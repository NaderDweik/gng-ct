import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV !== "production";

/*
 * What the pages may load. Everything is self-hosted except: Cloudflare Turnstile (register
 * form), YouTube (VideoPlayer: IFrame API + privacy-enhanced embed), the location map's tiles
 * (ArcGIS) and driving route (OSRM), and Cloudflare Web Analytics if it is switched on in the
 * Cloudflare dashboard. Add a host here before using a new third-party service.
 * 'unsafe-inline' scripts: Next.js inlines its hydration data and the JSON-LD; nonces would
 * force every page to render per request instead of being served static.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.youtube.com https://s.ytimg.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://server.arcgisonline.com https://i.ytimg.com",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""} https://router.project-osrm.org https://cloudflareinsights.com`,
  "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // YouTube embeds need the referrer (the origin is enough), so never "no-referrer".
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Every quality={…} used by an <Image> must be listed (required from Next.js 16).
    qualities: [75, 88, 90, 92, 95],
    // Keep resized photos for 31 days instead of 60 s: far fewer optimizations (Vercel bills
    // them) and faster pages. To change a photo, save it under a new file name.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "giving-city.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Photos, videos, fonts and icons from public/: browsers and Cloudflare keep them a week
      // instead of re-checking on every visit. Same rule as above: new file name to replace one.
      {
        source: "/:path*.:ext(jpg|jpeg|png|webp|avif|gif|svg|ico|mp4|webm|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
    ];
  },
  // Renamed pages: /units is now /compound, /master-plan is now /chalet.
  async redirects() {
    return [
      { source: "/units", destination: "/compound", permanent: true },
      { source: "/en/units", destination: "/en/compound", permanent: true },
      { source: "/master-plan", destination: "/chalet", permanent: true },
      { source: "/en/master-plan", destination: "/en/chalet", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
