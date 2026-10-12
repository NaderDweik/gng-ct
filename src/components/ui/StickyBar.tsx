"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";

/*
 * Phones: a compact bar that slides in under the fixed site header once `anchor` (the full
 * filter controls in the page) has scrolled up out of view, and slides away again when it
 * comes back or `until` (the end of the filtered content) has scrolled past. The page's
 * own controls never move, so nothing jumps. Styles: styles/base/sticky-bar.css.
 */
export function StickyBar({
  anchor,
  until,
  children,
  label,
}: {
  anchor: RefObject<HTMLElement | null>;
  until: RefObject<HTMLElement | null>;
  children: ReactNode;
  label: string;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    let raf = 0;
    const check = () => {
      raf = 0;
      const a = anchor.current;
      const u = until.current;
      if (!a || !u || !mq.matches) return setOn(false);
      const nav = document.querySelector<HTMLElement>("header")?.offsetHeight ?? 64;
      setOn(a.getBoundingClientRect().bottom < nav && u.getBoundingClientRect().bottom > nav + 120);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [anchor, until]);

  return (
    <div className={`sticky-bar${on ? " is-on" : ""}`} role="region" aria-label={label} inert={!on} aria-hidden={!on}>
      <div className="container-gc sticky-bar-inner">{children}</div>
    </div>
  );
}

/** The compact pill row inside a StickyBar; keeps the active pill scrolled into view. */
export function StickyPills({
  items,
  active,
  onPick,
}: {
  items: { id: string; label: string; count?: string; disabled?: boolean }[];
  active: string;
  onPick: (id: string) => void;
}) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`.sticky-pills [data-id="${CSS.escape(active)}"]`);
    const row = el?.parentElement;
    if (!el || !row) return;
    row.scrollTo({ left: el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div className="sticky-pills">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          data-id={it.id}
          disabled={it.disabled}
          aria-pressed={it.id === active}
          className={`sticky-pill${it.id === active ? " is-on" : ""}`}
          onClick={() => onPick(it.id)}
        >
          {it.label}
          {it.count !== undefined && <span className="sticky-pill-count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
