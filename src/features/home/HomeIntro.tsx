"use client";

import { SmoothImage } from "@/components/ui/SmoothImage";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { UiIcon } from "@/components/ui/UiIcon";
import { homeIntro as intro } from "@/content/home-intro";

/*
 * Home "About Giving Compound" (styles: styles/sections/home-intro.css).
 * Once in view the photo unveils from the bottom up while it settles from a slight zoom.
 *
 * Phones add a quiet editorial sequence (all CSS-gated to max-width: 767px):
 *   - the photo drifts slower than the page (scroll-driven, where supported);
 *   - the title rises line by line from behind a mask;
 *   - the facts slide in and each check draws itself, one after another.
 * Reduced motion: everything is shown in its final state.
 */

const IMAGE_SIZES = "(min-width: 1024px) 55vw, 100vw";

/** "One Community. 367+ Private Resorts." → ["One Community.", "367+ Private Resorts."] */
const lines = (title: string) => title.split(/(?<=\.)\s+/);

export function HomeIntro({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const copy = isAr ? intro.ar : intro.en;
  const root = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [copyIn, setCopyIn] = useState(false);

  useEffect(() => {
    const watch = (el: Element | null, threshold: number, done: () => void) => {
      if (!el) return () => {};
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          done();
          io.disconnect();
        },
        { threshold },
      );
      io.observe(el);
      return () => io.disconnect();
    };
    const a = watch(root.current, 0.35, () => setInView(true));
    // The copy has its own trigger: on phones it sits well below the photo.
    const b = watch(copyRef.current, 0.15, () => setCopyIn(true));
    return () => {
      a();
      b();
    };
  }, []);

  return (
    <section ref={root} className={`hi section bg-surface${inView ? " is-in" : ""}${copyIn ? " is-copy-in" : ""}`}>
      <div className="container-gc hi-grid">
        <figure className="hi-frame">
          <SmoothImage
            src={intro.image}
            alt={copy.alt}
            fill
            sizes={IMAGE_SIZES}
            quality={92}
            className="hi-photo"
            // Its own reveal hides it until in view: no preview over it.
            preview={false}
            style={{ objectPosition: intro.focus }}
          />
        </figure>

        <div ref={copyRef} className="hi-copy">
          <p className="section-eyebrow section-eyebrow--icon"><UiIcon name="home" />{copy.eyebrow}</p>
          <h2 className="section-title">
            {lines(copy.title).map((line, i) => (
              <span key={line} className="hi-line" style={{ "--i": i } as CSSProperties}>
                <span className="hi-line-in">{line}</span>{" "}
              </span>
            ))}
          </h2>
          <p className="hi-body">{copy.p1}</p>
          <ul className="hi-facts">
            {copy.facts.map((f, i) => (
              <li key={f} style={{ "--i": i } as CSSProperties}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path pathLength={1} d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link href={intro.href} className="btn btn-primary hi-cta">
            <UiIcon name="plan" />
            {copy.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
