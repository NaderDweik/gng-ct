import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { palette } from "@/theme/tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.nameAr} | ${site.nameEn}`,
    short_name: site.nameEn,
    description: site.taglineAr,
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: palette.white,
    theme_color: palette.secondary,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
