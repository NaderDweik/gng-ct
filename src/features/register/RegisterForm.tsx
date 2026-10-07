"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/content/site";
import { usePlanChoice } from "@/features/register/usePlanChoice";
import { cashDiscountPct, cashPriceJd, monthlyJd } from "@/content/pricing";
import { formatNumber } from "@/lib/format";
import {
  MESSAGE_MAX,
  NAME_MAX,
  PHONE_MAX,
  validateLead,
  type Interest,
  type LeadField,
  type TimeSlot,
} from "@/features/register/leadRules";

// Anti-bot / anti-spam: a hidden honeypot, the time the form was open, Cloudflare Turnstile
// (when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set) and a resend cooldown. /api/register
// re-checks all of it server-side and forwards the lead to the sales WhatsApp number.
const COOLDOWN_MS = 60_000;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "sending" | "sent" | "handoff";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

/** Cloudflare Turnstile widget. Usually invisible; shows a checkbox only to suspicious visitors. */
function useTurnstile(locale: string) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return;
    const el = ref.current;
    const w = window as unknown as { turnstile?: TurnstileApi };
    const render = () => {
      if (!w.turnstile || widget.current) return;
      widget.current = w.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        language: locale,
        appearance: "interaction-only",
        callback: setToken,
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    let script = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.dataset.turnstile = "";
      document.head.appendChild(script);
    }
    if (w.turnstile) render();
    else script.addEventListener("load", render);
    return () => {
      script?.removeEventListener("load", render);
      if (widget.current) w.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [locale]);

  const reset = () => {
    setToken("");
    const w = window as unknown as { turnstile?: TurnstileApi };
    if (widget.current) w.turnstile?.reset(widget.current);
  };

  return { ref, token, reset, enabled: !!TURNSTILE_SITE_KEY };
}

export function RegisterForm() {
  const t = useTranslations("register");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";
  const lang = isAr ? "ar" : "en";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState<TimeSlot>("morning");
  const [interest, setInterest] = useState<Interest>("financing");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [notice, setNotice] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const openedAt = useRef(0);
  const lastSentAt = useRef(0);
  const turnstile = useTurnstile(locale);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const interests: { id: Interest; labelAr: string; labelEn: string }[] = [
    {
      id: "financing",
      labelAr: "استفسار عن التمويل",
      labelEn: "Ask about financing",
    },
    {
      id: "visit",
      labelAr: "زيارة الموقع",
      labelEn: "Site visit",
    },
  ];

  const times: { id: TimeSlot; label: string }[] = [
    { id: "morning", label: t("morning") },
    { id: "afternoon", label: t("afternoon") },
    { id: "evening", label: t("evening") },
  ];

  // Plan picked on a plan card (?plan=…) — sent along so sales knows the choice.
  const chosen = usePlanChoice();
  const planText = (() => {
    if (!chosen) return "";
    if (chosen === "cash")
      return isAr
        ? `الدفع النقدي: ${formatNumber(cashPriceJd, locale)} د.أ (خصم ${formatNumber(cashDiscountPct, locale)}٪)`
        : `Cash: ${formatNumber(cashPriceJd, locale)} JD (${cashDiscountPct}% off)`;
    if (chosen !== "installments") return "";
    return isAr
      ? `التقسيط: دفعة أولى ثم ${formatNumber(monthlyJd, locale)} د.أ شهريًا`
      : `Installments: a down payment, then ${formatNumber(monthlyJd, locale)} JD a month`;
  })();

  /** Fallback when the WhatsApp API isn't configured or fails: the visitor sends it themselves. */
  function whatsAppHandoffUrl() {
    const timeLabel = times.find((x) => x.id === time)?.label ?? time;
    const interestLabel = interests.find((x) => x.id === interest);
    const interestText = interestLabel
      ? isAr
        ? interestLabel.labelAr
        : interestLabel.labelEn
      : interest;

    const text = [
      isAr ? "تسجيل اهتمام: Giving Compound" : "Register interest: Giving Compound",
      `${isAr ? "الاسم" : "Name"}: ${name.trim()}`,
      `${isAr ? "الهاتف" : "Phone"}: ${phone.trim()}`,
      `${isAr ? "الاهتمام" : "Interest"}: ${interestText}`,
      planText ? `${isAr ? "الخطة المختارة" : "Chosen plan"}: ${planText}` : "",
      `${isAr ? "الوقت المفضل" : "Preferred time"}: ${timeLabel}`,
      message.trim() ? `${isAr ? "الرسالة" : "Message"}: ${message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `${site.whatsappUrl}?text=${encodeURIComponent(text)}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setNotice("");

    const found = validateLead({ name, phone, message }, lang);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (Date.now() - lastSentAt.current < COOLDOWN_MS) {
      setNotice(
        isAr
          ? "تم إرسال طلبك بالفعل. يرجى الانتظار دقيقة قبل الإرسال مرة أخرى."
          : "Your request was already sent. Please wait a minute before sending again.",
      );
      return;
    }

    if (turnstile.enabled && !turnstile.token) {
      setNotice(
        isAr ? "يرجى إكمال التحقق أعلاه ثم الإرسال." : "Please complete the check above, then send.",
      );
      return;
    }

    setStatus("sending");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        message,
        interest,
        time,
        plan: chosen ?? "",
        locale: lang,
        company_website: honeypot,
        elapsedMs: Date.now() - openedAt.current,
        turnstileToken: turnstile.token,
      }),
    }).catch(() => null);
    turnstile.reset();

    if (res?.ok) {
      lastSentAt.current = Date.now();
      setStatus("sent");
      return;
    }

    const data = (await res?.json().catch(() => null)) as {
      error?: string;
      errors?: Partial<Record<LeadField, string>>;
    } | null;
    setStatus("idle");

    switch (data?.error) {
      case "invalid":
        setErrors(data.errors ?? {});
        return;
      case "rate_limited":
        setNotice(
          isAr
            ? "محاولات كثيرة. يرجى المحاولة بعد بضع دقائق أو الاتصال بنا."
            : "Too many attempts. Please try again in a few minutes, or call us.",
        );
        return;
      case "captcha":
        setNotice(isAr ? "فشل التحقق. يرجى المحاولة مرة أخرى." : "Verification failed. Please try again.");
        return;
      default:
        // API not set up yet, or WhatsApp failed: don't lose the lead, hand off to wa.me.
        // A link the visitor taps, since browsers block window.open after an await.
        setStatus("handoff");
    }
  }

  const errorId = (f: LeadField) => (errors[f] ? `register-${f}-error` : undefined);
  const clearError = (f: LeadField) => errors[f] && setErrors((x) => ({ ...x, [f]: undefined }));

  return (
    <form onSubmit={onSubmit} noValidate className="register-form space-y-5">
      {/* Honeypot: hidden from people and screen readers, bots tend to fill every field. */}
      <div aria-hidden="true" className="register-hp">
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {isAr ? "أنا مهتم بـ" : "I'm interested in"}
        </p>
        <div role="radiogroup" aria-label={isAr ? "نوع الاهتمام" : "Interest type"} className="grid grid-cols-2 gap-2">
          {interests.map((item) => {
            const active = interest === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setInterest(item.id)}
                className={`register-choice ${active ? "is-active" : ""}`}
              >
                <span className="block text-sm font-bold text-ink">
                  {isAr ? item.labelAr : item.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="register-field block">
          <span>{t("name")}</span>
          <input
            required
            name="name"
            autoComplete="name"
            maxLength={NAME_MAX}
            placeholder={isAr ? "مثال: أحمد العبدو" : "e.g. Ahmad Al-Abdo"}
            value={name}
            aria-invalid={!!errors.name}
            aria-describedby={errorId("name")}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
          />
          {errors.name && <em id={errorId("name")} className="register-error">{errors.name}</em>}
        </label>

        <label className="register-field block">
          <span>{t("phone")}</span>
          <input
            required
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            maxLength={PHONE_MAX}
            placeholder="+962 7X XXX XXXX"
            value={phone}
            aria-invalid={!!errors.phone}
            aria-describedby={errorId("phone")}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError("phone");
            }}
          />
          {errors.phone && <em id={errorId("phone")} className="register-error">{errors.phone}</em>}
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {t("preferredTime")}
        </p>
        <div role="radiogroup" aria-label={t("preferredTime")} className="flex flex-wrap gap-2">
          {times.map((item) => {
            const active = time === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTime(item.id)}
                className={`register-time ${active ? "is-active" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="register-field block">
        <span>{t("message")}</span>
        <textarea
          rows={3}
          placeholder={
            isAr
              ? "أي تفاصيل تود مشاركتها؟"
              : "Anything else you'd like to share?"
          }
          name="message"
          maxLength={MESSAGE_MAX}
          value={message}
          aria-invalid={!!errors.message}
          aria-describedby={errorId("message")}
          onChange={(e) => {
            setMessage(e.target.value);
            clearError("message");
          }}
        />
        {errors.message && <em id={errorId("message")} className="register-error">{errors.message}</em>}
      </label>

      {turnstile.enabled && <div ref={turnstile.ref} className="register-turnstile" />}

      <p className="text-sm text-muted">{tc("responseTime")}</p>

      <div className="space-y-2.5">
        <button type="submit" className="register-submit" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? (isAr ? "جارٍ الإرسال…" : "Sending…") : t("submit")}
        </button>
        <a href={`tel:${site.phoneAction}`} className="register-call">
          {t("orCall")}
        </a>
      </div>

      {notice && (
        <p className="register-error text-center" role="alert">
          {notice}
        </p>
      )}

      {status === "sent" && !notice && (
        <p className="text-center text-sm font-medium text-primary-ink" role="status">
          {isAr
            ? "شكرًا لك! وصلنا طلبك وسيتواصل معك فريقنا قريبًا."
            : "Thank you! We received your request and our team will be in touch soon."}
        </p>
      )}

      {status === "handoff" && !notice && (
        <div className="space-y-2 text-center" role="status">
          <p className="text-sm font-medium text-muted">
            {isAr
              ? "تعذّر إرسال الطلب تلقائيًا. أرسله لنا عبر واتساب:"
              : "We couldn't send your request automatically. Send it to us on WhatsApp:"}
          </p>
          <a
            href={whatsAppHandoffUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="register-call"
            onClick={() => {
              lastSentAt.current = Date.now();
              setStatus("sent");
            }}
          >
            {isAr ? "إرسال عبر واتساب" : "Send on WhatsApp"}
          </a>
        </div>
      )}
    </form>
  );
}
