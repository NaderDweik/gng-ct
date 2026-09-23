"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { heroLayered as hero, type HeroSlide } from "@/content/hero";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Cinematic home hero (styles: styles/sections/hero-layered.css).
 *   Stack: slide photos → giant wordmark → slide cut-outs → scrims → copy, so a
 *   slide's subject can stand in front of the letters (see content/hero.ts).
 *   Intro:  camera settles, wordmark rises letter by letter, title lines slide
 *           out of masks, details follow.
 *   Slides: auto-advance (progress bars); photo + its cut-out crossfade as one,
 *           title lines swap through their masks. Pauses off-screen / hidden tab.
 *   Scroll: (desktop) the hero pins and recedes into a framed picture while the
 *           copy lifts away, then scrolls on.
 * SSR renders slide 1 final; `.hl--pre` hides the animated bits until GSAP takes
 * over (CSS failsafe). Reduced motion: no intro, no autoplay, instant swaps.
 */

const slides: readonly HeroSlide[] = hero.slides;

export function HeroLayered() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  /** Set by the GSAP context — the only way slides change. */
  const goRef = useRef<(i: number) => void>(() => {});

  const word = isAr ? hero.wordmarkAr : hero.wordmarkEn;
  const n = (v: number) => formatNumber(v, locale).padStart(2, isAr ? "٠" : "0");
  const stats = [
    { value: `${formatNumber(site.stats.units, locale)}+`, label: isAr ? "منتجع خاص" : "Private resorts" },
    { value: formatNumber(site.stats.areaSqm, locale), label: isAr ? "متر مربع" : "Square meters" },
    { value: isAr ? "٠٪" : "0%", label: isAr ? "فوائد" : "Interest" },
  ];

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const layers = (i: number) => q(`img[data-slide="${i}"]`);
      const titleLines = (i: number) => q(`.hl-title [data-set="${i}"] .hl-line > span`);
      const titleSet = (i: number) => q(`.hl-title [data-set="${i}"]`);
      const desc = (i: number) => q(`.hl-desc[data-set="${i}"]`);
      const bars = q<HTMLElement>(".hl-bar-fill");

      let current = 0;
      let busy = false;
      let started = false;
      let paused = false;
      let timer: gsap.core.Tween | null = null;

      // ── Autoplay: the active bar fills over the interval, then advances.
      const runTimer = () => {
        timer?.kill();
        gsap.set(bars, { scaleX: 0 });
        const bar = bars[current];
        if (reduced || slides.length < 2 || !bar) return;
        timer = gsap.to(bar, {
          scaleX: 1,
          duration: hero.intervalMs / 1000,
          ease: "none",
          onComplete: () => go((current + 1) % slides.length),
        });
        if (paused) timer.pause();
      };

      const go = (next: number) => {
        if (next === current || busy) return;
        const prev = current;
        current = next;
        setActive(next);

        if (reduced) {
          gsap.set([...layers(prev), ...titleSet(prev), ...desc(prev)], { autoAlpha: 0 });
          gsap.set([...layers(next), ...titleSet(next), ...desc(next)], { autoAlpha: 1 });
          return;
        }

        busy = true;
        timer?.kill();
        gsap.set(bars, { scaleX: 0 });
        gsap
          .timeline({
            onComplete: () => {
              busy = false;
              if (started) runTimer();
            },
          })
          // Photo + its cut-out move as one so the layering never tears.
          .fromTo(layers(next), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power2.out" }, 0)
          .to(layers(prev), { autoAlpha: 0, duration: 1.3, ease: "power1.inOut" }, 0.1)
          .to(titleLines(prev), { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.06 }, 0)
          .to(desc(prev), { autoAlpha: 0, y: -10, duration: 0.5, ease: "power2.in" }, 0)
          .set(titleSet(prev), { autoAlpha: 0 }, 0.62)
          .set(titleSet(next), { autoAlpha: 1 }, 0.62)
          .fromTo(titleLines(next), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.62)
          .fromTo(desc(next), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.8);
      };
      goRef.current = go;

      const syncPause = () => {
        paused = document.hidden || window.scrollY > 40;
        if (!timer) return;
        if (paused) timer.pause();
        else timer.resume();
      };
      window.addEventListener("scroll", syncPause, { passive: true });
      document.addEventListener("visibilitychange", syncPause);
      const cleanup = () => {
        timer?.kill();
        window.removeEventListener("scroll", syncPause);
        document.removeEventListener("visibilitychange", syncPause);
      };

      // Un-hide first: `.from()` tweens read their end state from the live styles,
      // and render their start state immediately — same frame, so no flash.
      el.classList.remove("hl--pre");
      if (reduced) return cleanup;

      const intro = gsap.timeline({
        defaults: { ease: "expo.out" },
        paused: true,
        onComplete: () => {
          started = true;
          syncPause();
          runTimer();
        },
      });
      intro
        .from(q(".hl-stage"), { scale: 1.16, duration: 2.6 }, 0)
        .from(layers(0), { filter: "brightness(0.35) saturate(0.8)", duration: 2.2, ease: "power2.out" }, 0)
        .from(q(".hl-glyph"), { yPercent: 105, duration: 1.4, stagger: 0.06 }, 0.35)
        .from(titleLines(0), { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.95)
        .from(q(".hl-fade"), { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 1.25);

      // Start once slide 1's photo layers are decoded — never wait longer than 1.5s.
      Promise.race([
        Promise.all((layers(0) as HTMLImageElement[]).map((img) => img.decode().catch(() => undefined))),
        new Promise((r) => setTimeout(r, 1500)),
      ]).then(() => intro.play());

      // Scroll: pin + recede on larger screens; gentle drift on phones.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "+=70%", pin: true, scrub: 0.6 },
          })
          .to(q(".hl-stage"), { clipPath: "inset(9% 5% 12% 5%)", scale: 0.96 }, 0)
          .to(q(".hl-word"), { yPercent: -18 }, 0)
          .to(q(".hl-content"), { yPercent: -35, autoAlpha: 0 }, 0)
          .to(q(".hl-cue"), { autoAlpha: 0, duration: 0.2 }, 0);
      });
      mm.add("(max-width: 767px)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          })
          .to(q(".hl-stage"), { yPercent: 12 }, 0)
          .to(q(".hl-word"), { yPercent: -25 }, 0);
      });

      return cleanup;
    },
    { scope: root },
  );

  const glyphs = isAr ? [word] : Array.from(word);
  const first = (i: number) => (i === 0 ? " is-first" : "");

  return (
    <section
      ref={root}
      className="hl hl--pre"
      aria-label={isAr ? site.nameAr : site.nameEn}
      aria-roledescription="carousel"
    >
      <div className="hl-stage">
        {slides.map((s, i) => (
          <Image
            key={s.background}
            src={s.background}
            alt=""
            fill
            sizes="100vw"
            quality={88}
            priority={i === 0}
            data-slide={i}
            className={`hl-photo hl-layer${first(i)}`}
            style={{ objectPosition: s.focus }}
          />
        ))}

        <p className="hl-word" aria-hidden>
          {glyphs.map((g, i) => (
            <span key={i} className="hl-glyph-mask">
              <span className="hl-glyph">{g}</span>
            </span>
          ))}
        </p>

        {slides.map((s, i) =>
          s.foreground ? (
            <Image
              key={s.foreground}
              src={s.foreground}
              alt=""
              fill
              sizes="100vw"
              quality={88}
              priority={i === 0}
              data-slide={i}
              className={`hl-photo hl-layer hl-cutout${first(i)}`}
              style={{ objectPosition: s.focus }}
            />
          ) : null,
        )}
        <div className="hl-scrim" aria-hidden />
      </div>

      <div className="hl-content container-gc">
        <div className="hl-bottom">
          <div className="hl-main">
            <p className="hl-eyebrow hl-fade">{isAr ? hero.eyebrowAr : hero.eyebrowEn}</p>
            <h1 className="hl-title">
              {slides.map((s, i) => (
                <span key={i} data-set={i} className={`hl-set${first(i)}`} aria-hidden={i !== active}>
                  {(isAr ? s.titleAr : s.titleEn).map((line) => (
                    <span key={line} className="hl-line">
                      <span>{line}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="hl-ctas hl-fade">
              <Link href={hero.primaryHref} className="btn btn-accent">
                {isAr ? hero.ctaPrimaryAr : hero.ctaPrimaryEn}
              </Link>
              <Link href={hero.secondaryHref} className="hl-link">
                {isAr ? hero.ctaSecondaryAr : hero.ctaSecondaryEn}
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="hl-aside">
            <div className="hl-descs hl-fade">
              {slides.map((s, i) => (
                <p key={i} data-set={i} className={`hl-desc hl-set${first(i)}`} aria-hidden={i !== active}>
                  {isAr ? s.descAr : s.descEn}
                </p>
              ))}
            </div>
            <dl className="hl-stats hl-fade">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="hl-nav hl-fade" role="tablist" aria-label={isAr ? "الشرائح" : "Slides"}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`${n(i + 1)} / ${n(slides.length)}`}
                  className={`hl-bar${i === active ? " is-active" : ""}`}
                  onClick={() => goRef.current(i)}
                >
                  <span className="hl-bar-num">{n(i + 1)}</span>
                  <span className="hl-bar-track">
                    <span className="hl-bar-fill" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hl-cue hl-fade" aria-hidden>
        <span />
      </div>
    </section>
  );
}
