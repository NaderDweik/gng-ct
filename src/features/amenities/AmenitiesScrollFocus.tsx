"use client";

import { useEffect } from "react";

/*
 * Home amenity cards on touch screens / phones (styles: amenities-grid.css): there is no
 * hover, so the card crossing the middle of the screen gets `.is-active`, which plays the
 * same opening as a desktop hover. One card at a time; it closes again as it scrolls on.
 * Renders nothing. Reduced motion: the CSS drops the transitions, the states still swap.
 */
export function AmenitiesScrollFocus() {
  useEffect(() => {
    // Touch tablets only: phones show every card already open (amenities-grid.css).
    const mq = matchMedia("(hover: none) and (min-width: 768px)");
    let io: IntersectionObserver | null = null;

    const start = () => {
      const cards = [...document.querySelectorAll<HTMLElement>(".amg-card")];
      if (!cards.length) return;
      // A band through the middle of the screen: a card is "in focus" while it crosses it.
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.target.classList.toggle("is-active", e.isIntersecting);
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      cards.forEach((c) => io!.observe(c));
    };

    const stop = () => {
      io?.disconnect();
      io = null;
      document.querySelectorAll(".amg-card.is-active").forEach((c) => c.classList.remove("is-active"));
    };

    const sync = () => (mq.matches ? (io ? null : start()) : stop());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
