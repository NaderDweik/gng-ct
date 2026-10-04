/*
 * One price for every chalet, and two ways to pay:
 *   - installments: a down payment the buyer chooses, then 1% of the price a month.
 *     The bigger the down payment, the sooner the chalet is handed over. Amounts and
 *     handover dates aren't published; they're agreed at the sales office.
 *   - cash: the full price at a discount.
 */
export const basePriceJd = 168000;
export const monthlyPct = 1;
export const monthlyJd = (basePriceJd * monthlyPct) / 100;
export const cashDiscountPct = 24;
export const cashPriceJd = basePriceJd - (basePriceJd * cashDiscountPct) / 100;

/** A plan choice carried to /register as ?plan=… */
export type PlanChoice = "installments" | "cash";

/** Reads ?plan=… (older links used withDown / noDown: both are installments now). */
export function toPlanChoice(v: string | null | undefined): PlanChoice | null {
  if (v === "cash") return "cash";
  if (v === "installments" || v === "withDown" || v === "noDown") return "installments";
  return null;
}
