"use client";

import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, monthlyJd, monthlyPct } from "@/content/pricing";
import { formatNumber } from "@/lib/format";
import { usePlanChoice } from "@/features/register/usePlanChoice";

/*
 * Register page, dark side card. With ?plan=installments|cash it shows the
 * payment choice made on the offer block; otherwise the general price summary.
 * (Uses the existing .register-side--dark card styles.)
 */

type Props = { locale: string; jd: string; promises: string[] };

export function ChosenPlanCard({ locale, jd, promises }: Props) {
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => (isAr ? `${n(v)}٪` : `${v}%`);
  const choice = usePlanChoice();

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
        </dl>
        {change}
      </div>
    );
  }

  // Chosen: installments
  if (choice === "installments") {
    return (
      <div className="register-side register-side--dark" aria-live="polite">
        {eyebrow(isAr ? "خطتك المختارة" : "Your chosen plan")}
        <p className="font-display mt-2 text-2xl font-bold text-on-dark">
          {isAr ? `بالتقسيط، ${pct(monthlyPct)} شهريًا` : `Installments, ${monthlyPct}% a month`}
        </p>
        <p className="font-display mt-3 text-4xl font-bold leading-none text-on-dark tabular-nums">
          {n(monthlyJd)}
          <span className="ms-2 text-sm font-medium text-on-dark-muted">
            {jd} {isAr ? "شهريًا" : "/ month"}
          </span>
        </p>
        <dl className="mt-4 border-t border-line-on-dark pt-3">
          <Row k={isAr ? "سعر الشاليه" : "Chalet price"} v={`${n(basePriceJd)} ${jd}`} />
          <Row k={isAr ? "الدفعة الأولى" : "Down payment"} v={isAr ? "حسب الشاليه" : "Depends on the chalet"} />
        </dl>
        {change}
      </div>
    );
  }

  // No choice: the general summary
  return (
    <div className="register-side register-side--dark">
      {eyebrow(isAr ? "سعر الشاليه" : "Chalet price")}
      <p className="font-display mt-2 text-4xl font-bold leading-none text-on-dark tabular-nums">
        {n(basePriceJd)}
        <span className="ms-2 text-sm font-medium text-on-dark-muted">{jd}</span>
      </p>
      <p className="mt-2 text-sm text-on-dark-muted">
        {isAr
          ? `بالتقسيط ${pct(monthlyPct)} شهريًا، أو ${n(cashPriceJd)} د.أ كاش، خصم ${pct(cashDiscountPct)}`
          : `${monthlyPct}% a month, or ${n(cashPriceJd)} JD cash, ${cashDiscountPct}% off`}
      </p>
      <ul className="mt-5 space-y-2 border-t border-line-on-dark pt-4">
        {promises.map((line) => (
          <li key={line} className="flex items-start gap-3 text-sm text-on-dark-muted">
            <span className="mt-2 h-px w-4 shrink-0 bg-accent" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
