"use client";

import type { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { SmoothImage } from "@/components/ui/SmoothImage";

/**
 * SmoothImage that only starts downloading when its box is within `margin` of the screen.
 * For photos just below the first screen, which the browser's own lazy loading fetches at
 * once on phones. They competed with the hero for bandwidth. Needs a positioned parent (`fill`).
 */
export function NearImage({ margin = "400px", ...props }: ImageProps & { margin?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);

  if (near) return <SmoothImage {...props} />;
  return (
    <span ref={ref} aria-hidden className="absolute inset-0">
      {/* Without JavaScript the photo still shows. It also puts the photo's files in the HTML,
          which is how the build knows to make its AVIF (scripts/cloudflare-pages.mjs). */}
      <noscript>
        <SmoothImage {...props} preview={false} />
      </noscript>
    </span>
  );
}
