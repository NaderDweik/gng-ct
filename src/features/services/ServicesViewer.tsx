"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/features/services/ServiceIcon";
import type { ServiceIconName } from "@/content/services";

/*
 * The card at the top of /services (styles: styles/sections/services-directory.css).
 * Big photo on the start side, the "Available now" list on the end side. Controlled by
 * ServicesDirectory: the list steps through the services on its own and scrolls down
 * with the active one; hovering or tapping a service shows its photo. The dark band
 * below overlaps the card's bottom edge.
 */

export type ViewerShot = {
  id: string;
  src: string;
  en: string;
  ar: string;
  icon: ServiceIconName;
};

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

type Props = {
  shots: ViewerShot[];
  index: number;
  onPick: (i: number) => void;
  onHold: (held: boolean) => void;
  isAr: boolean;
  title: string;
  sub: string;
};

export function ServicesViewer({
  shots,
  index,
  onPick,
  onHold,
  isAr,
  title,
  sub,
}: Props) {
  const shot = shots[index]!;
  const total = shots.length;
  const pad = (n: number) => String(n).padStart(2, "0");
  const list = useRef<HTMLOListElement>(null);
  // Custom scroll indicator (always faintly visible; native bars auto-hide on macOS).
  const [thumb, setThumb] = useState({ top: 0, size: 1 });
  const measure = () => {
    const ol = list.current;
    if (!ol) return;
    const size = Math.min(1, ol.clientHeight / ol.scrollHeight);
    const max = ol.scrollHeight - ol.clientHeight;
    setThumb({ size, top: max > 0 ? (ol.scrollTop / max) * (1 - size) : 0 });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  // Caption card in the photo's bottom corner. Showing: a white block sweeps in from the
  // corner, then the title fades up inside it. Hiding (on every slide change, and when
  // the photo scrolls out of view): the title fades out, then the block sweeps back.
  // A change runs hide then show. If changes arrive mid-sequence, only the latest wins.
  const stage = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<number | null>(null); // whose title the card holds
  const [block, setBlock] = useState(false);
  const [text, setText] = useState(false);
  const [inView, setInView] = useState(false);
  const target = inView ? index : null;
  const latest = useRef<number | null>(null);
  latest.current = target;
  const running = useRef(false);
  const current = useRef<number | null>(null); // what the card is showing right now

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (running.current || target === current.current) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BLOCK_MS = reduce ? 0 : 450;
    const TEXT_MS = reduce ? 0 : 280;
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
    running.current = true;

    (async () => {
      while (latest.current !== current.current) {
        if (current.current !== null) {
          setText(false);
          await wait(TEXT_MS);
          setBlock(false);
          await wait(BLOCK_MS);
          current.current = null;
        }
        const next = latest.current;
        if (next === null) break;
        setShown(next);
        setBlock(true);
        await wait(BLOCK_MS);
        setText(true);
        await wait(TEXT_MS);
        current.current = next;
      }
      running.current = false;
    })();
  }, [target]);

  const capShot = shown === null ? null : shots[shown];

  // In RTL the visual "previous" arrow sits on the right, so the icons swap.
  const prevIcon = isAr ? "next" : "prev";
  const nextIcon = isAr ? "prev" : "next";

  // Keep the active service centred in its own list (never scrolls the page).
  useEffect(() => {
    const ol = list.current;
    const li = ol?.children[index] as HTMLElement | undefined;
    if (!ol || !li) return;
    ol.scrollTo({
      top: li.offsetTop - ol.clientHeight / 2 + li.offsetHeight / 2,
      behavior: "smooth",
    });
  }, [index]);

  return (
    <section
      className="svv"
      aria-label={isAr ? "الخدمات المتاحة" : "Available services"}
    >
      <div className="container-gc">
        <div
          className="svv-card"
          onMouseEnter={() => onHold(true)}
          onMouseLeave={() => onHold(false)}
        >
          <div ref={stage} className="svv-stage" aria-roledescription="carousel">
            {shots.map((s, i) => (
              <div
                key={s.id}
                className={`svv-slide${i === index ? " is-on" : ""}`}
                aria-hidden={i !== index}
              >
                <Image
                  src={s.src}
                  alt={isAr ? s.ar : s.en}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}

            <p className="svv-caption" aria-live="polite">
              <span className={`svv-cap${block ? " has-block" : ""}${text ? " has-text" : ""}`}>
                <span className="svv-cap-text">
                  <span className="svv-count">
                    {pad((shown ?? index) + 1)} / {pad(total)}
                  </span>
                  {capShot ? (isAr ? capShot.ar : capShot.en) : isAr ? shot.ar : shot.en}
                </span>
                <span className="svv-cap-block" aria-hidden />
              </span>
            </p>

            <div className="svv-arrows">
              <button
                type="button"
                className="svv-arrow"
                onClick={() => onPick((index - 1 + total) % total)}
                aria-label={isAr ? "السابق" : "Previous"}
              >
                <Arrow dir={prevIcon} />
              </button>
              <button
                type="button"
                className="svv-arrow"
                onClick={() => onPick((index + 1) % total)}
                aria-label={isAr ? "التالي" : "Next"}
              >
                <Arrow dir={nextIcon} />
              </button>
            </div>
          </div>

          <div className="svv-panel">
            <header className="svv-panel-head">
              <h2 className="svv-panel-title">{title}</h2>
              <p className="svv-panel-sub">{sub}</p>
            </header>
            <div className="svv-list-wrap">
              <ol ref={list} className="svv-list" onScroll={measure}>
                {shots.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`svv-item${i === index ? " is-on" : ""}`}
                      onMouseEnter={() => onPick(i)}
                      onFocus={() => onPick(i)}
                      onClick={() => onPick(i)}
                      aria-pressed={i === index}
                    >
                      <span className="svv-item-icon">
                        <ServiceIcon name={s.icon} />
                      </span>
                      <span className="svv-item-title">
                        {isAr ? s.ar : s.en}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              {thumb.size < 1 && (
                <span className="svv-scroll" aria-hidden>
                  <span
                    className="svv-scroll-thumb"
                    style={{
                      top: `${thumb.top * 100}%`,
                      height: `${thumb.size * 100}%`,
                    }}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
