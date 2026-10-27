"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { heroLayered as hero, type HeroSlide } from "@/content/hero";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { UiIcon } from "@/components/ui/UiIcon";
import { avifSrcSet, dropAvifOnError } from "@/components/ui/SmoothImage";

/**
 * The photos are 16:9 and `object-cover` a full-height hero (100svh, min 640px). On any
 * screen narrower than 16:9 (every phone held upright) they render at the hero's HEIGHT
 * × 16/9, far wider than the viewport; "100vw" made phones fetch a viewport-wide file and
 * stretch it ~4×. These sizes describe the real rendered width so the browser picks a
 * sharp file (640px min height × 16/9 = 1138px).
 */
const HERO_SIZES =
  "(max-aspect-ratio: 16/9) and (min-height: 640px) calc(100vh * 16 / 9), (max-aspect-ratio: 16/9) 1138px, 100vw";

/** Where a slide's `mobileBackground` (portrait photo) replaces the 16:9 one. */
const PORTRAIT = "(max-aspect-ratio: 3/4)";
/** The portrait photos are ~9:16 (1536 × 2752): on screens narrower than that they
    cover the hero's height, wider ones its width. */
const PORTRAIT_SIZES = "(max-aspect-ratio: 1536/2752) calc(100vh * 1536 / 2752), 100vw";

/**
 * A slide photo with art direction: the portrait file on portrait screens, the 16:9 one
 * elsewhere. Still a single <img data-slide> (inside <picture>), so the slide animations
 * and the first-slide decode wait find it as before.
 */
/** `defer`: render the layer without its photo yet (no download until it turns false). */
function HeroArtPhoto({ slide, index, className, defer }: { slide: HeroSlide; index: number; className: string; defer: boolean }) {
  const common = { alt: "", fill: true, quality: 95, priority: index === 0 } as const;
  // Phones: the lighter quality step (half the bytes; the first thing a phone downloads).
  const portrait = getImageProps({ ...common, quality: 75, src: slide.mobileBackground!, sizes: PORTRAIT_SIZES }).props;
  const { style, src, srcSet, sizes, ...wide } = getImageProps({ ...common, src: slide.background, sizes: HERO_SIZES }).props;
  // AVIF first where the browser takes it (~40% lighter), WebP otherwise.
  const portraitAvif = avifSrcSet(portrait.srcSet);
  const wideAvif = avifSrcSet(srcSet);
  return (
    <picture>
      {/* The AVIF sources stay in the HTML while deferred (media "not all" never matches), so
          the build sees them and makes the files (scripts/cloudflare-pages.mjs). */}
      {portraitAvif && <source media={defer ? "not all" : PORTRAIT} type="image/avif" srcSet={portraitAvif} sizes={portrait.sizes} />}
      {!defer && <source media={PORTRAIT} srcSet={portrait.srcSet} sizes={portrait.sizes} />}
      {wideAvif && <source media={defer ? "not all" : undefined} type="image/avif" srcSet={wideAvif} sizes={sizes} />}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes in through `wide` (getImageProps) */}
      <img
        {...wide}
        {...(defer ? {} : { src, srcSet, sizes })}
        data-slide={index}
        onError={dropAvifOnError}
        className={`${className} hl-photo--art`}
        style={{ ...style, "--hl-focus": slide.focus, "--hl-mfocus": slide.mobileFocus ?? "50% 50%" } as CSSProperties}
      />
    </picture>
  );
}
import { isSwitchingLocale } from "@/i18n/useSwitchLocale";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Cinematic home hero (styles: styles/sections/hero-layered.css).
 *   Stack: slide photos → giant wordmark → slide cut-outs → scrims → copy, so a
 *   slide's subject can stand in front of the letters (see content/hero.ts).
 *   Intro:  camera settles, wordmark rises letter by letter, title lines slide
 *           out of masks, details follow.
 *   Slides: auto-advance on a timer; photo + its cut-out crossfade as one,
 *           title lines swap through their masks. Pauses off-screen / hidden tab.
 *   Scroll: (desktop) the hero pins and recedes into a framed picture while the
 *           copy lifts away, then scrolls on.
 * SSR renders slide 1 final; `.hl--pre` plays the copy intro in CSS from first
 * paint (hero-layered.css), so the text never waits for JS. Reduced motion: no
 * intro, no autoplay, instant swaps.
 */

const slides: readonly HeroSlide[] = hero.slides;

// Logomark V outline (viewBox 0 0 152 178), as in components/ui/VLines.
const V_PATH =
  "M25.1182 0.5625L75.6475 104.501L126.177 0.5625L126.451 0H151.295L150.597 1.4375L88.3428 129.497L88.0703 130.057L88.0723 130.061H63.2227L63.2236 130.057L62.9521 129.497L0.698242 1.4375L0 0H24.8438L25.1182 0.5625Z";
/** The scroll row of V outlines: x positions in a 1920 × 1080 field, overlapping. */
const V_ROW = Array.from({ length: 20 }, (_, i) => -100 + i * 105);

export function HeroLayered() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  /*
   * Slides 2+ only start downloading once the page has loaded: they first show after the
   * intro and a full interval (~9 s), and fetching them up front competed with slide 1 and
   * the page's own files on phones. Until then their layers are in place without a photo;
   * tapping a dot loads them at once.
   */
  const [restReady, setRestReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    const ready = () => {
      idle = window.setTimeout(() => setRestReady(true), 300);
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => {
      window.removeEventListener("load", ready);
      window.clearTimeout(idle);
    };
  }, []);
  const deferred = (i: number) => i > 0 && !restReady;
  /** The carousel's go(), for the pagination dots (set inside the GSAP context). */
  const goRef = useRef<(n: number) => void>(() => {});

  const word = isAr ? hero.wordmarkAr : hero.wordmarkEn;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const layers = (i: number) => q(`img[data-slide="${i}"]`);
      const titleLines = (i: number) => q(`.hl-title [data-set="${i}"] .hl-line > span`);
      const titleSet = (i: number) => q(`.hl-title [data-set="${i}"]`);

      let current = 0;
      let busy = false;
      let started = false;
      let paused = false;
      /** Set on cleanup: anything still scheduled from this run (the intro's start, the
       *  autoplay timer — created in callbacks, outside the GSAP context) must stop, or a
       *  second carousel keeps swapping titles over this one's. */
      let disposed = false;
      let timer: gsap.core.Tween | null = null;

      /** Every slide but `keep`: hidden on each swap so titles can never stack. */
      const others = (pick: (i: number) => Element[], keep: number) =>
        slides.flatMap((_, i) => (i === keep ? [] : pick(i)));

      // ── Autoplay: advance after the interval.
      const runTimer = () => {
        timer?.kill();
        if (disposed || reduced || slides.length < 2) return;
        timer = gsap.delayedCall(hero.intervalMs / 1000, () => go((current + 1) % slides.length));
        if (paused) timer.pause();
      };

      /** A dot clicked mid-swap: shown as soon as the running swap ends (never dropped). */
      let queued: number | null = null;

      const go = (next: number) => {
        if (disposed) return;
        if (busy) {
          queued = next;
          return;
        }
        if (next === current) return;
        const prev = current;
        current = next;
        setActive(next);

        if (reduced) {
          gsap.set([...others(layers, next), ...others(titleSet, next)], { autoAlpha: 0 });
          gsap.set([...layers(next), ...titleSet(next)], { autoAlpha: 1 });
          return;
        }

        busy = true;
        timer?.kill();
        gsap
          .timeline({
            onComplete: () => {
              busy = false;
              if (queued !== null) {
                const q = queued;
                queued = null;
                if (q !== current) return go(q);
              }
              if (started) runTimer();
            },
          })
          // Photo + its cut-out move as one so the layering never tears.
          .fromTo(layers(next), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power2.out" }, 0)
          .to(layers(prev), { autoAlpha: 0, duration: 1.3, ease: "power1.inOut" }, 0.1)
          .to(titleLines(prev), { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.06 }, 0)
          .set(others(titleSet, next), { autoAlpha: 0 }, 0.62)
          .set(titleSet(next), { autoAlpha: 1 }, 0.62)
          .fromTo(titleLines(next), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.62)
          // Settle: only the new slide's photos remain (covers any interrupted swap).
          .set(others(layers, next), { autoAlpha: 0 }, 1.8);
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
        disposed = true;
        timer?.kill();
        window.removeEventListener("scroll", syncPause);
        document.removeEventListener("visibilitychange", syncPause);
      };

      // Arriving via a language switch: the page should feel the same, not reload.
      const switching = isSwitchingLocale();

      // The CSS copy intro is done (or skipped) → hand the title lines to GSAP's swaps.
      // Removing the class mid-intro would jump the copy, so wait for it to end.
      if (reduced || switching) el.classList.remove("hl--pre");
      else gsap.delayedCall(1.8, () => el.classList.remove("hl--pre"));
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
        .from(layers(0), { filter: "brightness(0.35) saturate(0.8)", duration: 2.2, ease: "power2.out" }, 0);
      // The wordmark is optional (empty in content/hero.ts): only animate its letters if any.
      const glyphs = q(".hl-glyph");
      if (glyphs.length) intro.from(glyphs, { yPercent: 105, duration: 1.4, stagger: 0.06 }, 0.35);

      if (switching) {
        intro.progress(1);
      } else {
        // Start once slide 1's photo layers are decoded — never wait longer than 1.5s.
        Promise.race([
          Promise.all((layers(0) as HTMLImageElement[]).map((img) => img.decode().catch(() => undefined))),
          new Promise((r) => setTimeout(r, 1500)),
        ]).then(() => {
          if (!disposed) intro.play();
        });
      }

      // Scroll: pin + recede on larger screens; gentle drift on phones.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const pin = gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "+=70%", pin: true, scrub: 0.6 },
          })
          .to(q(".hl-stage"), { clipPath: "inset(9% 5% 3% 5%)", scale: 0.96 }, 0)
          .to(q(".hl-word"), { yPercent: -18 }, 0)
          .to(q(".hl-content"), { yPercent: -35, autoAlpha: 0 }, 0)
          // fromTo: the dots are still fading in when this is built; a plain .to would
          // record that near-0 opacity as the start and keep them hidden.
          .fromTo(q(".hl-dots"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, 0);

        // After the pin (copy gone, photo framed), on the way down to the About section:
        // a row of V outlines draws on one after another in reading direction, then erases
        // in the same order (dash offset 1 → 0 → -1). Its own range, so the pin is unchanged.
        const pinEnd = () => pin.scrollTrigger?.end ?? 0;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: () => pinEnd(),
              end: () => pinEnd() + innerHeight * 0.6,
              scrub: 0.6,
            },
          })
          .set(q(".hl-vs"), { autoAlpha: 1 }, 0)
          .fromTo(q(".hl-v"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, stagger: 0.014 }, 0)
          .to(q(".hl-v"), { strokeDashoffset: -1, duration: 0.2, stagger: 0.014 }, 0.55);
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
        {slides.map((s, i) =>
          s.mobileBackground ? (
            <HeroArtPhoto key={s.background} slide={s} index={i} className={`hl-photo hl-layer${first(i)}`} defer={deferred(i)} />
          ) : deferred(i) ? (
            // eslint-disable-next-line @next/next/no-img-element -- photo comes once loaded
            <img key={s.background} alt="" data-slide={i} className={`hl-photo hl-layer${first(i)}`} />
          ) : (
            <Image
              key={s.background}
              src={s.background}
              alt=""
              fill
              sizes={HERO_SIZES}
              quality={95}
              priority={i === 0}
              data-slide={i}
              className={`hl-photo hl-layer${first(i)}`}
              style={{ objectPosition: s.focus }}
            />
          ),
        )}

        <p className="hl-word" aria-hidden>
          {glyphs.map((g, i) => (
            <span key={i} className="hl-glyph-mask">
              <span className="hl-glyph">{g}</span>
            </span>
          ))}
        </p>

        {slides.map((s, i) =>
          s.foreground && deferred(i) ? (
            // eslint-disable-next-line @next/next/no-img-element -- photo comes once loaded
            <img key={s.foreground} alt="" data-slide={i} className={`hl-photo hl-layer hl-cutout${first(i)}`} />
          ) : s.foreground ? (
            <Image
              key={s.foreground}
              src={s.foreground}
              alt=""
              fill
              sizes={HERO_SIZES}
              quality={95}
              priority={i === 0}
              data-slide={i}
              className={`hl-photo hl-layer hl-cutout${first(i)}`}
              style={{ objectPosition: s.focus }}
            />
          ) : null,
        )}
        <div className="hl-scrim" aria-hidden />

        {/* Scroll accent (desktop): the V row, drawn and erased by the pin timeline. */}
        <svg className="hl-vs" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden>
          {(isAr ? [...V_ROW].reverse() : V_ROW).map((x) => (
            <path
              key={x}
              className="hl-v"
              d={V_PATH}
              transform={`translate(${x} 650) scale(1.8)`}
              pathLength={1}
            />
          ))}
        </svg>
      </div>

      <div className="hl-content container-gc">
        <div className="hl-bottom">
          <div className="hl-main">
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
              <Link href={hero.primaryHref} className="btn btn-primary" data-track-placement="hero">
                <UiIcon name="calendar" />
                {isAr ? hero.ctaPrimaryAr : hero.ctaPrimaryEn}
              </Link>
              <Link href={hero.secondaryHref} className="hl-link">
                <UiIcon name="pool" />
                {isAr ? hero.ctaSecondaryAr : hero.ctaSecondaryEn}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination: one dot per slide; the current one is a longer pill. */}
      {slides.length > 1 && (
        <div className="hl-dots hl-fade">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hl-dot${i === active ? " is-on" : ""}`}
              aria-label={`${isAr ? "الشريحة" : "Slide"} ${i + 1} / ${slides.length}`}
              aria-current={i === active || undefined}
              onClick={() => {
                setRestReady(true);
                goRef.current(i);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
