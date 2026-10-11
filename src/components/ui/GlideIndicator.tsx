"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/*
 * One highlight that glides (and resizes) to the checked option of the group it sits in.
 * Drop it inside a positioned group whose options carry aria-checked / aria-selected;
 * pass the current value as `watch` so it re-measures on change. Style via `className`
 * (it gets --x / --y and width / height; transitions live in CSS).
 */
export function GlideIndicator({ watch, className }: { watch: unknown; className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const group = ref.current?.parentElement;
    if (!group) return;
    const measure = () => {
      const el = group.querySelector<HTMLElement>('[aria-checked="true"], [aria-selected="true"]');
      setBox(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(group);
    return () => ro.disconnect();
  }, [watch]);

  return (
    <span
      ref={ref}
      className={className}
      style={
        box
          ? ({ "--x": `${box.x}px`, "--y": `${box.y}px`, width: box.w, height: box.h } as CSSProperties)
          : { opacity: 0 }
      }
      aria-hidden
    />
  );
}
