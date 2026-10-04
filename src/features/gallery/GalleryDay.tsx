"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { dayCopy, dayScenes, type DayMode } from "@/content/gallery";
import { formatNumber } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { HoverBadge, HoverGlow } from "@/components/ui/HoverAccent";

/*
 * Home "A day at Giving Compound" (styles: styles/sections/gallery-day.css).
 * A static bento of seven scenes with a quiet Day / Night switch. Both sets are
 * stacked in every tile; the switch crossfades them tile by tile, the whole section
 * drops into its night palette and a crescent moon with stars slides in from the
 * top-right corner; by day a sun with turning rays sits there instead. Hover / focus a tile to read it.
 * A few seconds after the section comes into view it turns to Night on its own
 * (once; any press on the switch cancels that). Sized to fit one screen.
 */

/** Delay after the section is in view before it turns to Night. */
const AUTO_NIGHT_MS = 3500;

const MODES: DayMode[] = ["day", "night"];

/** Star positions around the moon (top, right), from the section's top-right corner. */
const STARS: [string, string][] = [
  ["1.4rem", "10rem"],
  ["4.2rem", "12.5rem"],
  ["0.9rem", "15rem"],
  ["5.6rem", "8.5rem"],
  ["2.6rem", "18.5rem"],
  ["6.4rem", "16rem"],
  ["1.2rem", "3rem"],
];

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

  return (
    <section ref={root} className={`gd${night ? " is-night on-dark" : ""}${inView ? " is-in" : ""}`} aria-label={copy.title}>
      {/* Night sky: a crescent slides in from the top-right corner with stars around it. */}
      {/* Day sky: a sun with slowly turning rays rises into the same corner. */}
      <div className="gd-day-sky" aria-hidden>
        <span className="gd-sun">
          <span className="gd-sun-rays" />
          <span className="gd-sun-core" />
        </span>
      </div>
      <div className="gd-night-sky" aria-hidden>
        <span className="gd-moon" />
        {STARS.map((st, k) => (
          <span key={k} className="gd-star" style={{ top: st[0], right: st[1], "--k": k } as CSSProperties} />
        ))}
      </div>
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
                <span className="gd-knob" aria-hidden />
              </button>
              <button type="button" className="gd-switch-label" aria-hidden tabIndex={-1} onClick={() => choose("night")}>
                {copy.modes.night}
              </button>
            </div>
          </div>
        </header>

        <ul className="gd-bento">
          {dayScenes.day.map((_, i) => (
            <li key={i} className="gd-tile hv" tabIndex={0} style={{ "--i": i } as CSSProperties}>
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
                    <HoverGlow />
                    <figcaption className="gd-cap">
                      <span className="gd-time">{clock(scene.time)}</span>
                      <span className="gd-cap-title">{isAr ? scene.titleAr : scene.titleEn}</span>
                    </figcaption>
                  </figure>
                );
              })}
              <HoverBadge />
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
