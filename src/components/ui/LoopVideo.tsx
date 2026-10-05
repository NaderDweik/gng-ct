"use client";

import { useEffect, useRef } from "react";

/*
 * Muted background loop (the Remotion renders in public/motion; source: motion/).
 * Shows the poster until it is near the viewport, plays only while on screen, and
 * never plays for reduced-motion visitors (they keep the poster). Decorative.
 * `lazyPoster`: below-the-fold loops also hold the poster back until they're near
 * (posters always download at page load otherwise, competing with the hero).
 */
export function LoopVideo({
  src,
  poster,
  className,
  lazyPoster,
}: {
  src: string;
  poster: string;
  className?: string;
  lazyPoster?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && !lazyPoster) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) {
          if (!v.poster) v.poster = poster;
          if (reduced) return;
          if (!v.src) v.src = src;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, poster, lazyPoster]);

  return (
    <video
      ref={ref}
      className={className}
      poster={lazyPoster ? undefined : poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}
