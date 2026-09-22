"use client";

import { useEffect, useRef, useState } from "react";
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="invisible" aria-hidden>
        {final}
      </span>
      <span className="absolute inset-0 whitespace-nowrap" aria-hidden>
        {prefix}
        {formatNumber(current, locale)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
