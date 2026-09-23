"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link } from "@/i18n/navigation";
import { galleryCategories, galleryCopy, type HomeGalleryPick } from "@/content/gallery";
import { formatNumber } from "@/lib/format";
import { MOSAIC_MORPH_NAME, MosaicLightbox } from "@/features/gallery/MosaicLightbox";

/*
 * "Golden hour" mosaic (styles: styles/sections/gallery-mosaic.css):
 *   1. Shutters — tiles open like louvers when the grid scrolls into view,
 *      radiating out from the feature tile, while each photo settles.
 *   2. Sunlight — a warm light follows the pointer (spring-smoothed); the
 *      hovered photo pans like a view through a window, the rest dim.
 *   3. Depth — photos drift inside their frames on scroll (CSS scroll timeline).
 *   4. Step out — a click morphs the photo into an in-page viewer (View
 *      Transitions) and back. Tiles stay real links for no-JS / new-tab use.
 * Pointer effects only on fine pointers; everything is static under
 * prefers-reduced-motion.
 */

/** Reveal delay per slot a…g — outward from the feature tile. */
const REVEAL_DELAYS = [0, 130, 320, 190, 260, 220, 390];
const SHUTTER_MS = 1100;
const SPRING = 0.14;

type Phase = "static" | "armed" | "in";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function withMorph(update: () => void) {
  const doc = document as ViewTransitionDocument;
  if (!doc.startViewTransition || prefersReducedMotion()) {
    update();
    return null;
  }
  return doc.startViewTransition(update);
}

type Props = { picks: HomeGalleryPick[]; locale: string };

export function MosaicGrid({ picks, locale }: Props) {
  const isAr = locale === "ar";
  const copy = galleryCopy[isAr ? "ar" : "en"];
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [ratios, setRatios] = useState<(number | undefined)[]>([]);
  const [phase, setPhase] = useState<Phase>("static");
  const [open, setOpen] = useState<number | null>(null);

  const n = (v: number) => formatNumber(v, locale).padStart(2, isAr ? "٠" : "0");
  const categoryTitle = (id: HomeGalleryPick["categoryId"]) => {
    const c = galleryCategories.find((x) => x.id === id);
    return c ? (isAr ? c.titleAr : c.titleEn) : "";
  };

  // 1. Shutter reveal — armed only if the grid starts below the fold, so
  // nothing that is already visible ever gets hidden.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    if (grid.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setPhase("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setPhase("in");
      },
      { threshold: 0.2 },
    );
    io.observe(grid);
    return () => io.disconnect();
  }, []);

  // Drop the masks once every shutter is open (avoids slat seams on resize).
  useEffect(() => {
    if (phase !== "in") return;
    const t = window.setTimeout(() => setPhase("static"), Math.max(...REVEAL_DELAYS) + SHUTTER_MS + 120);
    return () => window.clearTimeout(t);
  }, [phase]);

  // 2. Sunlight + cursor + window pan. Writes CSS vars only — no re-renders.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let entered = false;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const paint = () => {
      x += (tx - x) * SPRING;
      y += (ty - y) * SPRING;
      grid.style.setProperty("--gx", `${x.toFixed(1)}px`);
      grid.style.setProperty("--gy", `${y.toFixed(1)}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(paint) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = grid.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!entered) {
        entered = true;
        x = tx;
        y = ty;
      }
      if (!raf) raf = requestAnimationFrame(paint);

      const tile = (e.target as Element).closest<HTMLElement>(".gm-tile");
      if (tile) {
        const t = tile.getBoundingClientRect();
        tile.style.setProperty("--px", (((e.clientX - t.left) / t.width) * 2 - 1).toFixed(3));
        tile.style.setProperty("--py", (((e.clientY - t.top) / t.height) * 2 - 1).toFixed(3));
      }
    };

    const onOut = (e: PointerEvent) => {
      const tile = (e.target as Element).closest<HTMLElement>(".gm-tile");
      if (tile && !tile.contains(e.relatedTarget as Node | null)) {
        tile.style.setProperty("--px", "0");
        tile.style.setProperty("--py", "0");
      }
    };

    const onLeave = () => {
      entered = false;
    };

    grid.dataset.live = "";
    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerout", onOut);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      delete grid.dataset.live;
      cancelAnimationFrame(raf);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerout", onOut);
      grid.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // 4. Step out / step back in.
  const openAt = (i: number, e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const tile = tileRefs.current[i];
    // Photo aspect ratios from the already-loaded tiles, so the viewer frame hugs each photo.
    const measured = tileRefs.current.map((t) => {
      const img = t?.querySelector("img");
      return img?.naturalHeight ? img.naturalWidth / img.naturalHeight : undefined;
    });
    if (tile) tile.style.viewTransitionName = MOSAIC_MORPH_NAME;
    const t = withMorph(() => {
      if (tile) tile.style.viewTransitionName = "";
      flushSync(() => {
        setRatios(measured);
        setOpen(i);
      });
    });
    if (!t && tile) tile.style.viewTransitionName = "";
  };

  const close = useCallback(() => {
    if (open === null) return;
    const tile = tileRefs.current[open];
    const t = withMorph(() => {
      flushSync(() => setOpen(null));
      if (tile) tile.style.viewTransitionName = MOSAIC_MORPH_NAME;
    });
    const settle = () => {
      if (!tile) return;
      tile.style.viewTransitionName = "";
      tile.focus({ preventScroll: true });
    };
    if (t) t.finished.finally(settle);
    else settle();
  }, [open]);

  return (
    <>
      <div ref={gridRef} className={`gm gm--${phase}`}>
        {picks.map((pick, i) => {
          const label = isAr ? pick.captionAr : pick.captionEn;
          return (
            <Link
              key={pick.src}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              href={`/gallery?tab=${pick.categoryId}`}
              onClick={(e) => openAt(i, e)}
              aria-haspopup="dialog"
              className={`gm-tile gm-${String.fromCharCode(97 + i)}`}
              style={{ "--d": `${REVEAL_DELAYS[i] ?? 0}ms` } as CSSProperties}
            >
              <span className="gm-media">
                <Image
                  src={pick.src}
                  alt=""
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="gm-img"
                  priority={i === 0}
                />
              </span>
              <span className="gm-cap">
                <span className="gm-meta" aria-hidden>
                  <span className="gm-idx">{n(i + 1)}</span>
                  <span>{categoryTitle(pick.categoryId)}</span>
                </span>
                <span className="gm-label">{label}</span>
              </span>
            </Link>
          );
        })}

        <span className="gm-sun" aria-hidden />
        <span className="gm-glow" aria-hidden />
        <span className="gm-cursor" aria-hidden>
          {copy.view}
        </span>
      </div>

      {open !== null && (
        <MosaicLightbox
          picks={picks}
          ratios={ratios}
          index={open}
          locale={locale}
          onIndex={setOpen}
          onClose={close}
        />
      )}
    </>
  );
}
