import type { MetadataRoute } from "next";
import { articles } from "@/content/news";
import { seoPages, type SeoRoute } from "@/content/seo";
import { localeUrl } from "@/lib/seo";

/** Bump when page content changes meaningfully (crawlers trust stable dates over "now"). */
const CONTENT_UPDATED = "2026-10-05";

const priority: Partial<Record<SeoRoute, number>> = {
  "": 1,
  "/units": 0.9,
  "/financing": 0.9,
  "/register": 0.8,
  "/gallery": 0.8,
  "/amenities": 0.8,
  "/location": 0.7,
  "/faq": 0.7,
  "/about": 0.7,
};

function entry(path: string, lastModified: string, p: number, images?: string[]) {
  const alternates = {
    languages: {
      ar: localeUrl("ar", path),
      en: localeUrl("en", path),
      "x-default": localeUrl("ar", path),
    },
  };
  // One <url> per locale, each listing both (Google's hreflang sitemap format).
  return (["ar", "en"] as const).map((locale) => ({
    url: localeUrl(locale, path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: p,
    alternates,
    ...(images ? { images } : {}),
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = (Object.keys(seoPages) as SeoRoute[]).flatMap((path) =>
    entry(path, CONTENT_UPDATED, priority[path] ?? 0.5),
  );
  const news = articles.flatMap((a) =>
    entry(`/news/${a.slug}`, a.date, 0.6, [localeUrl("ar", a.image)]),
  );
  return [...pages, ...news];
}
