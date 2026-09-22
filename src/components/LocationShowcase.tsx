"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { site } from "@/content/site";
import {
  locationCopy,
  mapsSearchUrl,
  nearbyPlaces,
  type NearbyPlace,
} from "@/content/location";
import { LocationLeafletMap } from "@/components/LocationLeafletMap";

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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
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

function displayPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("962") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return phone;
}

export function LocationShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const c = locationCopy;
  const [activeId, setActiveId] = useState(nearbyPlaces[0]?.id ?? "");
  const active: NearbyPlace | null =
    nearbyPlaces.find((p) => p.id === activeId) ?? nearbyPlaces[0] ?? null;

  const phoneDisplay = displayPhone(site.phone);
  const telHref = `tel:${site.phoneAction || site.phone}`;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] lg:grid-rows-[auto_1fr] lg:items-stretch xl:min-h-[560px]">
      {/* Map */}
      <div className="relative order-2 h-[420px] overflow-hidden rounded-none border border-white/70 bg-[#dfe5e5] shadow-[0_24px_60px_rgba(66,85,99,0.14)] sm:h-[420px] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-[540px] xl:min-h-[560px]">
        <LocationLeafletMap
          active={active}
          isAr={isAr}
          projectLabel={isAr ? c.projectPinAr : c.projectPinEn}
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(242,244,243,0.04),rgba(66,85,99,0.08))]" />
        <div className="absolute inset-x-4 bottom-4 z-30 rounded-none border border-white/70 bg-white/95 p-3 shadow-2xl backdrop-blur md:inset-x-5 md:bottom-5 md:p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-brand text-white">
                <NavIcon />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand/55">
                  {site.nameEn}
                </p>
                <p className="font-semibold text-brand">
                  {isAr ? c.mapShortAr : c.mapShortEn}
                </p>
              </div>
            </div>
            <a
              href={site.mapsUrl || mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-none bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#33414b]"
            >
              {isAr ? c.openMapAr : c.openMapEn}
              <ExternalArrow />
            </a>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="order-1 rounded-none border border-white/75 bg-white p-6 shadow-[0_20px_48px_rgba(66,85,99,0.1)] md:p-7 lg:col-start-2 lg:row-start-1 lg:shrink-0">
        <span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#465461]">
          <MapPinIcon />
          {isAr ? c.eyebrowAr : c.eyebrowEn}
        </span>
        <h2 className="font-display mb-4 text-4xl font-extrabold leading-tight text-[#465461] md:text-5xl">
          {isAr ? c.titleAr : c.titleEn}
        </h2>
        <p className="mb-6 text-base font-light leading-relaxed text-neutral-600 md:text-lg">
          {isAr ? c.subAr : c.subEn}
        </p>
        <div className="border-t border-brand/10">
          <div className="grid gap-2 border-b border-brand/10 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start sm:gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/45 xl:text-[11px] xl:tracking-[0.22em]">
              {isAr ? c.addressLabelAr : c.addressLabelEn}
            </p>
            <p className="whitespace-pre-line text-[13px] font-semibold leading-relaxed text-brand md:text-sm xl:text-base">
              {isAr ? c.addressAr : c.addressEn}
            </p>
          </div>
          <div className="grid gap-2 border-b border-brand/10 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start sm:gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/45 xl:text-[11px] xl:tracking-[0.22em]">
              {isAr ? c.phoneLabelAr : c.phoneLabelEn}
            </p>
            <a
              href={telHref}
              className="text-start text-[13px] font-semibold leading-relaxed text-brand transition-colors hover:underline hover:opacity-75 md:text-sm xl:text-base"
            >
              <span dir="ltr" className="inline-block [direction:ltr]">
                {phoneDisplay}
              </span>
            </a>
          </div>
          <div className="grid gap-2 border-b border-brand/10 py-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-start sm:gap-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/45 xl:text-[11px] xl:tracking-[0.22em]">
              {isAr ? c.deliveryLabelAr : c.deliveryLabelEn}
            </p>
            <p className="whitespace-pre-line text-[13px] font-semibold leading-relaxed text-brand md:text-sm xl:text-base">
              {isAr ? c.deliveryAr : c.deliveryEn}
            </p>
          </div>
        </div>
      </div>

      {/* Nearby list */}
      <div className="order-3 flex flex-col rounded-none bg-brand p-5 text-white shadow-[0_20px_48px_rgba(66,85,99,0.16)] md:p-6 lg:col-start-2 lg:row-start-2 lg:flex-1">
        <h3 className="font-display mb-4 whitespace-nowrap text-sm font-semibold leading-tight tracking-tight sm:text-lg xl:text-xl">
          {isAr ? c.nearbyTitleAr : c.nearbyTitleEn}
        </h3>
        <ul className="grid gap-2 md:grid-cols-2 lg:flex-1 lg:grid-cols-2 lg:content-start xl:content-between">
          {nearbyPlaces.map((place, i) => {
            const on = place.id === activeId;
            return (
              <li key={place.id} className="min-h-10">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActiveId(place.id)}
                  className={`group flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-none px-3 py-2 text-start transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 hover:bg-white/10 ${
                    on ? "bg-white/10" : ""
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full transition ${
                      on ? "bg-white" : "bg-white/35"
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`text-[13px] font-medium leading-snug xl:text-sm ${
                      on ? "text-white" : "text-white/88"
                    }`}
                  >
                    {isAr ? place.nameAr : place.nameEn}
                  </span>
                  <span className="h-px flex-1 bg-white/18 transition group-hover:bg-white/30" />
                  <span className="shrink-0 rounded-none bg-white px-2.5 py-1 text-xs font-bold text-brand">
                    {isAr ? place.timeAr : place.timeEn}
                  </span>
                </button>
                <span className="sr-only">{i + 1}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
