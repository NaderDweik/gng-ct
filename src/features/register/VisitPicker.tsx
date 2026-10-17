"use client";

import { useEffect, useRef, useState } from "react";
import { GlideIndicator } from "@/components/ui/GlideIndicator";
import { formatNumber, localeTag } from "@/lib/format";
import { useDragScroll } from "@/lib/useDragScroll";
import {
  bookedByDate,
  bookedByWeekday,
  closedDates,
  visitDaysAhead,
  visitHours,
  visitSlotsCopy,
  visitWeekdays,
} from "@/content/visit-slots";

/*
 * Sales-office visit: pick a day (the next six working days, Saturday to Thursday), then an
 * hour (10 am to 6 pm). Booked days and hours stay visible but can't be chosen. Availability:
 * content/visit-slots.ts. The days depend on today's date, so they're worked out in the
 * browser (the page itself is static); until then the rows hold their space.
 */

export type VisitDay = { key: string; date: Date; booked: number[]; closed: boolean };

const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function upcomingDays(): VisitDay[] {
  const days: VisitDay[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.length < visitDaysAhead) {
    d.setDate(d.getDate() + 1);
    if (!(visitWeekdays as readonly number[]).includes(d.getDay())) continue;
    const key = dateKey(d);
    const booked = bookedByDate[key] ?? bookedByWeekday[d.getDay()] ?? [];
    const closed = closedDates.includes(key) || visitHours.every((h) => booked.includes(h));
    days.push({ key, date: new Date(d), booked, closed });
  }
  return days;
}

/** "10 am" / «١٠ صباحًا». */
export function hourLabel(h: number, locale: string) {
  const h12 = h % 12 || 12;
  if (locale !== "ar") return `${h12} ${h < 12 ? "am" : "pm"}`;
  return `${formatNumber(h12, "ar")} ${h < 12 ? "صباحًا" : h === 12 ? "ظهرًا" : "مساءً"}`;
}

/** "Saturday 18 October" / «السبت ١٨ تشرين الأول». */
export function dayLabel(date: Date, locale: string) {
  const tag = localeTag(locale);
  return `${date.toLocaleDateString(tag, { weekday: "long" })} ${date.toLocaleDateString(tag, { day: "numeric", month: "long" })}`;
}

export function VisitPicker({
  locale,
  day,
  hour,
  onDay,
  onHour,
  dayLabelText,
  hourLabelText,
  error,
  errorId,
}: {
  locale: string;
  day: VisitDay | null;
  hour: number | null;
  onDay: (d: VisitDay) => void;
  onHour: (h: number) => void;
  dayLabelText: string;
  hourLabelText: string;
  error?: string;
  errorId?: string;
}) {
  const copy = visitSlotsCopy[locale === "ar" ? "ar" : "en"];
  const tag = localeTag(locale);
  const [days, setDays] = useState<VisitDay[] | null>(null);
  // Phones: the day row scrolls sideways; arrows and edge fades show where more days are.
  const daysRef = useRef<HTMLDivElement>(null);
  useDragScroll(daysRef, days?.length);
  /** One arrow step: most of the visible row, towards the start (-1) or the end (1). */
  const page = (dir: -1 | 1) => {
    const el = daysRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.7, behavior: "smooth" });
  };

  // First open day is chosen to start with, so the hours show straight away.
  useEffect(() => {
    const list = upcomingDays();
    setDays(list);
    const first = list.find((d) => !d.closed);
    if (first && !day) onDay(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4" aria-describedby={errorId}>
      <div>
        <p className="register-group-label mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {dayLabelText}
        </p>
        <div className="register-days-wrap">
        <div ref={daysRef} role="radiogroup" aria-label={dayLabelText} className="register-days register-glide" data-snap>
          <GlideIndicator watch={`${day?.key}-${days?.length}`} className="register-glide-pill register-glide-pill--time" />
          {(days ?? Array.from({ length: visitDaysAhead }, () => null)).map((d, i) => {
            if (!d) return <span key={i} className="register-day is-placeholder" aria-hidden />;
            const active = day?.key === d.key;
            return (
              <button
                key={d.key}
                type="button"
                role="radio"
                aria-checked={active}
                aria-disabled={d.closed}
                disabled={d.closed}
                onClick={() => onDay(d)}
                className={`register-day${active ? " is-active" : ""}${d.closed ? " is-booked" : ""}`}
              >
                <span className="register-day-name">{d.date.toLocaleDateString(tag, { weekday: "long" })}</span>
                <span className="register-day-date">{d.date.toLocaleDateString(tag, { day: "numeric", month: "short" })}</span>
                {/* Days say nothing when open; only a fully booked day says so. */}
                {d.closed && <span className="register-slot-status">{copy.booked}</span>}
              </button>
            );
          })}
        </div>
        {/* Phones only (CSS): a fade and a round arrow on each edge that still hides days. */}
        {([-1, 1] as const).map((dir) => (
          <span key={dir} className={`register-days-edge ${dir < 0 ? "is-start" : "is-end"}`}>
            <button type="button" tabIndex={-1} onClick={() => page(dir)} aria-label={dir < 0 ? copy.prevDays : copy.nextDays}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d={(dir < 0) !== (locale === "ar") ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          </span>
        ))}
        </div>
      </div>

      <div>
        <p className="register-group-label mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {hourLabelText}
        </p>
        <div role="radiogroup" aria-label={hourLabelText} className="register-slots register-glide">
          <GlideIndicator watch={`${day?.key}-${hour}`} className="register-glide-pill register-glide-pill--time" />
          {visitHours.map((h) => {
            const booked = !day || day.booked.includes(h);
            const active = !booked && hour === h;
            return (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={active}
                aria-disabled={booked}
                disabled={booked}
                onClick={() => onHour(h)}
                className={`register-slot${active ? " is-active" : ""}${booked && day ? " is-booked" : ""}`}
              >
                <span className="register-slot-time">{hourLabel(h, locale)}</span>
                <span className="register-slot-status">{day ? (booked ? copy.booked : copy.available) : " "}</span>
              </button>
            );
          })}
        </div>
        {error && <em id={errorId} className="register-error">{error}</em>}
      </div>
    </div>
  );
}
