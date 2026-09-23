"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { HeroSlide } from "@/content/heroSlides";

const INTERVAL_MS = 7000;

type HeroCarouselProps = {
  slides: HeroSlide[];
};

/**
 * Jordan Gate–style hero: 3 full-bleed stills, 7s crossfade,
 * per-slide copy, dot pager, scroll cue.
 */
export function HeroCarousel({ slides }: HeroCarouselProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Bumps when user picks a dot so the 7s timer restarts from that slide. */
  const [timerKey, setTimerKey] = useState(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) setTimerKey((k) => k + 1);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(() => {
      if (!visibleRef.current) return;
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [slides.length, timerKey]);

  function goTo(i: number) {
    setIndex(i);
    setTimerKey((k) => k + 1);
  }

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-dark">
      {/* Crossfading stills — all eager so mobile doesn't defer opacity-0 slides */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority
              quality={90}
              className={`object-cover ${
                i === index && !reduceMotion ? "hero-kenburns" : ""
              }`}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-overlay/85 via-overlay/40 to-overlay/25" />
        <div className="absolute inset-0 z-[2] bg-primary/15" />
      </div>

      {/* Copy — Jordan Gate layout */}
      <div className="container-gc relative z-10 w-full pb-28 pt-32 md:pb-32 md:pt-40">
        <div key={index} className="reveal">
          <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-accent uppercase sm:text-sm">
            {isAr ? slide.badgeAr : slide.badgeEn}
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight text-on-dark drop-shadow-[0_4px_12px_color-mix(in_srgb,var(--black)_35%,transparent)] sm:text-5xl md:text-6xl lg:text-7xl">
            {isAr ? slide.titleAr : slide.titleEn}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-on-dark sm:text-lg md:text-xl">
            {isAr ? slide.descAr : slide.descEn}
          </p>
          <div className="mt-10 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <Link href={slide.primaryHref} className="btn btn-accent">
              {isAr ? slide.ctaPrimaryAr : slide.ctaPrimaryEn}
            </Link>
            <Link href={slide.secondaryHref} className="btn btn-ghost-light">
              {isAr ? slide.ctaSecondaryAr : slide.ctaSecondaryEn}
            </Link>
          </div>
        </div>

        {/* Dot pager */}
        <div className="mt-12 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                i === index
                  ? "w-8 bg-secondary"
                  : "w-1.5 bg-white/35 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

      {/* Scroll cue — matches JG mouse indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[9px] font-semibold tracking-[0.25em] text-on-dark-subtle uppercase">
          {isAr ? "اسحب لأسفل" : "Scroll"}
        </span>
        <div className="flex h-9 w-5 justify-center rounded-full border border-white/25 p-1 backdrop-blur-[1px]">
          <span className="scroll-dot mt-0.5 block h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--brand-secondary)]" />
        </div>
      </div>
    </section>
  );
}
