/*
 * Sales-office visit request: the checks the form runs before it hands the lead to WhatsApp.
 */

import { countries, type CountryIso } from "@/content/countries";

export type LeadField = "name" | "phone" | "slot" | "message";

/** `phone` is the number as typed, without the country code; `slot` is the chosen hour, if any. */
export type Lead = { name: string; country: CountryIso; phone: string; slot: string | null; message: string };

export const MESSAGE_MAX = 500;
export const NAME_MAX = 60;
export const PHONE_MAX = 20;

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|xyz|top|info|biz|click|link)\b)/i;
// Arabic and Latin letters, spaces, apostrophes, dots and hyphens; 2 to 60 characters.
const NAME_RE = /^[\p{Script=Arabic}\p{Script=Latin}][\p{Script=Arabic}\p{Script=Latin}\s'.-]{1,59}$/u;

export const toLatinDigits = (v: string) =>
  v.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

export const cleanName = (v: string) => v.trim().replace(/\s+/g, " ");

const dialOf = (iso: CountryIso) => countries.find((c) => c.iso === iso)?.dial ?? "";

/**
 * The number in international form, digits only (e.g. 962791234567), or null if invalid.
 * A leading 0 (trunk prefix) is dropped. Jordanian numbers must be mobiles (07X…).
 */
export function normalizePhone(country: CountryIso, raw: string): string | null {
  const local = toLatinDigits(raw).replace(/[\s()-]/g, "").replace(/^0+/, "");
  if (!/^\d+$/.test(local) || /^(\d)\1+$/.test(local)) return null;
  if (country === "JO") return /^7[789]\d{7}$/.test(local) ? `962${local}` : null;
  return local.length >= 6 && local.length <= 12 ? `${dialOf(country)}${local}` : null;
}

/**
 * A pasted "+9627…" / "009627…" number: the country it starts with (keeping `current` when
 * several share the code, e.g. +1) and the rest. Null when it has no international prefix.
 */
export function splitInternational(raw: string, current: CountryIso): { country: CountryIso; rest: string } | null {
  const v = toLatinDigits(raw).replace(/[\s()-]/g, "");
  if (!/^(\+|00)\d/.test(v)) return null;
  const digits = v.replace(/^\+|^00/, "");
  const match = countries
    .filter((c) => digits.startsWith(c.dial))
    .sort((a, b) => b.dial.length - a.dial.length || (a.iso === current ? -1 : b.iso === current ? 1 : 0))[0];
  return match ? { country: match.iso, rest: digits.slice(match.dial.length) } : null;
}

const msgs = {
  name: { ar: "يرجى إدخال اسم صحيح (أحرف فقط).", en: "Please enter a real name (letters only)." },
  phone: {
    ar: "يرجى إدخال رقم هاتف صحيح، مثال: 0791234567",
    en: "Please enter a valid phone number, e.g. 79 123 4567",
  },
  slot: { ar: "يرجى اختيار يوم وساعة متاحين للزيارة.", en: "Please choose an available day and hour for your visit." },
  long: { ar: `الحد الأقصى ${MESSAGE_MAX} حرف.`, en: `Keep it under ${MESSAGE_MAX} characters.` },
  link: { ar: "يرجى عدم إضافة روابط في الرسالة.", en: "Please don't include links in the message." },
};

export function validateLead(
  v: Lead,
  locale: "ar" | "en",
): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};
  if (!NAME_RE.test(cleanName(v.name))) errors.name = msgs.name[locale];
  if (v.phone.length > PHONE_MAX || !normalizePhone(v.country, v.phone)) errors.phone = msgs.phone[locale];
  if (!v.slot) errors.slot = msgs.slot[locale];
  if (v.message.length > MESSAGE_MAX) errors.message = msgs.long[locale];
  else if (LINK_RE.test(v.message)) errors.message = msgs.link[locale];
  return errors;
}
