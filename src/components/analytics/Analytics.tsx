"use client";

import { useEffect } from "react";
import { startAnalytics, stopAnalytics, track, type Props } from "@/lib/analytics";
import { rememberRegisterSource } from "@/components/analytics/registerSource";
import { cookieConsent, CONSENT_EVENT } from "@/components/layout/CookieNotice";

/**
 * Where a tapped link sits, when it has no data-track-placement of its own (or on a parent).
 * The first match wins; the page itself is always in $pathname.
 */
const PLACEMENTS: [selector: string, placement: string][] = [
  [".register-form", "register_form"],
  [".register-contact", "register_contact"],
  [".register-cta", "register_banner"],
  [".action-bar", "action_bar"],
  [".wa-float", "floating_button"],
  [".cx-page", "compound_map"],
  [".fin", "financing"],
  [".loc-map, .loc-panel", "location_map"],
  [".pp", "home_faq_passport"],
  [".fq", "home_faq_chat"],
  ["header", "header"],
  ["footer", "footer"],
];

function placementOf(el: Element) {
  const own = el.closest<HTMLElement>("[data-track-placement]")?.dataset.trackPlacement;
  return own ?? PLACEMENTS.find(([selector]) => el.closest(selector))?.[1] ?? "page";
}

/** data-track-chalet="D24" → { chalet: "D24" } (data-track-placement is read separately). */
function extraProps(el: HTMLElement): Props {
  const props: Props = {};
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key.startsWith("track") && key !== "trackPlacement" && value) {
      props[key.slice(5, 6).toLowerCase() + key.slice(6)] = value;
    }
  }
  return props;
}

const REGISTER_PATH = /^\/(en\/)?register\/?$/;

/** Google Maps links: maps.app.goo.gl, goo.gl/maps, maps.google.com, google.com/maps (any Google domain). */
function isMapsLink(url: URL) {
  if (url.host === "maps.app.goo.gl") return true;
  if (url.host === "goo.gl") return url.pathname.startsWith("/maps");
  if (!/(^|\.)google\.[a-z.]+$/.test(url.host)) return false;
  return url.host.startsWith("maps.") || url.pathname.startsWith("/maps");
}

/** Which named event a tapped link is, if any. */
function eventFor(link: HTMLAnchorElement) {
  const url = new URL(link.href, window.location.href);
  if (url.protocol === "tel:") return "call_click";
  if (url.host === "wa.me" || url.host === "api.whatsapp.com") return "whatsapp_click";
  if (url.origin === window.location.origin && REGISTER_PATH.test(url.pathname)) return "register_cta_click";
  if (isMapsLink(url)) return "directions_click";
  return null;
}

/**
 * Starts PostHog once the page is idle (src/lib/analytics.ts) and reports, from one listener,
 * every tap on a register, WhatsApp, phone or Google Maps link anywhere on the site, with where
 * it sits on the page. Renders nothing.
 */
export function Analytics() {
  useEffect(() => {
    // Only after the visitor accepts analytics in the cookie notice (privacy policy): now if
    // they already did, or the moment they press Accept.
    const start = () => {
      if (cookieConsent() === "accepted") void startAnalytics();
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 4000 })
      : window.setTimeout(start, 2500);
    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === "accepted") void startAnalytics();
      else stopAnalytics();
    };
    window.addEventListener(CONSENT_EVENT, onConsent);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const event = eventFor(link);
      if (!event) return;
      const placement = placementOf(link);
      if (event === "register_cta_click") rememberRegisterSource(placement);
      track(event, { placement, ...extraProps(link) });
    };
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener(CONSENT_EVENT, onConsent);
    };
  }, []);

  return null;
}
