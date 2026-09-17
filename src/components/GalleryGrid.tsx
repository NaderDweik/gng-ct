"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  galleryCategories,
  galleryImages,
  type GalleryCategory,
} from "@/content/gallery";

export function GalleryGrid() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [cat, setCat] = useState<GalleryCategory>("all");
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      cat === "all" ? galleryImages : galleryImages.filter((g) => g.category === cat),
    [cat],
  );

  const activeImg = filtered.find((g) => g.id === active) ?? null;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {galleryCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`rounded-sm px-3 py-1.5 text-sm transition ${
              cat === c.id
                ? "bg-navy text-cream"
                : "bg-sand text-navy hover:bg-sand-deep"
            }`}
          >
            {isAr ? c.labelAr : c.labelEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img) => (
          <button
            key={img.id}
            type="button"
            className="group relative aspect-[4/3] overflow-hidden bg-sand"
            onClick={() => setActive(img.id)}
          >
            <Image
              src={img.src}
              alt={isAr ? img.altAr : img.altEn}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {activeImg && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/90 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute top-4 end-4 text-3xl text-cream"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImg.src}
              alt={isAr ? activeImg.altAr : activeImg.altEn}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
