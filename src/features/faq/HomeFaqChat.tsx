"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import type { FaqItem } from "@/content/faq";
import { basePriceJd, cashDiscountPct, cashPriceJd, pricingPlans } from "@/content/pricing";
import { nearbyPlaces } from "@/content/location";
import { site } from "@/content/site";
import { GIVING_MARK_SVG } from "@/components/brand/givingMark";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Home FAQ as a conversation with a Giving City concierge
 * (styles: styles/sections/faq-chat.css).
 *   Questions are chips; picking one sends it as the visitor's message, the
 *   concierge types, then answers word by word — and each answer carries a
 *   small visual that says it at a glance (route, price, deed seal, 0%, plans).
 *   The first question asks itself when the section comes into view.
 *   "Ask your own" opens WhatsApp with the visitor's question already written.
 * Reduced motion: everything appears at once; nothing counts or draws.
 */

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type Fmt = (v: number, digits?: number) => string;

const copy = {
  en: {
    eyebrow: "FAQ",
    title: "Ask us anything.",
    lead: "The questions we hear most — answered by our concierge in seconds.",
    pick: "Pick a question",
    name: "Giving City Concierge",
    status: "Online · replies instantly",
    welcome: "Welcome! Pick any question and I’ll answer right away — or ask me your own below.",
    placeholder: "Ask your own question…",
    send: "Send on WhatsApp",
    sentReply: "I’ve opened WhatsApp with your question — our team usually replies within 2–4 hours.",
    all: "Read all FAQs",
    jd: "JD",
    // visuals
    km: "km",
    min: "min",
    royal: "Le Royal",
    home: "Giving City",
    installments: "Installments",
    cash: "Cash",
    deed: "Title deed",
    area: "Area",
    sqm: "m²",
    owner: "Owner",
    you: "You",
    stamp: "Tabou",
    interest: "interest",
    noBank: "Direct with the company — no bank in between.",
    down: "down",
    moveIn: "Move-in",
    monthly: "Monthly from",
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "اسألنا ما تشاء.",
    lead: "أكثر الأسئلة التي نسمعها — يجيب عنها مستشارنا في ثوانٍ.",
    pick: "اختر سؤالًا",
    name: "مستشار Giving City",
    status: "متصل · يرد فورًا",
    welcome: "أهلًا بك! اختر أي سؤال وسأجيبك فورًا — أو اكتب سؤالك في الأسفل.",
    placeholder: "اكتب سؤالك…",
    send: "أرسل عبر واتساب",
    sentReply: "فتحتُ لك واتساب مع سؤالك — يرد فريقنا عادةً خلال ٢–٤ ساعات.",
    all: "اقرأ جميع الأسئلة الشائعة",
    jd: "د.أ",
    km: "كم",
    min: "دقيقة",
    royal: "فندق الرويال",
    home: "Giving City",
    installments: "بالتقسيط",
    cash: "نقدًا",
    deed: "سند ملكية",
    area: "المساحة",
    sqm: "م²",
    owner: "المالك",
    you: "أنت",
    stamp: "طابو",
    interest: "فوائد",
    noBank: "مباشرة مع الشركة — بدون أي بنك.",
    down: "دفعة أولى",
    moveIn: "الاستلام",
    monthly: "أقساط شهرية من",
  },
} as const;

type Copy = (typeof copy)["en"] | (typeof copy)["ar"];

/** Count a number up (or down) into an element. */
function countTo(el: Element | null, from: number, to: number, fmt: Fmt, delay: number, digits = 0) {
  if (!el) return;
  const v = { n: from };
  el.textContent = fmt(from, digits);
  gsap.to(v, {
    n: to,
    duration: 1.3,
    delay,
    ease: "power3.out",
    onUpdate: () => {
      el.textContent = fmt(digits ? v.n : Math.round(v.n), digits);
    },
  });
}

// ── Visual answers ──────────────────────────────────────────────

function WhereVisual({ c, fmt, delay }: { c: Copy; fmt: Fmt; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const royal = nearbyPlaces.find((p) => p.id === "royal");
  const km = Math.round(royal?.km ?? 36);
  const min = royal?.minutes ?? 30;
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const path = ref.current?.querySelector<SVGPathElement>(".fq-route");
      const car = ref.current?.querySelector<SVGCircleElement>(".fq-route-car");
      if (reduced() || !path || !car) return;
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, delay, ease: "power2.inOut" });
      gsap.from(q(".fq-route-end"), { scale: 0, transformOrigin: "center", duration: 0.5, delay: delay + 1.05, ease: "back.out(3)" });
      const p = { t: 0 };
      gsap.to(p, {
        t: 1,
        duration: 2.4,
        delay: delay + 1.3,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 0.8,
        onUpdate: () => {
          const pt = path.getPointAtLength(p.t * len);
          car.setAttribute("cx", String(pt.x));
          car.setAttribute("cy", String(pt.y));
          car.style.opacity = String(p.t < 0.06 ? p.t / 0.06 : p.t > 0.94 ? (1 - p.t) / 0.06 : 1);
        },
      });
      countTo(q(".fq-v-km")[0] ?? null, 0, km, fmt, delay + 0.2);
      countTo(q(".fq-v-min")[0] ?? null, 0, min, fmt, delay + 0.2);
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="fq-vis fq-vis--where">
      <div className="fq-route-art" dir="ltr">
        <svg viewBox="0 0 280 84" aria-hidden>
          <path className="fq-route-shadow" d="M22 62 C 88 8, 170 92, 258 26" />
          <path className="fq-route" d="M22 62 C 88 8, 170 92, 258 26" pathLength={1} />
          <circle className="fq-route-start" cx="22" cy="62" r="4.5" />
          <circle className="fq-route-end" cx="258" cy="26" r="6" />
          <circle className="fq-route-car" cx="22" cy="62" r="3.5" />
        </svg>
        <span className="fq-route-label fq-route-label--a">{c.royal}</span>
        <span className="fq-route-label fq-route-label--b">{c.home}</span>
      </div>
      <p className="fq-figs">
        <span>
          <b className="fq-v-km">{fmt(km)}</b> {c.km}
        </span>
        <span className="fq-figs-dot" aria-hidden />
        <span>
          <b className="fq-v-min">{fmt(min)}</b> {c.min}
        </span>
      </p>
    </div>
  );
}

function PriceVisual({ c, fmt, delay }: { c: Copy; fmt: Fmt; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(ref);
      gsap.from(q(".fq-price-bar i"), { scaleX: 0, duration: 1.1, delay, ease: "expo.out", stagger: 0.18 });
      countTo(q(".fq-v-base")[0] ?? null, 0, basePriceJd, fmt, delay);
      countTo(q(".fq-v-cash")[0] ?? null, 0, cashPriceJd, fmt, delay + 0.18);
      gsap.from(q(".fq-badge"), { scale: 0, duration: 0.5, delay: delay + 1, ease: "back.out(3)" });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="fq-vis fq-vis--price">
      <div className="fq-price-row">
        <span className="fq-price-label">{c.installments}</span>
        <span className="fq-price-val">
          <b className="fq-v-base">{fmt(basePriceJd)}</b> {c.jd}
        </span>
        <span className="fq-price-bar" aria-hidden>
          <i style={{ width: "100%" }} />
        </span>
      </div>
      <div className="fq-price-row is-cash">
        <span className="fq-price-label">
          {c.cash} <span className="fq-badge" dir="ltr">−{fmt(cashDiscountPct)}%</span>
        </span>
        <span className="fq-price-val">
          <b className="fq-v-cash">{fmt(cashPriceJd)}</b> {c.jd}
        </span>
        <span className="fq-price-bar" aria-hidden>
          <i style={{ width: `${(cashPriceJd / basePriceJd) * 100}%` }} />
        </span>
      </div>
    </div>
  );
}

function DeedVisual({ c, fmt, delay }: { c: Copy; fmt: Fmt; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(ref);
      gsap.from(q(".fq-deed"), { y: 10, rotate: -2, autoAlpha: 0, duration: 0.6, delay, ease: "power3.out" });
      gsap.from(q(".fq-deed-line"), { scaleX: 0, duration: 0.6, delay: delay + 0.2, stagger: 0.08, ease: "power2.out" });
      gsap
        .timeline({ delay: delay + 0.75 })
        .from(q(".fq-seal"), { scale: 2.2, rotate: -40, autoAlpha: 0, duration: 0.35, ease: "power4.in" })
        .to(q(".fq-deed"), { y: 2, duration: 0.06, yoyo: true, repeat: 1 })
        .fromTo(q(".fq-seal-ring"), { scale: 0.8, autoAlpha: 0.8 }, { scale: 1.9, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "<");
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="fq-vis fq-vis--deed">
      <div className="fq-deed">
        <p className="fq-deed-title">{c.deed}</p>
        <span className="fq-deed-line" />
        <span className="fq-deed-line" style={{ width: "72%" }} />
        <dl className="fq-deed-fields">
          <div>
            <dt>{c.area}</dt>
            <dd>
              {fmt(500)} {c.sqm}
            </dd>
          </div>
          <div>
            <dt>{c.owner}</dt>
            <dd>{c.you}</dd>
          </div>
        </dl>
        <span className="fq-seal" aria-hidden>
          <span className="fq-seal-ring" />
          <span className="fq-seal-core" dangerouslySetInnerHTML={{ __html: GIVING_MARK_SVG }} />
          <span className="fq-seal-text">{c.stamp}</span>
        </span>
      </div>
    </div>
  );
}

function InterestVisual({ c, fmt, delay }: { c: Copy; fmt: Fmt; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(ref);
      countTo(q(".fq-v-zero")[0] ?? null, 9, 0, fmt, delay);
      gsap.from(q(".fq-bank-strike"), { strokeDashoffset: 1, duration: 0.5, delay: delay + 1.1, ease: "power2.out" });
      gsap.from(q(".fq-zero"), { scale: 0.9, duration: 1.4, delay, ease: "elastic.out(1, 0.5)" });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="fq-vis fq-vis--interest">
      <p className="fq-zero">
        <b className="fq-v-zero">{fmt(0)}</b>
        <span>%</span>
      </p>
      <div>
        <p className="fq-zero-label">{c.interest}</p>
        <p className="fq-zero-sub">
          <svg viewBox="0 0 24 24" className="fq-bank" aria-hidden>
            <path d="M3 10h18L12 4zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />
            <path className="fq-bank-strike" d="M3 21 21 3" pathLength={1} />
          </svg>
          {c.noBank}
        </p>
      </div>
    </div>
  );
}

function PlansVisual({ c, fmt, delay }: { c: Copy; fmt: Fmt; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(...pricingPlans.map((p) => p.downPct));
  useGSAP(
    () => {
      if (reduced()) return;
      const q = gsap.utils.selector(ref);
      gsap.from(q(".fq-plan-fill"), { scaleX: 0, duration: 1, delay, stagger: 0.15, ease: "expo.out" });
      gsap.from(q(".fq-plan"), { autoAlpha: 0, y: 6, duration: 0.4, delay, stagger: 0.15 });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="fq-vis fq-vis--plans">
      {pricingPlans.map((p) => (
        <div key={p.id} className="fq-plan">
          <span className="fq-plan-year">{fmt(p.moveIn).replace(/[٬,]/g, "")}</span>
          <span className="fq-plan-track">
            <span className="fq-plan-fill" style={{ width: `${(p.downPct / max) * 100}%` }} />
          </span>
          <span className="fq-plan-pct">
            {fmt(p.downPct)}% <small>{c.down}</small>
          </span>
        </div>
      ))}
      <p className="fq-plan-foot">
        {c.monthly} <b>{fmt(pricingPlans[0].monthlyFromJd)}</b> {c.jd}
      </p>
    </div>
  );
}

const visuals: Record<string, typeof WhereVisual> = {
  where: WhereVisual,
  price: PriceVisual,
  deed: DeedVisual,
  interest: InterestVisual,
  plans: PlansVisual,
};

// ── One exchange: the visitor's question, typing, the answer ─────

type Turn = { key: number; item?: FaqItem; text?: string };

function Exchange({
  turn,
  isAr,
  c,
  fmt,
  onGrow,
}: {
  turn: Turn;
  isAr: boolean;
  c: Copy;
  fmt: Fmt;
  onGrow: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [answered, setAnswered] = useState(() => reduced());
  const question = turn.item ? (isAr ? turn.item.qAr : turn.item.qEn) : (turn.text ?? "");
  const answer = turn.item ? (isAr ? turn.item.aAr : turn.item.aEn) : c.sentReply;
  const words = answer.split(" ");
  const Visual = turn.item?.id ? visuals[turn.item.id] : undefined;

  useGSAP(
    (_, contextSafe) => {
      if (reduced() || !contextSafe) return;
      const q = gsap.utils.selector(ref);
      gsap.from(q(".fq-msg--me"), {
        y: 14,
        scale: 0.94,
        autoAlpha: 0,
        duration: 0.55,
        ease: "back.out(1.8)",
        transformOrigin: isAr ? "left bottom" : "right bottom",
      });
      gsap.from(q(".fq-typing"), { autoAlpha: 0, y: 8, duration: 0.35, delay: 0.4 });
      const call = gsap.delayedCall(1.35, contextSafe(() => setAnswered(true)));
      return () => call.kill();
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      if (!answered || reduced()) return;
      const q = gsap.utils.selector(ref);
      gsap.from(q(".fq-msg--them"), { y: 10, autoAlpha: 0, duration: 0.45, ease: "power3.out" });
      gsap.from(q(".fq-w"), { autoAlpha: 0, y: 5, filter: "blur(4px)", duration: 0.4, stagger: 0.03, ease: "power2.out", delay: 0.08 });
    },
    { scope: ref, dependencies: [answered] },
  );

  useEffect(() => {
    onGrow();
  }, [answered, onGrow]);

  return (
    <div ref={ref} className="fq-turn">
      <p className="fq-msg fq-msg--me">{question}</p>
      {answered ? (
        <div className="fq-msg fq-msg--them">
          <p className="fq-answer">
            {words.map((w, i) => (
              <span key={i} className="fq-w">
                {w}{" "}
              </span>
            ))}
          </p>
          {Visual && <Visual c={c} fmt={fmt} delay={reduced() ? 0 : Math.min(1.2, words.length * 0.03 + 0.25)} />}
        </div>
      ) : (
        <p className="fq-typing" aria-label="…">
          <span />
          <span />
          <span />
        </p>
      )}
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────

type Props = { items: FaqItem[] };

export function HomeFaqChat({ items }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const c = isAr ? copy.ar : copy.en;
  const rootRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const seq = useRef(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [asked, setAsked] = useState<number[]>([]);
  const [draft, setDraft] = useState("");
  const turnCount = useRef(0);
  useEffect(() => {
    turnCount.current = turns.length;
  }, [turns]);

  const fmt: Fmt = useCallback(
    (v, digits = 0) =>
      v.toLocaleString(isAr ? "ar-JO" : "en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }),
    [isAr],
  );

  const current = turns.length ? turns[turns.length - 1] : undefined;
  const currentIndex = current?.item ? items.indexOf(current.item) : -1;

  const ask = useCallback(
    (i: number) => {
      const item = items[i];
      if (!item) return;
      seq.current += 1;
      setTurns((t) => [...t, { key: seq.current, item }].slice(-3));
      setAsked((a) => (a.includes(i) ? a : [...a, i]));
    },
    [items],
  );

  // Keep the newest message in view as the conversation grows.
  const grow = useCallback(() => {
    requestAnimationFrame(() => {
      const t = threadRef.current;
      if (t) t.scrollTo({ top: t.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
    });
  }, []);

  // The first question asks itself when the section arrives.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (reduced()) {
        ask(0);
        return;
      }
      const q = gsap.utils.selector(root);
      gsap.from(q(".fq-chip"), {
        autoAlpha: 0,
        x: isAr ? 18 : -18,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.from(q(".fq-chat"), {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      ScrollTrigger.create({
        trigger: root,
        start: "top 55%",
        once: true,
        onEnter: () =>
          gsap.delayedCall(0.7, () => {
            if (!turnCount.current) ask(0);
          }),
      });
    },
    { scope: rootRef, dependencies: [isAr] },
  );

  const send = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    window.open(`${site.whatsappUrl}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    seq.current += 1;
    setTurns((t) => [...t, { key: seq.current, text }].slice(-3));
    setDraft("");
  };

  return (
    <div ref={rootRef} className="fq">
      <div className="fq-intro">
        <p className="section-eyebrow mb-4">{c.eyebrow}</p>
        <h2 className="section-title mb-4">{c.title}</h2>
        <p className="fq-lead">{c.lead}</p>

        <p className="fq-pick">{c.pick}</p>
        <ul className="fq-chips">
          {items.map((it, i) => (
            <li key={i}>
              <button
                type="button"
                className={`fq-chip${i === currentIndex ? " is-active" : ""}${asked.includes(i) ? " is-asked" : ""}`}
                onClick={() => ask(i)}
                aria-pressed={i === currentIndex}
              >
                <span className="fq-chip-text">{isAr ? it.qAr : it.qEn}</span>
                <span className="fq-chip-icon" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path className="fq-chip-arrow" d="M5 12h13M13 6l6 6-6 6" />
                    <path className="fq-chip-check" d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Link href="/faq" className="fq-all">
          {c.all}
          <span aria-hidden>{isAr ? "←" : "→"}</span>
        </Link>
      </div>

      <div className="fq-chat">
        <header className="fq-chat-head">
          <span className="fq-avatar" aria-hidden>
            <span dangerouslySetInnerHTML={{ __html: GIVING_MARK_SVG }} />
            <i />
          </span>
          <span>
            <b>{c.name}</b>
            <small>{c.status}</small>
          </span>
        </header>

        <div ref={threadRef} className="fq-thread" aria-live="polite">
          <p className="fq-msg fq-msg--them fq-welcome">{c.welcome}</p>
          {turns.map((t) => (
            <Exchange key={t.key} turn={t} isAr={isAr} c={c} fmt={fmt} onGrow={grow} />
          ))}
        </div>

        <form className="fq-ask" onSubmit={send}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={c.placeholder}
            aria-label={c.placeholder}
            dir="auto"
          />
          <button type="submit" aria-label={c.send} title={c.send} disabled={!draft.trim()}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M4 12 20 4l-4 16-4.5-6.5z" />
              <path d="M11.5 13.5 20 4" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
