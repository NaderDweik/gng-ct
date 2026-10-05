"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import {
  galleryCategories,
  galleryCopy,
  galleryImages,
  type GalleryCategoryId,
  type GalleryImage,
} from "@/content/gallery";

/** Points to the inline end (→ in English); CSS mirrors it for "previous" and for RTL. */
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Clean photo studio — flush mosaic, quiet tabs, minimal lightbox.
 * Same visual language as the home `.gm` tiles.
 */
/*
 * "All" tab order: a fixed shuffle (same seed every render, so server and client agree),
 * then nudged so two photos from the same category rarely sit side by side.
 */
function seededShuffle(list: readonly GalleryImage[], seed: number): GalleryImage[] {
  const out = [...list];
  let x = seed;
  for (let i = out.length - 1; i > 0; i--) {
    x = (x * 1664525 + 1013904223) % 4294967296;
    const j = x % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  for (let i = 1; i < out.length; i++) {
    if (out[i]!.categoryId !== out[i - 1]!.categoryId) continue;
    const k = out.findIndex((g, n) => n > i && g.categoryId !== out[i - 1]!.categoryId);
    if (k > 0) [out[i], out[k]] = [out[k]!, out[i]!];
  }
  return out;
}

/** Kept out of the opening rows: shown after the rest of their tab. */
const LATER = ["family-walk-compound-t", "compound-a-gate-motorbikes", "compound-j-guard-booth"];
const isLater = (g: GalleryImage) => LATER.some((name) => g.src.includes(name));
const laterLast = (list: GalleryImage[]) => [...list.filter((g) => !isLater(g)), ...list.filter(isLater)];

const mixedImages = laterLast(seededShuffle(galleryImages, 23));
/** Each category tab gets its own fixed shuffle too, so no tab reads as a sequence. */
const categoryImages = (id: GalleryCategoryId) =>
  laterLast(
    seededShuffle(
      galleryImages.filter((g) => g.categoryId === id),
      11 + id.length,
    ),
  );

export function GalleryGrid() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const copy = isAr ? galleryCopy.ar : galleryCopy.en;
  const [tab, setTab] = useState<GalleryCategoryId>("all");
  /** The tab whose photos are on screen; trails `tab` while the old grid fades out. */
  const [shown, setShown] = useState<GalleryCategoryId>("all");
  const [leaving, setLeaving] = useState(false);
  const swapTimer = useRef<number | null>(null);

  // Switching tabs: the underline moves at once, the old photos fade out, then the
  // new ones rise in. Reduced motion swaps straight away.
  const pick = (next: GalleryCategoryId) => {
    if (next === tab) return;
    setTab(next);
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(next);
      return;
    }
    setLeaving(true);
    swapTimer.current = window.setTimeout(() => {
      setShown(next);
      setLeaving(false);
    }, 260);
  };
  useEffect(() => () => {
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
  }, []);
  const [active, setActive] = useState<GalleryImage | null>(null);
  // Each photo's own width/height, read on load, so the lightbox frame matches it (no letterbox bars).
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const touchX = useRef<number | null>(null);
  const touchDelta = useRef(0);

  // One underline that slides from the old tab to the new one (re-measured on resize,
  // since the tab row can wrap).
  const tabsRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ x: number; y: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const row = tabsRef.current;
    if (!row) return;
    const measure = () => {
      const el = row.querySelector<HTMLElement>(".gal-tab.is-active");
      if (el) setLine({ x: el.offsetLeft, y: el.offsetTop + el.offsetHeight, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [tab, isAr]);

  // ?tab=… (home mosaic links) is read on mount, not via useSearchParams: that would
  // make the page skip server-rendering the grid (layout shift, photos missing from HTML).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("tab");
    if (!q) return;
    const valid = q === "all" || galleryCategories.some((c) => c.id === q);
    if (valid) {
      setTab(q as GalleryCategoryId);
      setShown(q as GalleryCategoryId);
    }
  }, []);

  const filtered = useMemo(
    () =>
      shown === "all"
        ? mixedImages
        : categoryImages(shown),
    [shown],
  );

  const activeIndex = active ? filtered.findIndex((g) => g.id === active.id) : -1;

  function go(dir: "next" | "prev") {
    if (!active || filtered.length === 0 || activeIndex < 0) return;
    const next =
      dir === "next"
        ? (activeIndex + 1) % filtered.length
        : (activeIndex - 1 + filtered.length) % filtered.length;
    setActive(filtered[next]);
  }

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") go(isAr ? "prev" : "next");
      if (e.key === "ArrowLeft") go(isAr ? "next" : "prev");
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, activeIndex, filtered, isAr]);

  const tabs: { id: GalleryCategoryId; title: string }[] = [
    { id: "all", title: copy.allTitle },
    ...galleryCategories.map((c) => ({
      id: c.id as GalleryCategoryId,
      title: isAr ? c.titleAr : c.titleEn,
    })),
  ];

  const catLabel = (item: GalleryImage) =>
    isAr ? item.categoryTitleAr : item.categoryTitleEn;
  const nameLabel = (item: GalleryImage) => (isAr ? item.nameAr : item.nameEn);

  return (
    <div className="gal" dir={isAr ? "rtl" : "ltr"}>
      <div className="container-gc">
        <div ref={tabsRef} className="gal-tabs" role="tablist" aria-label={copy.title}>
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => pick(t.id)}
                className={`gal-tab${on ? " is-active" : ""}`}
              >
                {t.title}
              </button>
            );
          })}
          {line && (
            <span
              className="gal-tabs-line"
              style={{ transform: `translate(${line.x}px, ${line.y}px)`, width: line.w }}
              aria-hidden
            />
          )}
        </div>

        <div key={shown} className={`gal-grid${leaving ? " is-leaving" : ""}`}>
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="gal-tile"
              style={{ animationDelay: `${Math.min(i, 9) * 55}ms` }}
              aria-label={nameLabel(item)}
            >
              <Image
                src={item.src}
                alt=""
                fill
                quality={88}
                priority={i < 6 && shown === "all"}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="gal-tile-img"
              />
              <span className="gal-tile-hover" aria-hidden>
                <svg className="gal-tile-zoom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.9-3.9M11 8v6M8 11h6" />
                </svg>
                <span className="gal-tile-cat">{catLabel(item)}</span>
                <span className="gal-tile-name">{nameLabel(item)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="gal-lb"
          role="dialog"
          aria-modal
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="gal-lb-x"
            onClick={() => setActive(null)}
            aria-label={copy.close}
          >
            <CloseIcon />
          </button>

          <div
            className="gal-lb-body"
            style={{ "--lb-r": ratios[active.src] ?? 16 / 10 } as CSSProperties}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchX.current = e.touches[0]?.clientX ?? null;
              touchDelta.current = 0;
            }}
            onTouchMove={(e) => {
              if (touchX.current == null) return;
              touchDelta.current = (e.touches[0]?.clientX ?? 0) - touchX.current;
            }}
            onTouchEnd={() => {
              if (Math.abs(touchDelta.current) > 50) {
                const swipeNext = touchDelta.current < 0;
                go(isAr ? (swipeNext ? "prev" : "next") : swipeNext ? "next" : "prev");
              }
              touchX.current = null;
              touchDelta.current = 0;
            }}
          >
            <div className="gal-lb-shot">
              <Image
                src={active.src}
                alt={nameLabel(active)}
                fill
                priority
                quality={95}
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-contain"
                onLoad={(e) => {
                  const { naturalWidth: w, naturalHeight: h, currentSrc } = e.currentTarget;
                  if (w && h && currentSrc) setRatios((r) => ({ ...r, [active.src]: w / h }));
                }}
              />
              {filtered.length > 1 && (
                <>
                  <button type="button" className="gal-lb-arrow gal-lb-arrow--prev" onClick={() => go("prev")} aria-label={copy.prev}>
                    <ChevronIcon />
                  </button>
                  <button type="button" className="gal-lb-arrow gal-lb-arrow--next" onClick={() => go("next")} aria-label={copy.next}>
                    <ChevronIcon />
                  </button>
                </>
              )}
            </div>

            <div className="gal-lb-bar">
              <span>
                {nameLabel(active)} · {catLabel(active)}
              </span>
              <span className="gal-lb-n">
                {activeIndex + 1} {copy.of} {filtered.length}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
