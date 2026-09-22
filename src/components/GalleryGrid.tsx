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

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Jordan Gate gallery UX:
 * centered uppercase tabs + underline, 3-col grid, hover overlay,
 * lightbox with swipe + arrow keys.
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
    const valid =
      q === "all" || galleryCategories.some((c) => c.id === q);
    if (valid) setTab(q as GalleryCategoryId);
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      tab === "all"
        ? galleryImages
        : galleryImages.filter((g) => g.categoryId === tab),
    [tab],
  );

  const activeIndex = active
    ? filtered.findIndex((g) => g.id === active.id)
    : -1;

  const activeCategory = tab === "all" ? null : galleryCategories.find((c) => c.id === tab);
  const sectionTitle = activeCategory
    ? isAr
      ? activeCategory.titleAr
      : activeCategory.titleEn
    : copy.allTitle;

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
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") go(isAr ? "prev" : "next");
      if (e.key === "ArrowLeft") go(isAr ? "next" : "prev");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, activeIndex, filtered, isAr]);

  const tabs: { id: GalleryCategoryId; title: string }[] = [
    { id: "all", title: copy.allTitle },
    ...galleryCategories.map((c) => ({
      id: c.id as GalleryCategoryId,
      title: isAr ? c.titleAr : c.titleEn,
    })),
  ];

  return (
    <div className="relative overflow-hidden bg-neutral-50 pb-20 pt-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="container-gc relative z-10">
        {/* Tabs — JG style */}
        <div className="mb-10 flex flex-wrap justify-center gap-3 border-b border-neutral-200 pb-2 md:gap-6">
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative cursor-pointer px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 md:px-6 ${
                  on
                    ? "text-secondary"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {t.title}
                {on && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-secondary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Optional category description */}
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-neutral-500">
          {activeCategory
            ? isAr
              ? activeCategory.descriptionAr
              : activeCategory.descriptionEn
            : copy.allDescription}
        </p>

        {/* Grid */}
        <div
          key={tab}
          className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
        >
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-none border border-neutral-200/60 bg-white/70 text-start shadow-sm backdrop-blur-md transition-all duration-300 hover:border-secondary/50 hover:shadow-xl active:scale-[0.98]"
            >
              <Image
                src={item.src}
                alt={isAr ? item.nameAr : item.nameEn}
                fill
                quality={90}
                priority={i < 3 && tab === "all"}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/80 p-6 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <ZoomIcon className="mb-4 h-8 w-8 scale-90 text-white/90 transition-transform duration-300 group-hover:scale-100" />
                <span className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
                  {isAr ? item.categoryTitleAr : item.categoryTitleEn}
                </span>
                <h2 className="text-center text-lg font-bold leading-tight text-white">
                  {isAr ? item.nameAr : item.nameEn}
                </h2>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute top-6 end-6 cursor-pointer rounded-full bg-white/10 p-3 text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-90"
            aria-label="Close lightbox"
          >
            <CloseIcon />
          </button>

          <div
            className="relative flex w-full max-w-5xl max-h-[82vh] flex-col items-center gap-4"
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
                go(touchDelta.current < 0 ? "next" : "prev");
              }
              touchX.current = null;
              touchDelta.current = 0;
            }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-none border border-white/10 shadow-2xl md:aspect-[16/9]">
              <Image
                src={active.src}
                alt={isAr ? active.nameAr : active.nameEn}
                fill
                priority
                quality={100}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="bg-black object-contain"
              />
            </div>
            <div className="mt-2 text-center text-white">
              <span className="mb-1 block text-[10px] font-bold tracking-[0.3em] text-neutral-300 uppercase">
                {isAr ? active.categoryTitleAr : active.categoryTitleEn}
              </span>
              <h2 className="text-xl font-bold">
                {isAr ? active.nameAr : active.nameEn}
              </h2>
              <p className="mt-1 text-xs text-white/50">
                {activeIndex + 1} / {filtered.length} · {sectionTitle}
              </p>
            </div>

            {filtered.length > 1 && (
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold tracking-widest text-white/80 uppercase hover:bg-white/10"
                  onClick={() => go("prev")}
                >
                  {isAr ? "السابق" : "Prev"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold tracking-widest text-white/80 uppercase hover:bg-white/10"
                  onClick={() => go("next")}
                >
                  {isAr ? "التالي" : "Next"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
