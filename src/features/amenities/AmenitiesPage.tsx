"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AmenityFeature } from "@/content/amenities";
import type { CommunityPlace } from "@/content/amenities-page";
import { AmenityIcon } from "@/features/amenities/AmenitiesHoverGrid";
import { HoverAccent } from "@/components/ui/HoverAccent";
import { ScrollFocus } from "@/components/ui/ScrollFocus";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Amenities page pieces (styles: styles/sections/amenities-page.css).
 *   ResortChapters   — private amenities as a list of large rows beside a sticky
 *                      photo column; the row at mid-screen turns into a dark band,
 *                      and the photo column follows the scroll, centring that row's photo.
 *   CommunityMosaic  — shared places; tiles rise in as they arrive.
 * Reduced motion: no rises or wipes — the content is simply there.
 */

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const num = (i: number, isAr: boolean) => (i + 1).toLocaleString(isAr ? "ar-JO-u-nu-latn" : "en-US").padStart(isAr ? 0 : 2, "0");

// ── Inside your resort: chapters + pinned frame ───────────────────

export function ResortChapters({ items, isAr }: { items: AmenityFeature[]; isAr: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Scroll-driven, every frame: f is how far down the list the middle of the screen is,
  // in rows (f = i exactly when row i is centred). The current row is the nearest one;
  // on desktop the photo strip follows f continuously, holding the current photo
  // centred in its frame (flush at the strip's ends, so no empty band shows). A light
  // ease (a quarter of the gap per frame) smooths wheel steps without lagging behind.
  useEffect(() => {
    const root = ref.current;
    const strip = stripRef.current;
    if (!root || !strip) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".arl-row"));
    const instant = reduced();
    let raf = 0;
    let shown: number | null = null;

    const target = () => {
      const nav = 5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const line = nav + (window.innerHeight - nav) / 2;
      let f = 0;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i]!.getBoundingClientRect();
        if (line < r.top && i === 0) break;
        if (line >= r.top) f = i + Math.min(1, (line - r.top) / r.height) - 0.5;
      }
      return Math.max(0, Math.min(rows.length - 1, f));
    };

    const place = (f: number) => {
      const frame = strip.parentElement!;
      const photo = strip.firstElementChild as HTMLElement | null;
      if (!photo || frame.offsetParent === null) return; // phones: no photo column
      const h = frame.clientHeight;
      const ph = photo.offsetHeight;
      const step = ph + parseFloat(getComputedStyle(strip).rowGap || "0");
      const total = step * (rows.length - 1) + ph;
      const y = Math.min(0, Math.max(h - total, h / 2 - (f * step + ph / 2)));
      strip.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    const tick = () => {
      raf = 0;
      const f = target();
      setActive(Math.round(f));
      shown = shown === null || instant ? f : shown + (f - shown) * 0.25;
      if (Math.abs(f - shown) < 0.002) shown = f;
      place(shown);
      if (shown !== f) raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

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
        <div ref={stripRef} className="arl-strip">
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
      {/* Touch screens: the tile at mid-screen plays the hover effect (.is-active). */}
      <ScrollFocus selector=".ap-tile" />
    </div>
  );
}
