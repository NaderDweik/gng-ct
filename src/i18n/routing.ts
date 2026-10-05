import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "as-needed",
  // hreflang comes from page metadata (lib/seo.ts) on the canonical domain; the
  // middleware's Link header would use the request host (e.g. *.vercel.app).
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.includes(value as Locale);
}
