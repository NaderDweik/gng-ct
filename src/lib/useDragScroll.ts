"use client";

import { useEffect, type RefObject } from "react";

/**
 * Sideways scrolling rows (chip filters, photo strips). Touch swipes them natively; this
 * adds, for a mouse:
 *   - drag: the row follows the pointer 1:1; on release it glides (smooth scroll) to the
 *     nearest item, one item further in the direction of a quick flick;
 *   - a drag never counts as a click on what's under it.
 * For every input it marks the row with data-at-start / data-at-end, so CSS can fade only
 * the edges that still hide something (styles: compound-plan.css). Works right to left.
 * Pass `key` when the row mounts and unmounts (e.g. the view it lives in) so it re-attaches.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>, key?: unknown) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    // Distance scrolled from the start edge (scrollLeft runs negative in RTL rows).
    const pos = () => (rtl ? -el.scrollLeft : el.scrollLeft);
    const max = () => el.scrollWidth - el.clientWidth;

    const edges = () => {
      el.toggleAttribute("data-at-start", pos() <= 2);
      el.toggleAttribute("data-at-end", pos() >= max() - 2);
    };
    edges();

    let start: { x: number; left: number } | null = null;
    let moved = false;
    let last = { x: 0, t: 0, v: 0 };

    /** Where each item starts, as a scroll distance from the start edge. */
    const stops = () => {
      const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
      const box = el.getBoundingClientRect();
      return [...el.children].map((c) => {
        const r = c.getBoundingClientRect();
        const d = rtl ? box.right - pad - r.right : r.left - box.left - pad;
        return Math.min(max(), Math.max(0, pos() + d));
      });
    };

    const glideTo = (distance: number) => {
      el.scrollTo({ left: rtl ? -distance : distance, behavior: "smooth" });
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || max() <= 0) return;
      start = { x: e.clientX, left: el.scrollLeft };
      last = { x: e.clientX, t: e.timeStamp, v: 0 };
      moved = false;
    };
    const move = (e: PointerEvent) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (!moved && Math.abs(dx) < 4) return;
      if (!moved) {
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add("is-drag-scrolling");
      }
      const dt = Math.max(1, e.timeStamp - last.t);
      last = { x: e.clientX, t: e.timeStamp, v: (e.clientX - last.x) / dt };
      el.scrollLeft = start.left - dx;
    };
    const up = () => {
      if (!start) return;
      start = null;
      if (!moved) return;
      // Snapping stays off (.is-drag-scrolling) until the glide ends, or it would jump.
      const done = () => el.classList.remove("is-drag-scrolling");
      el.addEventListener("scrollend", done, { once: true });
      window.setTimeout(done, 700);
      // Pointer moving towards the end edge = scrolling back towards the start.
      const toEnd = rtl ? last.v > 0 : last.v < 0;
      const flick = Math.abs(last.v) > 0.35;
      const points = stops();
      const here = pos();
      let target: number;
      if (el.dataset.snap === undefined) {
        // Free rows (chips): coast a little further, then stop.
        target = Math.min(max(), Math.max(0, here + (toEnd ? 1 : -1) * Math.min(240, Math.abs(last.v) * 180)));
      } else if (flick) {
        target = toEnd ? (points.find((p) => p > here + 2) ?? max()) : ([...points].reverse().find((p) => p < here - 2) ?? 0);
      } else {
        target = points.reduce((a, b) => (Math.abs(b - here) < Math.abs(a - here) ? b : a), 0);
      }
      glideTo(target);
    };
    // Swallow the click that ends a drag.
    const click = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    el.addEventListener("scroll", edges, { passive: true });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    const ro = new ResizeObserver(edges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", edges);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      ro.disconnect();
    };
  }, [ref, key]);
}
