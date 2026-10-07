"use client";

import { useEffect, useRef, useState } from "react";
import { availableServices, servicePhotos, servicesCopy, upcomingServices } from "@/content/services";
import { ServicesViewer, type ViewerShot } from "@/features/services/ServicesViewer";

/*
 * /services (styles: styles/sections/services-directory.css): one card with a big
 * photo and the "Available now" list beside it. The list steps through the services
 * slowly on its own (pausing while the pointer is on the card); hovering or tapping a
 * service shows its photo. Below, a dark band that tucks under the card holds what is
 * coming, greyed out under a fade.
 */

const STEP_MS = 3500;

/**
 * Bento sizes for the coming-soon grid (columns x rows on the six-column desktop grid);
 * anything not listed is a single cell. This arrangement packs into full rows with no
 * gaps on both the six- and two-column grids (checked in the browser); re-check after
 * changing it, since dense packing depends on the order of the list.
 */
type SoonSize = "xl" | "hero" | "lg" | "wide3" | "wide" | "tall3" | "tall";
const SOON_SIZE: Record<string, SoonSize> = {
  helipad: "xl", // 3 x 3
  schools: "hero", // 3 x 2
  clinic: "lg", // 2 x 2
  equestrian: "lg",
  spa: "lg",
  well: "wide3", // 3 x 1
  trips: "wide3",
  "beauty-men": "wide3",
  "water-filter": "wide", // 2 x 1
  "outdoor-cinema": "wide",
  "bird-park": "wide",
  "beauty-women": "wide",
  emergency: "tall3", // 1 x 3
  pharmacy: "tall3",
  bazaar: "tall", // 1 x 2
  "events-hall": "tall",
  restaurant: "tall",
};

export function ServicesDirectory({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const copy = servicesCopy[isAr ? "ar" : "en"];

  const shots: ViewerShot[] = availableServices.map((s) => ({
    id: s.id,
    src: servicePhotos[s.id] ?? "",
    en: s.titleEn,
    ar: s.titleAr,
    icon: s.icon,
  }));

  // Coming-soon tiles fade up into view as they scroll in. Each tile's shade comes from
  // where it actually lands in the bento (measured, so it holds at every breakpoint):
  // lower tiles are fainter, and tiles further along a row arrive a beat later.
  const soon = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const tiles = soon.current?.querySelectorAll<HTMLElement>(".svc-tile--soon");
    if (!tiles?.length) return;

    const shade = () => {
      const list = [...tiles];
      const tops = [...new Set(list.map((t) => t.offsetTop))].sort((a, b) => a - b);
      const lefts = [...new Set(list.map((t) => t.offsetLeft))].sort((a, b) => a - b);
      const last = Math.max(1, tops.length - 1);
      for (const t of list) {
        const row = tops.indexOf(t.offsetTop);
        t.style.setProperty("--fade", String(1 - (0.86 * row) / last));
        t.style.setProperty("--col", String(lefts.indexOf(t.offsetLeft)));
      }
    };
    shade();
    window.addEventListener("resize", shade);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    tiles.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      window.removeEventListener("resize", shade);
    };
  }, []);

  // A short line travels through the bento from the top-left tile to the bottom-most
  // tile along the shortest route (Dijkstra over touching tiles, weighted by the
  // distance between their centres), lapping each tile's border on the way. Each lap
  // starts at the corner nearest where the previous one ended, and is timed from the
  // tile's perimeter so the line moves at one steady speed. Loops; only runs while the
  // grid is on screen; skipped for reduced motion.
  useEffect(() => {
    const ul = soon.current;
    if (!ul || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const PX_PER_MS = 0.45;
    const SEG = 0.2; // visible share of the perimeter
    const PAUSE_MS = 900; // rest at the end before the next run
    let timer = 0;
    let running = false;

    const route = () => {
      const tiles = [...ul.querySelectorAll<HTMLElement>(".svc-tile--soon")];
      const box = tiles.map((t) => ({ el: t, x: t.offsetLeft, y: t.offsetTop, w: t.offsetWidth, h: t.offsetHeight }));
      const gap = parseFloat(getComputedStyle(ul).rowGap) + 2;
      const overlap = (a0: number, a1: number, b0: number, b1: number) => Math.min(a1, b1) - Math.max(a0, b0) > 0;
      const touches = (a: (typeof box)[number], b: (typeof box)[number]) => {
        const sideBySide = (Math.abs(a.x + a.w - b.x) <= gap || Math.abs(b.x + b.w - a.x) <= gap) && overlap(a.y, a.y + a.h, b.y, b.y + b.h);
        const stacked = (Math.abs(a.y + a.h - b.y) <= gap || Math.abs(b.y + b.h - a.y) <= gap) && overlap(a.x, a.x + a.w, b.x, b.x + b.w);
        return sideBySide || stacked;
      };
      const centre = (b: (typeof box)[number]) => [b.x + b.w / 2, b.y + b.h / 2] as const;

      // Start top-left; end at the bottom-most tile (rightmost if several share the bottom).
      const start = box.reduce((m, b, i) => (b.y < box[m]!.y || (b.y === box[m]!.y && b.x < box[m]!.x) ? i : m), 0);
      const end = box.reduce((m, b, i) => {
        const bb = b.y + b.h, mb = box[m]!.y + box[m]!.h;
        return bb > mb || (bb === mb && b.x > box[m]!.x) ? i : m;
      }, 0);

      // Dijkstra.
      const dist = box.map(() => Infinity);
      const prev = box.map(() => -1);
      const done = box.map(() => false);
      dist[start] = 0;
      for (;;) {
        let u = -1;
        for (let i = 0; i < box.length; i++) if (!done[i] && (u < 0 || dist[i]! < dist[u]!)) u = i;
        if (u < 0 || dist[u] === Infinity || u === end) break;
        done[u] = true;
        const [ux, uy] = centre(box[u]!);
        for (let v = 0; v < box.length; v++) {
          if (done[v] || !touches(box[u]!, box[v]!)) continue;
          const [vx, vy] = centre(box[v]!);
          const d = dist[u]! + Math.hypot(vx - ux, vy - uy);
          if (d < dist[v]!) {
            dist[v] = d;
            prev[v] = u;
          }
        }
      }
      const path: (typeof box)[number][] = [];
      for (let i = end; i >= 0; i = prev[i]!) path.unshift(box[i]!);
      return path[0] === box[start] ? path : [box[start]!];
    };

    // Border of a tile as a path in its own coordinates, starting at corner k (0 TL, 1 TR, 2 BR, 3 BL), clockwise.
    const ring = (w: number, h: number, k: number) => {
      const c = [[0.75, 0.75], [w - 0.75, 0.75], [w - 0.75, h - 0.75], [0.75, h - 0.75]];
      const pts = [0, 1, 2, 3].map((i) => c[(k + i) % 4]!);
      return `M${pts.map((p) => p.join(" ")).join(" L")} Z`;
    };

    const run = () => {
      const path = route();
      let i = 0;
      let from: [number, number] = [path[0]!.x, path[0]!.y];
      const lap = () => {
        if (!running) return;
        if (i >= path.length) {
          timer = window.setTimeout(run, PAUSE_MS);
          return;
        }
        const t = path[i++]!;
        const corners: [number, number][] = [[t.x, t.y], [t.x + t.w, t.y], [t.x + t.w, t.y + t.h], [t.x, t.y + t.h]];
        const k = corners.reduce((m, c, j) => (Math.hypot(c[0] - from[0], c[1] - from[1]) < Math.hypot(corners[m]![0] - from[0], corners[m]![1] - from[1]) ? j : m), 0);
        from = corners[k]!;
        const line = t.el.querySelector<SVGPathElement>(".svc-trace path");
        if (!line) return lap();
        line.setAttribute("d", ring(t.w, t.h, k));
        const duration = (2 * (t.w + t.h)) / PX_PER_MS;
        line.animate([{ strokeDashoffset: SEG }, { strokeDashoffset: -1 }], { duration: duration * (1 + SEG), easing: "linear" });
        timer = window.setTimeout(lap, duration);
      };
      lap();
    };

    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) {
        running = true;
        run();
      } else if (!e?.isIntersecting && running) {
        running = false;
        clearTimeout(timer);
      }
    });
    io.observe(ul);
    return () => {
      running = false;
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % shots.length), STEP_MS);
    return () => clearInterval(t);
  }, [held, index, shots.length]);

  return (
    <>
      <ServicesViewer
        shots={shots}
        index={index}
        onPick={setIndex}
        onHold={setHeld}
        isAr={isAr}
        title={copy.available}
        sub={copy.availableSub}
      />

      <section className="svc on-dark">
        <div className="container-gc">
          <div className="svc-soon">
            <header className="svc-head">
              <p className="svc-soon-badge">{copy.upcoming}</p>
              <p className="svc-sub">{copy.upcomingSub}</p>
            </header>
            <ul ref={soon} className="svc-bento">
              {upcomingServices.map((s) => (
                <li key={s.id} className={`svc-tile svc-tile--soon${SOON_SIZE[s.id] ? ` is-${SOON_SIZE[s.id]}` : ""}`}>
                  <svg className="svc-trace" aria-hidden>
                    <path pathLength={1} />
                  </svg>
                  <span className="svc-tile-title">{isAr ? s.titleAr : s.titleEn}</span>
                </li>
              ))}
            </ul>
            <p className="svc-soon-big" aria-hidden>
              {copy.upcoming}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
