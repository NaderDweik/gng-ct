"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pricingPlans, basePriceJd, cashPriceJd, cashDiscountPct } from "@/content/pricing";
import { site } from "@/content/site";

export function FinancingCalculator() {
  const t = useTranslations("financing");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";
  const [planId, setPlanId] = useState<(typeof pricingPlans)[number]["id"]>("immediate");

  const plan = useMemo(
    () => pricingPlans.find((p) => p.id === planId) ?? pricingPlans[0],
    [planId],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        {pricingPlans.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlanId(p.id)}
            className={`w-full border p-5 text-start transition ${
              planId === p.id
                ? "border-terracotta bg-sand/60"
                : "border-sand-deep bg-surface hover:border-terracotta/50"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-navy">
                {isAr ? p.labelAr : p.labelEn}
              </h3>
              <span className="text-sm text-muted">
                {t("moveIn")} {p.moveIn}
              </span>
            </div>
            <p className="mt-2 text-terracotta font-semibold">
              {p.downPct}% · {p.downJd.toLocaleString(locale)} {tc("jd")}
            </p>
            <p className="mt-1 text-sm text-muted">
              {t("monthly")} {p.monthlyFromJd.toLocaleString(locale)} {tc("jd")}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-navy p-8 text-cream">
        <p className="text-sm text-gold">{t("calculatorTitle")}</p>
        <p className="mt-2 text-sand-deep text-sm">{t("calculatorHint")}</p>
        <p className="mt-8 text-sm text-sand-deep">{t("basePrice")}</p>
        <p className="text-3xl font-bold">
          {basePriceJd.toLocaleString(locale)} {tc("jd")}
        </p>
        <div className="mt-8 grid gap-4 border-t border-white/15 pt-6">
          <div>
            <p className="text-sm text-sand-deep">{t("downPayment")}</p>
            <p className="text-2xl font-semibold text-gold">
              {plan.downJd.toLocaleString(locale)} {tc("jd")}
            </p>
          </div>
          <div>
            <p className="text-sm text-sand-deep">{t("monthly")}</p>
            <p className="text-xl">
              {plan.monthlyFromJd.toLocaleString(locale)} {tc("jd")}
            </p>
          </div>
          <p className="text-sm text-sand">
            {site.copyBank[isAr ? "ar" : "en"].zeroInterest}
          </p>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-sm text-gold">{t("cashTitle")}</p>
          <p className="mt-2 text-2xl font-bold">
            {cashPriceJd.toLocaleString(locale)} {tc("jd")}
          </p>
          <p className="mt-1 text-sm text-sand-deep">
            {cashDiscountPct}% — {t("cashDesc")}
          </p>
        </div>

        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-8 w-full bg-gold text-navy hover:bg-cream"
        >
          {tc("whatsapp")}
        </a>
      </div>
    </div>
  );
}
