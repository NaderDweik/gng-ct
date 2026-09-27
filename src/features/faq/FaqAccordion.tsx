"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import type { FaqItem } from "@/content/faq";
import { formatNumber } from "@/lib/format";

/*
 * Home FAQ list (styles: styles/sections/home-faq.css, .hfaq-*).
 *   - One answer open at a time; the first starts open.
 *   - Answers slide open/closed with a grid-rows transition (every browser).
 *   - The list reserves the height of its tallest state, so opening or
 *     closing never pushes the sections below it around.
 */

type Props = { items: FaqItem[]; locale: string };

export function FaqAccordion({ items, locale }: Props) {
  const isAr = locale === "ar";
  const uid = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const [reserve, setReserve] = useState<number | undefined>(undefined);

  const n = (v: number) => formatNumber(v, locale).padStart(2, isAr ? "٠" : "0");

  // Reserve: all question rows + the tallest answer. Re-measured on resize.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const rows = [...list.querySelectorAll<HTMLElement>(".hfaq-item")];
      const closed = rows.reduce((sum, row) => {
        const q = row.querySelector<HTMLElement>(".hfaq-q");
        const cs = getComputedStyle(row);
        return sum + (q?.offsetHeight ?? 0) + parseFloat(cs.borderBottomWidth || "0");
      }, 0);
      const tallest = Math.max(
        0,
        ...rows.map((row) => row.querySelector<HTMLElement>(".hfaq-a")?.offsetHeight ?? 0),
      );
      setReserve(Math.ceil(closed + tallest) + 2); // + the list's top border
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [items, locale]);

  return (
    <div ref={listRef} className="hfaq-list" style={reserve ? { minHeight: reserve } : undefined}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const qId = `${uid}-q${i}`;
        const aId = `${uid}-a${i}`;
        return (
          <div key={it.qEn} className={`hfaq-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              id={qId}
              className="hfaq-q"
              aria-expanded={isOpen}
              aria-controls={aId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="hfaq-num" aria-hidden>
                {n(i + 1)}
              </span>
              <span className="hfaq-q-text">{isAr ? it.qAr : it.qEn}</span>
              <span className="hfaq-sign" aria-hidden />
            </button>
            <div id={aId} role="region" aria-labelledby={qId} className="hfaq-panel" inert={!isOpen}>
              <div className="hfaq-panel-inner">
                <p className="hfaq-a">{isAr ? it.aAr : it.aEn}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
