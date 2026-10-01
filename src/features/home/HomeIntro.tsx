"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { homeIntro as intro } from "@/content/home-intro";

/*
 * Home "About Giving City" (styles: styles/sections/home-intro.css).
 * Once in view the photo assembles from its layers (sky, walls, chalet, ground, pool),
 * then two lines run along the seams (the chalet's base, the pool's lower edge), each
 * drawing on and trailing off.
 */

const IMAGE_SIZES = "(min-width: 1024px) 55vw, 100vw";

export function HomeIntro({ locale }: { locale: string }) {
  const copy = locale === "ar" ? intro.ar : intro.en;
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} className={`hi section bg-surface${inView ? " is-in" : ""}`}>
      <div className="container-gc hi-grid">
        <figure className="hi-frame">
          <Image src={intro.layers.sky} alt="" fill sizes={IMAGE_SIZES} className="hi-layer hi-sky" />
          <Image src={intro.layers.walls} alt="" fill sizes={IMAGE_SIZES} className="hi-layer hi-walls" />
          <Image src={intro.layers.ground} alt="" fill sizes={IMAGE_SIZES} className="hi-layer hi-ground" />
          <Image src={intro.layers.pool} alt="" fill sizes={IMAGE_SIZES} className="hi-layer hi-pool" />
          <Image
            src={intro.layers.chalet}
            alt={copy.alt}
            fill
            sizes={IMAGE_SIZES}
            className="hi-layer hi-chalet"
          />
          <svg className="hi-seam" viewBox="0 0 546 307" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <path className="hi-seam-chalet" d={intro.seams.chalet} pathLength={1} />
            <path className="hi-seam-pool" d={intro.seams.pool} pathLength={1} />
          </svg>
        </figure>

        <div className="hi-copy">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p className="hi-body">{copy.p1}</p>
          <p className="hi-body">{copy.p2}</p>
          <Link href={intro.href} className="btn btn-primary hi-cta">
            {copy.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
