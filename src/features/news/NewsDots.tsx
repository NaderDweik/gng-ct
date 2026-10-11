"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Phones: the home news cards are a swipe row (styles: news-preview.css). These dots show
 * which card is in view and jump to a card on tap. Hidden from tablet up (CSS).
 */
export function NewsDots({ labels }: { labels: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const track = () => ref.current?.previousElementSibling as HTMLElement | null;

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

  const go = (i: number) => {
    const row = track();
    const card = row?.children[i] as HTMLElement | undefined;
    if (!row || !card) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: card.offsetLeft - row.offsetLeft - (row.clientWidth - card.offsetWidth) / 2, behavior: still ? "auto" : "smooth" });
  };

  return (
    <div ref={ref} className="np-dots">
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
  );
}
