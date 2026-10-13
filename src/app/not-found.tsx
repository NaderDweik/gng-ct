import { headers } from "next/headers";
import LocaleLayout from "./[locale]/layout";
import NotFoundPage, { generateMetadata as notFoundMetadata } from "./[locale]/404/page";

/*
 * Unknown URLs under `next dev`. html/body live in `[locale]/layout`, so this renders that layout
 * around the site's 404 (app/[locale]/404). The language middleware (dev only) says which side of
 * the site the URL was on. In the static build this becomes out/404.html, which
 * scripts/cloudflare-pages.mjs swaps for the Arabic /404; Pages serves /en/404 under /en/.
 */
async function localeParams() {
  const en =
    process.env.NODE_ENV === "development" && (await headers()).get("x-next-intl-locale") === "en";
  return { locale: en ? "en" : "ar" };
}

/*
 * Static build: Next renders this fallback alongside every page, and LocaleLayout / the 404
 * page call setRequestLocale, so rendering them here switched every English page's text to
 * Arabic. out/404.html is replaced by the real /404 page anyway, so the build gets an empty one.
 */
const isDev = process.env.NODE_ENV === "development";

export async function generateMetadata() {
  if (!isDev) return { robots: { index: false } };
  return notFoundMetadata({ params: localeParams() });
}

export default function NotFound() {
  if (!isDev) {
    return (
      <html lang="ar" dir="rtl">
        <body />
      </html>
    );
  }
  const params = localeParams();
  return (
    <LocaleLayout params={params}>
      <NotFoundPage params={params} />
    </LocaleLayout>
  );
}
