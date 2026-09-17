import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { articles } from "@/content/news";

const routes = [
  "",
  "/about",
  "/gallery",
  "/services",
  "/master-plan",
  "/financing",
  "/leadership",
  "/amenities",
  "/location",
  "/news",
  "/faq",
  "/register",
  "/units",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl;
  const staticEntries = routes.flatMap((path) => [
    {
      url: `${base}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ar: `${base}${path}`,
          en: `${base}/en${path}`,
        },
      },
    },
  ]);

  const newsEntries = articles.map((a) => ({
    url: `${base}/news/${a.slug}`,
    lastModified: new Date(a.date),
    alternates: {
      languages: {
        ar: `${base}/news/${a.slug}`,
        en: `${base}/en/news/${a.slug}`,
      },
    },
  }));

  return [...staticEntries, ...newsEntries];
}
