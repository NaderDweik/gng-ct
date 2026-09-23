"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { site } from "@/content/site";
import {
  unitFilters,
  unitPlans,
  unitsCopy,
  type UnitFilterId,
  type UnitPlan,
} from "@/content/units";

function IconBed({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconBath({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function IconHash({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconCar({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function IconMaximize({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function IconArrow({ className, rtl }: { className?: string; rtl?: boolean }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      style={rtl ? { transform: "scaleX(-1)" } : undefined}
    >
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function maidLabel(plan: UnitPlan, copy: (typeof unitsCopy)["ar"] | (typeof unitsCopy)["en"]) {
  if (plan.maidRoom === "yes") return copy.maidYes;
  if (plan.maidRoom === "no") return copy.maidNo;
  return "—";
}

function parkingLabel(n: number, copy: (typeof unitsCopy)["ar"] | (typeof unitsCopy)["en"]) {
  return n === 1 ? copy.parkingOne : copy.parkingMany(n);
}

export function UnitsPlans() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const copy = isAr ? unitsCopy.ar : unitsCopy.en;
  const [tab, setTab] = useState<UnitFilterId>("all");
  const [lightbox, setLightbox] = useState<UnitPlan | null>(null);

  const filtered = useMemo(
    () => (tab === "all" ? unitPlans : unitPlans.filter((p) => p.filterId === tab)),
    [tab],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <>
      {/* Intro — JG two-column block */}
      <section className="bg-surface pt-12 pb-4 md:pt-16">
        <div className="mx-auto w-[min(92rem,calc(100%-2rem))] px-2 sm:px-4">
          <div className="mb-14 grid overflow-hidden bg-surface-alt/70 lg:grid-cols-2">
            <div className="relative min-h-[320px]">
              <Image
                src="/gallery/img_2.jpg"
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

          {/* Sticky filter */}
          <div className="relative z-30 mb-8 px-0 sm:sticky sm:top-24 sm:mb-12 sm:px-4">
            <div className="mx-auto max-w-4xl border border-line/80 bg-surface/92 p-2 shadow-card backdrop-blur-md sm:p-3">
              <div className="mb-2 flex items-center justify-between px-1 sm:mb-3">
                <span className="text-[10px] font-bold tracking-[0.22em] text-primary-ink/55 uppercase sm:text-[11px]">
                  {copy.filterLabel}
                </span>
                <span className="text-[10px] font-bold tracking-[0.18em] text-primary-ink/55 uppercase sm:text-[11px]">
                  {copy.filterMeta}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:grid-cols-6">
                {unitFilters.map((f) => {
                  const active = tab === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTab(f.id)}
                      className={`min-h-[42px] border px-1 text-[10px] font-bold tracking-[0.12em] uppercase transition sm:min-h-[56px] sm:text-xs lg:text-sm ${
                        active
                          ? "border-primary bg-primary text-on-dark shadow-card-lg"
                          : "border-line bg-surface-alt text-subtle hover:border-primary-ink/40 hover:bg-surface hover:text-primary-ink"
                      }`}
                    >
                      {isAr ? f.labelAr : f.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-12 pb-20 lg:grid-cols-2">
            {filtered.map((plan) => {
              const title = isAr ? plan.titleAr : plan.titleEn;
              const category = isAr ? plan.categoryAr : plan.categoryEn;
              const floor = isAr ? plan.floorAr : plan.floorEn;
              const wa = `${site.whatsappUrl}?text=${encodeURIComponent(
                isAr ? `استفسار عن المخطط: ${plan.titleAr}` : `Inquiry about plan: ${plan.titleEn}`,
              )}`;

              const stats = [
                { icon: IconBed, label: copy.bedrooms, value: String(plan.bedrooms) },
                { icon: IconBath, label: copy.bathrooms, value: String(plan.bathrooms) },
                { icon: IconHash, label: copy.floor, value: floor },
                { icon: IconUser, label: copy.maid, value: maidLabel(plan, copy) },
                { icon: IconCar, label: copy.parking, value: parkingLabel(plan.parking, copy) },
              ];

              return (
                <article
                  key={plan.id}
                  className="group overflow-hidden border border-line bg-surface-tint transition duration-500 hover:border-primary-ink/25 hover:shadow-2xl"
                >
                  <div className="md:grid md:grid-cols-5">
                    {/* Desktop floor-plan image */}
                    <button
                      type="button"
                      onClick={() => setLightbox(plan)}
                      className="relative hidden min-h-[300px] cursor-zoom-in bg-surface p-5 md:col-span-2 md:block md:p-6"
                    >
                      <div className="relative mx-auto h-full max-h-[260px] min-h-[220px] w-full">
                        <Image
                          src={plan.image}
                          alt={title}
                          fill
                          className="object-contain transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 40vw, 28vw"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition group-hover:bg-primary/10 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-2 rounded-full bg-surface/95 px-4 py-2 text-xs font-bold tracking-wider text-primary-ink uppercase shadow-md backdrop-blur">
                          <IconMaximize className="animate-pulse" />
                          {copy.quickView}
                        </span>
                      </div>
                    </button>

                    {/* Content */}
                    <div className="bg-surface p-6 md:col-span-3 md:p-8">
                      {/* Mobile thumb */}
                      <button
                        type="button"
                        onClick={() => setLightbox(plan)}
                        className="mb-5 flex w-full cursor-zoom-in items-start gap-4 md:hidden"
                      >
                        <span className="relative h-24 w-24 shrink-0 overflow-hidden border border-surface bg-surface shadow-sm">
                          <Image src={plan.image} alt={title} fill className="object-cover" sizes="96px" />
                        </span>
                        <span className="pt-1 text-left text-[10px] font-bold tracking-wider text-primary-ink uppercase">
                          {copy.quickView}
                        </span>
                      </button>

                      <h3 className="font-display text-2xl font-bold text-ink transition hover:text-primary-ink">
                        {title}
                      </h3>
                      <p className="mt-1 text-xs font-bold tracking-widest text-primary-ink uppercase">
                        {category}
                      </p>

                      <div className="mt-6 mb-8 grid grid-cols-2 gap-x-3 gap-y-5 border border-line bg-surface-tint p-[1.125rem]">
                        {stats.map((s) => (
                          <div key={s.label} className="flex items-start gap-2.5">
                            <s.icon className="mt-0.5 shrink-0 text-primary-ink" />
                            <div>
                              <p className="text-[11px] font-semibold tracking-wide text-subtle uppercase">
                                {s.label}
                              </p>
                              <p className="text-sm font-bold text-primary-ink">{s.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-3 md:flex-row">
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 bg-primary px-4 py-3.5 text-xs font-bold tracking-widest text-on-dark uppercase transition hover:bg-primary-hover"
                        >
                          {copy.viewDetails}
                          <IconArrow rtl={isAr} />
                        </a>
                        <a
                          href={plan.image}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 border border-primary-ink bg-transparent px-4 py-3.5 text-xs font-bold tracking-widest text-primary-ink uppercase transition hover:bg-primary hover:text-on-dark"
                        >
                          <IconDownload />
                          {copy.download}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick View lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 end-4 flex h-10 w-10 items-center justify-center bg-fill-on-dark text-2xl text-on-dark hover:bg-white/20"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-4xl bg-surface p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto aspect-[4/3] w-full">
              <Image
                src={lightbox.image}
                alt={isAr ? lightbox.titleAr : lightbox.titleEn}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <p className="mt-4 text-center font-display text-lg font-bold text-primary-ink">
              {isAr ? lightbox.titleAr : lightbox.titleEn}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
