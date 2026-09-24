"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { homePreviewPicks as picks } from "@/content/gallery";
import { formatNumber } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/*
 * Home gallery teaser — a scattered checkerboard of thumbnails beside one large
 * preview (styles: styles/sections/gallery-preview.css).
 *   Hover / focus / tap a thumbnail → its photo wipes into the preview over
 *   the previous one (reading direction), caption slides in with it.
 *   Entrance: thumbnails settle in when the section scrolls into view.
 * No autoplay — it only moves when you do. Static under reduced motion.
 */

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  sub?: string;
  ctaLabel: string;
  ctaHref: string;
};

/** Small hover-intent delay so sweeping across the grid doesn't strobe. */
const INTENT_MS = 45;

export function GalleryPreview({ locale, eyebrow, title, sub, ctaLabel, ctaHref }: Props) {
  const isAr = locale === "ar";
  const rootRef = useRef<HTMLElement>(null);
  const intent = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [armed, setArmed] = useState<"static" | "armed" | "in">("static");

  const n = (v: number) => formatNumber(v, locale).padStart(isAr ? 0 : 2, "0");

  // Entrance — armed only when starting below the fold (never hide what's visible).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    setArmed("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setArmed("in");
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(intent.current), []);

  const show = (i: number, delay = 0) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => {
      if (activeRef.current === i) return;
      setPrev(activeRef.current);
      activeRef.current = i;
      setActive(i);
    }, delay);
  };

  const current = picks[active];

  return (
    <section ref={rootRef} className={`section hp hp--${armed}`}>
      <div className="container-gc">
        <div className="sec-head">
          <div>
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="section-title mb-0">{title}</h2>
          </div>
          <div>
            {sub && <p className="sub mb-8">{sub}</p>}
            <Link href={ctaHref} className="gallery-outline-btn">
              {ctaLabel}
              <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>

        <div className="hp-body">
          <div className="hp-grid" role="group" aria-label={title}>
            {picks.map((p, i) => (
              <button
                key={p.src}
                type="button"
                className={`hp-thumb${i === active ? " is-active" : ""}`}
                style={{ "--i": i } as CSSProperties}
                aria-pressed={i === active}
                aria-label={isAr ? p.captionAr : p.captionEn}
                onPointerEnter={(e) => e.pointerType === "mouse" && show(i, INTENT_MS)}
                onFocus={() => show(i)}
                onClick={() => show(i)}
              >
                <Image src={p.src} alt="" fill sizes="(max-width: 1024px) 25vw, 12vw" className="hp-thumb-img" />
              </button>
            ))}
          </div>

          <figure className="hp-preview">
            <div className="hp-frame">
              {picks.map((p, i) => (
                <Image
                  key={p.src}
                  src={p.src}
                  alt={i === active ? (isAr ? p.captionAr : p.captionEn) : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className={`hp-layer${i === active ? " is-active" : ""}${i === prev ? " is-prev" : ""}`}
                  priority={false}
                />
              ))}
            </div>
            {current && (
              <figcaption className="hp-cap" aria-live="polite">
                <span key={active} className="hp-cap-inner">
                  <span className="hp-cap-idx">{n(active + 1)}</span>
                  <span className="hp-cap-rule" aria-hidden />
                  {isAr ? current.captionAr : current.captionEn}
                </span>
                <span className="hp-cap-total">
                  {n(active + 1)} / {n(picks.length)}
                </span>
              </figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}
