import { site } from "@/content/site";

// Static export (Cloudflare Pages): written once at build time.
export const dynamic = "force-static";

/*
 * robots.txt. A route rather than app/robots.ts, which can't write Content-Signal
 * (https://contentsignals.org): appear in search, may be quoted in AI answers (ai-input),
 * not used to train AI models (ai-train). Signals only: crawlers choose to follow them.
 */
const body = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

Host: ${site.siteUrl}
Sitemap: ${site.siteUrl}/sitemap.xml
`;

export function GET() {
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
