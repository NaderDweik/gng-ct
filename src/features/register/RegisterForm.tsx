"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/content/site";
import { usePlanChoice } from "@/features/register/usePlanChoice";
import { cashDiscountPct, cashPriceJd, pricingPlans } from "@/content/pricing";
import { formatNumber } from "@/lib/format";

type Interest = "financing" | "visit";
type TimeSlot = "morning" | "afternoon" | "evening";

export function RegisterForm() {
  const t = useTranslations("register");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState<TimeSlot>("morning");
  const [interest, setInterest] = useState<Interest>("financing");
  const [sent, setSent] = useState(false);

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
    const p = pricingPlans.find((x) => x.id === chosen);
    if (!p) return "";
    return isAr
      ? `استلام ${formatNumber(p.moveIn, locale).replace(/[٬,]/g, "")} (${p.labelAr}): دفعة أولى ${formatNumber(p.downJd, locale)} د.أ (${formatNumber(p.downPct, locale)}٪)`
      : `Move-in ${p.moveIn} (${p.labelEn}): ${formatNumber(p.downJd, locale)} JD down (${p.downPct}%)`;
  })();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const timeLabel = times.find((x) => x.id === time)?.label ?? time;
    const interestLabel = interests.find((x) => x.id === interest);
    const interestText = interestLabel
      ? isAr
        ? interestLabel.labelAr
        : interestLabel.labelEn
      : interest;

    const text = [
      isAr ? "تسجيل اهتمام: Giving City" : "Register interest: Giving City",
      `${isAr ? "الاسم" : "Name"}: ${name}`,
      `${isAr ? "الهاتف" : "Phone"}: ${phone}`,
      `${isAr ? "الاهتمام" : "Interest"}: ${interestText}`,
      planText ? `${isAr ? "الخطة المختارة" : "Chosen plan"}: ${planText}` : "",
      `${isAr ? "الوقت المفضل" : "Preferred time"}: ${timeLabel}`,
      message ? `${isAr ? "الرسالة" : "Message"}: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `${site.whatsappUrl}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="register-form space-y-5">
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
            autoComplete="name"
            placeholder={isAr ? "مثال: أحمد العبدو" : "e.g. Ahmad Al-Abdo"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="register-field block">
          <span>{t("phone")}</span>
          <input
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+962 7X XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      <p className="text-sm text-muted">{tc("responseTime")}</p>

      <div className="space-y-2.5">
        <button type="submit" className="register-submit">
          {t("submit")}
        </button>
        <a href={`tel:${site.phoneAction}`} className="register-call">
          {t("orCall")}
        </a>
      </div>

      {sent && (
        <p className="text-center text-sm font-medium text-primary-ink" role="status">
          {isAr
            ? "تم فتح واتساب. أكمل الإرسال من هناك."
            : "WhatsApp opened. Finish sending from there."}
        </p>
      )}
    </form>
  );
}
