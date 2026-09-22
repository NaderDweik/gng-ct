"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pricingPlans, basePriceJd, cashPriceJd, cashDiscountPct } from "@/content/pricing";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";

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
                ? "border-brand bg-brand-secondary"
                : "border-line bg-surface hover:border-brand/50"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-brand">
                {isAr ? p.labelAr : p.labelEn}
              </h3>
              <span className="text-sm text-muted">
                {t("moveIn")} {p.moveIn}
              </span>
            </div>
            <p className="mt-2 text-brand font-semibold">
              {p.downPct}% · {formatNumber(p.downJd, locale)} {tc("jd")}
            </p>
            <p className="mt-1 text-sm text-muted">
              {t("monthly")} {formatNumber(p.monthlyFromJd, locale)} {tc("jd")}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-dark p-8 text-white">
        <p className="text-sm text-accent">{t("calculatorTitle")}</p>
        <p className="mt-2 text-neutral-400 text-sm">{t("calculatorHint")}</p>
        <p className="mt-8 text-sm text-neutral-400">{t("basePrice")}</p>
        <p className="text-3xl font-bold">
          {formatNumber(basePriceJd, locale)} {tc("jd")}
        </p>
        <div className="mt-8 grid gap-4 border-t border-white/15 pt-6">
          <div>
            <p className="text-sm text-neutral-400">{t("downPayment")}</p>
            <p className="text-2xl font-semibold text-accent">
              {formatNumber(plan.downJd, locale)} {tc("jd")}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">{t("monthly")}</p>
            <p className="text-xl">
              {formatNumber(plan.monthlyFromJd, locale)} {tc("jd")}
            </p>
          </div>
          <p className="text-sm text-neutral-300">
            {site.copyBank[isAr ? "ar" : "en"].zeroInterest}
          </p>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-sm text-accent">{t("cashTitle")}</p>
          <p className="mt-2 text-2xl font-bold">
            {formatNumber(cashPriceJd, locale)} {tc("jd")}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            {cashDiscountPct}% — {t("cashDesc")}
          </p>
        </div>

        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-accent mt-8 w-full"
        >
          {tc("whatsapp")}
        </a>
      </div>
    </div>
  );
}
