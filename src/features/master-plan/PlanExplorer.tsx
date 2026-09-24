"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  masterPlanCopy,
  masterPlanMapSize as MAP,
  masterPlanMapSrc,
  masterPlanZones,
  type PlanArea,
  type PlanItem,
} from "@/content/master-plan";
import { formatNumber } from "@/lib/format";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Interactive resort plan (styles: styles/sections/master-plan.css).
 * Every area is a rectangle measured from the plan's own walls/edges
 * (content/master-plan.ts). Hovering a space on the plan, or its list entry,
 * highlights it:
 *   - the dim layer gets exact rectangular cut-outs (clip-path, evenodd) that
 *     morph from one area to the next;
 *   - a thin gold line draws itself around the space, then a spark of light
 *     keeps running along its edge;
 *   - a tag names the space and glides with it.
 * Click / tap keeps the selection; hover previews on top of it.
 *
 * Showing it's interactive — no buttons, no fake cursor: when the plan comes
 * into view the light starts on the pool and wanders from space to space on
 * its own, with a quiet "hover the plan" hint. The moment a real mouse enters
 * (or a finger taps), it steps aside and follows the visitor instead; left
 * alone for a few seconds, it picks up again. Off-screen it rests.
 *
 * Entrance (only when it starts below the fold): the plan arrives as a
 * blueprint and a scan line sweeps it into the full render.
 * Reduced motion: no wandering, no sweep — hover and tap still highlight.
 */

type Props = { locale: string };

const items: PlanItem[] = masterPlanZones.flatMap((z) => z.items);
const numberOf = new Map(items.map((it, i) => [it.id, i + 1]));

/** First-visit tutorial: the light visits these, in order, once. */
const TUTORIAL = ["pool", "living", "lounge"];
const TUTORIAL_HOLD = 3; // seconds per space

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
  const [wander, setWander] = useState<string | null>(null);
  /** Set once the visitor has explored themselves — prompts are done then. */
  const [explored, setExplored] = useState(false);
  /** Tutorial finished → "your turn" prompt, until the visitor explores. */
  const [yourTurn, setYourTurn] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<string | null>(null);
  const pauseRef = useRef<() => void>(() => {});

  const activeId = hovered ?? selected ?? wander;
  const active = items.find((it) => it.id === activeId) ?? null;

  // Keep the last geometry while fading out, so the tag/cut-outs don't collapse.
  const last = useRef<PlanItem | null>(null);
  if (active) last.current = active;
  const shown = active ?? last.current;

  // A kept selection ends the tutorial.
  useEffect(() => {
    selectedRef.current = selected;
    if (selected) pauseRef.current();
  }, [selected]);

  const n = (v: number) => formatNumber(v, locale).padStart(isAr ? 0 : 2, "0");
  const title = (it: PlanItem) => (isAr ? it.titleAr : it.titleEn);
  const num = (it: PlanItem) => n(numberOf.get(it.id) ?? 0);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      const inner = q(".mp-map-inner")[0] as HTMLElement;

      // ── First-visit tutorial: pool → living room → outdoor lounge, once. ──
      let step = 0;
      let timer: gsap.core.Tween | null = null;
      let running = false;
      let done = false;
      let inView = false;
      let introDone = true;

      const finish = contextSafe((handedOver: boolean) => {
        timer?.kill();
        timer = null;
        if (running || step > 0) setWander(null);
        running = false;
        if (!done && !handedOver) setYourTurn(true);
        done = true;
      });
      const next = contextSafe(() => {
        if (step >= TUTORIAL.length) return finish(false);
        setWander(TUTORIAL[step]!);
        step += 1;
        timer = gsap.delayedCall(TUTORIAL_HOLD, next);
      });
      const start = contextSafe(() => {
        if (done || running || !inView || !introDone || selectedRef.current) return;
        running = true;
        // Resuming after a scroll-away continues where it left off.
        if (step > 0) step -= 1;
        next();
      });
      const pause = contextSafe(() => {
        timer?.kill();
        timer = null;
        running = false;
      });
      pauseRef.current = () => finish(true);

      // The visitor takes over the moment a real mouse enters the plan or a
      // finger lands on it — the tutorial ends and the prompt goes away.
      const takeOver = contextSafe(() => {
        finish(true);
        setExplored(true);
      });
      const onEnter = (e: globalThis.PointerEvent) => {
        if (e.pointerType === "mouse") takeOver();
      };
      const onDown = (e: globalThis.PointerEvent) => {
        if (e.pointerType !== "mouse") takeOver();
      };
      inner.addEventListener("pointerenter", onEnter);
      inner.addEventListener("pointerdown", onDown);

      ScrollTrigger.create({
        trigger: inner,
        start: "top 70%",
        end: "bottom 25%",
        onToggle: (self) => {
          inView = self.isActive;
          if (inView) start();
          else pause();
        },
      });

      // ── Entrance: blueprint → render (only if it starts off-screen). ──
      if (inner.getBoundingClientRect().top > window.innerHeight * 0.9) {
        introDone = false;
        const bp = q(".mp-blueprint")[0]!;
        const scan = q(".mp-scan")[0]!;
        gsap.set(bp, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(scan, { autoAlpha: 0, left: isAr ? "100%" : "0%" });
        gsap.set(q(".mp-dims-line"), { scaleX: 0 });
        gsap.set(q(".mp-dims-label"), { autoAlpha: 0, y: 8 });

        gsap
          .timeline({
            scrollTrigger: { trigger: inner, start: "top 78%", once: true },
            onComplete: () => {
              introDone = true;
              start();
            },
          })
          .from(q(".mp-blueprint-grid"), { autoAlpha: 0, duration: 0.6, ease: "power1.out" })
          .from(q(".mp-blueprint-img"), { autoAlpha: 0, scale: 1.04, duration: 0.9, ease: "power2.out" }, 0)
          .to(q(".mp-dims-line"), { scaleX: 1, duration: 1, ease: "expo.inOut" }, 0.2)
          .to(q(".mp-dims-label"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.85)
          .to(scan, { autoAlpha: 1, duration: 0.2 }, 0.75)
          .to(scan, { left: isAr ? "0%" : "100%", duration: 1.7, ease: "power2.inOut" }, 0.75)
          .to(bp, { clipPath: isAr ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)", duration: 1.7, ease: "power2.inOut" }, 0.75)
          .to(scan, { autoAlpha: 0, duration: 0.3 }, 2.3)
          .set(bp, { autoAlpha: 0 });
      }

      // ── Mouse: a soft light follows the cursor. ──
      const spot = q(".mp-spot")[0]!;
      const sx = gsap.quickTo(spot, "x", { duration: 0.6, ease: "power3" });
      const sy = gsap.quickTo(spot, "y", { duration: 0.6, ease: "power3" });
      const move = (e: globalThis.PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = inner.getBoundingClientRect();
        sx(e.clientX - r.left);
        sy(e.clientY - r.top);
      };
      const spotIn = (e: globalThis.PointerEvent) => e.pointerType === "mouse" && gsap.to(spot, { autoAlpha: 1, duration: 0.4 });
      const spotOut = () => gsap.to(spot, { autoAlpha: 0, duration: 0.5 });
      inner.addEventListener("pointermove", move);
      inner.addEventListener("pointerenter", spotIn);
      inner.addEventListener("pointerleave", spotOut);

      return () => {
        timer?.kill();
        inner.removeEventListener("pointerenter", onEnter);
        inner.removeEventListener("pointerdown", onDown);
        inner.removeEventListener("pointermove", move);
        inner.removeEventListener("pointerenter", spotIn);
        inner.removeEventListener("pointerleave", spotOut);
      };
    },
    { scope: rootRef, dependencies: [isAr] },
  );

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

  const frameA = shown?.areas[0];
  const tag = (() => {
    if (!frameA) return { below: false, end: false };
    const b = box(frameA);
    return { below: b.y < 9, end: b.x + b.w / 2 > 62 };
  })();

  return (
    <div
      ref={rootRef}
      className={`mp-explorer${active ? " is-focused" : ""}${wander && !hovered && !selected ? " is-auto" : ""}${yourTurn && !explored ? " is-your-turn" : ""}`}
    >
      <figure className="mp-map" aria-label={copy.mapAlt}>
        <div className="mp-dims" aria-hidden>
          <span className="mp-dims-line" />
          <span className="mp-dims-label">{copy.dims}</span>
        </div>
        <div className="mp-map-inner" style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}>
          <Image src={masterPlanMapSrc} alt={copy.mapAlt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="mp-map-img" />

          {/* Entrance only: the same plan as a blueprint, swept away by the scan line. */}
          <div className="mp-blueprint" aria-hidden>
            <Image src={masterPlanMapSrc} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" className="mp-blueprint-img" />
            <span className="mp-blueprint-grid" />
          </div>
          <span className="mp-scan" aria-hidden />
          <span className="mp-spot" aria-hidden />

          {/* The spaces themselves are the targets (the list is the keyboard path). */}
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

          {/* Light line: draws around the space, then a spark keeps running its edge. */}
          <svg
            className={`mp-trace${active ? " is-on" : ""}`}
            viewBox={`0 0 ${MAP.width} ${MAP.height}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <filter id="mp-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {shown && (
              <g key={shown.id}>
                {shown.areas.map((a, k) => (
                  <g key={k}>
                    <rect className="mp-trace-line" x={a.x} y={a.y} width={a.w} height={a.h} rx="6" pathLength={1} />
                    <rect className="mp-trace-spark" x={a.x} y={a.y} width={a.w} height={a.h} rx="6" pathLength={1} filter="url(#mp-glow)" />
                    <rect className="mp-trace-head" x={a.x} y={a.y} width={a.w} height={a.h} rx="6" pathLength={1} />
                  </g>
                ))}
              </g>
            )}
          </svg>

          {frameA && (
            <div className={`mp-frame${active ? " is-on" : ""}`} style={rectStyle(frameA)} aria-hidden>
              {shown && (
                <span key={shown.id} className={`mp-tag${tag.below ? " is-below" : ""}${tag.end ? " is-end" : ""}`}>
                  {title(shown)}
                </span>
              )}
            </div>
          )}

          {/* After the tutorial: a mouse that "hovers" — your turn. */}
          <div className="mp-turn" aria-live="polite">
            <span className="mp-turn-art" aria-hidden>
              <svg className="mp-turn-mouse" viewBox="0 0 24 36">
                <rect x="1.5" y="1.5" width="21" height="33" rx="10.5" />
                <line x1="12" y1="1.5" x2="12" y2="12" />
                <line className="mp-turn-wheel" x1="12" y1="6" x2="12" y2="9.5" />
              </svg>
              <svg className="mp-turn-cursor" viewBox="0 0 24 24">
                <path d="M3 2.5 20 11l-7.2 1.9L9 20z" />
              </svg>
              <svg className="mp-turn-tap" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="6" />
                <circle className="mp-turn-tap-ring" cx="18" cy="18" r="14" />
              </svg>
            </span>
            {yourTurn && !explored && (
              <span className="mp-turn-copy">
                <b className="mp-turn-hover">{copy.turnHover}</b>
                <b className="mp-turn-touch">{copy.turnTap}</b>
                <span>{copy.turnSub}</span>
              </span>
            )}
          </div>
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
