"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { locationCopy, nearbyPlaces, type NearbyPlace } from "@/content/location";
import { LocationLeafletMap } from "@/features/location/LocationLeafletMap";
import { track } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Seconds each destination stays up while the section tours on its own (long enough for
 *  its pin to pop in and its road to draw to the compound). */
const TOUR_SECONDS = 7;

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

/*
 * Location section (map: LocationLeafletMap; styles: styles/sections/location-map.css).
 *   Layout: a clean map beside one panel: eyebrow, title, then the places list on a dark
 *   band. The map shows one place at a time: its pin pops in and its road draws to the V.
 *   Tour: the first time the section is on screen, destinations advance on
 *   their own every TOUR_SECONDS, in list order; a hairline fills across the
 *   active row to show when it moves on. Choosing a place hands control to the
 *   visitor for good. Off-screen the tour pauses.
 * Phones: the panel's place line becomes a card attached to the top of the map, and the
 * card inside the map steps through the destinations with ‹ › chevrons (the drive-time
 * list is hidden).
 * Reduced motion: no tour, no counting — the list and map work as before.
 */
export function LocationShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const c = locationCopy;
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(nearbyPlaces[0]?.id ?? "");
  const [touring, setTouring] = useState(false);
  const tookOver = useRef(false);
  const active: NearbyPlace | null =
    nearbyPlaces.find((p) => p.id === activeId) ?? nearbyPlaces[0] ?? null;

  // Tour on/off with visibility; the list eases in the first time.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(root.querySelectorAll(".loc-item"), {
        autoAlpha: 0,
        y: 14,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: root.querySelector(".loc-list"), start: "top 88%", once: true },
      });
      ScrollTrigger.create({
        trigger: root,
        start: "top 65%",
        end: "bottom 30%",
        onToggle: (self) => {
          if (!tookOver.current) setTouring(self.isActive);
        },
      });
    },
    { scope: rootRef },
  );

  // The active row's hairline is the tour's clock: when it fills, move on.
  useEffect(() => {
    // The active row's hairline (list) and the loader under the place name (map card).
    const bar = [
      rootRef.current?.querySelector<HTMLElement>(`[data-bar="${activeId}"]`),
      rootRef.current?.querySelector<HTMLElement>(".loc-switch-fill"),
    ].filter((el): el is HTMLElement => !!el);
    if (!touring || !bar.length) return;
    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: TOUR_SECONDS,
        ease: "none",
        onComplete: () => {
          const i = nearbyPlaces.findIndex((p) => p.id === activeId);
          setActiveId(nearbyPlaces[(i + 1) % nearbyPlaces.length]!.id);
        },
      },
    );
    return () => {
      tween.kill();
      gsap.set(bar, { scaleX: 0 });
    };
  }, [touring, activeId]);

  const activeIndex = Math.max(0, nearbyPlaces.findIndex((p) => p.id === activeId));
  const step = (by: number) => {
    const n = nearbyPlaces.length;
    choose(nearbyPlaces[(activeIndex + by + n) % n]!.id);
  };

  const choose = (id: string) => {
    tookOver.current = true;
    setTouring(false);
    setActiveId(id);
    track("nearby_place_viewed", { place: id });
  };

  return (
    <div ref={rootRef} className={`loc${touring ? " is-touring" : ""}`}>
      {/* Phones: where it is, in a card attached to the top of the map */}
      <div className="loc-top">
        <span className="section-eyebrow flex items-center gap-2">
          <MapPinIcon />
          {isAr ? c.eyebrowAr : c.eyebrowEn}
        </span>
        <h2 className="loc-top-title">{isAr ? c.titleAr : c.titleEn}</h2>
      </div>

      {/* Map: the compound, plus the current place and its road to it */}
      <div className="loc-map">
        <LocationLeafletMap active={active} isAr={isAr} />
        {/* Phones: place card pinned to the map's foot */}
        <div className="loc-card absolute inset-x-4 bottom-4 z-30 border border-surface/70 bg-surface/95 p-3 shadow-2xl backdrop-blur md:inset-x-5 md:bottom-5 md:p-4">
          {/* Phones: step through the destinations */}
          {active && (
            <div className="loc-switch">
              <button type="button" className="loc-switch-btn" aria-label={isAr ? "الوجهة السابقة" : "Previous destination"} onClick={() => step(-1)}>
                <Chevron dir={isAr ? "next" : "prev"} />
              </button>
              <div className="loc-switch-text" aria-live="polite">
                <p className="loc-switch-count">
                  {formatNumber(activeIndex + 1, locale)} / {formatNumber(nearbyPlaces.length, locale)}
                </p>
                <p className="loc-switch-name">{isAr ? active.nameAr : active.nameEn}</p>
                {/* Tour loader: fills over TOUR_SECONDS, then the next place comes in */}
                <span className="loc-switch-track" aria-hidden>
                  <span className="loc-switch-fill" />
                </span>
                {(isAr ? active.distanceAr : active.distanceEn) && (
                  <p className="loc-switch-time">{isAr ? active.distanceAr : active.distanceEn}</p>
                )}
              </div>
              <button type="button" className="loc-switch-btn" aria-label={isAr ? "الوجهة التالية" : "Next destination"} onClick={() => step(1)}>
                <Chevron dir={isAr ? "prev" : "next"} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* One panel: where it is, then how far everything is */}
      <div className="loc-panel">
        <span className="section-eyebrow flex items-center gap-2">
          <MapPinIcon />
          {isAr ? c.eyebrowAr : c.eyebrowEn}
        </span>
        <h2 className="section-title loc-title">{isAr ? c.titleAr : c.titleEn}</h2>

        {/* Drive times on the dark band at the foot of the panel */}
        <div className="loc-drive">
        <p className="loc-list-label">{isAr ? c.nearbyTitleAr : c.nearbyTitleEn}</p>
        <ul className="loc-list">
          {nearbyPlaces.map((place) => {
            const on = place.id === activeId;
            return (
              <li key={place.id} className="loc-item">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(place.id)}
                  className={`loc-row${on ? " is-on" : ""}`}
                >
                  <span className="loc-row-name">{isAr ? place.nameAr : place.nameEn}</span>
                  {(isAr ? place.distanceAr : place.distanceEn) && (
                    <span className="loc-row-time">{isAr ? place.distanceAr : place.distanceEn}</span>
                  )}
                </button>
                <span className="loc-bar" data-bar={place.id} aria-hidden />
              </li>
            );
          })}
        </ul>

        </div>
      </div>
    </div>
  );
}
