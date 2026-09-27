"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { site } from "@/content/site";
import { unitsCopy } from "@/content/units";

/*
 * Units page body: the intro block, then a notice while the detailed floor
 * plans are being finalised. The plan data stays in content/units.ts
 * (`unitPlans`) for when the cards come back.
 */

const pending = {
  en: {
    eyebrow: "Floor plans",
    title: "Detailed floor plans are on their way.",
    body: "We’re finalising every unit layout with Dr. Tarek Qazan — the full plans will be published here soon. In the meantime, our team is happy to walk you through them.",
    cta: "Ask on WhatsApp",
  },
  ar: {
    eyebrow: "المخططات",
    title: "المخططات التفصيلية قريبًا.",
    body: "نعمل على اعتماد مخططات جميع الوحدات مع د. طارق قازان — وستُنشر هنا قريبًا. وحتى ذلك الحين، يسعد فريقنا بشرحها لك.",
    cta: "اسأل عبر واتساب",
  },
} as const;

export function UnitsPlans() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const copy = isAr ? unitsCopy.ar : unitsCopy.en;
  const soon = isAr ? pending.ar : pending.en;

  return (
    <>
      {/* Intro — JG two-column block */}
      <section className="bg-surface pt-12 pb-4 md:pt-16">
        <div className="mx-auto w-[min(92rem,calc(100%-2rem))] px-2 sm:px-4">
          <div className="mb-14 grid overflow-hidden bg-surface-alt/70 lg:grid-cols-2">
            <div className="relative min-h-[320px]">
              <Image
                src="/gallery/resortsPics/swimmer-pool-waterfall.png"
                alt={copy.introImageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-overlay/85 via-overlay/20 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-6 font-display text-base font-bold text-on-dark md:p-8 md:text-lg">
                {copy.introCaption}
              </p>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
              <p className="mb-3 text-xs font-bold tracking-[0.2em] text-secondary-ink uppercase">
                {copy.introEyebrow}
              </p>
              <h2 className="font-display mb-6 text-2xl font-bold text-primary-ink md:text-3xl">
                {copy.introHeading}
              </h2>
              <div className="space-y-5 text-sm text-muted md:text-base">
                <p>{copy.p1}</p>
                <p>{copy.p2}</p>
                <p>{copy.p3}</p>
              </div>
            </div>
          </div>

          {/* Floor plans — pending */}
          <div className="units-soon">
            <span className="units-soon-icon" aria-hidden>
              <svg viewBox="0 0 48 48">
                <rect x="6" y="8" width="36" height="32" rx="2" />
                <path d="M6 22h14v18M20 22v-6h22M30 16v24" />
              </svg>
            </span>
            <p className="units-soon-eyebrow">{soon.eyebrow}</p>
            <h2 className="units-soon-title">{soon.title}</h2>
            <p className="units-soon-body">{soon.body}</p>
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="units-soon-cta">
              {soon.cta}
              <span aria-hidden>{isAr ? "←" : "→"}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
