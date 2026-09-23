"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ThemeName } from "@/theme/tokens";

/*
 * Client-side theme state. The source of truth is the `data-theme` attribute on
 * <html> (set before paint by `themeInitScript`), so there is no provider —
 * any component can subscribe and they all stay in sync.
 */

const root = () => document.documentElement;

function read(): ThemeName {
  return root().getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Current theme; `"light"` during SSR / hydration, then the real value. */
export function useTheme(): ThemeName {
  return useSyncExternalStore(subscribe, read, () => "light");
}

export function hasStoredTheme(): boolean {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark";
  } catch {
    return false;
  }
}

export function applyTheme(theme: ThemeName, { persist = true } = {}) {
  root().setAttribute("data-theme", theme);
  root().style.colorScheme = theme;
  if (!persist) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode / blocked storage — the choice just won't persist */
  }
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

const REVEAL_MS = 700;
const FADE_MS = 350;

/**
 * Switch theme with a circular reveal growing from `origin` (the toggle).
 * Uses the View Transitions API where available, a short color cross-fade
 * elsewhere, and switches instantly for reduced-motion users.
 */
export function switchTheme(next: ThemeName, origin?: { x: number; y: number }) {
  const el = root();
  const doc = document as ViewTransitionDocument;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme(next);
    return;
  }

  if (!doc.startViewTransition) {
    el.classList.add("theme-fade");
    applyTheme(next);
    window.setTimeout(() => el.classList.remove("theme-fade"), FADE_MS);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  el.classList.add("theme-reveal");
  const transition = doc.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      el.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: REVEAL_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => el.classList.remove("theme-reveal"));
}
