/*
 * Response headers and moved pages, in one place for both hosts of the site:
 *   - `next dev` reads them through next.config.ts;
 *   - the Cloudflare Pages build writes them to out/_headers and out/_redirects
 *     (scripts/cloudflare-pages.mjs).
 *
 * What the pages may load. Everything is self-hosted except: YouTube (VideoPlayer: IFrame API +
 * privacy-enhanced embed), the location map's tiles (ArcGIS) and driving route (OSRM),
 * Google Sheets (content/sheets.ts: the published Chalets sheet, read from docs.google.com and
 * served from *.googleusercontent.com, and the Visit requests Apps Script on script.google.com),
 * Cloudflare Web Analytics (on for the zone; Speed Brain's rules come from the site's own
 * /cdn-cgi/), and PostHog analytics, EU cloud (src/lib/analytics.ts: events to eu.i.posthog.com,
 * add-ons such as session recording from eu-assets.i.posthog.com). Add a host here before using
 * a new third-party service.
 * 'unsafe-inline' scripts: Next.js inlines its hydration data and the JSON-LD; the pages are
 * static files, so there is no server to hand out nonces.
 */

/** @param {{ dev: boolean }} opts */
export function contentSecurityPolicy({ dev }) {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.youtube.com https://s.ytimg.com https://static.cloudflareinsights.com https://eu-assets.i.posthog.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://server.arcgisonline.com https://i.ytimg.com",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    `connect-src 'self'${dev ? " ws: wss:" : ""} https://router.project-osrm.org https://cloudflareinsights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com https://docs.google.com https://*.googleusercontent.com https://script.google.com`,
    "worker-src 'self' blob:",
    "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

/** @param {{ dev: boolean }} opts */
export function securityHeaders({ dev }) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy({ dev }) },
    { key: "Strict-Transport-Security", value: "max-age=63072000" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    // YouTube embeds need the referrer (the origin is enough), so never "no-referrer".
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}

/*
 * Photos, videos, fonts and icons from public/ (and the resized photos in /_img/): browsers keep
 * them a week instead of re-checking on every visit. To replace one, save it under a new file name.
 */
export const mediaExtensions = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg", "ico", "mp4", "webm", "woff2"];
export const mediaCacheControl = "public, max-age=604800";

/** Renamed or removed pages: old link → new page (Arabic paths; the English ones under /en follow). */
export const movedPages = [
  { from: "/units", to: "/compound" },
  { from: "/master-plan", to: "/chalet" },
  // Financing plans page removed (Oct 2026); old links land on the home page.
  { from: "/financing", to: "/" },
];
