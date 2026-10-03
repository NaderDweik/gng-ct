"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import {
  locationCopy,
  mapsSearchUrl,
  nearbyPlaces,
  type NearbyPlace,
} from "@/content/location";
import { LocationLeafletMap } from "@/features/location/LocationLeafletMap";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Seconds each destination stays up while the section tours on its own. */
const TOUR_SECONDS = 5;

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

function NavIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

/*
 * Location section (map: LocationLeafletMap; styles: styles/sections/location-map.css).
 *   Layout: a clean map (route + pins) beside one panel: eyebrow, title, the place, then
 *   the drive-time list on a dark band; the map keeps its place card + Open map button. Kept short and single-purpose.
 *   Tour: the first time the section is on screen, destinations advance on
 *   their own every TOUR_SECONDS, nearest first; a hairline fills across the
 *   active row to show when it moves on. Choosing a place hands control to the
 *   visitor for good. Off-screen the tour pauses.
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
    const bar = rootRef.current?.querySelector<HTMLElement>(`[data-bar="${activeId}"]`);
    if (!touring || !bar) return;
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

  const choose = (id: string) => {
    tookOver.current = true;
    setTouring(false);
    setActiveId(id);
  };

  return (
    <div ref={rootRef} className={`loc${touring ? " is-touring" : ""}`}>
      {/* Map: route + pins only */}
      <div className="loc-map">
        <LocationLeafletMap
          active={active}
          isAr={isAr}
          projectLabel={isAr ? c.projectPinAr : c.projectPinEn}
        />
        {/* Place card pinned to the map's foot, with the way out to Google Maps */}
        <div className="absolute inset-x-4 bottom-4 z-30 border border-surface/70 bg-surface/95 p-3 shadow-2xl backdrop-blur md:inset-x-5 md:bottom-5 md:p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-on-primary">
                <NavIcon />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-ink/55">{site.nameEn}</p>
                <p className="font-semibold text-primary-ink">{isAr ? c.mapShortAr : c.mapShortEn}</p>
              </div>
            </div>
            <a
              href={site.mapsUrl || mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition hover:bg-primary-hover"
            >
              {isAr ? c.openMapAr : c.openMapEn}
              <ExternalArrow />
            </a>
          </div>
        </div>
      </div>

      {/* One panel: where it is, then how far everything is */}
      <div className="loc-panel">
        <span className="section-eyebrow flex items-center gap-2">
          <MapPinIcon />
          {isAr ? c.eyebrowAr : c.eyebrowEn}
        </span>
        <h2 className="section-title loc-title">{isAr ? c.titleAr : c.titleEn}</h2>
        <p className="loc-place">{isAr ? c.mapShortAr : c.mapShortEn}</p>

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
                  <span className="loc-row-time">{isAr ? place.timeAr : place.timeEn}</span>
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
