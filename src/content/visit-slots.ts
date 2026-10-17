/**
 * Sales-office visit times for /register (features/register/VisitPicker.tsx).
 * Visits run Saturday to Thursday (Friday closed), on the hour from 10 am to 6 pm.
 * The form offers the next six working days, starting tomorrow.
 *
 * Availability is the client's weekly table (handwritten, 2026-10-17): the same booked
 * hours every week, by weekday. To change it:
 *   - `bookedByWeekday`: the weekly pattern;
 *   - `bookedByDate`: one-off changes for a given date ("2026-10-18": [15, 16]), which
 *     replace that day's weekly pattern;
 *   - `closedDates`: whole days booked.
 * Booked days and hours show as «محجوز» / "Booked"; the rest as «متاح» / "Available".
 */

/** 24-hour clock, one visit slot each: 10 am … 6 pm (the table's columns). */
export const visitHours = [10, 11, 12, 13, 14, 15, 16, 17, 18] as const;

/** JS weekday numbers (0 = Sunday); Friday (5) is closed. */
export const visitWeekdays = [6, 0, 1, 2, 3, 4] as const;

/** How many upcoming working days the form offers. */
export const visitDaysAhead = 6;

/** Booked hours each week, by JS weekday (0 = Sunday … 6 = Saturday). */
export const bookedByWeekday: Record<number, number[]> = {
  6: [10, 11, 14, 16, 18], // Saturday
  0: [12, 13, 15, 17], // Sunday
  1: [10, 15, 16], // Monday
  2: [10, 11, 12, 14, 17], // Tuesday
  3: [10, 12, 15], // Wednesday
  4: [10, 11, 12, 14, 16], // Thursday
};

export const bookedByDate: Record<string, number[]> = {};

export const closedDates: string[] = [];

export const visitSlotsCopy = {
  ar: { available: "متاح", booked: "محجوز", prevDays: "الأيام السابقة", nextDays: "الأيام التالية" },
  en: { available: "Available", booked: "Booked", prevDays: "Earlier days", nextDays: "Later days" },
} as const;
