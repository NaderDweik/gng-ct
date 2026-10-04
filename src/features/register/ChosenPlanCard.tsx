"use client";

import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, monthlyJd, monthlyPct, pricingPlans } from "@/content/pricing";
import { formatNumber } from "@/lib/format";
import { usePlanChoice } from "@/features/register/usePlanChoice";

/*
 * Register page, dark side card. With ?plan=… it shows the plan the visitor
 * chose on a plan card; with no choice it renders nothing.
 * (Uses the existing .register-side--dark card styles.)
 */

type Props = { locale: string; jd: string };

export function ChosenPlanCard({ locale, jd }: Props) {
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => (isAr ? `${n(v)}٪` : `${v}%`);
  const choice = usePlanChoice();
  const plan = pricingPlans.find((p) => p.id === choice);

  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="text-sm text-on-dark-muted">{k}</dt>
      <dd className="font-bold text-on-dark tabular-nums">{v}</dd>
    </div>
  );

  const eyebrow = (text: string) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{text}</p>
  );

  const change = (
    <Link
      href="/financing#plans"
      className="mt-4 inline-block text-sm font-semibold text-on-dark underline decoration-white/35 underline-offset-4 hover:decoration-white"
    >
      {isAr ? "تغيير الخطة" : "Change plan"}
    </Link>
  );

  // Chosen: cash offer
  if (choice === "cash") {
    return (
      <div className="register-side register-side--dark" aria-live="polite">
        {eyebrow(isAr ? "خطتك المختارة" : "Your chosen plan")}
        <p className="font-display mt-2 text-2xl font-bold text-on-dark">
          {isAr ? `الدفع النقدي، خصم ${pct(cashDiscountPct)}` : `Cash, ${cashDiscountPct}% off`}
        </p>
        <p className="font-display mt-3 text-4xl font-bold leading-none text-on-dark tabular-nums">
          {n(cashPriceJd)}
          <span className="ms-2 text-sm font-medium text-on-dark-muted">{jd}</span>
        </p>
        <dl className="mt-4 border-t border-line-on-dark pt-3">
          <Row k={isAr ? "بدلًا من" : "Instead of"} v={`${n(basePriceJd)} ${jd}`} />
          <Row k={isAr ? "التوفير" : "You save"} v={`${n(basePriceJd - cashPriceJd)} ${jd}`} />
          <Row k={isAr ? "التسليم" : "Handover"} v={isAr ? "حسب الشاليه" : "Per chalet"} />
        </dl>
        {change}
      </div>
    );
  }

  // Chosen: an installment plan
  if (plan) {
    const noDown = plan.id === "noDown";
    return (
      <div className="register-side register-side--dark" aria-live="polite">
        {eyebrow(isAr ? "خطتك المختارة" : "Your chosen plan")}
        <p className="font-display mt-2 text-2xl font-bold text-on-dark">
          {isAr ? `التقسيط ${plan.labelAr}` : `Installments, ${plan.labelEn.toLowerCase()}`}
        </p>
        <p className="mt-3 text-sm text-on-dark-muted">{isAr ? "القسط الشهري" : "Monthly installment"}</p>
        <p className="font-display mt-1 text-4xl font-bold leading-none text-on-dark tabular-nums">
          {n(monthlyJd)}
          <span className="ms-2 text-sm font-medium text-on-dark-muted">
            {jd} · {pct(monthlyPct)}
          </span>
        </p>
        <dl className="mt-4 border-t border-line-on-dark pt-3">
          <Row k={isAr ? "سعر الشاليه" : "Chalet price"} v={`${n(basePriceJd)} ${jd}`} />
          <Row
            k={isAr ? "الدفعة الأولى" : "Down payment"}
            v={noDown ? `${n(0)} ${jd}` : isAr ? "حسب الشاليه" : "Per chalet"}
          />
          <Row k={isAr ? "التسليم" : "Handover"} v={isAr ? "حسب الشاليه" : "Per chalet"} />
        </dl>
        {change}
      </div>
    );
  }

  // No choice: nothing (the sales-office card leads the column).
  return null;
}
