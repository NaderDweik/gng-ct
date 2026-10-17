"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CompoundUnit } from "@/content/compound-units";
import { compoundCopy } from "@/content/units";
import type { ChaletInfo } from "@/lib/chaletsSheet";
import { formatNumber } from "@/lib/format";
import { useDragScroll } from "@/lib/useDragScroll";

/*
 * "Available chalets" on the /compound map, browsed like a shop (styles:
 * styles/sections/compound-plan.css, "Available chalets" block).
 *   - The button sits where the "Step inside a chalet" pill used to be (bottom start on
 *     phones, top end from tablet up) and opens the sheet.
 *   - The sheet (a bottom sheet on phones, a drawer on the end edge from tablet up) lists
 *     the chalets on sale as photo cards, with compound filters on top.
 *   - A card, or any chalet tapped on the map, opens the chalet's details in the sheet (the
 *     map flies to it behind): photos, facts, then "Register interest" (to /register with
 *     the chalet filled in) and "Step inside a chalet" (to /chalet).
 *     An unavailable chalet shows the same view with a padlock, and its main button goes
 *     back to the available ones.
 * Photos are placeholders from the resort gallery until each chalet has its own.
 */

type Copy = (typeof compoundCopy)["ar"] | (typeof compoundCopy)["en"];

/** The compound a chalet belongs to: the letter its number starts with ("D24" → "D"). */
export const compoundOf = (id: string) => id.match(/^[A-Z]+/)?.[0] ?? id;

const R = "/gallery/resortsPics";
/** Lead photos, handed out in turn so neighbouring cards differ. */
const LEADS = [
  `${R}/pool-and-tent-pavilion.jpg`,
  `${R}/family-entering-resort-front-door.jpg`,
  `${R}/swimmer-pool-waterfall.jpg`,
  `${R}/family-lounge-under-pergola.jpg`,
  `${R}/giant-chess-poolside-royal.jpg`,
  `${R}/garden-lounge-kids-swing.jpg`,
  `${R}/family-breakfast-poolside-table.jpg`,
  `${R}/family-arriving-resort-a9-garage.jpg`,
];
/** The rest of a chalet's photo strip in its details. */
const INSIDE = [`${R}/family-living-room.jpg`, `${R}/master-bedroom-pool-view.jpg`, `${R}/bathroom-jacuzzi-tub.jpg`, `${R}/kitchen-and-laundry.jpg`];

/** Check mark in a circle: "available" on the map, in the list and on the card. */
export function AvailableIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`cx-ic${className ? ` ${className}` : ""}`} aria-hidden>
      <circle cx="8" cy="8" r="7" />
      <path d="m4.8 8.2 2.1 2.1 4.3-4.4" />
    </svg>
  );
}

/** Padlock in a circle: "unavailable". */
export function UnavailableIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`cx-ic cx-ic--off${className ? ` ${className}` : ""}`} aria-hidden>
      <circle cx="8" cy="8" r="7" />
      <rect x="5.4" y="7.3" width="5.2" height="3.9" rx="0.8" />
      <path d="M6.4 7.3V6.1a1.6 1.6 0 0 1 3.2 0v1.2" />
    </svg>
  );
}

function Chevron({ back, isAr }: { back?: boolean; isAr: boolean }) {
  // Forward points to the reading direction's end; back to its start.
  const right = back ? isAr : !isAr;
  return (
    <svg viewBox="0 0 24 24" className="cx-shop-chev" aria-hidden>
      <path d={right ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
    </svg>
  );
}

export function ChaletListings({
  units,
  all,
  isAvailable,
  info,
  copy,
  locale,
  open,
  detailId,
  hoverId,
  onOpen,
  onDetail,
  onHover,
}: {
  /** The chalets on sale (the list). */
  units: CompoundUnit[];
  /** Every chalet, for the details of one tapped on the map. */
  all: CompoundUnit[];
  isAvailable: (id: string) => boolean;
  /** A chalet's details (area, bedrooms, tags, description): built in or from the Chalets sheet. */
  info: (id: string) => ChaletInfo;
  copy: Copy;
  locale: string;
  open: boolean;
  /** The chalet whose details are showing, or null for the list. */
  detailId: string | null;
  hoverId: string | null;
  onOpen: (open: boolean) => void;
  onDetail: (u: CompoundUnit | null) => void;
  onHover: (id: string | null) => void;
}) {
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);
  const [filter, setFilter] = useState<string | null>(null);
  const [drag, setDrag] = useState(0);
  const start = useRef<{ y: number } | null>(null);
  // Mouse users drag (or wheel) the chip row and the photo strip sideways.
  const filtersRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const letters = [...new Set(units.map((u) => compoundOf(u.id)))];
  const shown = filter ? units.filter((u) => compoundOf(u.id) === filter) : units;
  const detail = all.find((u) => u.id === detailId) ?? null;
  const detailOn = detail ? isAvailable(detail.id) : false;
  /** The tags on a chalet's card: area, bedrooms, then the pool tag when it has one. */
  const factsOf = (id: string) => {
    const c = info(id);
    const beds = isAr
      ? c.bedrooms === 1
        ? "غرفة نوم واحدة"
        : c.bedrooms === 2
          ? "غرفتا نوم"
          : `${n(c.bedrooms)} ${c.bedrooms <= 10 ? "غرف نوم" : "غرفة نوم"}`
      : `${c.bedrooms} bedroom${c.bedrooms === 1 ? "" : "s"}`;
    return [
      ...(c.area ? [`${n(c.area)} ${isAr ? "م²" : "m²"}`] : []),
      beds,
      ...(c.pool ? [copy.facts[2]] : []),
    ];
  };
  /** The chalet's description from the sheet, or the shared line. */
  const pitchOf = (id: string) => (isAr ? info(id).descAr : info(id).descEn) || copy.pitch;
  // Rotate through the photos in list order, so neighbouring cards differ.
  const lead = (u: CompoundUnit) => {
    const i = units.indexOf(u);
    return LEADS[(i >= 0 ? i : all.indexOf(u)) % LEADS.length]!;
  };
  useDragScroll(filtersRef, `${open}-${detailId}`);
  useDragScroll(photosRef, `${open}-${detailId}`);

  // The scrolling body (list or details) fades at the bottom until it's scrolled to the end
  // (data-at-bottom; styles: .cx-shop-body).
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => el.toggleAttribute("data-at-bottom", el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [open, detailId, filter]);

  // Phones: drag the handle down to close the sheet.
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") start.current = { y: e.clientY };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current) setDrag(Math.max(0, e.clientY - start.current.y));
  };
  const onUp = () => {
    if (start.current && drag > 80) onOpen(false);
    start.current = null;
    setDrag(0);
  };

  return (
    <>
      <button type="button" className="cx-shop-open" onClick={() => onOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <AvailableIcon className="cx-shop-open-icon" />
        <span className="cx-shop-open-text">
          <strong>{copy.listTitle}</strong>
          <span>{copy.listOpenSub}</span>
        </span>
        <span className="cx-list-count">{n(units.length)}</span>
        <Chevron isAr={isAr} />
      </button>

      <aside
        className={`cx-shop${open ? " is-open" : ""}${detail ? " is-detail" : ""}${drag ? " is-dragging" : ""}`}
        style={drag ? { translate: `0 ${drag}px` } : undefined}
        aria-label={copy.listTitle}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="cx-shop-grip" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} aria-hidden />

        <header className="cx-shop-head">
          {detail ? (
            <button type="button" className="cx-shop-back" onClick={() => onDetail(null)}>
              <Chevron back isAr={isAr} />
              {copy.backToList}
            </button>
          ) : (
            <h2 className="cx-shop-title">
              {copy.listTitle} <span className="cx-list-count">{n(units.length)}</span>
            </h2>
          )}
          <button type="button" className="cx-shop-close" onClick={() => onOpen(false)} aria-label={copy.close}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {detail ? (
          <>
            <div className="cx-shop-body cx-detail" key={detail.id} ref={bodyRef}>
              <div className="cx-detail-photos" ref={photosRef} data-snap>
                {[lead(detail), ...INSIDE].map((src, i) => (
                  <div key={src} className="cx-detail-photo">
                    <Image src={src} alt={i === 0 ? `${copy.chalet} ${detail.id}` : ""} fill sizes="(min-width: 768px) 16rem, 62vw" className="object-cover" />
                  </div>
                ))}
              </div>
              {detailOn ? (
                <p className="cx-status is-available">
                  <AvailableIcon />
                  {copy.available}
                </p>
              ) : (
                <p className="cx-status is-unavailable">
                  <UnavailableIcon />
                  {copy.unavailable}
                </p>
              )}
              <h3 className="cx-detail-id">
                {copy.chalet} <span dir="ltr">{detail.id}</span>
              </h3>
              <p className="cx-detail-where">{copy.compound(compoundOf(detail.id))}</p>
              <ul className="cx-facts">
                {factsOf(detail.id).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="cx-pitch">{detailOn ? pitchOf(detail.id) : copy.unavailableNote}</p>
            </div>
            {/* Outside the scrolling body: always in view, on the panel's own glass. */}
            <div className="cx-detail-actions">
              {detailOn ? (
                <Link
                  href={{ pathname: "/register", query: { chalet: detail.id } }}
                  className="cx-btn cx-btn--wa"
                  data-track-chalet={detail.id}
                >
                  {copy.register}
                </Link>
              ) : (
                <button type="button" className="cx-btn cx-btn--wa" onClick={() => onDetail(null)}>
                  {copy.showAvailable}
                </button>
              )}
              <Link href="/chalet" className="cx-btn cx-btn--ghost">
                {copy.inside}
              </Link>
            </div>
          </>
        ) : (
          <div className="cx-shop-body" ref={bodyRef}>
            <div className="cx-shop-filters" ref={filtersRef} role="group" aria-label={copy.filterLabel}>
              <button type="button" className={`cx-chip${filter === null ? " is-on" : ""}`} aria-pressed={filter === null} onClick={() => setFilter(null)}>
                {copy.all}
              </button>
              {letters.map((l) => (
                <button key={l} type="button" className={`cx-chip${filter === l ? " is-on" : ""}`} aria-pressed={filter === l} onClick={() => setFilter(l)}>
                  {copy.compound(l)}
                </button>
              ))}
            </div>
            <ul className="cx-shop-grid">
              {shown.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    className={`cx-shop-card${u.id === hoverId ? " is-hover" : ""}`}
                    onClick={() => onDetail(u)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && onHover(u.id)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
                  >
                    <span className="cx-shop-photo">
                      <Image src={lead(u)} alt="" fill sizes="(min-width: 768px) 12rem, 45vw" className="object-cover" />
                      <span className="cx-shop-badge">
                        <AvailableIcon />
                        {copy.available}
                      </span>
                    </span>
                    <span className="cx-shop-info">
                      <span className="cx-shop-id">
                        {copy.chalet} <span dir="ltr">{u.id}</span>
                      </span>
                      <span className="cx-shop-where">{copy.compound(compoundOf(u.id))}</span>
                      <span className="cx-shop-facts">
                        {factsOf(u.id).slice(0, 2).join(" · ")}
                      </span>
                      <span className="cx-shop-more">
                        {copy.details}
                        <Chevron isAr={isAr} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
