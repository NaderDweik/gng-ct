/*
 * Register-interest lead: the shape the form posts and the validation both sides run.
 * The client checks first for instant feedback; /api/register re-checks everything,
 * since a bot can skip the browser entirely.
 */
import { toPlanChoice, type PlanChoice } from "@/content/pricing";

export type Interest = "financing" | "visit";
export type TimeSlot = "morning" | "afternoon" | "evening";
export type LeadField = "name" | "phone" | "message";

export type LeadPayload = {
  name: string;
  phone: string;
  message: string;
  interest: Interest;
  time: TimeSlot;
  plan: PlanChoice | null;
  locale: "ar" | "en";
  /** Honeypot. Must arrive empty. */
  company_website: string;
  /** ms the form was open before submitting. */
  elapsedMs: number;
  /** Cloudflare Turnstile token, when the widget is enabled. */
  turnstileToken?: string;
};

export const MIN_FILL_MS = 3000;
export const MESSAGE_MAX = 500;
export const NAME_MAX = 60;
export const PHONE_MAX = 20;

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|xyz|top|info|biz|click|link)\b)/i;
// Arabic and Latin letters, spaces, apostrophes, dots and hyphens; 2 to 60 characters.
const NAME_RE = /^[\p{Script=Arabic}\p{Script=Latin}][\p{Script=Arabic}\p{Script=Latin}\s'.-]{1,59}$/u;

export const toLatinDigits = (v: string) =>
  v.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export const cleanName = (v: string) => v.trim().replace(/\s+/g, " ");

/** Digits only, international form without "+" (e.g. 962791234567), or null if invalid. */
export function normalizePhone(raw: string): string | null {
  const v = toLatinDigits(raw).replace(/[\s()-]/g, "");
  if (!/^\+?\d+$/.test(v)) return null;
  const intl = v.startsWith("+") || v.startsWith("00");
  const digits = v.replace(/^\+|^00/, "");
  // Jordanian mobiles: 07X…, 7X…, 9627X…
  const jo = digits.match(/^(?:962|0)?(7[789]\d{7})$/);
  if (jo) return `962${jo[1]}`;
  if (!intl || /^(\d)\1+$/.test(digits)) return null;
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

const msgs = {
  name: { ar: "يرجى إدخال اسم صحيح (أحرف فقط).", en: "Please enter a real name (letters only)." },
  phone: {
    ar: "يرجى إدخال رقم هاتف صحيح، مثال: 0791234567",
    en: "Please enter a valid phone number, e.g. +962 79 123 4567",
  },
  long: { ar: `الحد الأقصى ${MESSAGE_MAX} حرف.`, en: `Keep it under ${MESSAGE_MAX} characters.` },
  link: { ar: "يرجى عدم إضافة روابط في الرسالة.", en: "Please don't include links in the message." },
};

export function validateLead(
  v: Pick<LeadPayload, "name" | "phone" | "message">,
  locale: "ar" | "en",
): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};
  if (!NAME_RE.test(cleanName(v.name))) errors.name = msgs.name[locale];
  if (v.phone.length > PHONE_MAX || !normalizePhone(v.phone)) errors.phone = msgs.phone[locale];
  if (v.message.length > MESSAGE_MAX) errors.message = msgs.long[locale];
  else if (LINK_RE.test(v.message)) errors.message = msgs.link[locale];
  return errors;
}

/** Coerce an untrusted JSON body into a LeadPayload, or null if the shape is wrong. */
export function parseLead(body: unknown): LeadPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string) : "");
  const interest = str("interest");
  const time = str("time");
  const locale = str("locale");
  if (interest !== "financing" && interest !== "visit") return null;
  if (time !== "morning" && time !== "afternoon" && time !== "evening") return null;
  if (locale !== "ar" && locale !== "en") return null;
  return {
    name: str("name"),
    phone: str("phone"),
    message: str("message"),
    interest,
    time,
    plan: toPlanChoice(str("plan")),
    locale,
    company_website: str("company_website"),
    elapsedMs: typeof b.elapsedMs === "number" ? b.elapsedMs : 0,
    turnstileToken: str("turnstileToken") || undefined,
  };
}
