/*
 * POST /api/register: receives the register-interest form and forwards it as a WhatsApp
 * message to one sales number, through the WhatsApp Cloud API (Meta).
 *
 * Anti-bot / anti-spam, in order: honeypot, minimum fill time, Cloudflare Turnstile
 * (when configured), per-IP rate limit, field validation, per-phone duplicate window.
 * Bot rejections answer 200 { ok: true } so the bot learns nothing.
 *
 * Env (see .env.example): WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TO,
 * WHATSAPP_TEMPLATE, WHATSAPP_TEMPLATE_LANG, TURNSTILE_SECRET_KEY.
 * Without the WhatsApp vars it answers 503 and the form falls back to the wa.me link.
 */
import { NextResponse } from "next/server";
import { cashDiscountPct, cashPriceJd, monthlyJd } from "@/content/pricing";
import {
  MIN_FILL_MS,
  cleanName,
  normalizePhone,
  parseLead,
  validateLead,
  type LeadPayload,
} from "@/features/register/leadRules";

export const runtime = "nodejs";

const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60_000;
const PHONE_WINDOW_MS = 10 * 60_000;

// Best effort: lives per serverless instance. Good enough against casual floods; use a shared
// store (e.g. Upstash Redis) if the form ever gets hammered.
const ipHits = new Map<string, number[]>();
const phoneSeen = new Map<string, number>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 5000) ipHits.clear();
  return hits.length > IP_LIMIT;
}

function duplicate(phone: string) {
  const now = Date.now();
  const last = phoneSeen.get(phone);
  if (phoneSeen.size > 5000) phoneSeen.clear();
  if (last && now - last < PHONE_WINDOW_MS) return true;
  phoneSeen.set(phone, now);
  return false;
}

async function turnstileOk(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  }).catch(() => null);
  const data = (await res?.json().catch(() => null)) as { success?: boolean } | null;
  return !!data?.success;
}

const labels = {
  en: {
    financing: "Ask about financing",
    visit: "Site visit",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    cash: `Cash: ${cashPriceJd.toLocaleString("en-US")} JD (${cashDiscountPct}% off)`,
    installments: `Installments: down payment, then ${monthlyJd.toLocaleString("en-US")} JD a month`,
    none: "-",
    site: { ar: "Arabic", en: "English" },
  },
  ar: {
    financing: "استفسار عن التمويل",
    visit: "زيارة الموقع",
    morning: "صباحًا",
    afternoon: "بعد الظهر",
    evening: "مساءً",
    cash: `الدفع النقدي: ${cashPriceJd.toLocaleString("en-US")} د.أ (خصم ${cashDiscountPct}٪)`,
    installments: `التقسيط: دفعة أولى ثم ${monthlyJd.toLocaleString("en-US")} د.أ شهريًا`,
    none: "-",
    site: { ar: "العربية", en: "الإنجليزية" },
  },
};

// Template parameters may not contain newlines, tabs or 4+ spaces in a row.
const param = (text: string) => ({ type: "text", text: text.replace(/\s+/g, " ").trim() || "-" });

async function sendWhatsApp(lead: LeadPayload, phone: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO;
  const template = process.env.WHATSAPP_TEMPLATE ?? "register_interest";
  const lang = process.env.WHATSAPP_TEMPLATE_LANG === "ar" ? "ar" : "en";
  const version = process.env.WHATSAPP_API_VERSION ?? "v23.0";
  if (!token || !phoneId || !to) return "not_configured" as const;

  const L = labels[lang];
  // Template body, in this order:
  // {{1}} name · {{2}} phone · {{3}} interest · {{4}} plan · {{5}} preferred time ·
  // {{6}} message · {{7}} site language
  const parameters = [
    cleanName(lead.name),
    `+${phone}`,
    L[lead.interest],
    lead.plan ? L[lead.plan] : L.none,
    L[lead.time],
    lead.message.slice(0, 500),
    L.site[lead.locale],
  ].map(param);

  const res = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: { name: template, language: { code: lang }, components: [{ type: "body", parameters }] },
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("[register] WhatsApp send failed", res?.status, await res?.text().catch(() => ""));
    return "failed" as const;
  }
  return "sent" as const;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ok = NextResponse.json({ ok: true });

  if (Number(req.headers.get("content-length") ?? 0) > 8_000) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  const lead = parseLead(await req.json().catch(() => null));
  if (!lead) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  // Bots: answer as if it worked.
  if (lead.company_website || lead.elapsedMs < MIN_FILL_MS) return ok;

  if (rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  if (!(await turnstileOk(lead.turnstileToken, ip))) {
    return NextResponse.json({ error: "captcha" }, { status: 403 });
  }

  const errors = validateLead(lead, lead.locale);
  if (Object.keys(errors).length) return NextResponse.json({ error: "invalid", errors }, { status: 422 });

  const phone = normalizePhone(lead.phone)!;
  if (duplicate(phone)) return ok;

  const result = await sendWhatsApp(lead, phone);
  if (result === "sent") return ok;
  phoneSeen.delete(phone);
  return NextResponse.json({ error: result }, { status: result === "not_configured" ? 503 : 502 });
}
