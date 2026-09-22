"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { faqCategories } from "@/content/faq";

export function FaqAccordion() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {faqCategories.map((cat) => (
        <section key={cat.id}>
          <h2 className="mb-4 text-xl font-bold text-brand">
            {isAr ? cat.titleAr : cat.titleEn}
          </h2>
          <div className="divide-y divide-line border border-line bg-surface">
            {cat.items.map((item, idx) => {
              const key = `${cat.id}-${idx}`;
              const isOpen = open === key;
              return (
                <div key={key}>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-start"
                    onClick={() => setOpen(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-brand">
                      {isAr ? item.qAr : item.qEn}
                    </span>
                    <span className="text-brand">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 text-muted leading-relaxed">
                      {isAr ? item.aAr : item.aEn}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
