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

export async function generateMetadata() {
  return notFoundMetadata({ params: localeParams() });
}

export default function NotFound() {
  const params = localeParams();
  return (
    <LocaleLayout params={params}>
      <NotFoundPage params={params} />
    </LocaleLayout>
  );
}
