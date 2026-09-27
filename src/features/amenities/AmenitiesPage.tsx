"use client";

import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AmenityFeature } from "@/content/amenities";
import type { CommunityPlace, ServiceLine } from "@/content/amenities-page";
import { AmenityIcon } from "@/features/amenities/AmenitiesHoverGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Amenities page pieces (styles: styles/sections/amenities-page.css).
 *   ResortChapters   — private amenities as cards beside a pinned frame; the
 *                      card you are reading is highlighted and its photo
 *                      wipes up over the last.
 *   CommunityMosaic  — shared places; tiles rise in as they arrive.
 *   ServiceList      — infrastructure tiles with icons; static.
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
      const chapters = gsap.utils.toArray<HTMLElement>(".ap-chapter", root);
      chapters.forEach((ch, i) => {
        ScrollTrigger.create({
          trigger: ch,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: ref },
  );

  const current = items[active];

  return (
    <div ref={ref} className="ap-resort">
      <ol className="ap-chapters">
        {items.map((it, i) => (
          <li key={it.id} id={`amenity-${it.id}`} className={`ap-chapter scroll-mt-28${i === active ? " is-active" : ""}`}>
            <article className="ap-card">
              {/* Phones: each chapter carries its own photo. */}
              <div className="ap-chapter-photo">
                <Image src={it.image} alt="" fill sizes="100vw" className="object-cover" />
              </div>
              <div className="ap-card-top">
                <span className="ap-card-icon" aria-hidden>
                  <AmenityIcon name={it.icon} className="ap-chapter-icon" />
                </span>
                <span className="ap-chapter-num">
                  {num(i, isAr)}
                  <i>/</i>
                  {num(items.length - 1, isAr)}
                </span>
              </div>
              <h3 className="ap-chapter-title">{isAr ? it.titleAr : it.titleEn}</h3>
              <p className="ap-chapter-body">{isAr ? it.descAr : it.descEn}</p>
              <ul className="ap-specs">
                {(isAr ? it.tagsAr : it.tagsEn).map((t) => (
                  <li key={t}>
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8.5 6.5 12 13 4.5" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
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
              <span className="ap-frame-count">
                {num(active, isAr)} <i /> {num(items.length - 1, isAr)}
              </span>
            </div>
          )}
          <span className="ap-frame-progress">
            <i style={{ transform: `scaleY(${(active + 1) / items.length})` }} />
          </span>
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
        <figure key={p.id} className={`ap-tile ap-tile--${p.size}`}>
          <Image
            src={p.image}
            alt={isAr ? p.titleAr : p.titleEn}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="ap-tile-img object-cover"
          />
          <figcaption className="ap-tile-cap">
            <b>{isAr ? p.titleAr : p.titleEn}</b>
            <span>{isAr ? p.bodyAr : p.bodyEn}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

// ── Serviced daily: infrastructure tiles ──────────────────────────
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

export function ServiceList({ lines, isAr }: { lines: ServiceLine[]; isAr: boolean }) {
  return (
    <ul className="ap-services">
      {lines.map((l) => (
        <li key={l.id} className="ap-service">
          <span className="ap-service-icon" aria-hidden>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {SERVICE_ICONS[l.id]}
            </svg>
          </span>
          <h3 className="ap-service-title">{isAr ? l.titleAr : l.titleEn}</h3>
          <p className="ap-service-body">{isAr ? l.bodyAr : l.bodyEn}</p>
        </li>
      ))}
    </ul>
  );
}
