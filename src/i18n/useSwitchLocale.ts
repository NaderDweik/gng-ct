"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/*
 * Language switch without the "reload" feel (styles: styles/base/locale-switch.css).
 *   - next-intl's router: updates the NEXT_LOCALE cookie client-side and goes
 *     straight to the target URL (a <Link locale> goes via /ar/… + a redirect).
 *   - Soft navigation (RSC fetch only) — the document never reloads.
 *   - View Transition: the old page stays on screen until the new language has
 *     rendered, then the new one wipes in from its own reading side.
 *   - Keeps your place: re-anchors to the section you were reading.
 *   - Direction is a view-transition *type* (to-rtl / to-ltr), read in CSS with
 *     :active-view-transition-type(). Nothing is written onto <html>: React owns
 *     that element and drops attributes it didn't render.
 *   - Entrance animations (hero intro, .reveal) are skipped on the new page via
 *     `isSwitchingLocale()`, so it doesn't look like a fresh load.
 * Reduced motion / no View Transitions: the same switch, without the animation.
 */

type VT = { finished: Promise<void> };
type VTDoc = Document & {
  startViewTransition?: (arg: (() => Promise<void>) | { update: () => Promise<void>; types: string[] }) => VT;
};

let switching = false;
/** True while a language switch is rendering the new page. */
export const isSwitchingLocale = () => switching;

const html = () => document.documentElement;

/** The page section at the top of the viewport, and how far into it we are. */
function readAnchor() {
  const sections = [...document.querySelectorAll<HTMLElement>("main > *")];
  const line = 96; // just under the fixed header
  const i = sections.findIndex((s) => s.getBoundingClientRect().bottom > line);
  if (i < 0) return null;
  const r = sections[i]!.getBoundingClientRect();
  return { i, ratio: Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height))) };
}

function restoreAnchor(a: ReturnType<typeof readAnchor>) {
  if (!a) return;
  const s = document.querySelectorAll<HTMLElement>("main > *")[a.i];
  if (!s) return;
  const top = s.getBoundingClientRect().top + window.scrollY + a.ratio * s.offsetHeight - 96;
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" as ScrollBehavior });
}

/** Resolves once <html lang> shows the new locale (i.e. the new tree is committed). */
function waitForLocale(next: string, timeout = 2500) { // < Chrome's 4s view-transition limit
  return new Promise<void>((resolve) => {
    if (html().lang === next) return resolve();
    // No requestAnimationFrame here: rendering is paused while a view
    // transition's update runs, so a rAF would never fire (→ 4s abort).
    const done = () => {
      mo.disconnect();
      clearTimeout(t);
      setTimeout(resolve, 0);
    };
    const mo = new MutationObserver(() => html().lang === next && done());
    mo.observe(html(), { attributes: true, attributeFilter: ["lang"] });
    const t = setTimeout(done, timeout);
  });
}

export function useSwitchLocale() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const target = locale === "ar" ? ("en" as Locale) : ("ar" as Locale);

  /** Warm the other language so the switch is near-instant. */
  const prefetch = useCallback(() => {
    router.prefetch(pathname, { locale: target });
  }, [router, pathname, target]);

  const switchLocale = useCallback(() => {
    const next = target;
    const query = window.location.search + window.location.hash;
    const href = `${pathname}${query}`;
    const anchor = readAnchor();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as VTDoc;

    const go = async () => {
      router.replace(href, { locale: next, scroll: false });
      await waitForLocale(next);
      // The new page shouldn't play its entrance animations.
      document.querySelectorAll<HTMLElement>("main .reveal").forEach((el) => (el.style.animation = "none"));
      restoreAnchor(anchor);
    };

    switching = true;
    const clear = () => window.setTimeout(() => (switching = false), 400);

    if (reduced || !doc.startViewTransition) {
      go().finally(clear);
      return;
    }
    const types = [next === "ar" ? "to-rtl" : "to-ltr"];
    let vt: VT;
    try {
      vt = doc.startViewTransition({ update: go, types });
    } catch {
      vt = doc.startViewTransition(go); // older engines: callback form, default cross-fade
    }
    vt.finished.finally(clear);
  }, [router, pathname, target]);

  return { target, switchLocale, prefetch };
}
