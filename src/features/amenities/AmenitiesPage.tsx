"use client";

import Image from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AmenityFeature } from "@/content/amenities";
import type { CommunityPlace, ServiceLine } from "@/content/amenities-page";
import { AmenityIcon } from "@/features/amenities/AmenitiesHoverGrid";
import { HoverAccent } from "@/components/ui/HoverAccent";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Amenities page pieces (styles: styles/sections/amenities-page.css).
 *   ResortChapters   — private amenities as a list of large rows beside a sticky
 *                      photo column; the row at mid-screen turns into a dark band,
 *                      and the photo column glides to centre that row's photo.
 *   CommunityMosaic  — shared places; tiles rise in as they arrive.
 *   ServiceShowcase  — infrastructure as a list on a dark panel beside a large photo;
 *                      the active line shows its line of copy and its photo, and the
 *                      list steps on by itself while in view (a bar fills on the
 *                      active line). Hover, focus or tap picks one and pauses it.
 * Reduced motion: no rises or wipes — the content is simply there.
 */

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const num = (i: number, isAr: boolean) => (i + 1).toLocaleString(isAr ? "ar-JO" : "en-US").padStart(isAr ? 0 : 2, "0");

// ── Inside your resort: chapters + pinned frame ───────────────────

export function ResortChapters({ items, isAr }: { items: AmenityFeature[]; isAr: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rows = gsap.utils.toArray<HTMLElement>(".arl-row", root);

      // The row crossing the middle of the screen is the current one.
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="arl">
      <ol className="arl-list">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li key={it.id} id={`amenity-${it.id}`} className={`arl-row scroll-mt-28${on ? " is-on" : ""}`}>
              {/* Phones: each row carries its own photo. */}
              <div className="arl-row-photo">
                <Image src={it.image} alt="" fill sizes="100vw" className="object-cover" />
              </div>
              <div className="arl-row-main">
                <div className="arl-row-text">
                  <h3 className="arl-title">
                    <AmenityIcon name={it.icon} className="arl-icon" />
                    {isAr ? it.titleAr : it.titleEn}
                  </h3>
                  <p className="arl-sub">{(isAr ? it.tagsAr : it.tagsEn).join(" · ")}</p>
                </div>
                <span className="arl-num" aria-hidden>
                  {num(i, isAr)}
                </span>
              </div>
              {/* The full line opens on the current row. */}
              <div className="arl-desc">
                <p>{isAr ? it.descAr : it.descEn}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="arl-photos" aria-hidden>
        <div className="arl-strip" style={{ "--i": active, "--n": items.length } as CSSProperties}>
          {items.map((it, i) => (
            <div key={it.id} className={`arl-photo${i === active ? " is-on" : ""}`}>
              <Image src={it.image} alt="" fill sizes="(min-width: 1024px) 40vw, 1px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Across the community: mosaic ──────────────────────────────────

export function CommunityMosaic({ places, isAr }: { places: CommunityPlace[]; isAr: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced()) return;
      ScrollTrigger.batch(root.querySelectorAll(".ap-tile"), {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 44, autoAlpha: 0, clipPath: "inset(12% 0% 0% 0%)" },
            { y: 0, autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out", stagger: 0.1 },
          ),
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="ap-mosaic">
      {places.map((p) => (
        <figure key={p.id} className={`ap-tile ap-tile--${p.size} hv`}>
          <Image
            src={p.image}
            alt={isAr ? p.titleAr : p.titleEn}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="ap-tile-img object-cover"
          />
          <HoverAccent />
          <figcaption className="ap-tile-cap">
            <b>{isAr ? p.titleAr : p.titleEn}</b>
            <span>{isAr ? p.bodyAr : p.bodyEn}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// ── Serviced daily: infrastructure showcase ───────────────────────
// Parallel services, not steps — so icons, not numbers.

const SERVICE_ICONS: Record<string, ReactNode> = {
  water: <path d="M12 3c3.6 4.3 6 7.5 6 10.6a6 6 0 0 1-12 0C6 10.5 8.4 7.3 12 3z" />,
  pools: (
    <>
      <path d="M8 3.5v9M16 3.5v9M8 7h8" />
      <path d="M3 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M3 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
    </>
  ),
  fiber: (
    <>
      <path d="M3.5 9.5a12 12 0 0 1 17 0M6.8 13a7.3 7.3 0 0 1 10.4 0M10 16.4a2.8 2.8 0 0 1 4 0" />
      <circle cx="12" cy="19.4" r="0.9" fill="currentColor" />
    </>
  ),
  power: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />,
  roads: <path d="M8.5 3 5 21M15.5 3 19 21M12 4v2.5M12 10.5v3M12 17.5v3" />,
  gardens: <path d="M5 19c0-8.3 5.2-14 14-14 0 8.8-5.7 14-14 14zM5 19l7.5-7.5" />,
};

const STEP_MS = 6000;

function ServiceGlyph({ id, size = 22 }: { id: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {SERVICE_ICONS[id]}
    </svg>
  );
}

export function ServiceShowcase({ lines, isAr }: { lines: ServiceLine[]; isAr: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(reduced());
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e!.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const auto = !still;
  const running = auto && inView && !held;

  return (
    <div
      ref={ref}
      className="ap-svc"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className="ap-svc-stage" aria-hidden>
        {lines.map((l, i) => (
          <Image
            key={l.id}
            src={l.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={`ap-svc-img${i === active ? " is-on" : ""}`}
          />
        ))}
      </div>

      <ol className="ap-svc-list">
        {lines.map((l, i) => {
          const on = i === active;
          return (
            <li key={l.id} className={`ap-svc-item${on ? " is-on" : ""}`}>
              <button
                type="button"
                className="ap-svc-btn"
                aria-expanded={on}
                aria-controls={`ap-svc-${l.id}`}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="ap-svc-icon">
                  <ServiceGlyph id={l.id} />
                </span>
                <span className="ap-svc-title">{isAr ? l.titleAr : l.titleEn}</span>
              </button>
              <div id={`ap-svc-${l.id}`} className="ap-svc-body" aria-hidden={!on}>
                <p>{isAr ? l.bodyAr : l.bodyEn}</p>
              </div>
              {on && auto && (
                <span
                  key={`${l.id}-${active}`}
                  className="ap-svc-progress"
                  style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                  onAnimationEnd={() => setActive((a) => (a + 1) % lines.length)}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
