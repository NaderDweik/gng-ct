"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/content/site";

export function RegisterForm() {
  const t = useTranslations("register");
  const tc = useTranslations("common");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("morning");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const timeLabel =
      time === "morning"
        ? t("morning")
        : time === "afternoon"
          ? t("afternoon")
          : t("evening");
    const text = [
      "تسجيل اهتمام — Giving City",
      `الاسم: ${name}`,
      `الهاتف: ${phone}`,
      `الوقت المفضل: ${timeLabel}`,
      message ? `الرسالة: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `${site.whatsappUrl}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brand">{t("name")}</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brand">{t("phone")}</span>
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brand">
          {t("preferredTime")}
        </span>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand"
        >
          <option value="morning">{t("morning")}</option>
          <option value="afternoon">{t("afternoon")}</option>
          <option value="evening">{t("evening")}</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brand">{t("message")}</span>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand"
        />
      </label>
      <p className="text-sm text-muted">{tc("responseTime")}</p>
      <button type="submit" className="btn btn-primary w-full">
        {t("submit")}
      </button>
      <a href={`tel:${site.phoneAction}`} className="btn btn-secondary w-full">
        {t("orCall")} — {site.phone}
      </a>
    </form>
  );
}
