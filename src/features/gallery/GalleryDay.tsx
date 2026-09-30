"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { dayCopy, dayScenes, type DayMode } from "@/content/gallery";
import { formatNumber } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/*
 * Home "A day at Giving City" (styles: styles/sections/gallery-day.css).
 * A static bento of seven scenes with a Day / Night toggle. Both sets are
 * stacked in every tile; the sky switch crossfades them tile by tile and the
 * whole section drops into its night palette. Hover / focus a tile to read it.
 * A few seconds after the section comes into view it turns to Night on its own
 * (once; any press on the switch cancels that). Sized to fit one screen.
 */

/** Delay after the section is in view before it turns to Night. */
const AUTO_NIGHT_MS = 3500;

const MODES: DayMode[] = ["day", "night"];

type Props = { locale: string; ctaHref: string };

export function GalleryDay({ locale, ctaHref }: Props) {
  const isAr = locale === "ar";
  const copy = isAr ? dayCopy.ar : dayCopy.en;
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<DayMode>("day");
  const [inView, setInView] = useState(false);
  const touched = useRef(false);
  const night = mode === "night";

  const choose = (m: DayMode) => {
    touched.current = true;
    setMode(m);
  };

  // First time the section is well in view: reveal the lede, then turn to Night.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setInView(true);
        timer = setTimeout(() => {
          if (!touched.current) setMode("night");
        }, AUTO_NIGHT_MS);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  /** 12-hour clock: "8:05 AM" — ص / م in Arabic. */
  const clock = (m: number) => {
    const h = Math.floor(m / 60) % 24;
    const min = formatNumber(m % 60, locale).padStart(2, isAr ? "٠" : "0");
    const mer = h >= 12 ? (isAr ? "م" : "PM") : isAr ? "ص" : "AM";
    return `${formatNumber(h % 12 || 12, locale)}:${min} ${mer}`;
  };
  const clock = (m: number) => clock12(m).join(" ");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const track = q(".gd-track")[0] as HTMLElement;
      const cards = q(".gd-card") as HTMLElement[];
      const media = cards.map((c) => c.querySelector(".gd-media") as HTMLElement);
      const imgs = cards.map((c) => c.querySelector(".gd-img") as HTMLElement);
      const timeEl = q(".gd-time")[0] as HTMLElement;
      const merEl = q(".gd-mer")[0] as HTMLElement;
      const phaseEl = q(".gd-phase")[0] as HTMLElement;
      const sun = el.querySelector<SVGGElement>(".gd-sun")!;
      const moon = el.querySelector<SVGGElement>(".gd-moon")!;
      const rays = el.querySelector<SVGGElement>(".gd-rays")!;
      const trail = el.querySelector<SVGPathElement>(".gd-arc-trail")!;
      const [stopMid, stopEdge] = Array.from(el.querySelectorAll<SVGStopElement>(".gd-sun-stop"));
      // Midday gold → low-sun amber.
      const midTone = gsap.utils.interpolate("#ffd766", "#ff9440");
      const edgeTone = gsap.utils.interpolate("#f6ae2d", "#e8572a");
      const rayTone = gsap.utils.interpolate("#f3b33c", "#ef7a32");
      const gold = q(".gd-gold")[0] as HTMLElement;
      const night = q(".gd-night")[0] as HTMLElement;
      const stars = q(".gd-stars")[0] as HTMLElement;
      const bar = q(".gd-bar-fill")[0] as HTMLElement;
      if (!track || !timeEl) return;

      const times = chapters.map((c) => c.time);
      let lastPhase = -1;
      let lastActive = -1;
      let lastMinute = -1;

      /** t: 0 = rising edge, 1 = setting edge; clamped just below the horizon so it never wraps. */
      const place = (node: SVGGElement, t: number) => {
        const a = Math.PI * (1 - Math.min(1.2, Math.max(-0.2, t)));
        node.setAttribute("transform", `translate(${CX + R * Math.cos(a)} ${CY - R * Math.sin(a)})`);
      };

      /** One frame: clock, sky, sun/moon, active card, and (optionally) window reveals. */
      const frame = (progress: number, fx: boolean, axis: "x" | "y" = "x") => {
        const vertical = axis === "y";
        // `vw` is the span the clock measures against: screen width for the
        // strip, screen height for the phone timeline.
        const vw = vertical ? window.innerHeight : window.innerWidth;
        const focal = vertical ? vw * 0.55 : vw * (isAr ? 0.56 : 0.44);
        // Signed distance past the focal line, in reading (or scrolling) direction.
        const s = cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          const center = vertical ? r.top + r.height / 2 : r.left + r.width / 2;

          if (fx) {
            // Window reveal from the leading edge + slow parallax inside.
            const lead = isAr ? r.right : vw - r.left;
            const open = smooth(lead / (vw * 0.42));
            const inset = (1 - open) * 100;
            media[i]!.style.clipPath = isAr ? `inset(0 0 0 ${inset}%)` : `inset(0 ${inset}% 0 0)`;
            const drift = (center - vw / 2) / vw;
            imgs[i]!.style.transform = `translate3d(${drift * -9}%,0,0) scale(${1.14 - open * 0.08})`;
          }
          if (vertical) return focal - center;
          return isAr ? center - focal : focal - center;
        });

        let k = -1;
        for (let i = 0; i < s.length; i++) if (s[i]! >= 0) k = i;

        let m: number;
        let active: number;
        if (k < 0) {
          m = times[0]! - Math.min(1, -s[0]! / vw) * 45;
          active = 0;
        } else if (k === s.length - 1) {
          m = Math.min(times[k]! + (s[k]! / (vw * 0.5)) * 50, 1425);
          active = k;
        } else {
          const f = s[k]! / (s[k]! - s[k + 1]!);
          m = times[k]! + (times[k + 1]! - times[k]!) * f;
          active = f < 0.5 ? k : k + 1;
        }

        const minute = Math.floor(m);
        if (minute !== lastMinute) {
          lastMinute = minute;
          const [hm, mer] = clock12(minute);
          timeEl.textContent = hm;
          merEl.textContent = mer;
        }
        const phase = PHASES.filter((b) => m >= b).length;
        if (phase !== lastPhase) {
          lastPhase = phase;
          phaseEl.textContent = copy.phases[phase] ?? "";
        }
        if (active !== lastActive) {
          cards[lastActive]?.classList.remove("is-active");
          cards[active]?.classList.add("is-active");
          lastActive = active;
        }

        // Sky.
        const g = Math.exp(-(((m - 1100) / 85) ** 2));
        const n = smooth((m - 1150) / 150);
        gold.style.opacity = String(g * 0.9);
        night.style.opacity = String(n);
        stars.style.opacity = String(smooth((m - 1230) / 120) * 0.9);
        el.classList.toggle("is-night", n > 0.5);

        // Sun: rides the arc (leaving a trail), warms as it drops, rays turn
        // slowly with the hours, then it sinks below the horizon.
        const t = (m - SUNRISE) / (SUNSET - SUNRISE);
        place(sun, t);
        const warm = 1 - clamp01(Math.sin(Math.PI * clamp01(t)) / 0.6);
        stopMid?.setAttribute("stop-color", midTone(warm));
        stopEdge?.setAttribute("stop-color", edgeTone(warm));
        rays.style.color = rayTone(warm);
        rays.setAttribute("transform", `rotate(${m * 0.25})`);
        trail.style.strokeDashoffset = String(1 - clamp01(t));
        trail.style.opacity = String(1 - n);
        place(moon, ((m - MOONRISE) / 600) * 1.1);
        bar.style.transform = `scaleX(${clamp01(progress)})`;
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          pin: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          swipe: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
          still: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          // Exactly one of pin / swipe matches, so this always runs.
          const { pin, still } = ctx.conditions as { pin: boolean; swipe: boolean; still: boolean };

          if (pin) {
            el.classList.add("gd--pinned");
            const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
            gsap.to(track, {
              x: () => (isAr ? 1 : -1) * dist(),
              ease: "none",
              onUpdate(this: gsap.core.Tween) {
                frame(this.progress(), true);
              },
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: () => `+=${dist()}`,
                pin: true,
                scrub: 0.9,
                invalidateOnRefresh: true,
                onRefresh: (self) => frame(self.progress, true),
              },
            });

            gsap.from(q(".gd-rise"), {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 70%", once: true },
            });
            gsap.from(q(".gd-dial"), {
              autoAlpha: 0,
              y: 16,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 70%", once: true },
            });

            frame(0, true);
            return () => {
              el.classList.remove("gd--pinned");
              media.forEach((n) => (n.style.clipPath = ""));
              imgs.forEach((n) => (n.style.transform = ""));
            };
          }

          // Phones & tablets: a vertical timeline. The clock bar stays pinned
          // under the site header; whichever moment crosses mid-screen sets it.
          el.classList.add("gd--timeline");
          const onScroll = () => {
            const r = track.getBoundingClientRect();
            frame(clamp01((window.innerHeight * 0.55 - r.top) / r.height), false, "y");
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          onScroll();

          if (!still) {
            ScrollTrigger.batch(cards, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.fromTo(batch, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
            });
          }
          return () => {
            el.classList.remove("gd--timeline");
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
          };
        },
      );
    },
    { scope: root, dependencies: [locale] },
  );

  return (
    <section ref={root} className={`gd${night ? " is-night on-dark" : ""}`} aria-label={copy.title}>
      <div className="container-gc">
        <header className="sec-head">
          <div>
            <p className="section-eyebrow">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
            <p className="section-sub gd-lede-phone">{copy.lead}</p>
          </div>
          <div className="gd-aside">
            <div className="gd-switch-wrap">
              <button type="button" className="gd-switch-label" aria-hidden tabIndex={-1} onClick={() => choose("day")}>
                {copy.modes.day}
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={night}
                aria-label={`${copy.toggleLabel}: ${copy.modes[mode]}`}
                className="gd-switch"
                onClick={() => choose(night ? "day" : "night")}
              >
                <span className="gd-switch-sky" aria-hidden>
                  <span className="gd-cloud gd-cloud--a" />
                  <span className="gd-cloud gd-cloud--b" />
                  {[0, 1, 2, 3, 4].map((k) => (
                    <span key={k} className={`gd-star gd-star--${k}`} />
                  ))}
                </span>
                <span className="gd-knob" aria-hidden>
                  <span className="gd-crater gd-crater--a" />
                  <span className="gd-crater gd-crater--b" />
                  <span className="gd-crater gd-crater--c" />
                </span>
              </button>
              <button type="button" className="gd-switch-label" aria-hidden tabIndex={-1} onClick={() => choose("night")}>
                {copy.modes.night}
              </button>
            </div>
          </div>
        </header>

        <ul className="gd-bento">
          {dayScenes.day.map((_, i) => (
            <li key={i} className="gd-tile" tabIndex={0} style={{ "--i": i } as CSSProperties}>
              {MODES.map((m) => {
                const scene = dayScenes[m][i]!;
                const shown = m === mode;
                return (
                  <figure key={m} className={`gd-scene${shown ? " is-shown" : ""}`} aria-hidden={!shown}>
                    <span className="gd-frame">
                      <Image
                        src={scene.src}
                        alt={isAr ? scene.titleAr : scene.titleEn}
                        fill
                        sizes={i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"}
                        className="gd-img"
                        style={scene.focus ? { objectPosition: scene.focus } : undefined}
                      />
                    </span>
                    <figcaption className="gd-cap">
                      <span className="gd-time">{clock(scene.time)}</span>
                      <span className="gd-cap-title">{isAr ? scene.titleAr : scene.titleEn}</span>
                    </figcaption>
                  </figure>
                );
              })}
              {i === 0 && (
                <p className={`gd-lede${inView ? " is-in" : ""}`}>
                  <span>{copy.lead}</span>
                </p>
              )}
            </li>
          ))}
        </ul>

        <div className="gd-foot">
          <Link href={ctaHref} className="gallery-outline-btn gd-cta">
            {copy.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
