"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, pricingPlans } from "@/content/pricing";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";
import { CountUp } from "@/components/CountUp";

type Mode = "installments" | "cash";

function useAnimatedNumber(target: number, enabled: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fromRef.current = target;
      setValue(target);
      startedRef.current = true;
      return;
    }

    // First reveal: always count up from 0. Later changes (toggle/plan) tween from current.
    const from = startedRef.current ? fromRef.current : 0;
    startedRef.current = true;

    if (from === target) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(from + (target - from) * eased);
      fromRef.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, enabled]);

  return value;
}

function AnimatedNumber({
  value,
  locale,
  enabled,
}: {
  value: number;
  locale: string;
  enabled: boolean;
}) {
  const v = useAnimatedNumber(value, enabled);
  return <span className="tabular-nums">{formatNumber(v, locale)}</span>;
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PricingShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const copy = site.copyBank[isAr ? "ar" : "en"];

  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const [mode, setMode] = useState<Mode>("installments");
  const [planId, setPlanId] = useState<(typeof pricingPlans)[number]["id"]>(pricingPlans[0].id);
  const plan = pricingPlans.find((p) => p.id === planId) ?? pricingPlans[0];

  const remaining = basePriceJd - plan.downJd;
  const months = Math.ceil(remaining / plan.monthlyFromJd);
  const savings = basePriceJd - cashPriceJd;
  const headline = mode === "cash" ? cashPriceJd : basePriceJd;
  const jd = tc("jd");

  const benefits = [copy.deed, copy.spanish, copy.privacy, copy.iso];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pricing-showcase grid items-stretch gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div className="flex flex-col justify-center">
        <p className="section-eyebrow">{tc("financing")}</p>
        <h2 className="section-title">{t("pricingTitle")}</h2>
        <p className="section-sub">{t("pricingSub")}</p>

        <div role="tablist" aria-label={isAr ? "طريقة الدفع" : "Payment method"} className="pricing-toggle mt-10" data-mode={mode}>
          <span className="pricing-toggle-thumb" aria-hidden />
          {(["installments", "cash"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className="pricing-toggle-btn"
            >
              {m === "installments"
                ? isAr ? "تقسيط بدون فوائد" : "Zero-interest plan"
                : isAr ? `نقدًا — خصم ${formatNumber(cashDiscountPct, locale)}٪` : `Cash — ${cashDiscountPct}% off`}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
            {isAr ? "سعر الشاليه يبدأ من" : "Chalets from"}
          </p>
          <p className="font-display mt-3 flex items-baseline gap-3 text-6xl font-bold leading-none tracking-tight text-brand md:text-7xl">
            <AnimatedNumber value={headline} locale={locale} enabled={inView} />
            <span className="text-lg font-medium tracking-normal text-muted">{jd}</span>
          </p>
          <div className="mt-4 flex min-h-8 flex-wrap items-center gap-3 text-sm">
            {mode === "cash" ? (
              <>
                <span className="text-muted line-through">
                  {formatNumber(basePriceJd, locale)} {jd}
                </span>
                <span className="pricing-chip pricing-chip--accent">
                  {isAr ? "توفير" : "Save"}{" "}
                  <AnimatedNumber value={savings} locale={locale} enabled={inView} /> {jd}
                </span>
              </>
            ) : (
              <>
                <span className="pricing-chip">{isAr ? `${formatNumber(0, locale)}٪ فوائد` : "0% interest"}</span>
                <span className="text-muted">
                  {isAr ? "أو" : "or"} {formatNumber(cashPriceJd, locale)} {jd} {isAr ? "نقدًا" : "cash"}
                </span>
              </>
            )}
          </div>
        </div>

        <ul className="mt-10 grid gap-x-6 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-ink">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Check />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/financing" className="btn btn-primary">
            {isAr ? "استكشف خطط التمويل" : "Explore financing"}
          </Link>
          <Link href="/register" className="btn border border-brand/30 text-brand hover:bg-brand hover:text-white">
            {tc("register")}
          </Link>
        </div>
      </div>

      <div className="pricing-card">
        <div className="pricing-card-glow" aria-hidden />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{copy.zeroInterest}</p>
            <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/70">
              {isAr ? "مباشرة مع الشركة" : "Direct with developer"}
            </span>
          </div>

          {mode === "installments" ? (
            <div key="inst" className="pricing-fade mt-8 flex flex-1 flex-col">
              <div role="tablist" aria-label={isAr ? "خطط الاستلام" : "Move-in plans"} className="grid grid-cols-3 gap-2">
                {pricingPlans.map((p) => {
                  const active = p.id === planId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPlanId(p.id)}
                      className={`pricing-plan-tab ${active ? "is-active" : ""}`}
                    >
                      <span className="font-display block text-2xl font-bold tabular-nums">
                        {formatNumber(p.moveIn, locale).replace(/[٬,]/g, "")}
                      </span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] opacity-75">
                        {isAr ? p.labelAr : p.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10">
                <p className="text-sm text-white/60">{isAr ? "الدفعة الأولى" : "Down payment"}</p>
                <p className="font-display mt-2 flex items-baseline gap-3 text-5xl font-bold leading-none text-white">
                  <AnimatedNumber value={plan.downJd} locale={locale} enabled={inView} />
                  <span className="text-base font-medium text-white/60">{jd}</span>
                  <span className="pricing-chip pricing-chip--dark ms-auto">
                    {formatNumber(plan.downPct, locale)}{isAr ? "٪" : "%"}
                  </span>
                </p>

                <div className="mt-6" aria-hidden>
                  <div className="pricing-bar">
                    <span className="pricing-bar-fill" style={{ width: inView ? `${plan.downPct}%` : "0%" }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-white/50">
                    <span>{isAr ? "الدفعة الأولى" : "Down"}</span>
                    <span>{isAr ? "أقساط شهرية بدون فوائد" : "Zero-interest monthly"}</span>
                  </div>
                </div>
              </div>

              <dl className="mt-auto grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 pt-0 [&>div]:bg-secondary-deep">
                <div className="p-5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{isAr ? "القسط الشهري من" : "Monthly from"}</dt>
                  <dd className="font-display mt-2 text-2xl font-bold">
                    <AnimatedNumber value={plan.monthlyFromJd} locale={locale} enabled={inView} />{" "}
                    <span className="text-sm font-medium text-white/60">{jd}</span>
                  </dd>
                </div>
                <div className="p-5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{isAr ? "المدة حتى" : "Up to"}</dt>
                  <dd className="font-display mt-2 text-2xl font-bold">
                    <AnimatedNumber value={months} locale={locale} enabled={inView} />{" "}
                    <span className="text-sm font-medium text-white/60">{isAr ? "شهرًا" : "months"}</span>
                  </dd>
                </div>
                <div className="p-5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{isAr ? "المتبقي" : "Balance"}</dt>
                  <dd className="font-display mt-2 text-2xl font-bold">
                    <AnimatedNumber value={remaining} locale={locale} enabled={inView} />{" "}
                    <span className="text-sm font-medium text-white/60">{jd}</span>
                  </dd>
                </div>
                <div className="p-5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{isAr ? "الفوائد" : "Interest"}</dt>
                  <dd className="font-display mt-2 text-2xl font-bold text-accent">
                    {inView ? (
                      <CountUp value={0} from={100} locale={locale} duration={1600} delay={150} suffix={isAr ? "٪" : "%"} />
                    ) : (
                      <span className="tabular-nums">100{isAr ? "٪" : "%"}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div key="cash" className="pricing-fade mt-8 flex flex-1 flex-col">
              <p className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                {isAr ? "ادفع نقدًا ووفّر مباشرة." : "Pay cash, save instantly."}
              </p>
              <p className="mt-3 max-w-sm text-sm text-white/65">
                {isAr
                  ? `خصم ${formatNumber(cashDiscountPct, locale)}٪ على السعر الأساسي عند الدفع الكامل، مع سند ملكية مستقل باسمك.`
                  : `${cashDiscountPct}% off the list price for full payment, with an independent deed in your name.`}
              </p>

              <dl className="mt-auto space-y-4 border-t border-white/10 pt-8 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-white/60">{isAr ? "السعر الأساسي" : "List price"}</dt>
                  <dd className="tabular-nums text-white/80">
                    <AnimatedNumber value={basePriceJd} locale={locale} enabled={inView} /> {jd}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-white/60">
                    {isAr ? `خصم نقدي ${formatNumber(cashDiscountPct, locale)}٪` : `Cash discount ${cashDiscountPct}%`}
                  </dt>
                  <dd className="tabular-nums text-accent">
                    − <AnimatedNumber value={savings} locale={locale} enabled={inView} /> {jd}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <dt className="font-bold text-white">{isAr ? "تدفع" : "You pay"}</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums text-white">
                    <AnimatedNumber value={cashPriceJd} locale={locale} enabled={inView} />{" "}
                    <span className="text-sm font-medium text-white/60">{jd}</span>
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
