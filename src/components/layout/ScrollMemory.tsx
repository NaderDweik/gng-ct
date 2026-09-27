"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

/*
 * Site-wide scroll memory: coming back to a page — by link, Back/Forward or a
 * refresh — returns you to where you were on it, not the top.
 *   - Positions are kept per page (path + query, same for both languages) in
 *     sessionStorage, so they last for the visit.
 *   - Saved continuously while you scroll, and frozen the moment you leave
 *     (link click / Back), so the next page's scroll-to-top can't overwrite it.
 *   - Restore retries briefly until the page is tall enough (late images,
 *     GSAP pin spacers) and stops if you start scrolling yourself.
 *   - Links to a #section still go to that section.
 */

const KEY = "gc-scroll-v1";
const RETRY_MS = 60;
const GIVE_UP_MS = 2500;

type Store = Record<string, number>;

const read = (): Store => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
};

const write = (page: string, y: number) => {
  try {
    const s = read();
    s[page] = Math.round(y);
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage blocked — just no memory */
  }
};

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
      lockTimer.current = window.setTimeout(() => (locked.current = false), 2000);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (a.origin !== window.location.origin) return;
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

    const saved = read()[page];
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
