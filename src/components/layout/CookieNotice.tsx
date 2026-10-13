"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/*
 * Cookie consent (styles: styles/base/cookie-notice.css): a modal over a dark tinted screen,
 * shown as soon as the page loads, until the visitor chooses.
 *   - Accept: analytics may start (components/analytics/Analytics.tsx listens).
 *   - The square × (and Esc): closes without accepting, so analytics stay off.
 *   - "Cookie policies": opens /cookies, where the modal steps aside so the page can be read.
 * The choice is kept in localStorage ("gc-cookie-consent": "accepted" | "declined", with the
 * date; asked again after 12 months) and announced with a window event of the same name.
 */
const KEY = "gc-cookie-consent";
/** Window event fired with the choice (detail: "accepted" | "declined"). */
export const CONSENT_EVENT = KEY;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
/** Pages the modal never covers: the policies it points to. */
const READ_PAGES = ["/cookies", "/privacy", "/terms"];

export function cookieConsent(): "accepted" | "declined" | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const [value, at] = raw.split("|");
    if (at && Date.now() - Number(at) > MAX_AGE_MS) return null;
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function CookieNotice() {
  const isAr = useLocale() === "ar";
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPending(cookieConsent() === null);
    // A choice made elsewhere (the cookie settings on /cookies) closes the notice too.
    const chosen = () => setPending(false);
    window.addEventListener(CONSENT_EVENT, chosen);
    return () => window.removeEventListener(CONSENT_EVENT, chosen);
  }, []);

  const open = pending && !READ_PAGES.includes(pathname);

  const choose = (value: "accepted" | "declined") => saveChoice(value);

  // While open: the page behind can't scroll, Accept takes focus, Esc closes (declines).
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    acceptRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && choose("declined");
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!pending) return null;

  return (
    <div className={`cookie-modal${open ? " is-on" : ""}`} inert={!open} aria-hidden={!open}>
      <div className="cookie-modal-backdrop" />
      <div className="cookie-modal-card" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
        <button
          type="button"
          className="cookie-modal-close"
          aria-label={isAr ? "إغلاق دون موافقة" : "Close without accepting"}
          onClick={() => choose("declined")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h2 id="cookie-modal-title" className="cookie-modal-title">
          {isAr ? "نستخدم ملفات تعريف الارتباط" : "We use cookies"}
        </h2>
        <p className="cookie-modal-text">
          {isAr ? (
            <>
              نستخدم ملفات تعريف الارتباط لتحسين تجربة تصفحك وتحليل زيارات موقعنا. بالضغط على «موافق»، فإنك توافق على
              استخدامنا لملفات تعريف الارتباط. اطّلع على سياسة ملفات تعريف الارتباط لمزيد من
              المعلومات.
            </>
          ) : (
            <>
              We use cookies to enhance your browsing experience and analyze our traffic. By clicking “Accept”, you
              consent to our use of cookies. Visit our Cookie Policy for more info.
            </>
          )}
        </p>
        <div className="cookie-modal-actions">
          <Link href="/cookies" className="btn btn-ghost-dark cookie-modal-btn">
            {isAr ? "سياسات ملفات تعريف الارتباط" : "Cookie policies"}
          </Link>
          <button ref={acceptRef} type="button" className="btn btn-primary cookie-modal-btn" onClick={() => choose("accepted")}>
            {isAr ? "موافق" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Saves a choice and tells the site (analytics, the notice). */
function saveChoice(value: "accepted" | "declined") {
  try {
    localStorage.setItem(KEY, `${value}|${Date.now()}`);
  } catch {
    /* private mode: the choice lasts this visit only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/**
 * Cookie policy page: "Cookie settings", an accordion with one toggle per kind of cookie.
 * Strictly necessary is always on; Analytics saves the choice the moment it is switched.
 */
export function CookieSettings() {
  const isAr = useLocale() === "ar";
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    setAnalytics(cookieConsent() === "accepted");
    const sync = (e: Event) => setAnalytics((e as CustomEvent).detail === "accepted");
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  const rows = [
    {
      id: "necessary",
      title: isAr ? "الضرورية" : "Strictly necessary",
      text: isAr
        ? "تُبقي الموقع يعمل بأمان وتتذكر لغتك واختياراتك. تعمل دائمًا."
        : "Keep the site working and secure, and remember your language and choices. Always on.",
      on: true,
      locked: true,
    },
    {
      id: "analytics",
      title: isAr ? "التحليلات" : "Analytics",
      text: isAr
        ? "تساعدنا على فهم طريقة استخدام الموقع وتحسين تجربتك."
        : "Help us understand how the site is used and improve your experience.",
      on: analytics,
      locked: false,
    },
  ];

  return (
    <div className={`cookie-settings${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="cookie-settings-head"
        aria-expanded={open}
        aria-controls="cookie-settings-body"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{isAr ? "إعدادات ملفات تعريف الارتباط" : "Cookie settings"}</span>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div id="cookie-settings-body" className="cookie-settings-body" inert={!open}>
        <ul className="cookie-settings-list">
          {rows.map((r) => (
            <li key={r.id} className="cookie-settings-row">
              <div>
                <p className="cookie-settings-title">{r.title}</p>
                <p className="cookie-settings-text">{r.text}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={r.on}
                aria-label={r.title}
                disabled={r.locked}
                className={`cookie-toggle${r.on ? " is-on" : ""}`}
                onClick={() => {
                  const next = !analytics;
                  setAnalytics(next);
                  saveChoice(next ? "accepted" : "declined");
                }}
              >
                <span className="cookie-toggle-knob" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
