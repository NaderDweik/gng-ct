"use client";

import { useRef, type PointerEvent } from "react";
import { FloorplanIcon } from "@/components/ui/FloorplanIcon";
import { IsoMedalIcon } from "@/components/ui/IsoMedalIcon";
import { isSwitchingLocale } from "@/i18n/useSwitchLocale";
import { GIVING_MARK_LAYERS, GIVING_MARK_LAYER_TRANSFORM, GIVING_MARK_VIEWBOX } from "@/components/brand/givingMark";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type HomeStatIcon = "units" | "area" | "unit" | "iso";

export type HomeStat = {
  icon: HomeStatIcon;
  value: string;
  label: string;
};

const draw = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1000,
};

function BadgeIcon() {
  const burst = Array.from({ length: 28 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 28 - Math.PI / 2;
    const r = i % 2 === 0 ? 19 : 15;
    return `${(25 + r * Math.cos(a)).toFixed(2)},${(25 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <g className="hs-burst">
        <polygon {...draw} className="hs-draw" points={burst} />
      </g>
      <g className="hs-tag">
        <path {...draw} className="hs-draw" d="M33.5 33.5 L41 31 L57 47 L47 57 L31 41 Z" />
        <circle {...draw} className="hs-draw" cx="38" cy="38" r="2" />
        <path {...draw} className="hs-draw" d="M38 36 C 34 30, 28 30, 26 34" />
      </g>
    </svg>
  );
}

/** Estate parcel with corner marks, a contour, and a pair of cypresses. */
function EstateIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
      <path {...draw} className="hs-draw" d="M6 42 L32 29 L58 42 L32 55 Z" />
      <path {...draw} className="hs-draw" d="M17 42 C 23 37.5, 41 37.5, 47 42 C 41 46.5, 23 46.5, 17 42 Z" strokeWidth={1.2} />
      <path {...draw} className="hs-draw" d="M3 40.5 L6 42 L3 43.5 M61 40.5 L58 42 L61 43.5" strokeWidth={1.2} />
      <g className="hs-tree" data-origin="27 41">
        <path {...draw} className="hs-draw" d="M27 41 V36 M27 36 C 21 30, 21.5 18, 27 11 C 32.5 18, 33 30, 27 36" />
      </g>
      <g className="hs-tree" data-origin="37 42">
        <path {...draw} className="hs-draw" d="M37 42 V38 M37 38 C 32.5 33, 33 24, 37 19 C 41 24, 41.5 33, 37 38" />
      </g>
    </svg>
  );
}

function Icon({ name }: { name: HomeStatIcon }) {
  if (name === "iso") return <IsoMedalIcon />;
  if (name === "unit") return <FloorplanIcon />;
  if (name === "area") return <EstateIcon />;
  return <BadgeIcon />;
}

/**
 * The Giving "V", large and tonal at the strip's inline end. Nesting, outside in:
 * float (the whole mark drifts and tilts) → layer (rises in on scroll, leans with the
 * pointer) → breathe (layers fan apart and settle) → the filled shape (light rolls through).
 */
function MarkBackdrop() {
  return (
    <div className="hs-mark-wrap" aria-hidden>
      <span className="hs-mark-glow" />
      <svg className="hs-mark" viewBox={GIVING_MARK_VIEWBOX}>
        <g className="hs-mark-float">
          {GIVING_MARK_LAYERS.map((l, i) => (
            <g key={l.tone} className="hs-mark-layer" data-depth={i + 1}>
              <g className="hs-mark-breathe">
                <g transform={GIVING_MARK_LAYER_TRANSFORM}>
                  <path className={`hs-mark-fill hs-mark-fill--${l.tone}`} d={l.d} />
                </g>
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function onSpot(e: PointerEvent<HTMLLIElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/**
 * Home key-facts strip. Ambient background (silk sheen, drifting light, the Giving V, grain)
 * runs always; lines, icons and numbers are written in by scroll, then icons idle.
 * Styles: styles/sections/home-stats.css.
 */
export function HomeStats({ items }: { items: HomeStat[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(el);

      // Ambient, always on and deliberately slow: soft light drifts over the teal.
      q(".hs-blob").forEach((b, i) => {
        gsap.to(b, {
          xPercent: i % 2 ? -40 : 40,
          yPercent: i % 2 ? 18 : -18,
          scale: 1.15,
          duration: 14 + i * 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
      // The V, slow and quiet: the whole mark drifts and tilts on a long breath, its
      // layers fan apart and settle, light rolls through them back to front, and a
      // soft glow behind it swells and fades.
      gsap.to(q(".hs-mark-float"), { y: -5, rotation: 1.5, svgOrigin: "402 443", duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      q(".hs-mark-breathe").forEach((g, i) => {
        gsap.to(g, { x: i * 0.9, y: -i * 1.5, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      gsap.fromTo(
        q(".hs-mark-fill"),
        { opacity: 1 },
        { opacity: 0.45, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.8 } },
      );
      gsap.fromTo(q(".hs-mark-glow"), { scale: 0.85, opacity: 0.5 }, { scale: 1.12, opacity: 1, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
      const layers = q<SVGGElement>(".hs-mark-layer");
      const lean = layers.map((g) => ({
        x: gsap.quickTo(g, "x", { duration: 1.4, ease: "power3.out" }),
        depth: Number(g.dataset.depth ?? 1),
      }));
      const onMove = (e: globalThis.PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        lean.forEach((l) => l.x(nx * l.depth * 2.2));
      };
      el.addEventListener("pointermove", onMove);
      gsap.fromTo(
        q(".hs-mark-wrap"),
        { yPercent: 6 },
        { yPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );

      // Scroll-written: the V's layers rise into a stack, then cards, icon strokes and numbers all
      // follow the scrollbar as the strip comes up, and rewind on the way back.
      // Strokes use pathLength 1000: GSAP rounds dash offsets to whole px, so 0–1 would only snap.
      gsap.set(q(".hs-draw"), { strokeDasharray: 1000, strokeDashoffset: 1000 });
      gsap.set(q(".hs-mark-layer"), { autoAlpha: 0, y: 14 });
      gsap.set(q(".hs-item"), { opacity: 0, y: 36, scale: 0.94 });

      const counters = q<HTMLElement>(".hs-num");
      const skipCount = isSwitchingLocale();
      const groups = counters.map((c) => {
        const text = c.dataset.value ?? "";
        const parts = [...text.matchAll(/\d[\d,]*/g)].map((m) => ({
          target: Number(m[0].replace(/,/g, "")),
          comma: m[0].includes(","),
          val: 0,
        }));
        const render = () => {
          let i = 0;
          c.textContent = text.replace(/\d[\d,]*/g, () => {
            const p = parts[i++];
            const n = Math.round(p.val);
            return p.comma ? n.toLocaleString("en-US") : String(n);
          });
        };
        if (!skipCount) render();
        return { parts, render };
      });

      let idle = false;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          end: "bottom 78%",
          scrub: 0.8,
          onUpdate: (self) => {
            if (!idle && self.progress > 0.98) {
              idle = true;
              startIdle();
            }
          },
        },
      });
      tl.to(q(".hs-mark-layer"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out" }, 0);
      q(".hs-item").forEach((item, i) => {
        const at = 0.15 + i * 0.22;
        tl.to(item, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, at);
        tl.to(item.querySelectorAll(".hs-draw"), { strokeDashoffset: 0, duration: 0.9, stagger: 0.04, ease: "power1.inOut" }, at + 0.1);
        tl.add(() => item.classList.toggle("is-in", tl.scrollTrigger?.direction !== -1), at + 0.6);
        const g = groups[i];
        if (g && !skipCount) {
          tl.to(g.parts, { val: (k: number) => g.parts[k].target, duration: 0.9, ease: "power2.out", onUpdate: g.render }, at + 0.1);
        }
      });

      // Idle loops, per icon: small and unhurried.
      function startIdle() {
        gsap.to(q(".hs-burst"), { rotation: 360, svgOrigin: "25 25", duration: 60, ease: "none", repeat: -1 });
        gsap.fromTo(q(".hs-tag"), { rotation: -3 }, { rotation: 4, svgOrigin: "38 38", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        q(".hs-tree").forEach((t, i) => {
          gsap.fromTo(
            t,
            { rotation: -1.5 },
            { rotation: 1.5, svgOrigin: t.getAttribute("data-origin") ?? "0 0", duration: 3.2 + i * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 },
          );
        });
        gsap.to(q(".hs-door"), { rotation: -24, svgOrigin: "48 81", duration: 2.6, ease: "power2.inOut", yoyo: true, repeat: -1, repeatDelay: 2.5 });
        gsap.to(q(".hs-dim"), { opacity: 0.5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(q(".hs-medal"), { rotation: 2.5, svgOrigin: "8 1", duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.fromTo(
          q(".hs-check"),
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.out", repeat: -1, repeatDelay: 5 },
        );
      }

      return () => el.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hs">
      <div className="hs-aurora" aria-hidden>
        <span className="hs-blob" />
        <span className="hs-blob" />
        <span className="hs-blob" />
        <span className="hs-blob" />
      </div>
      <div className="hs-silk" aria-hidden />
      <MarkBackdrop />
      <div className="hs-grain" aria-hidden />
      <ul className="container-gc hs-row">
        {items.map((item, i) => (
          <li key={item.icon} className={`hs-item${i % 2 === 0 ? " hs-item--card" : ""}`} onPointerMove={onSpot}>
            {i % 2 === 0 && <span className="hs-shine" aria-hidden />}
            <span className="hs-icon">
              <Icon name={item.icon} />
            </span>
            <p className="hs-value" data-value={item.value}>
              <span className="hs-num" data-value={item.value} aria-hidden>
                {item.value}
              </span>
              <span className="sr-only">{item.value}</span>
            </p>
            <p className="hs-label">{item.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
