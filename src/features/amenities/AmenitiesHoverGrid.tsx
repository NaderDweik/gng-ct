"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AmenityFeature } from "@/content/amenities";

export function AmenityIcon({
  name,
  className,
}: {
  name: AmenityFeature["icon"];
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "pool":
      return (
        <svg {...common}>
          <path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" />
          <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" />
          <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V7l-8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "interior":
      return (
        <svg {...common}>
          <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
          <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3z" />
          <path d="M5 17v2M19 17v2" />
        </svg>
      );
    case "kids":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 10h.01M15 10h.01" />
          <path d="M8.5 15a4.5 4.5 0 0 0 7 0" />
        </svg>
      );
    case "bbq":
      return (
        <svg {...common}>
          <path d="M8 14c0 2 1.8 4 4 4s4-2 4-4" />
          <path d="M6 14h12" />
          <path d="M9 10c.5-2 1.5-4 3-5 1.5 1 2.5 3 3 5" />
          <path d="M10 18v3M14 18v3" />
        </svg>
      );
    case "walls":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M4 12h16M12 4v16" />
        </svg>
      );
    case "parking":
      return (
        <svg {...common}>
          <path d="M5 17h14v-5l-2-4H7l-2 4z" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="16.5" cy="17.5" r="1.5" />
          <path d="M7 8h10" />
        </svg>
      );
    case "green":
      return (
        <svg {...common}>
          <path d="M12 21V11" />
          <path d="M12 11c-3-1-5-3.5-5-7 4 0 5 3 5 7Z" />
          <path d="M12 11c3-1 5-3.5 5-7-4 0-5 3-5 7Z" />
        </svg>
      );
  }
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  items: AmenityFeature[];
  isAr: boolean;
};

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Line icons draw themselves: every stroke runs from nothing to whole. */
function drawIcon(card: Element | null, delay = 0) {
  if (!card || reduced()) return;
  card.querySelectorAll<SVGGeometryElement>(".am-icon path, .am-icon circle").forEach((el) => {
    const len = el.getTotalLength();
    gsap.fromTo(
      el,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 0.9, delay, ease: "power2.inOut", overwrite: true },
    );
  });
}

/*
 * Amenity cards (styles: .am-* in styles/sections/amenities-grid.css).
 *   - The hairlines between cards carry a soft gold light that follows the
 *     cursor across the grid.
 *   - Hover: the photo opens as a circle from where the pointer came in (and
 *     closes toward where it leaves); the icon redraws, tags step in.
 *   - First view: cards rise in a stagger and their icons draw once.
 * Phones keep the photo showing, as before. Reduced motion: plain fades.
 */
export function AmenitiesHoverGrid({ items, isAr }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || reduced()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".am-card", grid);
      gsap.from(cards, {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: { each: 0.08, grid: "auto", from: "start" },
        scrollTrigger: { trigger: grid, start: "top 80%", once: true },
        onStart: () => cards.forEach((c, i) => drawIcon(c, 0.25 + i * 0.08)),
      });
    },
    { scope: gridRef },
  );

  /** Where the pointer crossed the card's edge, in % of the card. */
  const edge = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const glow = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };

  const num = (i: number) => (i + 1).toLocaleString(isAr ? "ar-JO" : "en-US").padStart(isAr ? 0 : 2, "0");

  return (
    <div
      ref={gridRef}
      className="am-grid grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
      onPointerMove={glow}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--gx", "-999px")}
    >
      {items.map((item, i) => {
        const tags = isAr ? item.tagsAr : item.tagsEn;
        return (
          <article
            key={item.id}
            className="am-card group relative flex h-full min-h-[340px] cursor-default select-none flex-col justify-between overflow-hidden bg-surface p-7 md:min-h-[360px] md:p-8"
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              edge(e);
              drawIcon(e.currentTarget);
            }}
            onPointerLeave={(e) => e.pointerType === "mouse" && edge(e)}
          >
            <div className="am-media pointer-events-none absolute inset-0 z-0">
              <Image
                src={item.image}
                alt=""
                fill
                className="am-img object-cover object-center"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/80 to-secondary/55" />
            </div>

            <span className="am-num" aria-hidden>
              {num(i)}
            </span>

            <div className="relative z-10 flex h-full w-full flex-col items-start justify-between">
              <div className="w-full">
                <div className="mb-5">
                  <AmenityIcon name={item.icon} className="am-icon h-9 w-9" />
                </div>
                <h3 className="am-title font-display mb-3 text-xl font-semibold leading-tight md:text-2xl">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
                {tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-1.5">
                    {tags.map((tag, k) => (
                      <span key={tag} className="am-tag" style={{ transitionDelay: `${80 + k * 70}ms` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="am-desc mt-auto w-full text-sm leading-relaxed">{isAr ? item.descAr : item.descEn}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
