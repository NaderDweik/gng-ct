import { useEffect, type RefObject } from "react";

/*
 * A soft scroll snap onto one full-screen section (the /compound map, the /chalet room
 * viewer): when a scroll comes to rest near it, the page glides so the section sits
 * exactly under the fixed site header. CSS scroll-snap can't do this: "proximity"
 * re-snaps after every wheel notch, so the page could never be scrolled past it.
 *   - moving toward the section and stopping within a third of a screen of it: snap in;
 *   - starting from the snapped position and moving less than ~1 wheel notch: spring
 *     back (the "tension"); anything further leaves freely.
 * Only from `minWidth` up (0 = every width). The spring-back applies only while the
 * section fits the screen; a taller one just glides into place.
 */

const REST_MS = 140;
const PULL = 1 / 3;
const TENSION_PX = 160;

/** The fixed site header's height (80px from tablet up, 64px on phones). */
const navHeight = () =>
  document.querySelector<HTMLElement>("body > header, header")?.offsetHeight ||
  5 * parseFloat(getComputedStyle(document.documentElement).fontSize);

export function useSoftSnap(ref: RefObject<HTMLElement | null>, minWidth: number) {
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    let startOffset: number | null = null;
    let gliding = false;

    // How far the section's top is from its snapped position (px; > 0 = below it).
    const offset = () => {
      const el = ref.current;
      if (!el) return null;
      return el.getBoundingClientRect().top - navHeight();
    };

    const settle = () => {
      const end = offset();
      const start = startOffset;
      startOffset = null;
      if (gliding) {
        gliding = false;
        return;
      }
      if (end === null || start === null || Math.abs(end) < 1) return;
      const toward = Math.abs(end) < Math.abs(start);
      // The spring-back only where the section fits the screen; a taller one (the room
      // viewer stacked on phones) must scroll freely through its own length.
      const fits = (ref.current?.offsetHeight ?? Infinity) <= window.innerHeight - navHeight() + 2;
      const wasSnapped = fits && Math.abs(start) < 2;
      if ((toward && Math.abs(end) < window.innerHeight * PULL) || (wasSnapped && Math.abs(end) < TENSION_PX)) {
        gliding = true;
        window.scrollBy({ top: end, behavior: reduced.matches ? "auto" : "smooth" });
      }
    };

    const onScroll = () => {
      if (!mq.matches) return;
      if (startOffset === null && !gliding) startOffset = offsetAtRest;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        settle();
        offsetAtRest = offset();
      }, REST_MS);
    };

    // The offset where the last scroll came to rest: the start of the next gesture.
    let offsetAtRest = offset();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [ref, minWidth]);
}
