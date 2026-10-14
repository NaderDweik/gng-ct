"use client";

import { FormEvent, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { GlideIndicator } from "@/components/ui/GlideIndicator";
import { track } from "@/lib/analytics";
import { registerSource } from "@/components/analytics/registerSource";
import {
  MESSAGE_MAX,
  NAME_MAX,
  PHONE_MAX,
  validateLead,
  type Interest,
  type LeadField,
  type TimeSlot,
} from "@/features/register/leadRules";

// No server: the form is checked here, then the visitor's own WhatsApp opens a chat with the
// sales number (site.whatsapp) with the lead written out, and they press send.

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
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [opened, setOpened] = useState(false);
  const started = useRef(false);

  const interests: { id: Interest; labelAr: string; labelEn: string }[] = [
    {
      id: "financing",
      labelAr: "التمويل",
      labelEn: "Financing",
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


  /** wa.me chat with the sales number, the lead already typed in. */
  function whatsAppUrl() {
    const timeLabel = times.find((x) => x.id === time)?.label ?? time;
    const interestLabel = interests.find((x) => x.id === interest);
    const interestText = interestLabel
      ? isAr
        ? interestLabel.labelAr
        : interestLabel.labelEn
      : interest;

    const text = [
      isAr ? "تسجيل اهتمام: روح العطاء" : "Register interest: Giving Compound",
      `${isAr ? "الاسم" : "Name"}: ${name.trim()}`,
      `${isAr ? "الهاتف" : "Phone"}: ${phone.trim()}`,
      `${isAr ? "الاهتمام" : "Interest"}: ${interestText}`,
      `${isAr ? "الوقت المفضل" : "Preferred time"}: ${timeLabel}`,
      message.trim() ? `${isAr ? "الرسالة" : "Message"}: ${message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `${site.whatsappUrl}?text=${encodeURIComponent(text)}`;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = validateLead({ name, phone, message }, lang);
    setErrors(found);
    if (Object.keys(found).length) {
      track("register_error", { fields: Object.keys(found).join(","), ...registerSource() });
      setOpened(false);
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Still inside the tap, so the browser lets WhatsApp open; the link below covers the rest.
    window.open(whatsAppUrl(), "_blank", "noopener,noreferrer");
    track("register_sent", { interest, time, ...registerSource() });
    setOpened(true);
  }

  const errorId = (f: LeadField) => (errors[f] ? `register-${f}-error` : undefined);
  const clearError = (f: LeadField) => errors[f] && setErrors((x) => ({ ...x, [f]: undefined }));

  return (
    <form
      onSubmit={onSubmit}
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        track("register_started", registerSource());
      }}
      noValidate
      className="register-form space-y-5"
    >
      <div>
        <p className="register-group-label mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {isAr ? "أنا مهتم بـ" : "I'm interested in"}
        </p>
        <div role="radiogroup" aria-label={isAr ? "نوع الاهتمام" : "Interest type"} className="register-glide grid grid-cols-2 gap-2">
          <GlideIndicator watch={interest} className="register-glide-pill register-glide-pill--choice" />
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
                <span className="register-radio" aria-hidden />
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
            placeholder={isAr ? "اسمك الكامل" : "Your full name"}
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
            placeholder="+962 70 000 0000"
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
        <p className="register-group-label mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {t("preferredTime")}
        </p>
        <div role="radiogroup" aria-label={t("preferredTime")} className="register-times register-glide flex flex-wrap gap-2">
          <GlideIndicator watch={time} className="register-glide-pill register-glide-pill--time" />
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

      <p className="register-note text-sm text-muted">{tc("responseTime")}</p>

      <div className="space-y-2.5">
        <button type="submit" className="register-submit">
          {t("submit")}
        </button>
        <a href={`tel:${site.phoneAction}`} className="register-call">
          {t("orCall")}
        </a>
      </div>

      {/* Consent: pressing submit accepts the privacy policy and terms (which set out the
          purposes, retention and transfers abroad). */}
      <p className="register-consent">
        {isAr ? (
          <>
            بالضغط على زر «{t("submit")}» فإنك توافق على <Link href="/privacy">سياسة الخصوصية</Link> و
            <Link href="/terms">شروط الاستخدام</Link>.
          </>
        ) : (
          <>
            By pressing “{t("submit")}”, you agree to our <Link href="/privacy">Privacy Policy</Link> and{" "}
            <Link href="/terms">Terms of Use</Link>.
          </>
        )}
      </p>

      {opened && (
        <div className="space-y-2 text-center" role="status">
          <p className="text-sm font-medium text-muted">
            {isAr
              ? "رسالتك جاهزة في واتساب، اضغط «إرسال» هناك."
              : "Your message is ready in WhatsApp. Tap Send there."}
          </p>
          <a href={whatsAppUrl()} target="_blank" rel="noopener noreferrer" className="register-call">
            {isAr ? "لم يفتح واتساب؟ افتحه من هنا" : "WhatsApp didn't open? Open it here"}
          </a>
        </div>
      )}
    </form>
  );
}
