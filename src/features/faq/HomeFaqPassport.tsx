"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import type { FaqItem } from "@/content/faq";
import { basePriceJd, cashDiscountPct, cashPriceJd, pricingPlans } from "@/content/pricing";
import { nearbyPlaces } from "@/content/location";
import { GIVING_MARK_SVG } from "@/components/brand/givingMark";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The brand mark's inner markup, for nesting inside a stamp's own SVG. */
const MARK_INNER = GIVING_MARK_SVG.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

/*
 * Home FAQ as the "Giving City passport" (styles: styles/sections/faq-passport.css).
 *   An open booklet: the left page carries the question and answer, the right
 *   page is a visa page. Choosing a question turns the page and that answer's
 *   own rubber stamp slams onto the visa page (ink texture, impact jolt, ink
 *   ring). Stamps accumulate like a real passport; each question in the list
 *   collects a mini stamp. With all five stamped, an "approved" V seal lands
 *   across the page and invites a site visit.
 *   The first question stamps itself when the section comes into view.
 * Reduced motion: pages swap and stamps appear without movement.
 */

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type Ink = "slate" | "gold" | "teal" | "rust";
type Shape = "circle" | "rect" | "oval";

type Stamp = {
  shape: Shape;
  ink: Ink;
  /** Text running around a circular stamp. */
  ring?: string;
  top?: string;
  big?: string;
  sub?: string;
  mark?: boolean;
  /** Where it lands on the visa page: centre (% of page) and tilt. */
  at: { x: number; y: number; r: number };
};

type Fmt = (v: number) => string;

function stampsFor(isAr: boolean, fmt: Fmt): Record<string, Stamp> {
  const royal = nearbyPlaces.find((p) => p.id === "royal");
  const km = Math.round(royal?.km ?? 36);
  const min = royal?.minutes ?? 30;
  const pct = pricingPlans.map((p) => fmt(p.downPct)).join(" · ");
  const years = `${fmt(pricingPlans[0].moveIn).replace(/[٬,]/g, "")}–${fmt(pricingPlans[pricingPlans.length - 1]!.moveIn).replace(/[٬,]/g, "")}`;
  return isAr
    ? {
        where: { shape: "circle", ink: "slate", ring: "من فندق الرويال · إلى Giving City ·", big: `${fmt(km)} كم`, sub: `${fmt(min)} دقيقة`, at: { x: 27, y: 25, r: -9 } },
        price: { shape: "rect", ink: "gold", top: "سعر المنتجع", big: `${fmt(basePriceJd)} د.أ`, sub: `نقدًا −${fmt(cashDiscountPct)}٪ · ${fmt(cashPriceJd)}`, at: { x: 61, y: 22, r: 6 } },
        deed: { shape: "circle", ink: "gold", ring: "سند ملكية مستقل · ٥٠٠ م² · باسمك ·", mark: true, sub: "طابو", at: { x: 33, y: 62, r: -5 } },
        interest: { shape: "oval", ink: "rust", top: "فوائد", big: `${fmt(0)}٪`, sub: "بدون بنك", at: { x: 72, y: 55, r: 11 } },
        plans: { shape: "rect", ink: "teal", top: "٣ خطط · دفعة أولى", big: `٪ ${pct}`, sub: `الاستلام ${years}`, at: { x: 55, y: 85, r: -6 } },
      }
    : {
        where: { shape: "circle", ink: "slate", ring: "LE ROYAL · TO · GIVING CITY ·", big: `${km} km`, sub: `${min} min`, at: { x: 27, y: 25, r: -9 } },
        price: { shape: "rect", ink: "gold", top: "PRICE PER RESORT", big: `${fmt(basePriceJd)} JD`, sub: `CASH −${cashDiscountPct}% · ${fmt(cashPriceJd)}`, at: { x: 61, y: 22, r: 6 } },
        deed: { shape: "circle", ink: "gold", ring: "INDEPENDENT DEED · 500 m² · IN YOUR NAME ·", mark: true, sub: "TABOU", at: { x: 33, y: 62, r: -5 } },
        interest: { shape: "oval", ink: "rust", top: "INTEREST", big: "0%", sub: "NO BANK", at: { x: 72, y: 55, r: 11 } },
        plans: { shape: "rect", ink: "teal", top: "3 PLANS · DOWN", big: `${pct} %`, sub: `MOVE-IN ${years}`, at: { x: 55, y: 85, r: -6 } },
      };
}

const copy = {
  en: {
    eyebrow: "FAQ",
    title: "Five answers, stamped.",
    lead: "The questions we hear most — each answer comes with our seal on it.",
    hint: "Tap a question to collect its stamp",
    collected: (n: string, t: string) => `${n} of ${t} stamped`,
    passport: "Giving City · Passport",
    page: "Page",
    visas: "Visas",
    empty: "Your first stamp lands here",
    issued: "Answers issued by Al-Ataa · ISO 9001:2015",
    approvedRing: "GIVING CITY · APPROVED · GIVING CITY · APPROVED ·",
    approvedSub: "READY TO VISIT",
    doneTitle: "You’ve got the essentials.",
    doneBody: "Now come and see it for real.",
    doneCta: "Book a site visit",
    all: "Read all FAQs",
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "خمس إجابات، مختومة.",
    lead: "أكثر الأسئلة التي نسمعها — وكل إجابة تحمل ختمنا.",
    hint: "اضغط على سؤال لتحصل على ختمه",
    collected: (n: string, t: string) => `${n} من ${t} مختومة`,
    passport: "جواز Giving City",
    page: "صفحة",
    visas: "تأشيرات",
    empty: "هنا يُطبع ختمك الأول",
    issued: "إجابات صادرة عن شركة العطاء · ISO 9001:2015",
    approvedRing: "Giving City · معتمد · Giving City · معتمد ·",
    approvedSub: "جاهز للزيارة",
    doneTitle: "أصبحت تعرف الأساسيات.",
    doneBody: "تعال الآن وشاهده على أرض الواقع.",
    doneCta: "احجز زيارة للموقع",
    all: "اقرأ جميع الأسئلة الشائعة",
  },
} as const;

// ── A rubber stamp ────────────────────────────────────────────────

function StampArt({ s, id, fit }: { s: Stamp; id: string; fit: boolean }) {
  const w = s.shape === "circle" ? 150 : s.shape === "oval" ? 180 : 210;
  const h = s.shape === "circle" ? 150 : s.shape === "oval" ? 118 : 112;
  const cx = w / 2;
  const cy = h / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="pp-stamp-art" aria-hidden>
      <g filter="url(#pp-ink)">
        {s.shape === "circle" && (
          <>
            <circle cx={cx} cy={cy} r={70} className="pp-ink-stroke" strokeWidth={4} />
            <circle cx={cx} cy={cy} r={63} className="pp-ink-stroke" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={43} className="pp-ink-stroke" strokeWidth={1.5} />
            <path id={`pp-ring-${id}`} d={`M ${cx} ${cy} m -53 0 a 53 53 0 1 1 106 0 a 53 53 0 1 1 -106 0`} fill="none" />
            <text className="pp-ink-fill pp-ring-text">
              {/* Stretch Latin to close the ring; Arabic keeps its joins, centred. */}
              <textPath
                href={`#pp-ring-${id}`}
                startOffset={fit ? "0" : "50%"}
                textAnchor={fit ? undefined : "middle"}
                textLength={fit ? 328 : undefined}
                lengthAdjust={fit ? "spacingAndGlyphs" : undefined}
              >
                {s.ring}
              </textPath>
            </text>
            {s.mark ? (
              <svg
                x={cx - 24}
                y={cy - 34}
                width={48}
                height={48}
                viewBox="307 348 190 190"
                className="pp-mark"
                dangerouslySetInnerHTML={{ __html: MARK_INNER }}
              />
            ) : (
              <text x={cx} y={cy + 6} className="pp-ink-fill pp-big" textAnchor="middle">
                {s.big}
              </text>
            )}
            {s.sub && (
              <text x={cx} y={s.mark ? cy + 33 : cy + 26} className="pp-ink-fill pp-sub" textAnchor="middle">
                {s.sub}
              </text>
            )}
          </>
        )}
        {s.shape === "rect" && (
          <>
            <rect x={4} y={4} width={w - 8} height={h - 8} rx={8} className="pp-ink-stroke" strokeWidth={4} />
            <rect x={11} y={11} width={w - 22} height={h - 22} rx={4} className="pp-ink-stroke" strokeWidth={1.4} />
            <text x={cx} y={34} className="pp-ink-fill pp-top" textAnchor="middle">
              {s.top}
            </text>
            <line x1={24} x2={w - 24} y1={43} y2={43} className="pp-ink-stroke" strokeWidth={1.2} />
            <text x={cx} y={73} className="pp-ink-fill pp-big" textAnchor="middle">
              {s.big}
            </text>
            <text x={cx} y={93} className="pp-ink-fill pp-sub" textAnchor="middle">
              {s.sub}
            </text>
          </>
        )}
        {s.shape === "oval" && (
          <>
            <ellipse cx={cx} cy={cy} rx={cx - 4} ry={cy - 4} className="pp-ink-stroke" strokeWidth={4} />
            <ellipse cx={cx} cy={cy} rx={cx - 12} ry={cy - 12} className="pp-ink-stroke" strokeWidth={1.4} />
            <text x={cx} y={cy - 22} className="pp-ink-fill pp-top" textAnchor="middle">
              {s.top}
            </text>
            <text x={cx} y={cy + 18} className="pp-ink-fill pp-big pp-big--xl" textAnchor="middle">
              {s.big}
            </text>
            <text x={cx} y={cy + 38} className="pp-ink-fill pp-sub" textAnchor="middle">
              {s.sub}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

// ── Section ───────────────────────────────────────────────────────

type Props = { items: FaqItem[] };

export function HomeFaqPassport({ items }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const c = isAr ? copy.ar : copy.en;
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(-1);
  const [collected, setCollected] = useState<number[]>([]);
  const [approved, setApproved] = useState(false);
  const busy = useRef(false);
  const shownRef = useRef(-1);
  const pendingStamp = useRef<number | null>(null);

  const fmt: Fmt = useCallback((v) => v.toLocaleString(isAr ? "ar-JO" : "en-US"), [isAr]);
  const stamps = stampsFor(isAr, fmt);
  const idOf = (i: number) => items[i]?.id ?? "";
  const total = items.length;

  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  /** Turn to question i: the page folds away, the new one unfolds, then the stamp lands. */
  const open = useCallback(
    (i: number) => {
      if (i === shownRef.current || busy.current) return;
      const page = rootRef.current?.querySelector<HTMLElement>(".pp-leaf");
      pendingStamp.current = i;
      if (!page || reduced() || shownRef.current < 0) {
        setShown(i);
        return;
      }
      busy.current = true;
      gsap.to(page, {
        rotateY: isAr ? -88 : 88,
        autoAlpha: 0.2,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => setShown(i),
      });
    },
    [isAr],
  );

  // After the page content changes: unfold it, then slam the stamp.
  useLayoutEffect(() => {
    if (shown < 0) return;
    const root = rootRef.current;
    const page = root?.querySelector<HTMLElement>(".pp-leaf");
    const i = pendingStamp.current;
    pendingStamp.current = null;
    const first = !collected.includes(shown);
    if (first) setCollected((cur) => [...cur, shown]);
    if (!root || !page || reduced()) {
      busy.current = false;
      return;
    }
    gsap.fromTo(
      page,
      { rotateY: isAr ? 88 : -88, autoAlpha: 0.2 },
      {
        rotateY: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power3.out",
        onComplete: () => {
          busy.current = false;
        },
      },
    );
    gsap.from(root.querySelectorAll(".pp-leaf .pp-rise"), { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.07, delay: 0.12, ease: "power2.out" });
    if (i !== null) slam(idOf(shown), first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  /** The stamp comes down hard, the book takes the hit, ink rings out. */
  const slam = (id: string, first: boolean) => {
    const root = rootRef.current;
    const el = root?.querySelector<HTMLElement>(`.pp-stamp[data-id="${id}"] .pp-press`);
    const s = stamps[id];
    if (!root || !el || !s) return;
    const book = root.querySelector(".pp-book");
    const ring = el.querySelector(".pp-splash");
    const tl = gsap.timeline({ delay: 0.35 });
    if (first) {
      tl.fromTo(
        el,
        { scale: 2.3, rotation: -22, y: -46, autoAlpha: 0, filter: "blur(5px)" },
        { scale: 1, rotation: 0, y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.3, ease: "power4.in", clearProps: "filter" },
      );
    } else {
      // Re-stamping an existing visa: a firm press in place.
      tl.to(el, { scale: 1.12, duration: 0.14, ease: "power2.out" }).to(el, { scale: 1, duration: 0.18, ease: "power4.in" });
    }
    tl.to(book, { y: 3, duration: 0.05, yoyo: true, repeat: 1, ease: "power1.inOut" }, ">-0.02")
      .fromTo(ring, { scale: 0.7, autoAlpha: 0.55 }, { scale: 1.7, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "<")
      .fromTo(
        root.querySelector(`.pp-q[data-i="${items.findIndex((it) => it.id === id)}"] .pp-q-slot i`),
        { scale: 2.4, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(3)" },
        "<",
      );
  };

  // All five stamped → the approval seal, once.
  useEffect(() => {
    if (approved || collected.length < total || total === 0) return;
    const t = window.setTimeout(() => setApproved(true), reduced() ? 0 : 1500);
    return () => window.clearTimeout(t);
  }, [collected, total, approved]);

  useLayoutEffect(() => {
    if (!approved || reduced()) return;
    const root = rootRef.current;
    if (!root) return;
    gsap
      .timeline()
      .fromTo(
        root.querySelector(".pp-approved .pp-press"),
        { scale: 2.6, rotation: -24, autoAlpha: 0, filter: "blur(6px)" },
        { scale: 1, rotation: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.34, ease: "power4.in", clearProps: "filter" },
      )
      .to(root.querySelector(".pp-book"), { y: 5, duration: 0.06, yoyo: true, repeat: 1 })
      .fromTo(root.querySelector(".pp-approved .pp-splash"), { scale: 0.7, autoAlpha: 0.6 }, { scale: 1.9, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, "<")
      .from(root.querySelectorAll(".pp-done > *"), { y: 14, autoAlpha: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }, "-=0.3");
  }, [approved]);

  // Entrance + the first stamp, on its own, when the section arrives.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (reduced()) {
        open(0);
        return;
      }
      gsap.from(root.querySelectorAll(".pp-q"), {
        autoAlpha: 0,
        x: isAr ? 16 : -16,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.from(root.querySelector(".pp-book"), {
        autoAlpha: 0,
        y: 36,
        rotateX: 12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      ScrollTrigger.create({
        trigger: root,
        start: "top 55%",
        once: true,
        onEnter: () =>
          gsap.delayedCall(0.9, () => {
            if (shownRef.current < 0) open(0);
          }),
      });
    },
    { scope: rootRef, dependencies: [isAr] },
  );

  const item = shown >= 0 ? items[shown] : undefined;
  const pageNo = (i: number) => fmt(i + 1).padStart(isAr ? 0 : 2, "0");

  return (
    <div ref={rootRef} className={`pp${approved ? " is-approved" : ""}`}>
      {/* Shared ink texture for every stamp. */}
      <svg width="0" height="0" className="pp-defs" aria-hidden>
        <filter id="pp-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.75" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="inked" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="warp" />
          <feDisplacementMap in="inked" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="pp-intro">
        <p className="section-eyebrow mb-4">{c.eyebrow}</p>
        <h2 className="section-title mb-4">{c.title}</h2>
        <p className="pp-lead">{c.lead}</p>

        <div className="pp-progress" aria-live="polite">
          <span className="pp-progress-bars" aria-hidden>
            {items.map((_, i) => (
              <i key={i} className={i < collected.length ? "is-on" : ""} />
            ))}
          </span>
          <span>{collected.length ? c.collected(fmt(collected.length), fmt(total)) : c.hint}</span>
        </div>

        <ol className="pp-qs">
          {items.map((it, i) => {
            const s = stamps[it.id ?? ""];
            return (
              <li key={i}>
                <button
                  type="button"
                  data-i={i}
                  className={`pp-q${i === shown ? " is-open" : ""}${collected.includes(i) ? " is-stamped" : ""}`}
                  onClick={() => open(i)}
                  aria-pressed={i === shown}
                >
                  <span className="pp-q-n">{pageNo(i)}</span>
                  <span className="pp-q-text">{isAr ? it.qAr : it.qEn}</span>
                  <span className={`pp-q-slot ink-${s?.ink ?? "slate"}`} aria-hidden>
                    <i>
                      <svg viewBox="0 0 24 24">
                        <path d="m6 12.5 4 4 8-9" />
                      </svg>
                    </i>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <Link href="/faq" className="pp-all">
          {c.all}
          <span aria-hidden>{isAr ? "←" : "→"}</span>
        </Link>
      </div>

      <div className="pp-stage">
        <div className="pp-book">
          {/* Left page — the answer */}
          <div className="pp-page pp-page--text">
            <div className="pp-leaf" aria-live="polite">
              <header className="pp-page-head">
                <span>{c.passport}</span>
                <span>
                  {c.page} {item ? pageNo(shown) : pageNo(0)}
                </span>
              </header>
              {item ? (
                <>
                  <h3 className="pp-question pp-rise">{isAr ? item.qAr : item.qEn}</h3>
                  <p className="pp-answer pp-rise">{isAr ? item.aAr : item.aEn}</p>
                </>
              ) : (
                <p className="pp-answer pp-waiting">{c.hint}</p>
              )}
              <footer className="pp-page-foot">
                <span className="pp-mrz" aria-hidden>
                  {"P<JOR<GIVING<CITY<<AL<ATAA<<<<<<<<<<<<<"}
                </span>
                <span>{c.issued}</span>
              </footer>
            </div>
          </div>

          {/* Right page — the visas */}
          <div className="pp-page pp-page--visa">
            <header className="pp-page-head">
              <span>{c.visas}</span>
              <span className="pp-page-mark" aria-hidden dangerouslySetInnerHTML={{ __html: GIVING_MARK_SVG }} />
            </header>
            {collected.length === 0 && <p className="pp-empty">{c.empty}</p>}
            {items.map((it) => {
              const id = it.id ?? "";
              const s = stamps[id];
              if (!s) return null;
              const i = items.indexOf(it);
              const on = collected.includes(i);
              return (
                <span
                  key={id}
                  data-id={id}
                  className={`pp-stamp ink-${s.ink}${on ? " is-on" : ""}${i === shown ? " is-current" : ""}`}
                  style={{ left: `${isAr ? 100 - s.at.x : s.at.x}%`, top: `${s.at.y}%`, rotate: `${isAr ? -s.at.r : s.at.r}deg` }}
                >
                  <span className="pp-press">
                    <span className="pp-splash" />
                    <StampArt s={s} id={id} fit={!isAr} />
                  </span>
                </span>
              );
            })}
            <span className="pp-approved ink-gold">
              <span className="pp-press">
              <span className="pp-splash" />
              <StampArt
                s={{ shape: "circle", ink: "gold", ring: c.approvedRing, mark: true, sub: c.approvedSub, at: { x: 50, y: 50, r: -16 } }}
                id="approved"
                fit={!isAr}
              />
              </span>
            </span>
          </div>
        </div>

        {approved && (
          <div className="pp-done">
            <p className="pp-done-title">{c.doneTitle}</p>
            <p className="pp-done-body">{c.doneBody}</p>
            <Link href="/register" className="pp-done-cta">
              {c.doneCta}
              <span aria-hidden>{isAr ? "←" : "→"}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
