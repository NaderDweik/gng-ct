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
