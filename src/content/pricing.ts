/*
 * One price for every chalet, and two ways to pay:
 *   - installments: a down payment the buyer chooses, then 1% of the price a month.
 *     The bigger the down payment, the sooner the chalet is handed over. Amounts and
 *     handover dates aren't published; they're agreed at the sales office.
 *   - cash: the full price at a discount (24% off, set by the client at 128,000 JD).
 */
export const basePriceJd = 168000;
export const monthlyPct = 1;
export const monthlyJd = (basePriceJd * monthlyPct) / 100;
export const cashDiscountPct = 24;
/** The client's cash price: 24% off, rounded to 128,000 JD (24% exactly would be 127,680). */
export const cashPriceJd = 128000;

/** The two ways to pay. */
export type PlanChoice = "installments" | "cash";
