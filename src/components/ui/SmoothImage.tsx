"use client";

import { getImageProps, type ImageProps } from "next/image";
import { useState } from "react";
import imageLoader from "@/lib/imageLoader";

/**
 * The AVIF twin of a resized-WebP srcset (scripts/cloudflare-pages.mjs encodes every AVIF a
 * page asks for). Undefined under `next dev`, which serves the original photos.
 */
export function avifSrcSet(srcSet: string | undefined) {
  const avif = srcSet?.replace(/\.webp(?= )/g, ".avif");
  return avif !== srcSet ? avif : undefined;
}

/**
 * onError for an <img> inside a <picture> with AVIF sources: if the AVIF failed (e.g. a file
 * the build didn't make), drop those sources so the browser loads the WebP instead.
 */
export function dropAvifOnError(e: { currentTarget: HTMLImageElement }) {
  const img = e.currentTarget;
  if (!img.currentSrc.endsWith(".avif")) return;
  img.parentElement?.querySelectorAll('source[type="image/avif"]').forEach((s) => s.remove());
}

/**
 * next/image for `fill` photos, lighter and calmer while loading:
 *   - AVIF where the browser can show it (~40% smaller), WebP otherwise.
 *   - `preview` (default): a blurred 32 px version covers the box until the photo has fully
 *     downloaded, then fades away, so a photo never paints in strips. Leave it off where the
 *     photo has its own reveal or crossfade (the overlay would show while it is hidden).
 * The <img> keeps every prop and class it had as next/image.
 */
export function SmoothImage({ preview = true, onLoad, onError, ...props }: ImageProps & { preview?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const { props: img } = getImageProps(props);
  const avif = avifSrcSet(img.srcSet);
  const tiny = preview && avif && typeof props.src === "string" ? imageLoader({ src: props.src, width: 32 }) : null;
  const shown = (el: HTMLImageElement | null) => {
    // Downloaded before React started: no load event will come.
    if (el?.complete && el.naturalWidth) setLoaded(true);
  };

  return (
    <>
      <picture>
        {avif && <source type="image/avif" srcSet={avif} sizes={img.sizes} />}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes in through getImageProps */}
        <img
          {...img}
          ref={tiny ? shown : undefined}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            dropAvifOnError(e);
            onError?.(e);
          }}
        />
      </picture>
      {tiny && (
        <span
          className={`smooth-preview${loaded ? " is-gone" : ""}`}
          style={{ backgroundImage: `url(${tiny})` }}
          aria-hidden
        />
      )}
    </>
  );
}
