"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AmenityFeature } from "@/content/amenities";
import type { CommunityPlace, ServiceLine } from "@/content/amenities-page";
import { AmenityIcon } from "@/features/amenities/AmenitiesHoverGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Amenities page pieces (styles: styles/sections/amenities-page.css).
 *   ResortChapters   — private amenities as chapters beside a pinned frame;
 *                      each chapter wipes its photo up over the last.
 *   CommunityMosaic  — shared places; tiles rise in as they arrive.
 *   ServiceList      — infrastructure lines; hairlines draw in.
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
        if (reduced()) return;
        gsap.from(ch.querySelectorAll(".ap-rise"), {
          y: 26,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ch, start: "top 78%", once: true },
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
          <li key={it.id} className={`ap-chapter${i === active ? " is-active" : ""}`}>
            {/* Phones: each chapter carries its own photo. */}
            <div className="ap-chapter-photo">
              <Image src={it.image} alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <span className="ap-chapter-num ap-rise">{num(i, isAr)}</span>
            <AmenityIcon name={it.icon} className="ap-chapter-icon ap-rise" />
            <h3 className="ap-chapter-title ap-rise">{isAr ? it.titleAr : it.titleEn}</h3>
            <p className="ap-chapter-body ap-rise">{isAr ? it.descAr : it.descEn}</p>
            <ul className="ap-specs ap-rise">
              {(isAr ? it.tagsAr : it.tagsEn).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
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

// ── Serviced daily: infrastructure lines ──────────────────────────

export function ServiceList({ lines, isAr }: { lines: ServiceLine[]; isAr: boolean }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduced()) return;
      const rows = root.querySelectorAll(".ap-service");
      gsap.from(root.querySelectorAll(".ap-service-rule"), {
        scaleX: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
      gsap.from(rows, {
        y: 18,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.15,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="ap-services">
      {lines.map((l, i) => (
        <li key={l.id} className="ap-service">
          <span className="ap-service-rule" aria-hidden />
          <span className="ap-service-num">{num(i, isAr)}</span>
          <div>
            <h3 className="ap-service-title">{isAr ? l.titleAr : l.titleEn}</h3>
            <p className="ap-service-body">{isAr ? l.bodyAr : l.bodyEn}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
