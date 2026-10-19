"use client";

import Image from "next/image";
import { SmoothImage } from "@/components/ui/SmoothImage";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { useSoftSnap } from "@/lib/useSoftSnap";
import { track } from "@/lib/analytics";
import {
  masterPlanMapSize,
  masterPlanMapSrc,
  chaletVideoSrc,
  planItem,
  planItemClips,
  planItemPhotos,
  unitPlanColumns,
  unitPlanLineSrc,
  unitPlanPanel,
  type PlanArea,
  type PlanItem,
} from "@/content/master-plan";

/*
 * /master-plan room viewer (styles: styles/sections/room-viewer.css). Split screen: the
 * current space's photo on the start side with its name over it; on the end side a dark
 * panel with the line plan, the space outlined on it, the unit facts and previous / next.
 * The arrows (or arrow keys, or hovering / clicking a space on the plan) step through every
 * space in plan order: inside the house, terraces & gardens, then outdoors.
 *
 * Smoothness (nothing ever blinks out before its replacement is in):
 *   - hovering a space shows its colour at once but only makes it current after a short
 *     intent delay, so sweeping across the plan doesn't strobe;
 *   - photos: the new one fades in ON TOP of the previous one, which stays solid beneath
 *     (no dip to the background mid-change);
 *   - the caption, counter digits and step bar hand over: the old one leaves while the new
 *     one arrives;
 *   - the walkthrough video of a space fades in over its photo only once it has a frame, and
 *     the previous space's video stays beneath until then. A space with several rooms plays
 *     each room's clip in turn (each fading into the next) while the outline on the plan
 *     glides to the room being shown; hovering or tapping a room jumps to its clip;
 *   - one outline glides from space to space on the plan.
 */

/** ms the pointer must rest on a space before it becomes current. */
const HOVER_INTENT = 110;
/** ms a replaced video stays mounted under the new one after that one is ready (its fade). */
const VIDEO_HANDOVER = 900;

type Step = { item: PlanItem; zone: string; photo: string };

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d={dir === "prev" ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"}
      />
    </svg>
  );
}

/**
 * One space's walkthrough: every clip of the sequence mounted and stacked, only `clip`
 * visible and playing; when it ends the parent moves `clip` on and the next fades in over it
 * (already buffered). `state` "prev": this space was left for one with a video; it stays as
 * the floor under the newcomer. "out": left for a space without one; fades.
 */
function SpaceVideo({
  id,
  clips,
  clip,
  state,
  onReady,
  onEnded,
}: {
  id: string;
  clips: string[];
  clip: number;
  state: "cur" | "prev" | "out";
  onReady: (id: string) => void;
  onEnded: (id: string, count: number) => void;
}) {
  const [ready, setReady] = useState<ReadonlySet<number>>(() => new Set());
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const isCur = state === "cur";

  useEffect(() => {
    refs.current.forEach((v, k) => {
      if (!v) return;
      if (k === clip && isCur) v.play().catch(() => {});
      else {
        v.pause();
        if (k !== clip) v.currentTime = 0;
      }
    });
  }, [clip, isCur]);

  return (
    <div className={`rmv-video is-${state}${ready.has(clip) ? " is-ready" : ""}`} aria-hidden>
      {clips.map((src, k) => (
        <video
          // Video browser extensions inject attributes (e.g. crossorigin) before hydration.
          suppressHydrationWarning
          key={src}
          ref={(el) => {
            refs.current[k] = el;
          }}
          src={src}
          className={k === clip ? "is-on" : undefined}
          muted
          playsInline
          loop={clips.length === 1}
          autoPlay={k === clip && isCur}
          // Every room's clip buffers while the space is current, so a tap on a room
          // (or the hand-over at a clip's end) shows a frame at once.
          preload={isCur ? "auto" : "metadata"}
          onLoadedData={() => {
            setReady((r) => (r.has(k) ? r : new Set(r).add(k)));
            if (k === clip) onReady(id);
          }}
          onEnded={() => k === clip && clips.length > 1 && onEnded(id, clips.length)}
        />
      ))}
    </div>
  );
}

export function RoomViewer({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const panel = unitPlanPanel[isAr ? "ar" : "en"];
  const { width: W, height: H } = masterPlanMapSize;

  const steps: Step[] = unitPlanColumns.flat().flatMap((group) =>
    group.ids.flatMap((id) => {
      const item = planItem(id);
      const photo = planItemPhotos[id];
      return item && photo ? [{ item, zone: panel[group.label], photo }] : [];
    }),
  );

  const total = steps.length;
  /** Current space, the one before it (for hand-over animations), and travel direction. */
  const [nav, setNav] = useState<{ index: number; prev: number | null; dir: number }>({
    index: 0,
    prev: null,
    dir: 1,
  });
  const { index, prev, dir } = nav;
  const indexRef = useRef(0);
  // Scrolling near the viewer settles it under the nav (every width).
  const rootRef = useRef<HTMLDivElement>(null);
  useSoftSnap(rootRef, 0);
  indexRef.current = index;
  /** The space whose video is playing (and which of its clips), and the one it replaced
   *  (kept beneath until the new video is ready, then dropped). `cur` is null on spaces
   *  without a video. */
  const firstVideo = steps[0] && planItemClips(steps[0].item).length ? steps[0].item.id : null;
  const [videos, setVideos] = useState<{ cur: string | null; clip: number; prev: string | null }>({
    cur: firstVideo,
    clip: 0,
    prev: null,
  });
  const handoverTimer = useRef<number | undefined>(undefined);
  /** Phones get the 720p renditions. Decided once on the client (null until then: no video). */
  const [small, setSmall] = useState<boolean | null>(null);
  useEffect(() => setSmall(matchMedia("(max-width: 767px)").matches), []);
  /** Spaces already reported to analytics on this visit (chalet_room_viewed, once each). */
  const seenRooms = useRef(new Set<string>());
  /**
   * Make space `n` current, starting its video at the clip of room `room` (or its first).
   * On the current space, only the clip changes.
   */
  const select = (n: number, d = Math.sign(n - indexRef.current), room?: number) => {
    const item = steps[n]!.item;
    const clips = planItemClips(item);
    const wanted = room === undefined ? undefined : item.areas[room]?.clips?.[0];
    const clip = Math.max(0, wanted ? clips.indexOf(wanted) : 0);
    const from = indexRef.current;
    if (n === from) {
      if (wanted) setVideos((v) => (v.clip === clip ? v : { ...v, clip }));
      return;
    }
    indexRef.current = n;
    setNav({ index: n, prev: from, dir: d || 1 });
    if (!seenRooms.current.has(item.id)) {
      seenRooms.current.add(item.id);
      track("chalet_room_viewed", { room: item.id });
    }
    const next = clips.length ? item.id : null;
    window.clearTimeout(handoverTimer.current);
    setVideos((v) => (v.cur === next ? { ...v, clip } : { cur: next, clip, prev: v.cur }));
    // No video to wait for: let the old one fade out, then drop it.
    if (!next) handoverTimer.current = window.setTimeout(() => setVideos((v) => ({ ...v, prev: null })), VIDEO_HANDOVER);
  };
  const setIndex = (n: number, d?: number) => select(n, d);
  /** The new space's video has a frame: the replaced one can go once covered. */
  const onVideoReady = (id: string) => {
    if (id !== videos.cur) return;
    window.clearTimeout(handoverTimer.current);
    handoverTimer.current = window.setTimeout(() => setVideos((v) => ({ ...v, prev: null })), VIDEO_HANDOVER);
  };
  /** The current clip ended: on to the next room's clip (and round again). */
  const onClipEnded = (id: string, count: number) =>
    setVideos((v) => (v.cur === id ? { ...v, clip: (v.clip + 1) % count } : v));
  useEffect(() => () => window.clearTimeout(handoverTimer.current), []);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverTo = (i: number, room: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => select(i, undefined, room), HOVER_INTENT);
  };
  const hoverOut = () => window.clearTimeout(hoverTimer.current);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  const [still, setStill] = useState(false);
  useEffect(() => setStill(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  const step = steps[index]!;
  const prevStep = prev === null ? null : steps[prev]!;
  const go = (d: number) => setIndex((indexRef.current + d + total) % total, d);
  const num = (v: number) =>
    v.toLocaleString(isAr ? "ar-JO" : "en-US", { minimumIntegerDigits: 2 });
  const title = (it: PlanItem) => (isAr ? it.titleAr : it.titleEn);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(e.key === (isAr ? "ArrowLeft" : "ArrowRight") ? 1 : -1);
  }

  /** The clip now showing and the room(s) it belongs to: the outline sits on the first. */
  const curClips = planItemClips(step.item);
  const playing = videos.cur === step.item.id ? curClips[videos.clip] : undefined;
  const isPlayingRoom = (a: PlanArea) => Boolean(playing && a.clips?.includes(playing));
  const focus = step.item.areas.find(isPlayingRoom) ?? step.item.areas[0]!;

  return (
    <div
      ref={rootRef}
      className="rmv"
      role="region"
      aria-roledescription={isAr ? "عارض الغرف" : "room viewer"}
      aria-label={isAr ? "مساحات الشاليه" : "Spaces of the chalet"}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Photo side */}
      <div className="rmv-photo">
        {steps.map((s, i) => (
          <SmoothImage
            key={s.item.id}
            src={s.photo}
            alt={i === index ? title(s.item) : ""}
            aria-hidden={i !== index}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={`rmv-img${i === index ? " is-on" : i === prev ? " is-prev" : ""}`}
            // The photos crossfade on their own: no preview over them.
            preview={false}
          />
        ))}
        {/* The walkthrough video of this space, edge to edge over its photo (which stays as the
            still until the video has a frame, and for reduced-motion visitors). */}
        {small !== null &&
          !still &&
          [videos.prev, videos.cur]
            .filter((id): id is string => Boolean(id))
            // Fixed (sorted) order: a video that is moved in the DOM gets paused.
            .sort()
            .map((id) => (
              <SpaceVideo
                key={id}
                id={id}
                clips={planItemClips(planItem(id)!).map((clip) => chaletVideoSrc(clip, small))}
                clip={id === videos.cur ? videos.clip : 0}
                state={id === videos.cur ? "cur" : videos.cur ? "prev" : "out"}
                onReady={onVideoReady}
                onEnded={onClipEnded}
              />
            ))}
        {prevStep && (
          <div key={`out-${prevStep.item.id}-${index}`} className="rmv-photo-copy is-out" aria-hidden>
            <p className="rmv-zone">{prevStep.zone}</p>
            <p className="rmv-name">{title(prevStep.item)}</p>
            <p className="rmv-body">{isAr ? prevStep.item.bodyAr : prevStep.item.bodyEn}</p>
          </div>
        )}
        <div key={step.item.id} className={`rmv-photo-copy${prevStep ? " is-in" : ""}`} aria-live="polite">
          <p className="rmv-zone">{step.zone}</p>
          <h3 className="rmv-name">{title(step.item)}</h3>
          <p className="rmv-body">
            {isAr ? step.item.bodyAr : step.item.bodyEn}
          </p>
        </div>
      </div>

      {/* Plan side */}
      <div className="rmv-panel">
        <div className="rmv-plan-wrap">
          <div className="rmv-plan" style={{ aspectRatio: `${W} / ${H}` }}>
            <Image
              src={unitPlanLineSrc}
              alt={isAr ? "مخطط الشاليه" : "Chalet plan"}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="rmv-plan-img"
            />
            {/* Every space is a target on the plan; the current one is outlined. */}
            {steps.map((s, i) =>
              s.item.areas.map((a, k) => (
                <button
                  key={`${s.item.id}-${k}`}
                  type="button"
                  className={`rmv-area${i === index ? " is-on" : ""}${a === focus && i === index ? " is-focus" : ""}${
                    i === index && a !== focus && isPlayingRoom(a) ? " is-twin" : ""
                  }`}
                  style={{
                    left: pct(a.x, W),
                    top: pct(a.y, H),
                    width: pct(a.w, W),
                    height: pct(a.h, H),
                  }}
                  aria-label={title(s.item)}
                  aria-pressed={i === index}
                  tabIndex={k === 0 ? 0 : -1}
                  onClick={() => {
                    hoverOut();
                    select(i, undefined, k);
                  }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && hoverTo(i, k)}
                  onPointerLeave={hoverOut}
                >
                  {/* The colour plan, cropped to exactly this room (the area rectangles are
                      measured on that image), shown while the room is the one being shown. */}
                  <span
                    className="rmv-area-img"
                    style={{
                      backgroundImage: `url(${masterPlanMapSrc})`,
                      backgroundSize: `${(W / a.w) * 100}% ${(H / a.h) * 100}%`,
                      backgroundPosition: `${a.w === W ? 0 : (a.x / (W - a.w)) * 100}% ${a.h === H ? 0 : (a.y / (H - a.h)) * 100}%`,
                    }}
                    aria-hidden
                  />
                </button>
              )),
            )}
            {/* One frame that glides from room to room (the outline of the one being shown). */}
            <span
              className="rmv-frame"
              style={{ left: pct(focus.x, W), top: pct(focus.y, H), width: pct(focus.w, W), height: pct(focus.h, H) }}
              aria-hidden
            />
            <span
              className="rmv-dot"
              style={{
                left: pct(focus.x + focus.w / 2, W),
                top: pct(focus.y + focus.h / 2, H),
              }}
              aria-hidden
            />
          </div>
        </div>

        <div className="rmv-foot">
          <div className="rmv-arrows">
            <button
              type="button"
              className="rmv-arrow"
              aria-label={isAr ? "المساحة السابقة" : "Previous space"}
              onClick={() => go(-1)}
            >
              <Chevron dir={isAr ? "next" : "prev"} />
            </button>
            <button
              type="button"
              className="rmv-arrow"
              aria-label={isAr ? "المساحة التالية" : "Next space"}
              onClick={() => go(1)}
            >
              <Chevron dir={isAr ? "prev" : "next"} />
            </button>
            {/* Where you are in the walk-through. */}
            <p className="rmv-count" aria-hidden>
              <span className={`rmv-count-now${dir < 0 ? " is-back" : ""}`}>
                {prev !== null && (
                  <span key={`out-${prev}-${index}`} className="rmv-count-digits is-out">
                    {num(prev + 1)}
                  </span>
                )}
                <span key={index} className={`rmv-count-digits${prev !== null ? " is-in" : ""}`}>
                  {num(index + 1)}
                </span>
              </span>
              <span className="rmv-count-total">/{num(total)}</span>
            </p>
          </div>
          <Link href={unitPlanPanel.href} className="rmv-cta">
            {panel.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
