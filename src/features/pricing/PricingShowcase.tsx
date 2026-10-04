"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, monthlyJd, monthlyPct, toPlanChoice, type PlanChoice } from "@/content/pricing";
import { formatNumber } from "@/lib/format";

/*
 * Financing, said plainly: one price for every chalet and two ways to pay.
 * Installments — a down payment the buyer chooses, then 1% of the price a month;
 * the bigger the down payment, the sooner the handover.
 * Cash — the full price at a discount. Amounts and dates are agreed at the
 * sales office, so the card shows the rule, not a table.
 */
export function PricingShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const tc = useTranslations("common");
  const jd = tc("jd");
  const n = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => `${n(v)}${isAr ? "٪" : "%"}`;

  const [choice, setChoice] = useState<PlanChoice>("installments");

  // Deep link: /financing?plan=cash (or plan=installments).
  useEffect(() => {
    const wanted = toPlanChoice(new URLSearchParams(window.location.search).get("plan"));
    if (wanted) setChoice(wanted);
  }, []);

  // Each option's headline figure sits large in the tab's corner and lights up when chosen.
  const options: { id: PlanChoice; label: string; figure: string; caption: string }[] = [
    { id: "installments", label: isAr ? "دفعة أولى" : "Down payment", figure: pct(monthlyPct), caption: isAr ? "شهريًا" : "a month" },
    { id: "cash", label: isAr ? "نقدًا" : "Cash", figure: pct(cashDiscountPct), caption: isAr ? "خصم" : "off" },
  ];

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
      : [
          {
            label: isAr ? "الدفعة الأولى" : "Down payment",
            value: isAr ? "تختار قيمتها" : "You choose",
            note: isAr ? "نتفق عليها معك في مكتب المبيعات" : "Agreed with you at the sales office",
          },
          {
            label: isAr ? "ثم كل شهر" : "Then every month",
            value: `${n(monthlyJd)} ${jd}`,
            note: isAr ? `${pct(monthlyPct)} من السعر` : `${monthlyPct}% of the price`,
            accent: true,
          },
        ];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <p className="section-eyebrow">{tc("financing")}</p>
        <h2 className="section-title">{isAr ? "طريقتان لتملّك شاليهك." : "Two ways to own your chalet."}</h2>
        <p className="section-sub">
          {isAr
            ? `جميع الشاليهات بسعر ${n(basePriceJd)} ${jd}. قسّط شاليهك بدفعة أولى تختار قيمتها، ثم ${pct(monthlyPct)} من السعر شهريًا (${n(monthlyJd)} ${jd})، وكلما زادت دفعتك الأولى استلمت شاليهك أسرع. أو ادفع نقدًا ووفّر ${pct(cashDiscountPct)}. قيمة الدفعة وموعد الاستلام نتفق عليهما معك عند زيارتك لمكتب المبيعات.`
            : `Every chalet is ${n(basePriceJd)} ${jd}. Pay in installments: a down payment you choose, then ${monthlyPct}% of the price a month (${n(monthlyJd)} ${jd}). The bigger your down payment, the sooner your chalet is handed over. Or pay cash and save ${cashDiscountPct}%. We agree the down payment and handover date with you at our sales office.`}
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
          className="pricing-tabs mt-4"
          data-on={choice}
        >
          {/* The white panel behind the chosen tab; it glides when the choice changes. */}
          <span className="pricing-plan-thumb" aria-hidden />
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={choice === o.id}
              onClick={() => setChoice(o.id)}
              className={`pricing-plan-tab${choice === o.id ? " is-active" : ""}`}
            >
              <span className="pricing-plan-tab-figure" aria-hidden>
                {o.figure}
                <small>{o.caption}</small>
              </span>
              <span className="pricing-plan-tab-label">{o.label}</span>
              <span className="sr-only">
                {o.figure} {o.caption}
              </span>
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
                {n(choice === "cash" ? cashPriceJd : basePriceJd)} {jd}
              </span>
              <span className="mt-1 block text-sm text-on-dark-muted">
                {choice === "cash"
                  ? isAr ? "التسليم حسب الشاليه" : "Handover depends on the chalet"
                  : isAr ? "سعر الشاليه، بدون فوائد" : "The chalet price, zero interest"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
