"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

/*
 * Site-wide scroll memory: coming back to a page — by link, Back/Forward or a
 * refresh — returns you to where you were on it, not the top.
 *   - Positions are kept per page (path + query, same for both languages) in
 *     sessionStorage, but only for the last RECENT pages visited: going back to
 *     one of those returns you to your place; anything older opens at the top
 *     (so a long trail of pages doesn't leave every page parked at its footer).
 *     A refresh counts as the same page and keeps its place.
 *   - Saved continuously while you scroll, and frozen the moment you leave
 *     (link click / Back), so the next page's scroll-to-top can't overwrite it.
 *   - Restore retries briefly until the page is tall enough (late images,
 *     GSAP pin spacers) and stops if you start scrolling yourself.
 *   - Links to a #section still go to that section.
 *   - Links inside a `[data-scroll-fresh]` area (the site header) always open the
 *     page at its top and forget its old position.
 */

const KEY = "gc-scroll-v2";
const RETRY_MS = 60;
const GIVE_UP_MS = 2500;
/** How many previously visited pages keep their scroll position. */
const RECENT = 3;

/** `order`: pages by last visit, newest first (the current page leads). */
type Store = { order: string[]; pos: Record<string, number> };

const read = (): Store => {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || "null") as Store | null;
    return s && Array.isArray(s.order) && s.pos ? s : { order: [], pos: {} };
  } catch {
    return { order: [], pos: {} };
  }
};

const save = (s: Store) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage blocked — just no memory */
  }
};

const write = (page: string, y: number) => {
  const s = read();
  s.pos[page] = Math.round(y);
  save(s);
};

/**
 * Arriving on `page`: its remembered position if it is among the last RECENT pages
 * visited (or is the page itself, on a refresh), else nothing. Then it becomes the
 * newest page, and positions for pages that fall off the list are forgotten.
 */
const arrive = (page: string): number | undefined => {
  const s = read();
  const rank = s.order.indexOf(page);
  const saved = rank >= 0 && rank < RECENT ? s.pos[page] : undefined;
  s.order = [page, ...s.order.filter((p) => p !== page)].slice(0, RECENT + 1);
  s.pos = Object.fromEntries(s.order.filter((p) => p in s.pos).map((p) => [p, s.pos[p]!]));
  if (saved === undefined) delete s.pos[page];
  save(s);
  return saved;
};

/** Set by a click on a `[data-scroll-fresh]` link; the next page opens at the top. */
let freshNext = false;

export function ScrollMemory() {
  const pathname = usePathname();
  const pageRef = useRef<string | null>(null);
  const locked = useRef(false);
  const lockTimer = useRef<number | undefined>(undefined);

  // We restore positions ourselves (the browser's own restore fights late layout).
  useEffect(() => {
    const prev = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = prev;
    };
  }, []);

  // Save while scrolling; freeze the position the moment a navigation starts.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (locked.current || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!locked.current && pageRef.current) write(pageRef.current, window.scrollY);
      });
    };
    const freeze = () => {
      if (pageRef.current) write(pageRef.current, window.scrollY);
      locked.current = true;
      // Safety: a click that doesn't change page (e.g. the language switch) unlocks again.
      window.clearTimeout(lockTimer.current);
      lockTimer.current = window.setTimeout(() => {
        locked.current = false;
        freshNext = false;
      }, 2000);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (a.origin !== window.location.origin) return;
      freshNext = Boolean(a.closest("[data-scroll-fresh]"));
      freeze();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", freeze);
    window.addEventListener("pagehide", freeze);
    document.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", freeze);
      window.removeEventListener("pagehide", freeze);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  // Arriving on a page: restore its remembered position.
  useEffect(() => {
    const page = `${pathname}${window.location.search}`;
    pageRef.current = page;

    const fresh = freshNext;
    freshNext = false;
    const remembered = arrive(page);
    const saved = fresh ? undefined : remembered;
    const unlock = () => {
      window.clearTimeout(lockTimer.current);
      locked.current = false;
    };
    if (window.location.hash || !saved) {
      unlock();
      return;
    }

    let cancelled = false;
    const stop = () => (cancelled = true);
    const userEvents = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    userEvents.forEach((ev) => window.addEventListener(ev, stop, { passive: true, once: true }));

    const start = performance.now();
    let settled = 0;
    let timer = 0;
    const attempt = () => {
      if (cancelled) return finish();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.min(saved, Math.max(0, max)), behavior: "instant" as ScrollBehavior });
      const there = Math.abs(window.scrollY - saved) < 2;
      settled = there ? settled + 1 : 0;
      // Done once it has held for a few checks (late layout can still push it).
      if (settled >= 4 || performance.now() - start > GIVE_UP_MS) return finish();
      timer = window.setTimeout(attempt, RETRY_MS);
    };
    const finish = () => {
      userEvents.forEach((ev) => window.removeEventListener(ev, stop));
      unlock();
    };
    // Let the new page (and Next's own scroll-to-top) commit first.
    timer = window.setTimeout(attempt, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      userEvents.forEach((ev) => window.removeEventListener(ev, stop));
    };
  }, [pathname]);

  return null;
}
