import path from "node:path";
import sharp from "sharp";
import { galleryImages } from "@/content/gallery";

let blurs: Promise<Record<string, string>> | null = null;

/**
 * Server only (the gallery page): a 12 px wide WebP of each gallery photo as a data URL
 * (~100 bytes), drawn blurred under its tile while the real photo downloads. Made once per
 * build (static export); `next dev` makes them on the first visit.
 */
export function galleryBlurs() {
  blurs ??= Promise.all(
    galleryImages.map(async (g) => {
      const tiny = await sharp(path.join(process.cwd(), "public", g.src))
        .rotate()
        .resize({ width: 12 })
        .webp({ quality: 40 })
        .toBuffer();
      return [g.src, `data:image/webp;base64,${tiny.toString("base64")}`] as const;
    }),
  ).then(Object.fromEntries);
  return blurs;
}
