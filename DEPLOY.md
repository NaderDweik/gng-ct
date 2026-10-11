# Soft launch — Vercel + giving-estate.com

The app is production-ready and pushed to https://github.com/NaderDweik/gng-ct.

## Deploy (one-time)

1. Go to [vercel.com/new](https://vercel.com/new) and import **NaderDweik/gng-ct** (personal account).
2. Framework preset: **Next.js** (auto-detected via `vercel.json`).
3. Deploy — you get a `*.vercel.app` preview URL immediately.
4. Project → **Settings → Domains** → add `giving-estate.com` and `www.giving-estate.com`.
5. At your DNS provider, add the records Vercel shows (usually A/`76.76.21.21` for apex + CNAME for www).
6. Wait for TLS to become **Valid**, then smoke-test:

   - `/` hero + WhatsApp float  
   - `/financing` calculator  
   - `/register` → WhatsApp deep link  
   - `/gallery` images + videos  
   - `/en` English locale  

## CLI alternative

```bash
npx vercel login
npx vercel --prod
npx vercel domains add giving-estate.com
```

Analytics can be added later when the client provides a GA4/Plausible ID.

## Security checklist (before going live)

Already in the code: security headers + Content-Security-Policy (`next.config.ts`), real visitor
IP behind Cloudflare (`src/lib/clientIp.ts`), same-site check, honeypot, fill-time check,
per-IP rate limit, Turnstile and duplicate-phone window on `/api/register`.

1. **Vercel → Settings → Environment Variables (Production):** `WHATSAPP_TOKEN`,
   `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TO`, `WHATSAPP_TEMPLATE`, `WHATSAPP_TEMPLATE_LANG`,
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`. Never commit them. Redeploy after.
2. **Turnstile:** Cloudflare → Turnstile → Add widget, hostnames `giving-estate.com` and
   `www.giving-estate.com`, mode *Managed*. Copy the two keys into step 1.
3. **Cloudflare (free plan) in front of Vercel:**
   - DNS: apex + `www` records from Vercel, **Proxied** (orange cloud).
   - SSL/TLS → **Full (strict)**; Edge Certificates → *Always Use HTTPS* on.
   - Security → Bots → **Bot Fight Mode** on.
   - Security → WAF → Rate limiting rule: URI path equals `/api/register`, method POST,
     5 requests / 10 s per IP → Block for 10 s.
   - Speed → Optimization: **Rocket Loader off** (it breaks React hydration). Leave Brotli on.
   - Caching: leave defaults; photos/videos send their own 7-day `Cache-Control`.
   - Optional: Web Analytics (free, no cookie banner needed); the CSP already allows it.
4. **Accounts:** 2-factor login on Vercel, Cloudflare, GitHub, the domain registrar and Meta
   Business. Give teammates their own logins, never shared passwords.
5. **Replacing a photo or video later:** save it under a **new file name** and update the path.
   Browsers and Cloudflare keep public files 7 days and resized photos 31 days.
6. **Adding a third-party service** (analytics, chat widget, embed): add its host to the CSP in
   `next.config.ts`, or the browser will block it.
7. Keep dependencies patched: `npm audit --omit=dev` should report 0 before each deploy.
