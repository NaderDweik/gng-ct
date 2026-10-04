/*
 * One price for every chalet. Installments are 1% of the price each month; whether there is
 * a down payment (and how much), and how long remains until handover, depend on the chalet
 * the buyer picks at the sales office — so the site doesn't list chalets or fixed plans.
 */
export const basePriceJd = 168000;
export const monthlyPct = 1;
export const monthlyJd = (basePriceJd * monthlyPct) / 100;
export const cashDiscountPct = 24;
export const cashPriceJd = basePriceJd - (basePriceJd * cashDiscountPct) / 100;

export const pricingPlans = [
  {
    id: "withDown",
    labelAr: "بدفعة أولى",
    labelEn: "With down payment",
  },
  {
    id: "noDown",
    labelAr: "بدون دفعة أولى",
    labelEn: "No down payment",
  },
] as const;

/** A plan choice carried to /register as ?plan=… ("cash" = the cash offer). */
export type PlanChoice = (typeof pricingPlans)[number]["id"] | "cash";

export const isPlanChoice = (v: string | null | undefined): v is PlanChoice =>
  v === "cash" || pricingPlans.some((p) => p.id === v);
