"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { unitsCopy } from "@/content/units";

/*
 * Units page body: the intro block, followed by `children` (the unit plan section on
 * /units). The per-unit plan data stays in content/units.ts (`unitPlans`) for when
 * detailed floor plans are published.
 */

/** `children` renders after the intro (the unit plan section on /units). */
export function UnitsPlans({ children }: { children?: ReactNode }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const copy = isAr ? unitsCopy.ar : unitsCopy.en;

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
              <p className="section-eyebrow">
                {copy.introEyebrow}
              </p>
              <h2 className="section-title units-intro-title">
                {copy.introHeading}
              </h2>
              <div className="space-y-5 text-sm text-muted md:text-base">
                <p>{copy.p1}</p>
                <p>{copy.p2}</p>
                <p>{copy.p3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {children}
    </>
  );
}
