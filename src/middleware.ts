/*
 * Language routing for `next dev` only. The Cloudflare build is static files, where
 * scripts/cloudflare-pages.mjs does the same job: Arabic pages at the root, /ar/... redirected
 * to the unprefixed URL. (No browser-language redirect or ?plan= cleanup there.)
 */
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // Plan links (/register?plan=…, /financing?plan=…) are retired: send any old ones to the
  // plain page so those URLs never render as pages of their own.
  if (req.nextUrl.searchParams.has("plan")) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("plan");
    return NextResponse.redirect(url, 308);
  }
  return intl(req);
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*", "/((?!_next|.*\\..*).*)"],
};
