"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { dayChapters as chapters, dayCopy } from "@/content/gallery";
import { formatNumber } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Home "A day at Giving City" (styles: styles/sections/gallery-day.css).
 *   Desktop: the section pins and a film strip of moments drifts past in
 *   reading direction. Whatever sits at the focal line sets the clock; the sun
 *   rides its arc and sets, the moon rises, and the sky slides from daylight
 *   through golden hour into night. Photos open like windows as they arrive.
 *   Phones / reduced motion: a native swipe strip — the clock and sky still
 *   follow the strip, nothing is pinned or wiped.
 * Every per-frame effect is read from card rects, so LTR and RTL share one path.
 */

const SUNRISE = 360; // 06:00
const SUNSET = 1140; // 19:00
const MOONRISE = 1170; // 19:30
/** Phase boundaries (minutes) → dayCopy.phases index. */
const PHASES = [660, 900, 1020, 1110, 1170, 1290];

// Arc geometry (SVG units).
const CX = 120;
const CY = 108;
const R = 92;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

type Props = { locale: string; ctaHref: string };

export function GalleryDay({ locale, ctaHref }: Props) {
  const isAr = locale === "ar";
  const copy = isAr ? dayCopy.ar : dayCopy.en;
  const root = useRef<HTMLElement>(null);

  const pad = (v: number) => formatNumber(v, locale).padStart(2, isAr ? "٠" : "0");
  /** 12-hour clock: [ "8:05", "AM" ] — ص / م in Arabic. */
  const clock12 = (m: number): [string, string] => {
    const h = Math.floor(m / 60) % 24;
    const hour = formatNumber(h % 12 || 12, locale);
    const pm = h >= 12;
    return [`${hour}:${pad(Math.floor(m % 60))}`, isAr ? (pm ? "م" : "ص") : pm ? "PM" : "AM"];
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
      const frame = (progress: number, fx: boolean) => {
        const vw = window.innerWidth;
        const focal = vw * (isAr ? 0.56 : 0.44);
        // Signed distance past the focal line, in reading direction.
        const s = cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          const center = r.left + r.width / 2;

          if (fx) {
            // Window reveal from the leading edge + slow parallax inside.
            const lead = isAr ? r.right : vw - r.left;
            const open = smooth(lead / (vw * 0.42));
            const inset = (1 - open) * 100;
            media[i]!.style.clipPath = isAr ? `inset(0 0 0 ${inset}%)` : `inset(0 ${inset}% 0 0)`;
            const drift = (center - vw / 2) / vw;
            imgs[i]!.style.transform = `translate3d(${drift * -9}%,0,0) scale(${1.14 - open * 0.08})`;
          }
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

          // Swipe strip: clock and sky follow the strip's own scroll.
          const onScroll = () => {
            const max = track.scrollWidth - track.clientWidth;
            frame(max > 0 ? Math.abs(track.scrollLeft) / max : 0, false);
          };
          track.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          onScroll();

          if (!still) {
            gsap.from(cards, {
              autoAlpha: 0,
              y: 36,
              duration: 1,
              ease: "power3.out",
              stagger: 0.07,
              scrollTrigger: { trigger: track, start: "top 85%", once: true },
            });
          }
          return () => {
            track.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
          };
        },
      );
    },
    { scope: root, dependencies: [locale] },
  );

  return (
    <section ref={root} className="gd" aria-label={copy.title}>
      <div className="gd-sky" aria-hidden>
        <span className="gd-gold" />
        <span className="gd-night" />
        <span className="gd-stars" />
      </div>

      <div className="gd-stage">
        <header className="gd-head container-gc">
          <div>
            <p className="gd-mask">
              <span className="gd-rise section-eyebrow mb-0 block">{copy.eyebrow}</span>
            </p>
            <h2 className="gd-mask">
              <span className="gd-rise gd-title block">{copy.title}</span>
            </h2>
            <p className="gd-mask">
              <span className="gd-rise gd-lead block">{copy.lead}</span>
            </p>
          </div>

          <div className="gd-dial" aria-hidden>
            <svg viewBox="0 0 240 120" className="gd-arc">
              <defs>
                <clipPath id="gd-sky-clip">
                  <rect x="0" y="0" width="240" height={CY} />
                </clipPath>
                <radialGradient id="gd-sun-core">
                  <stop offset="0" stopColor="#fffbea" />
                  <stop offset="0.55" className="gd-sun-stop" stopColor="#ffd766" />
                  <stop offset="1" className="gd-sun-stop" stopColor="#f6ae2d" />
                </radialGradient>
                <radialGradient id="gd-sun-halo">
                  <stop offset="0" stopColor="#ffc24a" stopOpacity="0.55" />
                  <stop offset="0.45" stopColor="#ffb13c" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#ffb13c" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="gd-moon-halo">
                  <stop offset="0" stopColor="#dfe6ff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#dfe6ff" stopOpacity="0" />
                </radialGradient>
                <mask id="gd-crescent">
                  <rect x="-10" y="-10" width="20" height="20" fill="#fff" />
                  <circle cx="3.5" cy="-2.5" r="6" fill="#000" />
                </mask>
              </defs>
              <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} className="gd-arc-path" />
              <path
                d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                className="gd-arc-trail"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
              />
              <line x1="8" y1={CY} x2="232" y2={CY} className="gd-horizon" />
              <g clipPath="url(#gd-sky-clip)">
                <g className="gd-sun" transform={`translate(${CX - R} ${CY})`}>
                  <circle r="24" fill="url(#gd-sun-halo)" />
                  <g className="gd-rays">
                    {Array.from({ length: 12 }, (_, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={-10.5}
                        x2="0"
                        y2={i % 2 ? -13.5 : -16}
                        transform={`rotate(${i * 30})`}
                      />
                    ))}
                  </g>
                  <circle r="8" fill="url(#gd-sun-core)" />
                </g>
                <g className="gd-moon" transform={`translate(${CX - R} ${CY + 40})`}>
                  <circle r="18" fill="url(#gd-moon-halo)" />
                  <circle r="7" className="gd-moon-core" mask="url(#gd-crescent)" />
                </g>
              </g>
            </svg>
            <div className="gd-readout">
              <span className="gd-clock">
                <span className="gd-time">{clock12(chapters[0]?.time ?? 480)[0]}</span>
                <span className="gd-mer">{clock12(chapters[0]?.time ?? 480)[1]}</span>
              </span>
              <span className="gd-phase">{copy.phases[0]}</span>
            </div>
          </div>
        </header>

        <div className="gd-track">
          {chapters.map((c, i) => {
            const title = isAr ? c.titleAr : c.titleEn;
            return (
              <figure key={c.src} className={`gd-card gd-card--${c.shape} gd-card--${c.align}${i === 0 ? " is-active" : ""}`}>
                <div className="gd-media">
                  <div className="gd-img">
                    <Image src={c.src} alt={title} fill sizes="(max-width: 1024px) 80vw, 45vw" className="object-cover" />
                  </div>
                  <span className="gd-chip">{clock(c.time)}</span>
                </div>
                <figcaption className="gd-cap">
                  <span className="gd-cap-n">{isAr ? formatNumber(i + 1, locale) : pad(i + 1)}</span>
                  <span className="gd-cap-rule" aria-hidden />
                  <span>{title}</span>
                </figcaption>
              </figure>
            );
          })}

          <div className="gd-end">
            <p className="gd-end-title">{copy.endTitle}</p>
            <Link href={ctaHref} className="gallery-outline-btn gd-cta">
              {copy.cta}
              <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>

        <div className="gd-bar container-gc" aria-hidden>
          <span className="gd-bar-fill" />
        </div>
      </div>
    </section>
  );
}
