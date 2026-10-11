"use client";

import Image from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { site } from "@/content/site";
import {
  masterPlanMapSize,
  masterPlanMapSrc,
  planItem,
  planItemClips,
  planItemPhotos,
  unitPlanColumns,
  unitPlanLineSrc,
  unitPlanPanel,
  type PlanItem,
} from "@/content/master-plan";

/*
 * /master-plan room viewer (styles: styles/sections/room-viewer.css). Split screen: the
 * current space's photo on the start side with its name over it; on the end side a dark
 * panel with the line plan, the space outlined on it, the unit facts and previous / next.
 * The arrows (or arrow keys, or a click on the plan) step through every space in plan
 * order: inside the house, terraces & gardens, then outdoors.
 */

type Step = { item: PlanItem; zone: string; photo: string };

/** Spaces whose photo carries the chalet size: the opening view and the two widest shots. */
const SIZE_ON = new Set(["living", "pool", "gardens"]);

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d={dir === "prev" ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"}
      />
    </svg>
  );
}

export function RoomViewer({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const panel = unitPlanPanel[isAr ? "ar" : "en"];
  const { width: W, height: H } = masterPlanMapSize;

  const steps: Step[] = unitPlanColumns.flat().flatMap((group) =>
    group.ids.flatMap((id) => {
      const item = planItem(id);
      const photo = planItemPhotos[id];
      return item && photo ? [{ item, zone: panel[group.label], photo }] : [];
    }),
  );

  const [index, setIndex] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => setStill(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  const total = steps.length;
  const step = steps[index]!;
  const go = (d: number) => setIndex((i) => (i + d + total) % total);
  const num = (v: number) =>
    v.toLocaleString(isAr ? "ar-JO" : "en-US", { minimumIntegerDigits: 2 });
  const title = (it: PlanItem) => (isAr ? it.titleAr : it.titleEn);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(e.key === (isAr ? "ArrowLeft" : "ArrowRight") ? 1 : -1);
  }

  const first = step.item.areas[0];

  return (
    <div
      className="rmv"
      role="region"
      aria-roledescription={isAr ? "عارض الغرف" : "room viewer"}
      aria-label={isAr ? "مساحات الشاليه" : "Spaces of the chalet"}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Photo side */}
      <div className="rmv-photo">
        {steps.map((s, i) => (
          <Image
            key={s.item.id}
            src={s.photo}
            alt={i === index ? title(s.item) : ""}
            aria-hidden={i !== index}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={`rmv-img${i === index ? " is-on" : ""}`}
          />
        ))}
        {/* The chalet's size, in the top corner on a few select photos (fades between). */}
        <p
          className={`rmv-size${SIZE_ON.has(step.item.id) ? " is-on" : ""}`}
          aria-hidden={!SIZE_ON.has(step.item.id)}
        >
          <span className="rmv-size-label">{isAr ? "شاليه" : "Chalet"}</span>
          <span className="rmv-size-value">
            {site.stats.unitAreaSqm.toLocaleString(isAr ? "ar-JO" : "en-US")}
            <span className="rmv-size-unit">{isAr ? " م²" : " m²"}</span>
          </span>
        </p>
        {/* A few seconds of the walkthrough for this space, in a padded card (top end). */}
        {planItemClips.has(step.item.id) && (
          <figure key={`clip-${step.item.id}`} className="rmv-clip">
            <video
              src={`/plan-clips/${step.item.id}.mp4`}
              poster={`/plan-clips/${step.item.id}.jpg`}
              muted
              loop
              playsInline
              autoPlay={!still}
              preload="metadata"
              aria-hidden
            />
          </figure>
        )}
        <div key={step.item.id} className="rmv-photo-copy" aria-live="polite">
          <p className="rmv-zone">{step.zone}</p>
          <h3 className="rmv-name">{title(step.item)}</h3>
          <p className="rmv-body">
            {isAr ? step.item.bodyAr : step.item.bodyEn}
          </p>
        </div>
      </div>

      {/* Plan side */}
      <div className="rmv-panel">
        <div className="rmv-plan-wrap">
          <div className="rmv-plan" style={{ aspectRatio: `${W} / ${H}` }}>
            <Image
              src={unitPlanLineSrc}
              alt={isAr ? "مخطط الشاليه" : "Chalet plan"}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="rmv-plan-img"
            />
            {/* Every space is a target on the plan; the current one is outlined. */}
            {steps.map((s, i) =>
              s.item.areas.map((a, k) => (
                <button
                  key={`${s.item.id}-${k}`}
                  type="button"
                  className={`rmv-area${i === index ? " is-on" : ""}`}
                  style={{
                    left: pct(a.x, W),
                    top: pct(a.y, H),
                    width: pct(a.w, W),
                    height: pct(a.h, H),
                  }}
                  aria-label={title(s.item)}
                  aria-pressed={i === index}
                  tabIndex={k === 0 ? 0 : -1}
                  onClick={() => setIndex(i)}
                >
                  {/* The colour plan, cropped to exactly this space (the area rectangles
                      are measured on that image), shown while the space is current. */}
                  <span
                    className="rmv-area-img"
                    style={{
                      backgroundImage: `url(${masterPlanMapSrc})`,
                      backgroundSize: `${(W / a.w) * 100}% ${(H / a.h) * 100}%`,
                      backgroundPosition: `${a.w === W ? 0 : (a.x / (W - a.w)) * 100}% ${a.h === H ? 0 : (a.y / (H - a.h)) * 100}%`,
                    }}
                    aria-hidden
                  />
                </button>
              )),
            )}
            <span
              className="rmv-dot"
              style={{
                left: pct(first.x + first.w / 2, W),
                top: pct(first.y + first.h / 2, H),
              }}
              aria-hidden
            />
          </div>
        </div>

        <div className="rmv-foot">
          <div className="rmv-arrows">
            <button
              type="button"
              className="rmv-arrow"
              aria-label={isAr ? "المساحة السابقة" : "Previous space"}
              onClick={() => go(-1)}
            >
              <Chevron dir={isAr ? "next" : "prev"} />
            </button>
            <button
              type="button"
              className="rmv-arrow"
              aria-label={isAr ? "المساحة التالية" : "Next space"}
              onClick={() => go(1)}
            >
              <Chevron dir={isAr ? "prev" : "next"} />
            </button>
            {/* Where you are in the walk-through. */}
            <p className="rmv-count" aria-hidden>
              {num(index + 1)}
              <span>/{num(total)}</span>
            </p>
          </div>
          <Link href={unitPlanPanel.href} className="rmv-cta">
            {panel.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
