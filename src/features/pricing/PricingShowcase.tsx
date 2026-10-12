"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, monthlyJd, monthlyPct, type PlanChoice } from "@/content/pricing";
import { formatNumber } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/*
 * Financing, said plainly (styles: styles/sections/pricing.css). A dark panel: the pitch on
 * the start side with one card per way to pay underneath (its headline figure, then the
 * numbers that follow from it), and the chalet price with the register CTA on the end side.
 * Installments: a down payment the buyer chooses, then 1% of the price a month; the bigger
 * the down payment, the sooner the handover. Cash: the full price at a discount. Amounts
 * and dates are agreed at the sales office, so the cards show the rule, not a table.
 */

type Plan = {
  id: PlanChoice;
  name: string;
  figure: string;
  caption: string;
  rows: { k: string; v: string; accent?: boolean; total?: boolean }[];
  note: string;
  cta: string;
};

export function PricingShowcase() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const tc = useTranslations("common");
  const jd = tc("jd");
  const n = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => `${n(v)}${isAr ? "٪" : "%"}`;


  const plans: Plan[] = [
    {
      id: "installments",
      name: isAr ? "بالتقسيط" : "Installments",
      figure: pct(monthlyPct),
      caption: isAr ? "شهريًا" : "a month",
      rows: [
        { k: isAr ? "الدفعة الأولى" : "Down payment", v: isAr ? "تختار قيمتها" : "You choose" },
        { k: isAr ? "كل شهر" : "Every month", v: `${n(monthlyJd)} ${jd}`, accent: true },
        { k: isAr ? "المجموع، بدون فوائد" : "Total, zero interest", v: `${n(basePriceJd)} ${jd}`, total: true },
      ],
      note: isAr
        ? "كلما زادت دفعتك الأولى، استلمت شاليهك أسرع."
        : "The bigger your down payment, the sooner your chalet is handed over.",
      cta: isAr ? "اختر التقسيط" : "Choose installments",
    },
    {
      id: "cash",
      name: isAr ? "نقدًا" : "Cash",
      figure: pct(cashDiscountPct),
      caption: isAr ? "خصم" : "off",
      rows: [
        { k: isAr ? "توفّر" : "You save", v: `${n(basePriceJd - cashPriceJd)} ${jd}`, accent: true },
        { k: isAr ? "الدفعات" : "Payments", v: isAr ? "دفعة واحدة" : "One" },
        { k: isAr ? "المجموع" : "Total", v: `${n(cashPriceJd)} ${jd}`, total: true },
      ],
      note: isAr ? "موعد التسليم حسب الشاليه الذي تختاره." : "Handover depends on the chalet you choose.",
      cta: isAr ? "اختر الدفع النقدي" : "Choose cash",
    },
  ];

  return (
    <div className="fin">
      <div className="fin-head">
        <p className="fin-badge">{tc("financing")}</p>
        <h2 className="fin-title">{isAr ? "طريقتان لتملّك شاليهك." : "Two ways to own your chalet."}</h2>
        <p className="fin-lead">
          {isAr
            ? `جميع الشاليهات بسعر ${n(basePriceJd)} ${jd}، بتمويل مباشر من الشركة وبدون فوائد. قسّط شاليهك أو ادفع نقدًا بخصم ${pct(cashDiscountPct)}، ونتفق معك على الدفعة الأولى وموعد الاستلام عند زيارتك لمكتب المبيعات.`
            : `Every chalet is ${n(basePriceJd)} ${jd}, financed directly by the developer with zero interest. Pay in installments, or pay cash and save ${cashDiscountPct}%. We agree the down payment and handover date with you at our sales office.`}
        </p>
      </div>

      <div className="fin-cards">
        {plans.map((p) => (
          <article key={p.id} className="fin-plan">
            <p className="fin-plan-name">{p.name}</p>
            <p className="fin-plan-figure">
              {p.figure}
              <small>{p.caption}</small>
            </p>
            <dl className="fin-plan-rows">
              {p.rows.map((r) => (
                <div key={r.k} className={`fin-plan-row${r.total ? " is-total" : ""}`}>
                  <dt>{r.k}</dt>
                  <dd className={r.accent ? "is-accent" : undefined}>{r.v}</dd>
                </div>
              ))}
            </dl>
            <p className="fin-plan-note">{p.note}</p>
            <Link href="/register" className="fin-plan-cta">
              {p.cta}
              <ArrowIcon />
            </Link>
          </article>
        ))}

        <div className="fin-price">
          <p className="fin-price-label">{isAr ? "سعر كل شاليه" : "Every chalet"}</p>
          <p className="fin-price-figure">
            {n(basePriceJd)} <small>{jd}</small>
          </p>
          <p className="fin-price-tag">{isAr ? "بدون فوائد · مباشرة مع الشركة" : "Zero interest · Direct with the developer"}</p>
          <p className="fin-price-text">
            {isAr
              ? "بدون بنوك أو وسطاء. سند ملكية مستقل باسمك."
              : "No banks, no brokers. An independent title deed in your name."}
          </p>
          <Link href="/register" className="btn btn-primary fin-price-btn">
            {tc("register")}
          </Link>
        </div>
      </div>
    </div>
  );
}
