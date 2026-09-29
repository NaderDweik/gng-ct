/**
 * The offer, as the sales office states it: every chalet is one price, paid
 * either in monthly installments of 1% of the price, or in cash at a discount.
 * Whether there is a down payment (and how much) depends on the chalet chosen.
 */

export const basePriceJd = 168000;
export const monthlyPct = 1;
export const monthlyJd = (basePriceJd * monthlyPct) / 100; // 1,680
export const cashDiscountPct = 24;
export const cashPriceJd = (basePriceJd * (100 - cashDiscountPct)) / 100; // 127,680

/** A payment choice carried to /register as ?plan=… */
export type PlanChoice = "installments" | "cash";

export const isPlanChoice = (v: string | null | undefined): v is PlanChoice =>
  v === "installments" || v === "cash";
