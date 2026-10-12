/*
 * next/image loader for the static Cloudflare Pages build: each <Image> points at a WebP that
 * scripts/cloudflare-pages.mjs resized at build time, under /_img/<original path>-<width><q>.webp.
 * Two quality steps: "h" (quality 85 and up: hero, gallery, lightbox) and "s" (everything else).
 * `next dev` serves the original file.
 */

const RASTER = /^\/[^/].*\.(jpe?g|png|webp|avif)$/i;

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // ?w= only tells next/image the loader honours width; static files ignore it.
  if (process.env.NODE_ENV === "development") return src.startsWith("/") ? `${src}?w=${width}` : src;
  if (!RASTER.test(src)) return src;
  return `/_img${src}-${width}${(quality ?? 75) >= 85 ? "h" : "s"}.webp`;
}
