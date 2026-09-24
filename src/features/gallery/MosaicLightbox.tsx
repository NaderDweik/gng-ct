"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { galleryCategories, galleryCopy, type HomeGalleryPick } from "@/content/gallery";
import { formatNumber } from "@/lib/format";

type Props = {
  picks: HomeGalleryPick[];
  /** Natural width / height per pick (from the loaded tiles) so the frame hugs the photo. */
  ratios: (number | undefined)[];
  index: number;
  locale: string;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Shared with the tiles so the View Transition morphs tile ⇄ this frame. */
export const MOSAIC_MORPH_NAME = "gm-photo";

export function MosaicLightbox({ picks, ratios, index, locale, onIndex, onClose }: Props) {
  const isAr = locale === "ar";
  const copy = galleryCopy[isAr ? "ar" : "en"];
  const pick = picks[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const step = (dir: 1 | -1) => onIndex((index + dir + picks.length) % picks.length);

  // Scroll lock + initial focus: once per open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Arrow keys follow reading direction.
      if (e.key === "ArrowRight") onIndex((index + (isAr ? -1 : 1) + picks.length) % picks.length);
      if (e.key === "ArrowLeft") onIndex((index + (isAr ? 1 : -1) + picks.length) % picks.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, isAr, onClose, onIndex, picks.length]);

  if (!pick) return null;
  const caption = isAr ? pick.captionAr : pick.captionEn;
  const category = galleryCategories.find((c) => c.id === pick.categoryId);
  const categoryTitle = category ? (isAr ? category.titleAr : category.titleEn) : "";
  const n = (v: number) => formatNumber(v, locale).padStart(isAr ? 0 : 2, "0");

  return (
    <div className="gal-lb gm-lb" role="dialog" aria-modal aria-label={caption} onClick={onClose}>
      <button ref={closeRef} type="button" className="gal-lb-x" onClick={onClose} aria-label={copy.close}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className="gal-lb-body"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 50) return;
          const forward = dx < 0;
          step(isAr ? (forward ? -1 : 1) : forward ? 1 : -1);
        }}
      >
        <div
          className="gm-lb-frame"
          style={{ viewTransitionName: MOSAIC_MORPH_NAME, "--ar": ratios[index] ?? 1.6 } as CSSProperties}
        >
          <Image
            key={pick.src}
            src={pick.src}
            alt={caption}
            fill
            priority
            quality={92}
            sizes="(max-width: 1100px) 100vw, 1040px"
            className="gm-lb-img object-cover"
          />
        </div>

        <div className="gal-lb-bar">
          <span className="gm-lb-caption">
            <span className="gm-lb-idx">{n(index + 1)}</span>
            {caption}
          </span>
          <span className="gal-lb-n">
            {n(index + 1)} / {n(picks.length)}
          </span>
        </div>

        <div className="gm-lb-foot">
          <Link href={`/gallery?tab=${pick.categoryId}`} className="gm-lb-link">
            {copy.seeAll} {categoryTitle}
            <span className="arrow" aria-hidden>
              →
            </span>
          </Link>
          <div className="gal-lb-controls">
            <button type="button" onClick={() => step(-1)}>
              {copy.prev}
            </button>
            <button type="button" onClick={() => step(1)}>
              {copy.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
