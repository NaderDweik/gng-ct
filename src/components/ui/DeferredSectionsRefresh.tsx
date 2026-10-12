"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * `.cv-defer` sections (styles/base/motion.css) take their real height only when first drawn,
 * which moves everything under them: re-measure the scroll animations then. Renders nothing.
 */
export function DeferredSectionsRefresh() {
  useEffect(() => {
    const sections = document.querySelectorAll(".cv-defer");
    let timer = 0;
    const refresh = (e: Event) => {
      if ((e as Event & { skipped?: boolean }).skipped) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    sections.forEach((el) => el.addEventListener("contentvisibilityautostatechange", refresh));
    return () => {
      window.clearTimeout(timer);
      sections.forEach((el) => el.removeEventListener("contentvisibilityautostatechange", refresh));
    };
  }, []);

  return null;
}
