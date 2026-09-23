"use client";

import { useTranslations } from "next-intl";
import { site } from "@/content/site";

export function WhatsAppFloat() {
  const t = useTranslations("common");

  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-on-dark shadow-lg transition hover:scale-[1.03] end-5"
      aria-label={t("whatsapp")}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .15 5.35.15 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.65a11.86 11.86 0 0 0 5.75 1.45h.01c6.55 0 11.9-5.35 11.9-11.9 0-3.18-1.24-6.17-3.46-8.4ZM12.05 21.75h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.5-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.8 9.8 0 0 1 2.88 6.97c0 5.43-4.42 9.85-9.85 9.85Zm5.72-7.37c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.55-1.85-1.73-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.2 1.98.12.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.12-.29-.2-.6-.36Z" />
      </svg>
      <span className="hidden sm:inline">{t("whatsapp")}</span>
    </a>
  );
}
