# Giving City / روح العطاء

Arabic-first Next.js website for **Giving City** (Al-Ataa for City Development & Financing).

- Domain: [giving-estate.com](https://giving-estate.com)
- Source of truth: `SOURCE_OF_TRUTH.md` · `SOURCE_OF_TRUTH_SUMMARY.md`
- Repo: https://github.com/NaderDweik/gng-ct

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · next-intl (AR default RTL, EN secondary)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local dev (Turbopack)
- `npm run build` — production build
- `npm start` — serve production build

## Deploy

Production deploys run via **GitHub Actions** on every push to `main` (workflow: `.github/workflows/deploy.yml`). Hosting is **Vercel**.

### One-time setup

1. Create / open the project on [Vercel](https://vercel.com) (framework: Next.js).
2. Create a Vercel token: [Account → Tokens](https://vercel.com/account/tokens).
3. From a linked machine (or Vercel dashboard → Project Settings → General), get:
   - **Org ID** → `.vercel/project.json` → `orgId`
   - **Project ID** → `.vercel/project.json` → `projectId`  
   Or run locally: `npx vercel link` then open `.vercel/project.json`.
4. In GitHub → **NaderDweik/gng-ct** → Settings → Secrets and variables → Actions, add:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. In Vercel → Project → **Settings → Git**, turn **off** automatic deployments (or set “Ignored Build Step” to `exit 0`) so only GitHub Actions deploys — avoids double builds.
6. Attach custom domain `giving-estate.com` in Vercel → Domains.

After secrets are set, any push to `main` deploys production. You can also run the workflow manually under Actions → **Deploy Production**.
