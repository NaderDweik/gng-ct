"use client";

import { useEffect } from "react";

/*
 * /news timeline rail (styles: styles/sections/article.css). For each year block, the
 * reader's progress through its stories (0–1, measured at a line a third of the way down
 * the screen) moves the rail's dot down and fills the rail behind it.
 *
 * Smoothness: scroll only sets a target; one rAF loop eases each rail toward its target
 * (exponential smoothing, frame-rate independent) and writes transforms only, so nothing
 * triggers layout and the dot glides instead of stepping. The loop stops when settled.
 * Reduced motion: snaps to the target. Renders nothing; one instance drives every year.
 */

const DOT = 12; // px, matches .news-rail-dot
const SMOOTHING = 12; // higher = snappier

type Rail = { year: HTMLElement; rail: HTMLElement; fill: HTMLElement; dot: HTMLElement; cur: number; target: number };

export function YearRail() {
  useEffect(() => {
    const rails: Rail[] = [...document.querySelectorAll<HTMLElement>(".news-year")].flatMap((year) => {
      const rail = year.querySelector<HTMLElement>(".news-rail");
      const fill = year.querySelector<HTMLElement>(".news-rail-fill");
      const dot = year.querySelector<HTMLElement>(".news-rail-dot");
      return rail && fill && dot ? [{ year, rail, fill, dot, cur: 0, target: 0 }] : [];
    });
    if (!rails.length) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let heights = rails.map((r) => r.rail.offsetHeight);
    let frame = 0;
    let last = 0;

    const measure = () => {
      const anchor = window.innerHeight / 3;
      for (const r of rails) {
        const b = r.year.getBoundingClientRect();
        r.target = Math.min(1, Math.max(0, (anchor - b.top) / b.height));
      }
    };

    const paint = (r: Rail, i: number) => {
      const h = heights[i] ?? 0;
      r.dot.style.transform = `translate3d(0, ${(r.cur * Math.max(0, h - DOT)).toFixed(2)}px, 0)`;
      r.fill.style.transform = `scaleY(${r.cur.toFixed(4)})`;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60;
      last = now;
      const k = still ? 1 : 1 - Math.exp(-SMOOTHING * dt);
      let moving = false;
      rails.forEach((r, i) => {
        const d = r.target - r.cur;
        if (Math.abs(d) < 0.0005) {
          if (r.cur !== r.target) {
            r.cur = r.target;
            paint(r, i);
          }
          return;
        }
        r.cur += d * k;
        moving = true;
        paint(r, i);
      });
      frame = moving ? requestAnimationFrame(tick) : 0;
      if (!moving) last = 0;
    };

    const wake = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      heights = rails.map((r) => r.rail.offsetHeight);
      wake();
    };

    // Start in place (no glide on load).
    measure();
    rails.forEach((r, i) => {
      r.cur = r.target;
      paint(r, i);
    });

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
