"use client";

import { useEffect } from "react";

/*
 * Adds `className` (default "is-in") to every element matching `selector` the first time it
 * scrolls into view; for touch screens, where hover-only states never play. Renders nothing.
 */
export function InViewOnce({
  selector,
  className = "is-in",
  rootMargin = "0px 0px -20% 0px",
}: {
  selector: string;
  className?: string;
  rootMargin?: string;
}) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add(className);
          io.unobserve(e.target);
        }
      },
      { rootMargin },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, className, rootMargin]);

  return null;
}
