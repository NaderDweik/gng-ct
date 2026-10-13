"use client";

import { SmoothImage } from "@/components/ui/SmoothImage";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { ServiceIconName } from "@/content/services";
import { ServiceIcon } from "@/features/services/ServiceIcon";

/*
 * Home services film strip (styles: styles/sections/home-links.css). A row of photos;
 * the focused one sits first, larger and taller, with its icon, name and line above it.
 * Previous / next (top end, over a progress line) slide the next photo into focus and it
 * grows as it arrives. It also steps on by itself while in view (paused on hover / focus).
 * Endless: the list is rendered three times and the strip jumps back to the middle copy
 * after each move, without animating. Arrow keys and swipes work; mirrored in Arabic.
 */

export type HomeServiceShot = {
  id: string;
  src: string;
  icon: ServiceIconName;
  title: string;
  body: string;
};

const STEP_MS = 5000;
/** The track's slide length (--hsc-dur in home-links.css). */
const SLIDE_MS = 800;

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d={dir === "prev" ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"}
      />
    </svg>
  );
}

export function HomeServicesViewer({
  shots,
  isAr,
  locale,
  cta,
}: {
  shots: HomeServiceShot[];
  isAr: boolean;
  locale: string;
  /** Phones: shown at the start of the controls row under the photos. */
  cta?: ReactNode;
}) {
  const total = shots.length;
  const loop = [...shots, ...shots, ...shots];
  // Position in the tripled list; the middle copy is home.
  const [pos, setPos] = useState(total);
  const [animate, setAnimate] = useState(true);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const swipeX = useRef<number | null>(null);

  const index = ((pos % total) + total) % total;
  const shot = shots[index]!;
  const num = (v: number) =>
    v.toLocaleString(isAr ? "ar-JO" : "en-US", { minimumIntegerDigits: 2 });

  const go = (step: number) => {
    setAnimate(true);
    setPos((p) => p + step);
  };

  // After a move lands outside the middle copy, jump back into it (same picture, no
  // motion). Timed off the slide's length (--hsc-dur, 0.8s) rather than transitionend,
  // which never fires in a background tab or when a quick second move interrupts the
  // slide: the position then ran on past the copies into an empty track.
  useEffect(() => {
    if (pos < total * 2 && pos >= total) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos(total + (((pos % total) + total) % total));
    }, SLIDE_MS + 60);
    return () => clearTimeout(t);
  }, [pos, total]);

  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true)),
      );
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  useEffect(() => {
    setStill(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e!.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay: only while on screen, not held, and the tab is visible.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (still || held || !inView || !visible) return;
    const t = setTimeout(() => go(1), STEP_MS);
    return () => clearTimeout(t);
  }, [pos, still, held, inView, visible]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(e.key === (isAr ? "ArrowLeft" : "ArrowRight") ? 1 : -1);
  }

  function onPointerUp(e: PointerEvent) {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) < 40) return;
    go(dx < 0 !== isAr ? 1 : -1);
  }

  return (
    <div
      ref={ref}
      className="hsc"
      role="region"
      aria-roledescription={isAr ? "عارض صور" : "carousel"}
      aria-label={isAr ? "خدمات الكمباوند" : "Compound services"}
      tabIndex={0}
      lang={locale}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setHeld(false);
      }}
    >
      <div className="hsc-top">
        {/* Screen-reader announcement of the focused service (its card is on the photo). */}
        <p className="sr-only" aria-live="polite">
          {shot.title}: {shot.body}
        </p>

        <div className="hsc-nav">
          {cta && <div className="hsc-cta">{cta}</div>}
          <div className="hsc-arrows">
            <span className="hsc-count" aria-hidden>
              {num(index + 1)} <span>/ {num(total)}</span>
            </span>
            <button
              type="button"
              className="hsc-arrow"
              aria-label={isAr ? "السابق" : "Previous"}
              onClick={() => go(-1)}
            >
              <Arrow dir={isAr ? "next" : "prev"} />
            </button>
            <button
              type="button"
              className="hsc-arrow is-next"
              aria-label={isAr ? "التالي" : "Next"}
              onClick={() => go(1)}
            >
              <Arrow dir={isAr ? "prev" : "next"} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="hsc-viewport"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") swipeX.current = e.clientX;
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeX.current = null)}
      >
        <ul
          className={`hsc-track${animate ? "" : " no-anim"}`}
          style={{ "--pos": pos } as CSSProperties}
        >
          {loop.map((s, i) => {
            const on = i === pos;
            return (
              <li
                key={`${s.id}-${i}`}
                className={`hsc-item${on ? " is-on" : ""}`}
                aria-hidden={!on}
                onClick={() => !on && go(i - pos)}
              >
                <SmoothImage
                  src={s.src}
                  alt={on ? s.title : ""}
                  fill
                  sizes="(min-width: 1024px) 45vw, 80vw"
                  className="hsc-img"
                />
                {/* White corner card on the focused photo: icon + name. */}
                <span className="hsc-cap" aria-hidden>
                  <span className="hsc-icon">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <span className="hsc-title">{s.title}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Progress: how far through the set you are. */}
      <span className="hsc-line" aria-hidden>
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </span>
    </div>
  );
}
