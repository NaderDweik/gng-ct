import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { mediaCacheControl, mediaExtensions, movedPages, securityHeaders } from "./hosting.config.mjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  /*
   * `npm run build` writes the whole site as plain files to out/ for Cloudflare Pages, then
   * scripts/cloudflare-pages.mjs finishes it (Arabic at the root, _headers, _redirects, resized
   * photos). `next dev` stays a normal server so the language middleware runs locally.
   */
  output: isDev ? undefined : "export",
  // `npm run dev` works in its own folder, so a dev server left running never breaks
  // `npm run build` (both used to write .next).
  distDir: isDev ? ".next-dev" : ".next",
  poweredByHeader: false,
  images: {
    // Pages has no image server: photos are resized at build time (src/lib/imageLoader.ts),
    // so any quality={…} works.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
  // In production the same headers and redirects go to out/_headers and out/_redirects
  // (static export ignores these).
  ...(isDev && {
    async headers() {
      return [
        { source: "/:path*", headers: securityHeaders({ dev: true }) },
        {
          source: `/:path*.:ext(${mediaExtensions.join("|")})`,
          headers: [{ key: "Cache-Control", value: mediaCacheControl }],
        },
      ];
    },
    async redirects() {
      return movedPages.flatMap(({ from, to }) => [
        { source: from, destination: to, permanent: true },
        { source: `/en${from}`, destination: `/en${to}`, permanent: true },
      ]);
    },
  }),
};

export default withNextIntl(nextConfig);
