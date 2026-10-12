# Launch: Cloudflare Pages + giving-estate.com

## How the site runs

- **100% static.** `npm run build` writes the whole site as plain files to `out/`: every page in
  both languages, the photos resized for phones (`out/_img/`), the security headers
  (`out/_headers`) and the redirects (`out/_redirects`). `scripts/cloudflare-pages.mjs` does the
  Cloudflare-specific part. No Functions/Workers, no environment variables, no secrets.
- **Register form:** checks the fields in the browser, then opens
  `https://wa.me/<number>?text=<the lead>` so the visitor sends it from their own WhatsApp.
  The number is `site.whatsapp` / `site.whatsappUrl` in `src/content/site.ts` (the sales number,
  962790029928).
- Arabic is at the root (`/`, `/compound`), English under `/en`. Old `/ar/...`, `/units` and
  `/master-plan` links redirect (list in `hosting.config.mjs`).
- SSL is free and automatic. The Namecheap SSL certificate isn't needed.
- `npm run dev` works as before (normal Next.js dev server; the language middleware only runs there).

## Status (2026-10-12): nothing deployed yet

Done:
- Cloudflare account (free plan); zone **giving-estate.com is Active**. Namecheap uses the
  Cloudflare nameservers; DNSSEC off. The domain is registered at Namecheap for 3 years.
- DNS: Namecheap parking records deleted. Kept: 5 MX `eforward1-5.registrar-servers.com` + SPF
  TXT (Namecheap email forwarding). No `@` / `www` records yet. Pages adds them at go-live.
- SSL: Universal certificate Active (`giving-estate.com` + `*.giving-estate.com`), mode Automatic
  (fine: Pages has no origin server). Always Use HTTPS on, minimum TLS 1.2.
- Security: Bot Fight Mode on. A WAF rate-limiting rule "register-form" on `/api/register` still
  exists, but that path no longer exists. It's harmless, so delete it or leave it.
- Speed: Rocket Loader **off** (it breaks React). Web Analytics (RUM) on, Speed Brain on.
- Redirect rule "Redirect from WWW to root": `https://www.*` → `https://${1}`, 301, keeps the
  query string. It starts working once `www` gets its record at go-live.
- Pages project **giving-estate** created with wrangler (production branch `main`, no deployments).
- Wrangler is logged in on this computer as nderdweik@gmail.com.

To tidy up in the dashboard (not needed for the site to work):
- Delete the Turnstile widget "giving-estate" (the site no longer uses Turnstile).
- ~~4 leftover Pages secrets~~: deleted 2026-10-12. The project has no secrets.

Skipped for now: Email Routing (Namecheap forwarding kept).

## Remaining steps, in order

1. **Lock the test address** (optional but recommended). Workers & Pages → giving-estate →
   Settings → **Access policy** → Enable. Then Zero Trust → Access → Applications → open the app it
   created → add the hostname `giving-estate.pages.dev` (by default only preview links are
   covered) → policy **Allow**, include **Emails** = your address → Save. Zero Trust's Free plan
   is $0 for up to 50 users, but it may ask for a card.
2. **First deploy** (only when the client says go):
   ```bash
   npm run build && npm run deploy
   ```
   This uploads `out/` to the existing **giving-estate** project. Open
   `https://giving-estate.pages.dev`, click through every page in both languages, and send one
   form from a phone: WhatsApp should open with the lead written out.
3. ~~Before going live: set the sales number~~: done 2026-10-12. Calls, WhatsApp buttons and
   the form all go to 962790029928 (`src/content/site.ts`).
4. **Go live:** Workers & Pages → giving-estate → **Custom domains** → Set up a custom domain →
   `giving-estate.com`, then `www.giving-estate.com`. Wait for both to show **Active** (minutes).
   The Access lock, if used, stays on `giving-estate.pages.dev` only.
5. **After launch:**
   - Google Search Console: add the domain; Cloudflare can add the TXT record. Submit
     `https://giving-estate.com/sitemap.xml`.
   - Set up the Google Business Profile.
   - Send a test email to an `@giving-estate.com` address to confirm Namecheap forwarding still
     works on Cloudflare DNS. If it doesn't, turn on Cloudflare Email Routing (free).

## Notes on the Cloudflare settings

- **Web Analytics** is on for the whole zone, so it covers the real domain. Don't also switch it
  on in the Pages project's Metrics tab. The CSP allows its script
  (`static.cloudflareinsights.com`) and its reports (`cloudflareinsights.com`).
- **Speed Brain** loads its prefetch rules from the site's own `/cdn-cgi/` path, which the CSP
  allows. The site already prefetches its own pages, so it adds little, but it's harmless.

## Updating the site later

```bash
npm run build && npm run deploy
```

The first build on a computer takes ~2 min (it resizes every photo); later builds reuse them.
To test the production build locally first: `npm run build && npm run preview` → http://localhost:8788.

Pushing to GitHub does **not** deploy. The project was created with wrangler ("Direct
Upload"), and Cloudflare can't switch such a project to Git integration later. To deploy on every
push, create a new Pages project from the GitHub repo (build command `npm run build`, output `out`)
and move the custom domains to it.

## Security checklist

Already in the code: security headers + Content-Security-Policy (`hosting.config.mjs`). With no
server code, there is nothing on the site for an attacker to call.

1. **Accounts:** 2-factor login on Cloudflare, GitHub and Namecheap. Give teammates their own
   logins, never shared passwords.
2. **Replacing a photo or video later:** save it under a **new file name** and update the path.
   Browsers keep photos, videos and resized photos for 7 days.
3. **Adding a third-party service** (analytics, chat widget, embed): add its host to the CSP in
   `hosting.config.mjs`, or the browser will block it.
4. Keep dependencies patched: `npm audit --omit=dev` should report 0 before each deploy.
