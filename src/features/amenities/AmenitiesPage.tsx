"use client";

import Image from "next/image";
import { type ReactNode, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AmenityFeature } from "@/content/amenities";
import type { CommunityPlace, ServiceLine } from "@/content/amenities-page";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Amenities page pieces (styles: styles/sections/amenities-page.css).
 * The page zooms out in three rings — your walls, the gates, what runs
 * beneath — and RingMark draws that idea in each section's eyebrow.
 *   ResortIndex    — the five private amenities as an index beside one photo;
 *                    one row is open at a time and the photo crossfades to it.
 *   CommunityGrid  — shared places as a catalogue, captions under the photos;
 *                    a swipe row on phones. Cards rise in as they arrive.
 *   ServiceSheet   — key figures beside a two-column spec list; static.
 * Reduced motion: no rises or crossfades — the content is simply there.
 */

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const num = (i: number, isAr: boolean) => (i + 1).toLocaleString(isAr ? "ar-JO" : "en-US").padStart(isAr ? 0 : 2, "0");

// ── The three rings: 0 your walls · 1 the gates · 2 everything beneath ──

export function RingMark({ ring }: { ring: 0 | 1 | 2 }) {
  const rings = [
    { inset: 8, size: 8 },
    { inset: 4.5, size: 15 },
    { inset: 1, size: 22 },
  ];
  return (
    <svg className="ap-ring" viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {rings.map((r, i) => (
        <rect
          key={i}
          x={r.inset}
          y={r.inset}
          width={r.size}
          height={r.size}
          rx={i === 0 ? 1 : 2}
          className={ring === 2 || ring === i ? "is-on" : undefined}
        />
      ))}
    </svg>
  );
}

// ── Inside your walls: index + photo ──────────────────────────────

const Check = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);

export function ResortIndex({ items, isAr }: { items: AmenityFeature[]; isAr: boolean }) {
  const [active, setActive] = useState(0);
  const uid = useId();

  return (
    <div className="ri">
      <div className="ri-stage" aria-hidden>
        {items.map((it, i) => (
          <div key={it.id} className={`ri-photo${i === active ? " is-on" : ""}`}>
            <Image src={it.image} alt="" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" priority={i === 0} />
          </div>
        ))}
      </div>

      <ol className="ri-list">
        {items.map((it, i) => {
          const open = i === active;
          const btn = `${uid}-b${i}`;
          const panel = `${uid}-p${i}`;
          return (
            <li key={it.id} id={`amenity-${it.id}`} className={`ri-item scroll-mt-28${open ? " is-open" : ""}`}>
              <h3 className="ri-head">
                <button
                  id={btn}
                  type="button"
                  className="ri-btn"
                  aria-expanded={open}
                  aria-controls={panel}
                  onClick={() => setActive(i)}
                >
                  <span className="ri-num">{num(i, isAr)}</span>
                  <span className="ri-title">{isAr ? it.titleAr : it.titleEn}</span>
                  <span className="ri-sign" aria-hidden />
                </button>
              </h3>
              <div id={panel} role="region" aria-labelledby={btn} className="ri-panel" inert={!open}>
                <div className="ri-panel-inner">
                  {/* Phones: the open row carries its own photo. */}
                  <div className="ri-panel-photo">
                    <Image src={it.image} alt="" fill sizes="100vw" className="object-cover" />
                  </div>
                  <p className="ri-body">{isAr ? it.descAr : it.descEn}</p>
                  <ul className="ri-specs">
                    {(isAr ? it.tagsAr : it.tagsEn).map((t) => (
                      <li key={t}>
                        <Check />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="ap-frame" aria-hidden>
        <div className="ap-frame-inner">
          {items.map((it, i) => (
            <div key={it.id} className={`ap-frame-photo${i <= active ? " is-on" : ""}`} style={{ zIndex: i + 1 }}>
              <Image src={it.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
          <div className="ap-frame-shade" />
          {current && (
            <div className="ap-frame-cap">
              <span key={current.id} className="ap-frame-title">
                {isAr ? current.titleAr : current.titleEn}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Inside the gates: catalogue ───────────────────────────────────

export function CommunityGrid({ places, isAr }: { places: CommunityPlace[]; isAr: boolean }) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced()) return;
      ScrollTrigger.batch(root.querySelectorAll(".cg-card"), {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
      });
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} className="cg">
      {places.map((p) => (
        <li key={p.id} className="cg-card">
          <div className="cg-photo">
            <Image
              src={p.image}
              alt={isAr ? p.titleAr : p.titleEn}
              fill
              sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw"
              className="cg-img object-cover"
            />
          </div>
          <h3 className="cg-title">{isAr ? p.titleAr : p.titleEn}</h3>
          <p className="cg-body">{isAr ? p.bodyAr : p.bodyEn}</p>
        </li>
      ))}
    </ul>
  );
}

// ── Behind the scenes: figures + spec list ────────────────────────
// Parallel services, not steps — so icons, not numbers. Static (no entrance motion).

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

export function ServiceSheet({ figures, lines, isAr }: { figures: ReactNode; lines: ServiceLine[]; isAr: boolean }) {
  return (
    <div className="sv">
      {figures}
      <ul className="sv-list">
        {lines.map((l) => (
          <li key={l.id} className="sv-item">
            <h3 className="sv-title">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {SERVICE_ICONS[l.id]}
              </svg>
              {isAr ? l.titleAr : l.titleEn}
            </h3>
            <p className="sv-body">{isAr ? l.bodyAr : l.bodyEn}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
