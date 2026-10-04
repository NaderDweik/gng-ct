"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/*
 * Branded video player (styles: styles/base/video-player.css). Same poster,
 * controls and behaviour for two sources:
 *   - `src`: a self-hosted file (public/videos/…) in a plain <video>. Preferred:
 *     nothing third-party is ever loaded.
 *   - `youtubeId`: the video stays on YouTube but none of YouTube shows. Nothing
 *     loads until Play (privacy-enhanced youtube-nocookie host, IFrame API). The
 *     iframe is 3× the frame's height and centred, so the letterboxed 16:9
 *     picture fills the frame while YouTube's title bar, logo and pause panel
 *     sit outside it; a layer on top takes every click, and playback stops just
 *     before the end so the "more videos" end screen never appears.
 * Controls: play / pause, scrubber, time, mute, fullscreen. Keyboard on the
 * focused player: Space / K play-pause, ← → seek 5 s, M mute, F fullscreen.
 */

type Props = {
  title: string;
  poster: string;
  /** Self-hosted file — used when present. */
  src?: string;
  youtubeId?: string;
  locale: string;
  className?: string;
};

/** The few calls we use from the YouTube IFrame API player. */
type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  mute(): void;
  unMute(): void;
  destroy(): void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: { onReady?: () => void; onStateChange?: (e: { data: number }) => void };
    },
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApi: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  ytApi ??= new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return ytApi;
}

/** Stop this close to the end (s) so YouTube's end screen never shows. */
const END_GUARD = 0.35;

const clock = (t: number, locale: string) => {
  const s = Math.max(0, Math.floor(t));
  const text = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return locale === "ar" ? text.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!) : text;
};

export function VideoPlayer({ title, poster, src, youtubeId, locale, className }: Props) {
  const isAr = locale === "ar";
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytHostRef = useRef<HTMLDivElement>(null);
  const ytRef = useRef<YTPlayer | null>(null);

  /** idle = poster; then the player is live until it ends (back to idle). */
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [full, setFull] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const yt = !src && Boolean(youtubeId);

  // ── Source adapters ──
  const play = useCallback(() => {
    if (yt) ytRef.current?.playVideo();
    else void videoRef.current?.play();
  }, [yt]);
  const pause = useCallback(() => {
    if (yt) ytRef.current?.pauseVideo();
    else videoRef.current?.pause();
  }, [yt]);
  const seek = useCallback(
    (t: number) => {
      const to = Math.max(0, Math.min(t, (duration || 0) - END_GUARD));
      if (yt) ytRef.current?.seekTo(to, true);
      else if (videoRef.current) videoRef.current.currentTime = to;
      setTime(to);
    },
    [yt, duration],
  );
  const setMute = useCallback(
    (m: boolean) => {
      if (yt) {
        if (m) ytRef.current?.mute();
        else ytRef.current?.unMute();
      } else if (videoRef.current) videoRef.current.muted = m;
      setMuted(m);
    },
    [yt],
  );

  /** Ended (or about to): back to the poster, rewound. */
  const finish = useCallback(() => {
    pause();
    if (yt) ytRef.current?.seekTo(0, true);
    else if (videoRef.current) videoRef.current.currentTime = 0;
    setTime(0);
    setPlaying(false);
    setStarted(false);
  }, [pause, yt]);

  const start = () => {
    setStarted(true);
    setLoading(true);
    if (!yt) {
      void videoRef.current?.play();
      return;
    }
    if (ytRef.current) {
      ytRef.current.playVideo();
      return;
    }
    void loadYouTubeApi().then((YT) => {
      if (!ytHostRef.current) return;
      const mount = document.createElement("div");
      ytHostRef.current.appendChild(mount);
      ytRef.current = new YT.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId: youtubeId!,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
          modestbranding: 1,
          hl: isAr ? "ar" : "en",
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            const d = ytRef.current?.getDuration() ?? 0;
            if (d) setDuration(d);
            ytRef.current?.playVideo();
          },
          onStateChange: ({ data }) => {
            // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering
            if (data === 1) {
              setPlaying(true);
              setLoading(false);
              const d = ytRef.current?.getDuration() ?? 0;
              if (d) setDuration(d);
            } else if (data === 2) setPlaying(false);
            else if (data === 3) setLoading(true);
            else if (data === 0) finish();
          },
        },
      });
    });
  };

  // YouTube has no timeupdate event: poll while playing (and guard the end).
  useEffect(() => {
    if (!yt || !playing) return;
    const id = window.setInterval(() => {
      const p = ytRef.current;
      if (!p) return;
      const t = p.getCurrentTime();
      const d = p.getDuration();
      setTime(t);
      if (d && t >= d - END_GUARD) finish();
    }, 200);
    return () => window.clearInterval(id);
  }, [yt, playing, finish]);

  useEffect(() => () => ytRef.current?.destroy(), []);

  // Fullscreen state follows the browser (Esc exits too).
  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen?.();
  };

  // Controls fade out while playing and the pointer is still.
  const wake = () => {
    setChrome(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setChrome(false), 2600);
  };
  useEffect(() => {
    if (!playing) setChrome(true);
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [playing]);

  const toggle = () => (playing ? pause() : play());

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!started) return;
    const k = e.key.toLowerCase();
    if (k === " " || k === "k") toggle();
    else if (k === "arrowright") seek(time + (isAr ? -5 : 5));
    else if (k === "arrowleft") seek(time + (isAr ? 5 : -5));
    else if (k === "m") setMute(!muted);
    else if (k === "f") toggleFull();
    else return;
    e.preventDefault();
    wake();
  };

  // Scrubber: pointer drag along the track (direction-aware for RTL).
  const trackRef = useRef<HTMLDivElement>(null);
  const scrubTo = (e: PointerEvent) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r || !duration) return;
    let f = (e.clientX - r.left) / r.width;
    if (isAr) f = 1 - f;
    seek(Math.max(0, Math.min(1, f)) * duration);
  };

  const pct = duration ? (time / duration) * 100 : 0;
  const t = isAr
    ? { play: "تشغيل", pause: "إيقاف مؤقت", mute: "كتم الصوت", unmute: "تشغيل الصوت", full: "ملء الشاشة", exit: "الخروج من ملء الشاشة", seek: "شريط التقدّم" }
    : { play: "Play", pause: "Pause", mute: "Mute", unmute: "Unmute", full: "Full screen", exit: "Exit full screen", seek: "Seek" };

  return (
    <div
      ref={rootRef}
      className={`vp${started ? " is-started" : ""}${playing ? " is-playing" : ""}${loading ? " is-loading" : ""}${chrome ? "" : " is-idle"}${full ? " is-full" : ""}${className ? ` ${className}` : ""}`}
      tabIndex={started ? 0 : -1}
      onKeyDown={onKey}
      onPointerMove={() => started && wake()}
      aria-label={title}
      role="region"
    >
      <div className="vp-stage">
        {src ? (
          <video
            ref={videoRef}
            className="vp-video"
            src={src}
            poster={poster}
            preload="metadata"
            playsInline
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onPlaying={() => {
              setPlaying(true);
              setLoading(false);
            }}
            onPause={() => setPlaying(false)}
            onWaiting={() => setLoading(true)}
            onEnded={finish}
          />
        ) : (
          <div ref={ytHostRef} className="vp-yt" aria-hidden />
        )}

        {/* Takes every click on the picture: nothing of YouTube is reachable. */}
        {started && <div className="vp-shield" onClick={toggle} onDoubleClick={toggleFull} aria-hidden />}

        {/* Poster + play, until it starts (and again after it ends). */}
        <button type="button" className="vp-poster" onClick={start} aria-label={`${t.play}: ${title}`} tabIndex={started ? -1 : 0}>
          <Image src={poster} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="vp-poster-img" />
          <span className="vp-poster-shade" aria-hidden />
          <span className="vp-big-play" aria-hidden>
            <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
          </span>
          <span className="vp-poster-title">{title}</span>
        </button>

        {loading && <span className="vp-spinner" aria-hidden />}
      </div>

      {started && (
        <div className="vp-bar">
          <button type="button" className="vp-btn" onClick={toggle} aria-label={playing ? t.pause : t.play}>
            {playing ? (
              <svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
            )}
          </button>

          <div
            ref={trackRef}
            className="vp-track"
            role="slider"
            tabIndex={0}
            aria-label={t.seek}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${clock(time, locale)} / ${clock(duration, locale)}`}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              scrubTo(e);
            }}
            onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && scrubTo(e)}
          >
            <span className="vp-track-fill" style={{ width: `${pct}%` }} />
            <span className="vp-track-knob" style={{ insetInlineStart: `${pct}%` }} />
          </div>

          <span className="vp-time">
            {clock(time, locale)} <i>/</i> {clock(duration, locale)}
          </span>

          <button type="button" className="vp-btn" onClick={() => setMute(!muted)} aria-label={muted ? t.unmute : t.mute}>
            {muted ? (
              <svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path className="vp-stroke" d="M16 9.5l5 5M21 9.5l-5 5" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path className="vp-stroke" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
            )}
          </button>
          <button type="button" className="vp-btn" onClick={toggleFull} aria-label={full ? t.exit : t.full}>
            {full ? (
              <svg viewBox="0 0 24 24"><path className="vp-stroke" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path className="vp-stroke" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
