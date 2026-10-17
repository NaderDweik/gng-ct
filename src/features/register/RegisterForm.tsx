"use client";

import { FormEvent, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { registerSource } from "@/components/analytics/registerSource";
import { countries, defaultCountry, type CountryIso } from "@/content/countries";
import { visitRequestsWebAppUrl } from "@/content/sheets";
import { MESSAGE_MAX, NAME_MAX, normalizePhone, validateLead, type LeadField } from "@/features/register/leadRules";
import { CountryPhoneField } from "@/features/register/CountryPhoneField";
import { useChaletParam } from "@/features/register/RegisterHeading";
import { VisitPicker, dayLabel, hourLabel, type VisitDay } from "@/features/register/VisitPicker";

// No server: the form is checked here, then the visitor's own WhatsApp opens a chat with the
// sales number (site.whatsapp) with the visit request written out, and they press send.
// The page books sales-office visits only (no call-back or financing requests).

export function RegisterForm() {
  const t = useTranslations("register");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";
  const lang = isAr ? "ar" : "en";

  const [name, setName] = useState("");
  const [country, setCountry] = useState<CountryIso>(defaultCountry);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [day, setDay] = useState<VisitDay | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [opened, setOpened] = useState(false);
  const started = useRef(false);

  const slot = day && hour !== null ? `${day.key} ${hour}:00` : null;

  // Arriving from the compound map (/register?chalet=D24): named in the panel title
  // (RegisterHeading) and in the WhatsApp message.
  const chalet = useChaletParam();

  // Hidden field only bots fill in; the sheet ignores requests that have it.
  const [website, setWebsite] = useState("");

  /** Adds the request to the «طلبات الزيارة» Google Sheet (content/sheets.ts), in Arabic, in the
   *  background: it never holds up WhatsApp, and a failure doesn't reach the visitor. */
  function saveToSheet() {
    if (!visitRequestsWebAppUrl) return;
    const full = normalizePhone(country, phone);
    const c = countries.find((x) => x.iso === country);
    const body = {
      name: name.trim(),
      phone: full ? `+${full}` : phone.trim(),
      country: c ? c.ar : country,
      day: day ? dayLabel(day.date, "ar") : "",
      time: hour !== null ? hourLabel(hour, "ar") : "",
      chalet: chalet ?? "",
      message: message.trim(),
      language: isAr ? "العربية" : "الإنجليزية",
      page: registerSource().from_page,
      website,
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
  function whatsAppUrl() {
    const full = normalizePhone(country, phone);
    const when = day && hour !== null ? `${dayLabel(day.date, locale)}، ${hourLabel(hour, locale)}` : "";

    const text = [
      isAr ? "طلب زيارة لمكتب المبيعات: روح العطاء" : "Sales office visit request: Giving Compound",
      `${isAr ? "الاسم" : "Name"}: ${name.trim()}`,
      `${isAr ? "الهاتف" : "Phone"}: ${full ? `+${full}` : phone.trim()}`,
      chalet ? `${isAr ? "الشاليه" : "Chalet"}: ${chalet}` : "",
      `${isAr ? "موعد الزيارة" : "Visit"}: ${isAr ? when : when.replace("،", ",")}`,
      `${isAr ? "المكان" : "Place"}: ${isAr ? site.salesOfficeAr : site.salesOfficeEn}`,
      message.trim() ? `${isAr ? "الرسالة" : "Message"}: ${message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `${site.whatsappUrl}?text=${encodeURIComponent(text)}`;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = validateLead({ name, country, phone, slot, message }, lang);
    setErrors(found);
    if (Object.keys(found).length) {
      track("register_error", { fields: Object.keys(found).join(","), ...registerSource() });
      setOpened(false);
      const first = Object.keys(found)[0];
      e.currentTarget
        .querySelector<HTMLElement>(first === "slot" ? ".register-slots button:not(:disabled)" : `[name="${first}"]`)
        ?.focus();
      return;
    }

    // Still inside the tap, so the browser lets WhatsApp open; the link below covers the rest.
    window.open(whatsAppUrl(), "_blank", "noopener,noreferrer");
    saveToSheet();
    track("register_sent", { visit_day: day?.key ?? "", visit_hour: hour ?? -1, country, chalet: chalet ?? "", ...registerSource() });
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
      {/* Spam trap: hidden from people and screen readers, so only bots fill it in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="register-trap"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
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

        <CountryPhoneField
          label={t("phone")}
          country={country}
          phone={phone}
          isAr={isAr}
          error={errors.phone}
          errorId={errorId("phone")}
          onCountry={(iso) => {
            setCountry(iso);
            clearError("phone");
          }}
          onPhone={(v) => {
            setPhone(v);
            clearError("phone");
          }}
        />
      </div>

      <VisitPicker
        locale={locale}
        day={day}
        hour={hour}
        onDay={(d) => {
          setDay(d);
          if (hour !== null && d.booked.includes(hour)) setHour(null);
          clearError("slot");
        }}
        onHour={(h) => {
          setHour(h);
          clearError("slot");
        }}
        dayLabelText={t("visitDay")}
        hourLabelText={t("visitHour")}
        error={errors.slot}
        errorId={errorId("slot")}
      />

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
