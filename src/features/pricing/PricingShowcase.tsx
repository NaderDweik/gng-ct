"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  basePriceJd,
  cashDiscountPct,
  cashPriceJd,
  isPlanChoice,
  monthlyJd,
  monthlyPct,
  type PlanChoice,
} from "@/content/pricing";
import { formatNumber } from "@/lib/format";

/*
 * Financing, said plainly: one price, one choice (installments or cash), and a
 * breakdown that answers "what do I pay today / each month / in total".
 * (Styles: styles/sections/pricing.css)
 */
export function PricingShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const tc = useTranslations("common");
  const jd = tc("jd");
  const n = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => `${n(v)}${isAr ? "٪" : "%"}`;

  const [choice, setChoice] = useState<PlanChoice>("installments");

  // Deep link from the home offer: /financing?plan=installments (or plan=cash).
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("plan");
    if (isPlanChoice(wanted)) setChoice(wanted);
  }, []);

  const options: { id: PlanChoice; label: string }[] = [
    { id: "installments", label: isAr ? "بالتقسيط" : "Installments" },
    { id: "cash", label: isAr ? "كاش" : "Pay in full" },
  ];

  const rows: { label: string; value: string; note?: string; accent?: boolean }[] =
    choice === "installments"
      ? [
          {
            label: isAr ? "سعر الشاليه" : "Chalet price",
            value: `${n(basePriceJd)} ${jd}`,
          },
          {
            label: isAr ? "ثم كل شهر" : "Then every month",
            value: `${n(monthlyJd)} ${jd}`,
            note: isAr ? `${pct(monthlyPct)} من السعر` : `${monthlyPct}% of the price`,
          },
          { label: isAr ? "الفوائد" : "Interest", value: `${n(0)} ${jd}`, accent: true },
        ]
      : [
          {
            label: isAr ? "تدفع اليوم" : "You pay today",
            value: `${n(cashPriceJd)} ${jd}`,
            note: isAr ? "دفعة واحدة" : "One payment",
          },
          {
            label: isAr ? "توفّر" : "You save",
            value: `${n(basePriceJd - cashPriceJd)} ${jd}`,
            note: isAr ? `خصم ${pct(cashDiscountPct)}` : `${cashDiscountPct}% off`,
            accent: true,
          },
          { label: isAr ? "الأقساط" : "Monthly payments", value: isAr ? "لا يوجد" : "None" },
        ];

  const total = choice === "installments" ? basePriceJd : cashPriceJd;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <p className="section-eyebrow">{tc("financing")}</p>
        <h2 className="section-title">
          {isAr ? "امتلك شاليهك بدون فوائد." : "Own your chalet with 0% interest."}
        </h2>
        <p className="section-sub">
          {isAr
            ? `سعر الشاليه ${n(basePriceJd)} ${jd}. ادفع ${pct(monthlyPct)} شهريًا مباشرة لنا، بدون بنك وبدون فوائد. أو ادفع كامل المبلغ واحصل على خصم ${pct(cashDiscountPct)}.`
            : `A chalet costs ${n(basePriceJd)} ${jd}. Pay ${monthlyPct}% a month, directly to us. No bank, no interest. Or pay in full and get ${cashDiscountPct}% off.`}
        </p>
        <div className="mt-10">
          <Link href={`/register?plan=${choice}`} className="btn btn-primary">
            {tc("register")}
          </Link>
        </div>
      </div>

      <div className="pricing-card">
        <p className="text-sm font-bold text-on-dark">
          {isAr ? "كيف تريد أن تدفع؟" : "How would you like to pay?"}
        </p>
        <div
          role="tablist"
          aria-label={isAr ? "طريقة الدفع" : "Payment option"}
          className="mt-4 grid grid-cols-2 gap-2"
        >
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={choice === o.id}
              onClick={() => setChoice(o.id)}
              className={`pricing-plan-tab${choice === o.id ? " is-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <dl key={choice} className="pricing-fade mt-8">
          {rows.map((r) => (
            <div key={r.label} className="pricing-row">
              <dt className="text-on-dark-muted">{r.label}</dt>
              <dd className="text-end">
                <span
                  className={`font-display block text-2xl font-bold tabular-nums md:text-3xl${r.accent ? " text-accent" : ""}`}
                >
                  {r.value}
                </span>
                {r.note && <span className="mt-1 block text-sm text-on-dark-muted">{r.note}</span>}
              </dd>
            </div>
          ))}
          <div className="pricing-row pricing-row--total">
            <dt className="font-bold text-on-dark">{isAr ? "المجموع" : "Total"}</dt>
            <dd className="text-end">
              <span className="font-display block text-2xl font-bold tabular-nums md:text-3xl">
                {n(total)} {jd}
              </span>
              <span className="mt-1 block text-sm text-on-dark-muted">
                {choice === "installments"
                  ? isAr
                    ? "الدفعة الأولى حسب الشاليه"
                    : "Down payment depends on the chalet"
                  : isAr
                    ? "استلام فوري"
                    : "Immediate move-in"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
