"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { homeIntro as intro } from "@/content/home-intro";

/*
 * Home "About Giving Compound" (styles: styles/sections/home-intro.css).
 * Once in view the photo unveils from the bottom up while it settles from a slight zoom.
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
          <Image
            src={intro.image}
            alt={copy.alt}
            fill
            sizes={IMAGE_SIZES}
            quality={92}
            className="hi-photo"
            style={{ objectPosition: intro.focus }}
          />
        </figure>

        <div className="hi-copy">
          <p className="section-eyebrow">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p className="hi-body">{copy.p1}</p>
          <ul className="hi-facts">
            {copy.facts.map((f) => (
              <li key={f}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link href={intro.href} className="btn btn-primary hi-cta">
            {copy.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
