"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
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
 * The arrows (or arrow keys, or hovering / clicking a space on the plan) step through every
 * space in plan order: inside the house, terraces & gardens, then outdoors.
 *
 * Smoothness (nothing ever blinks out before its replacement is in):
 *   - hovering a space shows its colour at once but only makes it current after a short
 *     intent delay, so sweeping across the plan doesn't strobe;
 *   - photos: the new one fades in ON TOP of the previous one, which stays solid beneath
 *     (no dip to the background mid-change);
 *   - the caption, counter digits and step bar hand over: the old one leaves while the new
 *     one arrives;
 *   - the clip card stays put; each clip fades in over the last only once it has a frame;
 *   - one outline glides from space to space on the plan.
 */

/** ms the pointer must rest on a space before it becomes current. */
const HOVER_INTENT = 110;

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

  const total = steps.length;
  /** Current space, the one before it (for hand-over animations), and travel direction. */
  const [nav, setNav] = useState<{ index: number; prev: number | null; dir: number }>({
    index: 0,
    prev: null,
    dir: 1,
  });
  const { index, prev, dir } = nav;
  const indexRef = useRef(0);
  indexRef.current = index;
  /** The last two clips shown (the card keeps the old one under the new until it's ready). */
  const firstClip = steps[0] && planItemClips.has(steps[0].item.id) ? steps[0].item.id : null;
  const [clips, setClips] = useState<{ cur: string | null; prev: string | null }>({ cur: firstClip, prev: null });
  const [readyClips, setReadyClips] = useState<ReadonlySet<string>>(() => new Set());
  const setIndex = (n: number, d = Math.sign(n - indexRef.current)) => {
    const from = indexRef.current;
    if (n === from) return;
    indexRef.current = n;
    setNav({ index: n, prev: from, dir: d || 1 });
    const id = steps[n]!.item.id;
    if (planItemClips.has(id)) setClips((c) => (c.cur === id ? c : { cur: id, prev: c.cur }));
  };
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverTo = (i: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setIndex(i), HOVER_INTENT);
  };
  const hoverOut = () => window.clearTimeout(hoverTimer.current);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  const [still, setStill] = useState(false);
  useEffect(() => setStill(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  const step = steps[index]!;
  const prevStep = prev === null ? null : steps[prev]!;
  const hasClip = planItemClips.has(step.item.id);
  const go = (d: number) => setIndex((indexRef.current + d + total) % total, d);
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
            className={`rmv-img${i === index ? " is-on" : i === prev ? " is-prev" : ""}`}
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
        {clips.cur && (
          <figure className={`rmv-clip${hasClip ? " is-on" : ""}`} aria-hidden>
            {/* Fixed (sorted) order: a video that is moved in the DOM gets paused. */}
            {[clips.prev, clips.cur]
              .filter((id): id is string => Boolean(id))
              .sort()
              .map((id) => (
                <video
                  key={id}
                  src={`/plan-clips/${id}.mp4`}
                  poster={`/plan-clips/${id}.jpg`}
                  className={`${id === clips.cur ? "is-cur" : "is-prev"}${readyClips.has(id) ? " is-ready" : ""}`}
                  muted
                  loop
                  playsInline
                  autoPlay={!still}
                  preload="auto"
                  onLoadedData={() => setReadyClips((r) => (r.has(id) ? r : new Set(r).add(id)))}
                />
              ))}
          </figure>
        )}
        {prevStep && (
          <div key={`out-${prevStep.item.id}-${index}`} className="rmv-photo-copy is-out" aria-hidden>
            <p className="rmv-zone">{prevStep.zone}</p>
            <p className="rmv-name">{title(prevStep.item)}</p>
            <p className="rmv-body">{isAr ? prevStep.item.bodyAr : prevStep.item.bodyEn}</p>
          </div>
        )}
        <div key={step.item.id} className={`rmv-photo-copy${prevStep ? " is-in" : ""}`} aria-live="polite">
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
                  className={`rmv-area${k > 0 ? " rmv-area--extra" : ""}${i === index ? " is-on" : ""}`}
                  style={{
                    left: pct(a.x, W),
                    top: pct(a.y, H),
                    width: pct(a.w, W),
                    height: pct(a.h, H),
                  }}
                  aria-label={title(s.item)}
                  aria-pressed={i === index}
                  tabIndex={k === 0 ? 0 : -1}
                  onClick={() => {
                    hoverOut();
                    setIndex(i);
                  }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && hoverTo(i)}
                  onPointerLeave={hoverOut}
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
            {/* One frame that glides from space to space (the outline of the current one). */}
            <span
              className="rmv-frame"
              style={{ left: pct(first.x, W), top: pct(first.y, H), width: pct(first.w, W), height: pct(first.h, H) }}
              aria-hidden
            />
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

        {/* Step bar: one segment per space; the lit segment slides along (and any segment
            jumps straight to its space). */}
        <div className="rmv-steps" style={{ "--n": total, "--i": index } as CSSProperties}>
          {steps.map((s, i) => (
            <button
              key={s.item.id}
              type="button"
              className={`rmv-step${i < index ? " is-past" : ""}`}
              aria-label={title(s.item)}
              aria-current={i === index ? "step" : undefined}
              onClick={() => {
                hoverOut();
                setIndex(i);
              }}
              tabIndex={-1}
            />
          ))}
          <span className="rmv-steps-thumb" aria-hidden />
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
              <span className={`rmv-count-now${dir < 0 ? " is-back" : ""}`}>
                {prev !== null && (
                  <span key={`out-${prev}-${index}`} className="rmv-count-digits is-out">
                    {num(prev + 1)}
                  </span>
                )}
                <span key={index} className={`rmv-count-digits${prev !== null ? " is-in" : ""}`}>
                  {num(index + 1)}
                </span>
              </span>
              <span className="rmv-count-total">/{num(total)}</span>
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
