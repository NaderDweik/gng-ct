"use client";

import { useEffect, useRef, useState } from "react";
import { isSwitchingLocale } from "@/i18n/useSwitchLocale";
import { formatNumber } from "@/lib/format";

type Props = {
  value: number;
  from?: number;
  locale: string;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
};

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function CountUp({ value, from = 0, locale, duration = 2000, delay = 0, prefix = "", suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion, or arriving via a language switch: show the number, don't count.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isSwitchingLocale()) {
      setCurrent(value);
      return;
    }

    let raf = 0;
    let timer = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setCurrent(Math.round(from + (value - from) * easeOutExpo(p)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, from, duration, delay]);

  const final = `${prefix}${formatNumber(value, locale)}${suffix}`;
  const shown = `${prefix}${formatNumber(current, locale)}${suffix}`;

  // Grid stack: the invisible final value reserves width; the live value paints in the
  // same cell. Avoids the absolute/relative pair that can show both numbers when layout CSS is off.
  return (
    <span
      ref={ref}
      className="inline-grid tabular-nums [grid-template-areas:'n']"
      aria-label={final}
    >
      <span className="invisible col-[1] row-[1] [grid-area:n] whitespace-nowrap" aria-hidden>
        {final}
      </span>
      <span className="col-[1] row-[1] [grid-area:n] whitespace-nowrap" aria-hidden>
        {shown}
      </span>
    </span>
  );
}
