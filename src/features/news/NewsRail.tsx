"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Phones: the home news cards are a swipe row (styles: news-preview.css). This wraps the
 * row with a soft fade on each side, a round chevron over each fade that steps one card
 * (hidden at either end), and dots underneath that show which card is in view and jump to
 * it on tap. Fingers swipe the row natively; a mouse can drag it too. From tablet up, only the plain grid shows (CSS).
 */
export function NewsRail({
  children,
  labels,
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  labels: string[];
  prevLabel: string;
  nextLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const track = () => ref.current?.querySelector<HTMLElement>(".np-grid") ?? null;

  useEffect(() => {
    const row = track();
    if (!row) return;
    const cards = [...row.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement));
      },
      { root: row, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // Touch swipes natively; a mouse (a desktop browser at phone width) drags the row too.
  // A drag never opens the card under the pointer, and the row snaps to a card on release.
  useEffect(() => {
    const row = track();
    if (!row) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || row.scrollWidth <= row.clientWidth) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = row.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        row.style.scrollSnapType = "none";
        row.style.cursor = "grabbing";
      }
      e.preventDefault();
      row.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      row.style.cursor = "";
      if (!moved) return;
      // Snap to the card nearest the middle, then hand snapping back to CSS.
      const cards = [...row.children] as HTMLElement[];
      const mid = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      cards.forEach((c, i) => {
        const b = cards[best]!;
        if (Math.abs(c.offsetLeft - row.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(b.offsetLeft - row.offsetLeft + b.offsetWidth / 2 - mid)) best = i;
      });
      go(best);
      window.setTimeout(() => (row.style.scrollSnapType = ""), 450);
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const noDrag = (e: DragEvent) => e.preventDefault();
    row.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    row.addEventListener("click", click, true);
    row.addEventListener("dragstart", noDrag);
    return () => {
      row.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      row.removeEventListener("click", click, true);
      row.removeEventListener("dragstart", noDrag);
    };
  }, []);

  const go = (i: number) => {
    const row = track();
    const card = row?.children[i] as HTMLElement | undefined;
    if (!row || !card) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: card.offsetLeft - row.offsetLeft - (row.clientWidth - card.offsetWidth) / 2, behavior: still ? "auto" : "smooth" });
  };

  const last = labels.length - 1;
  const chevron = (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );

  return (
    <>
      <div ref={ref} className="np-rail">
        {children}
        <span className="np-fade np-fade--start" aria-hidden />
        <span className="np-fade np-fade--end" aria-hidden />
        <button
          type="button"
          className={`np-step np-step--prev${active <= 0 ? " is-off" : ""}`}
          aria-label={prevLabel}
          disabled={active <= 0}
          onClick={() => go(active - 1)}
        >
          {chevron}
        </button>
        <button
          type="button"
          className={`np-step np-step--next${active >= last ? " is-off" : ""}`}
          aria-label={nextLabel}
          disabled={active >= last}
          onClick={() => go(active + 1)}
        >
          {chevron}
        </button>
      </div>
      <div className="np-dots">
        {labels.map((label, i) => (
          <button
            key={i}
            type="button"
            className={`np-dot${i === active ? " is-on" : ""}`}
            aria-label={label}
            aria-current={i === active || undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </>
  );
}
