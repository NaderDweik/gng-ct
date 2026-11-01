/*
 * Sending a visit request, shared by the /register form (RegisterForm.tsx) and the chat
 * assistant's booking flow (components/chatbot/chat-booking.ts), so both reach the sales team
 * the same way: a row in the «طلبات الزيارة» Google Sheet and a WhatsApp message.
 */

import { site } from "@/content/site";
import { countries, type CountryIso } from "@/content/countries";
import { visitRequestsWebAppUrl } from "@/content/sheets";
import { normalizePhone } from "@/features/register/leadRules";
import { dayLabel, hourLabel, type VisitDay } from "@/features/register/VisitPicker";

export type VisitRequest = {
  name: string;
  country: CountryIso;
  /** As typed, without the country code. */
  phone: string;
  day: VisitDay | null;
  hour: number | null;
  chalet?: string | null;
  message: string;
  /** Spam trap value (empty for people). */
  website?: string;
};

const fullPhone = (r: VisitRequest) => {
  const full = normalizePhone(r.country, r.phone);
  return full ? `+${full}` : r.phone.trim();
};

/** Adds the request to the «طلبات الزيارة» Google Sheet (content/sheets.ts), in Arabic, in the
 *  background: it never holds up WhatsApp, and a failure doesn't reach the visitor.
 *  `page` says where it came from (the form's source page, or "chatbot …"). */
export function saveVisitRequest(r: VisitRequest, { locale, page }: { locale: string; page: string }) {
  if (!visitRequestsWebAppUrl) return;
  const c = countries.find((x) => x.iso === r.country);
  const body = {
    name: r.name.trim(),
    phone: fullPhone(r),
    country: c ? c.ar : r.country,
    day: r.day ? dayLabel(r.day.date, "ar") : "",
    time: r.hour !== null ? hourLabel(r.hour, "ar") : "",
    chalet: r.chalet ?? "",
    message: r.message.trim(),
    language: locale === "ar" ? "العربية" : "الإنجليزية",
    page,
    website: r.website ?? "",
  };
  // text/plain keeps it a "simple" request (no CORS preflight, which Apps Script can't answer);
  // no-cors because the reply isn't needed; keepalive so it still goes if WhatsApp takes over.
  fetch(visitRequestsWebAppUrl, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

/** wa.me chat with the sales number, the visit request already typed in. */
export function visitWhatsAppUrl(r: VisitRequest, locale: string) {
  const isAr = locale === "ar";
  const when = r.day && r.hour !== null ? `${dayLabel(r.day.date, locale)}، ${hourLabel(r.hour, locale)}` : "";

  // No heading line, and the place is the compound itself, not the sales office (Oct 2026).
  const text = [
    `${isAr ? "الاسم" : "Name"}: ${r.name.trim()}`,
    `${isAr ? "الهاتف" : "Phone"}: ${fullPhone(r)}`,
    r.chalet ? `${isAr ? "الشاليه" : "Chalet"}: ${r.chalet}` : "",
    `${isAr ? "موعد الزيارة" : "Visit"}: ${isAr ? when : when.replace("،", ",")}`,
    `${isAr ? "المكان" : "Place"}: ${isAr ? "كمباوند شاليهات روح العطاء، عمّان، الأردن" : "Giving Compound chalets, Amman, Jordan"}`,
    r.message.trim() ? `${isAr ? "الرسالة" : "Message"}: ${r.message.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${site.whatsappUrl}?text=${encodeURIComponent(text)}`;
}
