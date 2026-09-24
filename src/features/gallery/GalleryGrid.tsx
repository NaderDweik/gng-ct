"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import {
  galleryCategories,
  galleryCopy,
  galleryImages,
  type GalleryCategoryId,
  type GalleryImage,
} from "@/content/gallery";

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
export function GalleryGrid() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const copy = isAr ? galleryCopy.ar : galleryCopy.en;
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<GalleryCategoryId>("all");
  const [active, setActive] = useState<GalleryImage | null>(null);
  const touchX = useRef<number | null>(null);
  const touchDelta = useRef(0);

  useEffect(() => {
    const q = searchParams.get("tab");
    if (!q) return;
    const valid = q === "all" || galleryCategories.some((c) => c.id === q);
    if (valid) setTab(q as GalleryCategoryId);
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      tab === "all"
        ? galleryImages
        : galleryImages.filter((g) => g.categoryId === tab),
    [tab],
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
        <div className="gal-tabs" role="tablist" aria-label={copy.title}>
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={`gal-tab${on ? " is-active" : ""}`}
              >
                {t.title}
              </button>
            );
          })}
        </div>

        <div key={tab} className="gal-grid">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="gal-tile"
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              aria-label={nameLabel(item)}
            >
              <Image
                src={item.src}
                alt=""
                fill
                quality={88}
                priority={i < 6 && tab === "all"}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="gal-tile-img"
              />
              <span className="gal-tile-label">{nameLabel(item)}</span>
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
              />
            </div>

            <div className="gal-lb-bar">
              <span>
                {nameLabel(active)} · {catLabel(active)}
              </span>
              <span className="gal-lb-n">
                {activeIndex + 1} {copy.of} {filtered.length}
              </span>
            </div>

            {filtered.length > 1 && (
              <div className="gal-lb-controls">
                <button type="button" onClick={() => go("prev")}>
                  {copy.prev}
                </button>
                <button type="button" onClick={() => go("next")}>
                  {copy.next}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
