"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sceneRoyal as scene, type ScenePieceId } from "@/content/scene";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Home "piece by piece" (styles: styles/sections/scene-explode.css).
 * One pinned, scroll-scrubbed shot in four beats:
 *   1. Photo    — the hero's pavilion scene, full-screen.
 *   2. Explode  — its objects (content/scene.ts) lift off; the photo dims and
 *                 the camera pulls back.
 *   3. Model    — the resort plan slides in as a tilted tabletop and every
 *                 object flies to its real spot and stands on it, pop-up-book style.
 *   4. Top shot — the camera swings overhead; the objects fold down into their
 *                 spaces, which outline themselves and call out with drawn
 *                 leader lines. Hover / tap a space (or its label): the rest of
 *                 the plan dims and its objects pop back up out of it. Left
 *                 alone, the spaces take turns on their own.
 * How: the plan is a CSS 3D plane; the cut-outs live in a flat layer on top and
 * `render()` projects each one through the same transform every frame, so they
 * stay glued to the plane while the camera moves. SSR / reduced motion = the
 * final top shot, no pinning.
 */

const W = scene.width;
const H = scene.height;
const PW = scene.plan.width;
const PH = scene.plan.height;

/** Same as the hero, so the plate is served from its cache. */
const PLATE_SIZES = "(max-aspect-ratio: 16/9) 178vh, 100vw";

/** A piece's share of the cover-fitted photo — the largest it's ever shown. */
const pieceSizes = (id: ScenePieceId) => {
  const f = scene.pieces[id].w / W;
  return `(max-aspect-ratio: 16/9) ${Math.ceil(f * 178)}vh, ${Math.ceil(f * 100)}vw`;
};

const pieceIds = Object.keys(scene.pieces) as ScenePieceId[];
const zoneOf = new Map<ScenePieceId, number>(scene.zones.flatMap((z, i) => z.pieces.map((p) => [p, i] as const)));

type Pt = readonly [number, number];

/** Leader line: space → elbow just outside the plan → label. */
const leader = ([dx, dy]: Pt, [lx, ly]: Pt, mobile: boolean) => {
  if (mobile) {
    const ey = ly < 0 ? -26 : PH + 26;
    return `M${dx} ${dy}L${lx} ${ey}L${lx} ${ly}`;
  }
  const ex = lx < 0 ? -34 : PW + 34;
  return `M${dx} ${dy}L${ex} ${ly}L${lx} ${ly}`;
};

const side = ([x, y]: Pt) => (x < 0 ? "left" : x > PW ? "right" : y < 0 ? "top" : "bottom");

/** Dim everything but the picked space: one evenodd path, outer frame + holes. */
const holes = (i: number | null) => {
  const r = i === null ? [] : scene.zones[i]!.rects;
  return `M0 0H${PW}V${PH}H0Z` + r.map((a) => `M${a.x} ${a.y}h${a.w}v${a.h}h${-a.w}Z`).join("");
};

type Props = { locale: string };

export function SceneExplode({ locale }: Props) {
  const isAr = locale === "ar";
  const copy = isAr ? scene.copy.ar : scene.copy.en;
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  /** True once the shot has played through to the top view (callouts interactive). */
  const [ready, setReady] = useState(false);
  /** JS has taken over (pieces + photo layers shown); a class React owns, so re-renders keep it. */
  const [live, setLive] = useState(false);
  /** Bridge from React state into the GSAP render loop. */
  const popTo = useRef<(i: number | null) => void>(() => {});
  const touched = useRef(false);

  const pick = (i: number | null) => {
    touched.current = true;
    setActive(i);
  };

  useEffect(() => popTo.current(ready ? active : null), [active, ready]);

  // Left alone, the spaces take turns so the plan shows it's alive (and phones get a tour).
  useEffect(() => {
    if (!ready || touched.current) return;
    let i = 0;
    setActive(0);
    const id = setInterval(() => {
      if (touched.current) return clearInterval(id);
      i = (i + 1) % scene.zones.length;
      setActive(i);
    }, 2800);
    return () => clearInterval(id);
  }, [ready]);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      if (!el) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReady(true);
        return;
      }
      const q = gsap.utils.selector(el);
      const pieces = q(".sx-piece") as HTMLElement[];
      const plan = q(".sx-plan")[0] as HTMLElement;

      // Scrubbed state, read by render().
      const st = { tilt: 64, sc: 1, ty: 0, fold: 0 };
      const ex = pieces.map(() => ({ t: 0 }));
      const land = pieces.map(() => ({ t: 0 }));
      const pop = pieces.map(() => ({ t: 0 }));
      const ratio = pieceIds.map((id) => scene.pieces[id].w / scene.pieces[id].h);

      type Box = { x: number; y: number; w: number };
      let A: Box[] = [];
      let E: Box[] = [];
      let P = { cx: 0, cy: 0, w: 1 };
      let persp = 1200;
      let tl: gsap.core.Timeline | null = null;

      const render = () => {
        plan.style.transform = `translateY(${st.ty}px) scale(${st.sc}) perspective(${persp}px) rotateX(${st.tilt}deg)`;
        const k = P.w / PW;
        const rad = (st.tilt * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        pieces.forEach((p, i) => {
          const s = scene.stands[pieceIds[i]!];
          const r = ratio[i]!;
          // Project the stand's foot through the plan's own transform (rotateX → perspective → scale → translate).
          const u = (s.u - PW / 2) * k;
          const v = (s.v - PH / 2) * k;
          const f = persp / (persp - v * sin);
          const ax = P.cx + st.sc * u * f;
          const ay = P.cy + st.sc * v * cos * f + st.ty;
          const ws = s.w * k * f * st.sc;

          const a = A[i]!;
          const e = E[i]!;
          const te = ex[i]!.t;
          const tn = land[i]!.t;
          const bx = a.x + (e.x - a.x) * te;
          const by = a.y + (e.y - a.y) * te;
          const bw = a.w + (e.w - a.w) * te;
          const w = bw + (ws - bw) * tn;
          const x = bx + (ax - ws / 2 - bx) * tn;
          const bottom = by + bw / r + (ay - (by + bw / r)) * tn;
          // Fold flat into the space; a pick pops it back up (a touch smaller).
          const pp = pop[i]!.t;
          const fold = st.fold * tn * (1 - pp);
          const ww = w * (1 - 0.18 * pp);
          const h = (ww / r) * (1 - 0.9 * fold);
          p.style.transform = `translate3d(${x + (w - ww) / 2}px, ${bottom - h}px, 0) scale(${ww / 100}, ${h / (100 / r)})`;
          p.style.opacity = String(Math.max(0, 1 - fold * 1.15));
          p.style.zIndex = tn > 0.5 ? String(10 + Math.round(s.v)) : "1";
        });
      };

      // contextSafe: rebuilds after mount still get reverted on unmount.
      const build = contextSafe!(() => {
        const was = tl?.scrollTrigger?.progress ?? 0;
        tl?.scrollTrigger?.kill();
        tl?.kill();
        plan.style.transform = "none";

        // Measure against the section box, so the scroll position doesn't matter.
        const box = el.getBoundingClientRect();
        const pr = plan.getBoundingClientRect();
        P = { cx: pr.left - box.left + pr.width / 2, cy: pr.top - box.top + pr.height / 2, w: pr.width };
        persp = Math.max(900, pr.height * 2.2);
        const phone = box.width < 600;

        // 1 → 2: photo (cover-fitted) → exploded (camera pulled back to the scene's width;
        // on a portrait phone "cover" shows a third of it). Pieces drift apart — vertically on phones.
        const s = Math.max(box.width / W, box.height / H);
        const sE = Math.min(s, (box.width / W) * (phone ? 1 : 0.92));
        const at = (kk: number, x: number, y: number) => ({
          x: (box.width - W * kk) / 2 + x * kk,
          y: (box.height - H * kk) / 2 + y * kk,
        });
        const spreadX = phone ? 0.1 : 0.2;
        const spreadY = phone ? 1.5 : 0.35;
        const lift = phone ? 1.12 : 1.05;
        A = [];
        E = [];
        pieceIds.forEach((id) => {
          const g = scene.pieces[id];
          const a = at(s, g.x, g.y);
          const e = at(sE, g.x, g.y);
          const cx = e.x + (g.w * sE) / 2 - box.width / 2;
          const cy = e.y + (g.h * sE) / 2 - box.height / 2;
          A.push({ x: a.x, y: a.y, w: g.w * s });
          E.push({
            x: e.x + cx * spreadX - (g.w * sE * (lift - 1)) / 2,
            y: e.y + cy * spreadY - (g.h * sE * (lift - 1)) / 2,
            w: g.w * sE * lift,
          });
        });

        // Model view: the plan as a tabletop, low in the frame so the pieces have sky above them.
        Object.assign(st, { tilt: 64, sc: phone ? 1.12 : 1.04, ty: box.height * (phone ? 0.1 : 0.05), fold: 0 });
        [...ex, ...land].forEach((o) => (o.t = 0));

        tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: render,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=340%",
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            onUpdate: (self) => setReady(self.progress > 0.97),
          },
        });

        // 2. Explode.
        tl.to(ex, { t: 1, duration: 0.24, ease: "power1.inOut", stagger: 0.012 }, 0.04)
          .fromTo(q(".sx-plate-img"), { filter: "brightness(1) blur(0px)", scale: 1 }, { filter: "brightness(0.35) blur(8px)", scale: sE / s, duration: 0.24, ease: "power1.inOut" }, 0.04)
          .fromTo(q(".sx-hint"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06 }, 0.02)
          // 3. The plan arrives as a blueprint and warms into its render; the pieces land on it.
          .fromTo(plan, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.24)
          .fromTo(q(".sx-plan-img"), { filter: "grayscale(1) brightness(0.55) contrast(1.2)" }, { filter: "grayscale(0) brightness(1) contrast(1)", duration: 0.22 }, 0.3)
          .fromTo(q(".sx-plate"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.14 }, 0.3)
          .to(st, { tilt: 56, duration: 0.3, ease: "power1.out" }, 0.24)
          .to(land, { t: 1, duration: 0.22, ease: "power3.inOut", stagger: 0.02 }, 0.3)
          // Hold the model a beat, drifting.
          .to(st, { tilt: 50, duration: 0.08 }, 0.54)
          // 4. Camera overhead; the pieces fold into their spaces, which light up and call out.
          .to(st, { tilt: 0, sc: 1, ty: 0, duration: 0.2, ease: "power2.inOut" }, 0.62)
          .to(st, { fold: 1, duration: 0.1, ease: "power2.in" }, 0.72)
          // Each space flashes as its pieces sink into it.
          .fromTo(q(".sx-zone-fill"), { opacity: 0 }, { opacity: 0.55, duration: 0.03, stagger: 0.015 }, 0.73)
          .to(q(".sx-zone-fill"), { opacity: 0, duration: 0.1, stagger: 0.015 }, 0.77)
          .fromTo(q(".sx-zone"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.08, stagger: 0.015 }, 0.78)
          .fromTo(q(".sx-head > *"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.03 }, 0.8)
          .fromTo(q(".sx-dot"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.04, stagger: 0.02, ease: "back.out(3)" }, 0.83)
          .fromTo(q(".sx-leader"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.08, stagger: 0.02 }, 0.85)
          .fromTo(q(".sx-callout-in"), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.05, stagger: 0.02 }, 0.9)
          .fromTo(q(".sx-panel"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.92)
          .to({}, { duration: 0.03 }, 0.97);

        if (was) tl.progress(was);
        render();
        ScrollTrigger.refresh();
      });

      // A pick pops its pieces back up out of the plan (outside the scrubbed timeline).
      popTo.current = contextSafe!((z: number | null) => {
        pop.forEach((o, i) => {
          const on = z !== null && zoneOf.get(pieceIds[i]!) === z;
          gsap.to(o, {
            t: on ? 1 : 0,
            duration: on ? 0.75 : 0.35,
            ease: on ? "back.out(1.7)" : "power2.in",
            onUpdate: render,
            overwrite: true,
          });
        });
      });

      build();
      setLive(true);
      document.fonts?.ready.then(build);

      // Width changes re-layout the plan; height only matters past the mobile URL-bar wobble.
      let w = innerWidth;
      let h = innerHeight;
      let t: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(t);
        t = setTimeout(() => {
          if (innerWidth === w && Math.abs(innerHeight - h) < 140) return;
          w = innerWidth;
          h = innerHeight;
          build();
        }, 180);
      };
      addEventListener("resize", onResize);
      return () => {
        clearTimeout(t);
        removeEventListener("resize", onResize);
        popTo.current = () => {};
      };
    },
    { scope: root },
  );

  const act = active !== null ? scene.zones[active] : null;
  const hover = (i: number) => (e: PointerEvent) => e.pointerType === "mouse" && ready && pick(i);

  return (
    <section
      ref={root}
      className={`sx${live ? " is-live" : ""}${ready ? " is-ready" : ""}${act ? " has-active" : ""}`}
      aria-label={copy.title}
    >
      <div className="sx-plate" aria-hidden>
        <Image src={scene.plate} alt="" fill sizes={PLATE_SIZES} quality={88} className="sx-plate-img" />
      </div>
      <p className="sx-hint" aria-hidden>
        <span>{copy.hint}</span>
      </p>

      <div className="sx-inner container-gc">
        <header className="sec-head sx-head on-dark">
          <div>
            <p className="section-eyebrow">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
          </div>
          <p className="section-sub sx-tap">{copy.tapHint}</p>
        </header>

        <div className="sx-planwrap">
          <div className="sx-plan">
            <Image src={scene.plan.src} alt={copy.planAlt} fill sizes="(min-width: 900px) 720px, 100vw" className="sx-plan-img" />

            <svg className="sx-svg" viewBox={`-180 -130 ${PW + 360} ${PH + 260}`} aria-hidden>
              <path className="sx-dim" d={holes(active)} fillRule="evenodd" />
              {scene.zones.map((z, i) => (
                <g key={z.id} className={`sx-z${active === i ? " is-on" : ""}`}>
                  {z.rects.map((r, k) => (
                    <g key={k}>
                      <rect className="sx-zone-fill" x={r.x} y={r.y} width={r.w} height={r.h} />
                      <rect className="sx-zone" x={r.x} y={r.y} width={r.w} height={r.h} pathLength={1} />
                      <rect
                        className="sx-hit"
                        x={r.x}
                        y={r.y}
                        width={r.w}
                        height={r.h}
                        onPointerEnter={hover(i)}
                        onClick={() => ready && pick(i)}
                      />
                    </g>
                  ))}
                  <path className="sx-leader sx-leader--desk" d={leader(z.dot, z.desk, false)} pathLength={1} />
                  <path className="sx-leader sx-leader--mob" d={leader(z.dot, z.mob, true)} pathLength={1} />
                  <circle className="sx-dot" cx={z.dot[0]} cy={z.dot[1]} r={9} />
                </g>
              ))}
            </svg>

            {scene.zones.map((z, i) => (
              <button
                key={z.id}
                type="button"
                className={`sx-callout${active === i ? " is-on" : ""}`}
                data-dside={side(z.desk)}
                data-mside={side(z.mob)}
                style={
                  {
                    "--dx": `${(z.desk[0] / PW) * 100}%`,
                    "--dy": `${(z.desk[1] / PH) * 100}%`,
                    "--mx": `${(z.mob[0] / PW) * 100}%`,
                    "--my": `${(z.mob[1] / PH) * 100}%`,
                  } as CSSProperties
                }
                aria-pressed={active === i}
                onPointerEnter={hover(i)}
                onFocus={() => ready && pick(i)}
                onClick={() => pick(i)}
              >
                <span className="sx-callout-in">
                  <span className="sx-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sx-ctext">
                    <span className="sx-ctitle">{isAr ? z.titleAr : z.titleEn}</span>
                    <span className="sx-cdesc">{isAr ? z.descAr : z.descEn}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Phones: the picked space's line, under the plan. */}
        <p className="sx-panel" aria-live="polite">
          {act ? (
            <>
              <span className="sx-panel-title">{isAr ? act.titleAr : act.titleEn}</span>
              <span className="sx-panel-desc">{isAr ? act.descAr : act.descEn}</span>
            </>
          ) : (
            <span className="sx-panel-desc">{copy.tapHint}</span>
          )}
        </p>
      </div>

      <div className="sx-pieces" aria-hidden>
        {pieceIds.map((id) => {
          const g = scene.pieces[id];
          return (
            <span key={id} className="sx-piece" style={{ "--ar": g.w / g.h } as CSSProperties}>
              <Image src={`${scene.pieceDir}/${id}.webp`} alt="" fill sizes={pieceSizes(id)} className="sx-img" />
            </span>
          );
        })}
      </div>
    </section>
  );
}
