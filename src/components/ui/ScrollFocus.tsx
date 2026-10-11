"use client";

import { useEffect } from "react";

/*
 * Touch screens / phones have no hover: the element matching `selector` that crosses the
 * middle of the screen gets `.is-active` (style it like :hover). One at a time; it clears
 * as it scrolls on. Renders nothing; does nothing on hover-capable desktops.
 */
export function ScrollFocus({ selector }: { selector: string }) {
  useEffect(() => {
    const mq = matchMedia("(hover: none), (max-width: 767px)");
    let io: IntersectionObserver | null = null;
    const start = () => {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.target.classList.toggle("is-active", e.isIntersecting);
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      document.querySelectorAll(selector).forEach((el) => io!.observe(el));
    };
    const stop = () => {
      io?.disconnect();
      io = null;
      document.querySelectorAll(`${selector}.is-active`).forEach((el) => el.classList.remove("is-active"));
    };
    const sync = () => (mq.matches ? !io && start() : stop());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop();
    };
  }, [selector]);
  return null;
}
