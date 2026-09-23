"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  masterPlanCopy,
  masterPlanMapSize as MAP,
  masterPlanMapSrc,
  masterPlanZones,
  type PlanArea,
  type PlanItem,
} from "@/content/master-plan";
import { formatNumber } from "@/lib/format";

/*
 * Interactive resort plan (styles: styles/sections/master-plan.css).
 * Every area is a rectangle measured from the plan's own walls/edges
 * (content/master-plan.ts). Hovering the space itself, its pin, or its list
 * entry highlights it:
 *   - the dim layer gets exact rectangular cut-outs (clip-path, evenodd) that
 *     morph from one area to the next;
 *   - gold frames with architectural corner ticks sit on the area's edges and
 *     glide / resize between areas (a two-part item splits into two frames);
 *   - a tag on the frame names the space.
 * Click / tap pins the selection; hover previews on top of it.
 */

type Props = { locale: string };

const items: PlanItem[] = masterPlanZones.flatMap((z) => z.items);
const numberOf = new Map(items.map((it, i) => [it.id, i + 1]));

/** Map pixels → % of the map box. */
const box = (a: PlanArea) => ({
  x: (a.x / MAP.width) * 100,
  y: (a.y / MAP.height) * 100,
  w: (a.w / MAP.width) * 100,
  h: (a.h / MAP.height) * 100,
});

const rectStyle = (a: PlanArea): CSSProperties => {
  const b = box(a);
  return { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` };
};

/**
 * Outer ring + two rectangular holes as one evenodd path. The bridges between
 * rings are walked out and back along the same line (zero area — no wedges),
 * and the vertex count never changes, so clip-path morphs between areas.
 */
const holes = (areas: readonly PlanArea[]) => {
  const [a, second] = areas.map(box);
  // Single-area items: the second hole collapses to a zero-size point at A's
  // corner. (Reusing A would cut the same hole twice, and evenodd would fill it
  // back in.) It also lets a two-part item visibly grow out of the first.
  const b = second ?? { x: a!.x, y: a!.y, w: 0, h: 0 };
  const p = (x: number, y: number) => `${x}% ${y}%`;
  const ring = (r: { x: number; y: number; w: number; h: number }) =>
    [p(r.x, r.y), p(r.x + r.w, r.y), p(r.x + r.w, r.y + r.h), p(r.x, r.y + r.h), p(r.x, r.y)].join(", ");
  return `polygon(evenodd, ${[
    p(0, 0), p(100, 0), p(100, 100), p(0, 100), p(0, 0),
    ring(a!),
    ring(b),
    p(a!.x, a!.y), // back along the bridge B → A
    p(0, 0), // …and A → outer corner
  ].join(", ")})`;
};

export function PlanExplorer({ locale }: Props) {
  const isAr = locale === "ar";
  const copy = masterPlanCopy[isAr ? "ar" : "en"];
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const activeId = hovered ?? selected;
  const active = items.find((it) => it.id === activeId) ?? null;

  // Keep the last geometry while fading out, so frames/cut-outs don't collapse.
  const last = useRef<PlanItem | null>(null);
  if (active) last.current = active;
  const shown = active ?? last.current;

  const n = (v: number) => formatNumber(v, locale).padStart(2, isAr ? "٠" : "0");
  const title = (it: PlanItem) => (isAr ? it.titleAr : it.titleEn);
  const num = (it: PlanItem) => n(numberOf.get(it.id) ?? 0);

  const toggle = (id: string) => setSelected((cur) => (cur === id ? null : id));
  const hover = (id: string) => ({
    onPointerEnter: (e: PointerEvent) => e.pointerType === "mouse" && setHovered(id),
    onPointerLeave: (e: PointerEvent) => e.pointerType === "mouse" && setHovered(null),
  });
  const control = (id: string) => ({
    ...hover(id),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered(null),
    onClick: () => toggle(id),
  });

  // Frames: the second one rests on the first when an item has a single area,
  // so switching to a two-part item visibly splits it.
  const frameA = shown?.areas[0];
  const frameB = shown?.areas[1] ?? frameA;
  const tag = (() => {
    if (!frameA) return { below: false, end: false };
    const b = box(frameA);
    return { below: b.y < 9, end: b.x + b.w / 2 > 62 };
  })();

  return (
    <div className={`mp-explorer${active ? " is-focused" : ""}`}>
      <figure className="mp-map" aria-label={copy.mapAlt}>
        <div className="mp-map-inner" style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}>
          <Image src={masterPlanMapSrc} alt={copy.mapAlt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="mp-map-img" />

          {/* Hover targets: the spaces themselves (pins remain the accessible controls). */}
          {items.map((it) =>
            it.areas.map((a, k) => (
              <div
                key={`hit-${it.id}-${k}`}
                className="mp-hit"
                style={rectStyle(a)}
                aria-hidden
                {...hover(it.id)}
                onClick={() => toggle(it.id)}
              />
            )),
          )}

          <div
            className={`mp-dim${active ? " is-on" : ""}`}
            style={shown ? { clipPath: holes(shown.areas) } : undefined}
            aria-hidden
          />

          {frameA && frameB && (
            <>
              <div className={`mp-frame${active ? " is-on" : ""}`} style={rectStyle(frameA)} aria-hidden>
                {shown && (
                  <span
                    key={shown.id}
                    className={`mp-tag${tag.below ? " is-below" : ""}${tag.end ? " is-end" : ""}`}
                  >
                    <b>{num(shown)}</b>
                    {title(shown)}
                  </span>
                )}
              </div>
              <div
                className={`mp-frame${active && shown?.areas[1] ? " is-on" : ""}`}
                style={rectStyle(frameB)}
                aria-hidden
              />
            </>
          )}

          {items.map((it) =>
            it.areas.map((a, k) => {
              const b = box(a);
              return (
                <button
                  key={`${it.id}-${k}`}
                  type="button"
                  className={`mp-pin${it.id === activeId ? " is-active" : ""}`}
                  style={{ left: `${b.x + b.w / 2}%`, top: `${b.y + b.h / 2}%` }}
                  aria-label={title(it)}
                  aria-pressed={it.id === selected}
                  tabIndex={k === 0 ? 0 : -1}
                  {...control(it.id)}
                >
                  {num(it)}
                </button>
              );
            }),
          )}
        </div>
        <figcaption className="mp-caption">{copy.caption}</figcaption>
      </figure>

      <div className="mp-panel">
        <div className="mp-detail" aria-live="polite">
          {active ? (
            <div key={active.id} className="mp-detail-inner">
              <span className="mp-detail-num">{num(active)}</span>
              <h3 className="mp-detail-title">{title(active)}</h3>
              <p className="mp-detail-body">{isAr ? active.bodyAr : active.bodyEn}</p>
            </div>
          ) : (
            <p className="mp-detail-hint">{copy.explorerHint}</p>
          )}
        </div>

        {masterPlanZones.map((z) => (
          <div key={z.id} className="mp-zone">
            <h3 className="mp-zone-title">{isAr ? z.titleAr : z.titleEn}</h3>
            <ul className="mp-list">
              {z.items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    className={`mp-item${it.id === activeId ? " is-active" : ""}`}
                    aria-pressed={it.id === selected}
                    {...control(it.id)}
                  >
                    <span className="mp-item-num">{num(it)}</span>
                    <span className="mp-item-title">{title(it)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {selected && (
          <button type="button" className="mp-reset" onClick={() => setSelected(null)}>
            {copy.reset}
          </button>
        )}
      </div>
    </div>
  );
}
