import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, pricingPlans } from "@/content/pricing";
import { formatNumber } from "@/lib/format";

type Props = { locale: string; jd: string };

export function PlanCompare({ locale, jd }: Props) {
  const isAr = locale === "ar";
  const pct = (n: number) => (isAr ? `${formatNumber(n, locale)}٪` : `${n}%`);
  const year = (n: number) => formatNumber(n, locale).replace(/[٬,]/g, "");

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {pricingPlans.map((p) => {
        const remaining = basePriceJd - p.downJd;
        const months = Math.ceil(remaining / p.monthlyFromJd);
        return (
          <article key={p.id} className="plan-card group">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                  {isAr ? "الاستلام" : "Move-in"}
                </p>
                <p className="font-display mt-1 text-4xl font-bold leading-none text-primary-ink tabular-nums">
                  {year(p.moveIn)}
                </p>
              </div>
              <span className="pricing-chip">{isAr ? p.labelAr : p.labelEn}</span>
            </div>

            <div className="mt-8">
              <p className="text-sm text-muted">{isAr ? "الدفعة الأولى" : "Down payment"}</p>
              <p className="font-display mt-1 flex items-baseline gap-2 text-3xl font-bold text-ink">
                <span className="tabular-nums">{formatNumber(p.downJd, locale)}</span>
                <span className="text-sm font-medium text-muted">{jd}</span>
                <span className="ms-auto text-base font-bold text-primary-ink">{pct(p.downPct)}</span>
              </p>
              <div className="plan-bar mt-4" aria-hidden>
                <span style={{ width: `${p.downPct}%` }} />
              </div>
            </div>

            <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{isAr ? "القسط الشهري من" : "Monthly from"}</dt>
                <dd className="font-bold text-ink tabular-nums">{formatNumber(p.monthlyFromJd, locale)} {jd}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{isAr ? "المدة حتى" : "Up to"}</dt>
                <dd className="font-bold text-ink tabular-nums">
                  {formatNumber(months, locale)} {isAr ? "شهرًا" : "months"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{isAr ? "المتبقي" : "Balance"}</dt>
                <dd className="font-bold text-ink tabular-nums">{formatNumber(remaining, locale)} {jd}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{isAr ? "الفوائد" : "Interest"}</dt>
                <dd className="font-bold text-primary-ink">{pct(0)}</dd>
              </div>
            </dl>

            <Link href="/register" className="plan-card-cta">
              {isAr ? "اختر هذه الخطة" : "Choose this plan"}
              <span className="arrow" aria-hidden />
            </Link>
          </article>
        );
      })}

      <article className="plan-card plan-card--cash">
        <div className="pricing-card-glow" aria-hidden />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-dark-muted">
                {isAr ? "الدفع النقدي" : "Cash"}
              </p>
              <p className="font-display mt-1 text-4xl font-bold leading-none text-accent">
                −{pct(cashDiscountPct)}
              </p>
            </div>
            <span className="pricing-chip pricing-chip--accent">{isAr ? "استلام فوري" : "Immediate"}</span>
          </div>

          <div className="mt-8">
            <p className="text-sm text-on-dark-muted">{isAr ? "تدفع" : "You pay"}</p>
            <p className="font-display mt-1 flex items-baseline gap-2 text-3xl font-bold text-on-dark">
              <span className="tabular-nums">{formatNumber(cashPriceJd, locale)}</span>
              <span className="text-sm font-medium text-on-dark-muted">{jd}</span>
            </p>
            <p className="mt-3 text-sm text-on-dark-subtle line-through tabular-nums">
              {formatNumber(basePriceJd, locale)} {jd}
            </p>
          </div>

          <dl className="mt-8 space-y-3 border-t border-line-on-dark pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-on-dark-muted">{isAr ? "التوفير" : "You save"}</dt>
              <dd className="font-bold text-accent tabular-nums">
                {formatNumber(basePriceJd - cashPriceJd, locale)} {jd}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-on-dark-muted">{isAr ? "الأقساط" : "Installments"}</dt>
              <dd className="font-bold text-on-dark">{isAr ? "لا يوجد" : "None"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-on-dark-muted">{isAr ? "سند الملكية" : "Title deed"}</dt>
              <dd className="font-bold text-on-dark">{isAr ? "مستقل باسمك" : "Independent"}</dd>
            </div>
          </dl>

          <Link href="/register" className="plan-card-cta plan-card-cta--light">
            {isAr ? "احجز نقدًا" : "Reserve with cash"}
            <span className="arrow" aria-hidden />
          </Link>
        </div>
      </article>
    </div>
  );
}
