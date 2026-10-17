/*
 * One price for every chalet, and two ways to pay:
 *   - installments: the monthly amount depends on the down payment and the duration the
 *     buyer chooses (no fixed monthly percentage is published). The bigger the down
 *     payment, the sooner the chalet is handed over. Agreed at the sales office.
 *   - cash: the full price at a discount (24% off, set by the client at 128,000 JD).
 */
export const basePriceJd = 168000;
export const cashDiscountPct = 24;
/** The client's cash price: 24% off, rounded to 128,000 JD (24% exactly would be 127,680). */
export const cashPriceJd = 128000;

/** The two ways to pay. */
export type PlanChoice = "installments" | "cash";
