"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { displayPhone } from "@/lib/format";

/*
 * Phones: "prefer to ask a person?" as a contact card (styles: home-faq.css,
 * .hfaq-card-*). A live status line from the sales office hours in Amman time
 * (open now / back at…), the number, and two thumb-sized actions.
 * The status is filled in after mount, so server and client HTML agree.
 */

/** Office hours in Amman — keep in step with site.hoursAr / hoursEn. Sun=0 … Sat=6. */
const HOURS: Record<number, [open: number, close: number] | null> = {
  0: [9, 19],
  1: [9, 19],
  2: [9, 19],
  3: [9, 19],
  4: [9, 19],
  5: null, // Friday — closed
  6: [10, 16],
};

const DAYS = {
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

function ammanNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Amman",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: Number(get("hour")) + Number(get("minute")) / 60 };
}

function clock(h: number, isAr: boolean) {
  const pm = h >= 12;
  const h12 = h % 12 || 12;
  return isAr ? `${h12.toLocaleString("ar-JO")} ${pm ? "مساءً" : "صباحًا"}` : `${h12} ${pm ? "PM" : "AM"}`;
}

type Status = { open: boolean; text: string };

function status(isAr: boolean): Status {
  const { day, hour } = ammanNow();
  const today = HOURS[day];
  if (today && hour >= today[0] && hour < today[1]) {
    return { open: true, text: isAr ? `متاحون الآن — حتى ${clock(today[1], true)}` : `Available now · until ${clock(today[1], false)}` };
  }
  // Next opening: later today, or the next open day.
  for (let k = 0; k < 7; k++) {
    const d = (day + k) % 7;
    const h = HOURS[d];
    if (!h || (k === 0 && hour >= h[0])) continue;
    const when = k === 0 ? (isAr ? "اليوم" : "today") : k === 1 ? (isAr ? "غدًا" : "tomorrow") : isAr ? DAYS.ar[d] : DAYS.en[d];
    return {
      open: false,
      text: isAr ? `مغلق الآن — نعود ${when} ${clock(h[0], true)}` : `Closed now · back ${when} at ${clock(h[0], false)}`,
    };
  }
  return { open: false, text: "" };
}

type Props = { isAr: boolean };

export function ContactCard({ isAr }: Props) {
  const [st, setSt] = useState<Status | null>(null);
  const hours = isAr ? site.hoursAr : site.hoursEn;
  const tel = `tel:${site.phoneAction || site.phone}`;

  useEffect(() => {
    const tick = () => setSt(status(isAr));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [isAr]);

  return (
    <div className="hfaq-card">
      <p className={`hfaq-card-status${st?.open ? " is-open" : ""}`} aria-live="polite">
        <i aria-hidden />
        <span>{st?.text ?? " "}</span>
      </p>
      <p className="hfaq-card-title">{isAr ? "تفضّل التحدث مع شخص؟" : "Prefer to ask a person?"}</p>
      <a href={tel} className="hfaq-card-phone" dir="ltr">
        {displayPhone(site.phone)}
      </a>

      <div className="hfaq-card-actions">
        <a href={tel} className="hfaq-card-btn hfaq-card-btn--call">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
          </svg>
          {isAr ? "اتصل الآن" : "Call now"}
        </a>
        <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hfaq-card-btn hfaq-card-btn--wa">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z" />
            <path d="M9 8.8c.2 2.6 3.4 5.9 6.2 6.2l1.2-1.5-1.9-1-1 .9c-1-.5-2-1.5-2.5-2.5l.9-1-1-1.9z" />
          </svg>
          {isAr ? "واتساب" : "WhatsApp"}
        </a>
      </div>

      <p className="hfaq-card-hours">
        {hours.weekdays}
        <br />
        {hours.saturday}
      </p>
    </div>
  );
}
