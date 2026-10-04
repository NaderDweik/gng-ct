"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, isPlanChoice, monthlyJd, monthlyPct, pricingPlans, type PlanChoice } from "@/content/pricing";
import { formatNumber } from "@/lib/format";

/*
 * Financing, said plainly: one price for every chalet, 1% of it a month, with or without a
 * down payment, or pay in full at a discount. The down payment and the time left until
 * handover depend on the chalet, which buyers pick at the sales office.
 */
export function PricingShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const tc = useTranslations("common");
  const jd = tc("jd");
  const n = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => `${n(v)}${isAr ? "٪" : "%"}`;

  const [choice, setChoice] = useState<PlanChoice>(pricingPlans[0].id);

  // Deep link: /financing?plan=noDown (or plan=cash).
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("plan");
    if (isPlanChoice(wanted)) setChoice(wanted);
  }, []);

  const options: { id: PlanChoice; label: string }[] = [
    ...pricingPlans.map((p) => ({ id: p.id, label: isAr ? p.labelAr : p.labelEn })),
    { id: "cash", label: isAr ? "دفع كامل" : "Pay in full" },
  ];

  const perChalet = isAr ? "حسب الشاليه" : "Per chalet";
  const monthlyRow = {
    label: isAr ? "ثم كل شهر" : "Then every month",
    value: `${n(monthlyJd)} ${jd}`,
    note: isAr ? `${pct(monthlyPct)} من السعر` : `${monthlyPct}% of the price`,
  };
  const rows: { label: string; value: string; note?: string; accent?: boolean }[] =
    choice === "cash"
      ? [
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
        ]
      : choice === "noDown"
        ? [
            {
              label: isAr ? "تدفع اليوم" : "You pay today",
              value: `${n(0)} ${jd}`,
              note: isAr ? "بدون دفعة أولى" : "No down payment",
              accent: true,
            },
            { ...monthlyRow, note: isAr ? `${pct(monthlyPct)} من السعر، لمدة ${n(basePriceJd / monthlyJd)} شهرًا` : `${monthlyPct}% of the price, for ${basePriceJd / monthlyJd} months` },
          ]
        : [
            {
              label: isAr ? "الدفعة الأولى" : "Down payment",
              value: perChalet,
              note: isAr ? "تُحدَّد مع الشاليه الذي تختاره" : "Set by the chalet you choose",
            },
            monthlyRow,
          ];
  const total = choice === "cash" ? cashPriceJd : basePriceJd;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <p className="section-eyebrow">{tc("financing")}</p>
        <h2 className="section-title">
          {isAr ? `شاليهك بأقساط ${pct(monthlyPct)} شهريًا.` : `Your chalet at ${monthlyPct}% a month.`}
        </h2>
        <p className="section-sub">
          {isAr
            ? `جميع الشاليهات بسعر ${n(basePriceJd)} ${jd}، تقسّطها ${pct(monthlyPct)} من السعر شهريًا (${n(monthlyJd)} ${jd})، بدفعة أولى أو بدونها حسب الشاليه الذي تختاره. أو ادفع كامل المبلغ نقدًا واحصل على خصم ${pct(cashDiscountPct)}. تختار شاليهك عند زيارتك لمكتب المبيعات.`
            : `Every chalet is ${n(basePriceJd)} ${jd}. Pay ${monthlyPct}% of the price a month (${n(monthlyJd)} ${jd}), with or without a down payment depending on the chalet you choose. Or pay in full and get ${cashDiscountPct}% off. You pick your chalet when you visit our sales office.`}
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
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
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
                <span className={`font-display block text-2xl font-bold tabular-nums md:text-3xl${r.accent ? " text-accent" : ""}`}>
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
                {isAr ? "التسليم حسب الشاليه" : "Handover depends on the chalet"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
