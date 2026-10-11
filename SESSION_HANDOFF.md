# Session handoff — 2026-10-11

> **For the next agent:** read this first, then `SOURCE_OF_TRUTH_SUMMARY.md` (product state) and
> `SOURCE_OF_TRUTH.md` (business brief). This file records what changed in the 2026-10-11 session,
> the decisions the client made, and what is still open. **Nothing from this session is committed**
> (`git status` shows ~108 changed/new files on `main`; last commit is `8fad139`).
>
> Note: `SOURCE_OF_TRUTH*.md` were **not** updated this session and are now partly stale
> (FAQ, news, pricing wording, nav labels). Trust the code + this file over them.

---

## How the client works (preferences learned)

- Talks in short, informal messages (often Arabic + English mixed). Wants things **done**, not
  proposals; when asked "what would we do…?" and then says "fix that", it means do it all.
- **Mobile requests are mobile-only**: "the web is fine, don't change anything" — gate changes behind
  `@media (max-width: 767px)` (or Tailwind `max-md:` / `md:` resets). Desktop must stay identical.
- Taste: **elegant, adult, business-like** — no childish/bouncy animation. Likes smooth, calm motion
  (hand-over transitions, gliding indicators). Dislikes "default slop" transitions and flicker.
- Business rules (important):
  - **Never disclose chalet availability** (no available/sold/reserved anywhere). Every chalet leads
    to "ask us / visit us".
  - **No price on the units page.** (Elsewhere the old 168,000 JD / 0% / 24% cash copy still exists —
    see Open items.)
  - No "blocks" concept on the compound map; no lists of all chalet numbers; no coloured tags.
  - Reply-time copy: "as soon as possible", **no hours / working days**.
  - Arabic spelling: **الكمباوند** (not كمبوند). Sales office: **Le Royal Hotel, First Floor**.
- Prefers seeing it working; I verified every change with headless Chromium (Playwright from
  `~/.npm/_npx/705bc6b22212b352/node_modules/playwright-core`) at 390×844 (phone) and 1440×900.

## Environment gotchas

- **Dev server image optimizer gets stuck** (`next dev --turbopack`, started 18:42): new
  `/_next/image` sizes hang forever (cached sizes return instantly). Symptom: grey/blank photos on
  phone widths. Fix = restart (`Ctrl+C`, `npm run dev`, or `rm -rf .next && npm run dev`). For
  screenshots I route `/_next/image?url=…` to the source file in Playwright. **The client was told to
  restart; unknown whether they did.**
- **CSS build polyfills one-sided logical properties** (`inset-inline-start`, `margin-inline-start: auto`,
  `padding-inline-start`, `border-inline-end` …) with `:lang()` rules that **outrank media queries**
  and can **drop `color-mix()`**. Use physical `left/right/padding-left…` plus a `[dir="rtl"]` override
  instead. (Shorthands like `inset-inline`, `padding-inline` with two values are fine.)
- Don't run Prettier (not a project tool; it reformatted a file once — reverted).
- Empty stray file `public/n` (0 bytes, created by the editor) — untouched, client may delete.

---

## What was done (by area)

### 1. Small fixes
- `src/components/ui/LoopVideo.tsx`: `suppressHydrationWarning` on `<video>` (a browser extension was
  injecting `crossorigin`, causing a hydration warning).

### 2. `/units` → "Compound map" explorer (biggest feature)
- Source: client's layered TIFF `~/Downloads/design fainal.tif` (7874×5906, CMYK, each chalet tag is a
  named layer). 446 chalet positions extracted → `src/content/compound-units.ts` (generated; id, x, y,
  w, h in % of the plan). Plan exported to `public/plans/compound/compound-plan-{1600,2800,4400}.webp`.
  The 408 MB copy in `public/hero/` was deleted (original stays in `~/Downloads`).
- **Plan typo:** two tags read "S 21"; the eastern one is listed as **S19** (missing otherwise) —
  *confirm with designer*.
- `src/features/units/CompoundPlan.tsx` + `src/styles/sections/compound-plan.css` (`.cx-*`):
  full-screen map under a `SubpageHeader`, page header + map = exactly one screen (`.cx-page`).
  Tap/hover a chalet → fly-to + green pin + card (facts, "Ask about X" WhatsApp with prefilled
  message, "Book a visit", "See it from the inside" → `/master-plan`). Search by number,
  "Pick one for me" (random), zoom buttons / pinch / ctrl-wheel / drag, minimap (desktop),
  smart tap radius on phones, gliding tooltip (single element, intent delay).
  "Step inside a chalet" card uses the line plan + coloured pool crop (same look as `/master-plan`).
- Copy in `src/content/units.ts` → `compoundCopy` (en/ar). No availability, no price, no blocks.
- Nav label: Arabic **"خريطة الكمباوند"** for `/units` (header, mobile menu, footer); English still "Units".
  Page title AR "اعثر على شاليهك." / EN "Find your chalet."

### 3. `/master-plan` room viewer (`src/features/master-plan/RoomViewer.tsx`, `room-viewer.css`)
- Hover a space on the plan → becomes current after a 110 ms intent delay (no strobing).
- Flicker removed: photos cross-fade with the old one solid underneath; caption and counter hand
  over (out + in); clip card stays mounted and new clip fades in only when loaded; one gliding
  outline (`.rmv-frame`); rolling odometer counter; arrows with directional fill sweep.
- New step bar (`.rmv-steps`): one segment per space, glowing thumb glides, segments clickable.
- Nav label AR "المخطط العام" → **"المخطط"**; page title AR **"مخطط أحد الشاليهات"** (EN unchanged).

### 4. FAQ — replaced with client's content
- `src/content/faq.ts`: 6 categories / 20 Q&A (compound, chalet, visit, pricing, ownership, invest),
  EN translated by me (client should proof-read). Home preview = where, size, deed, plans, handover.
  `/financing` uses category id `pricing`. Spelling normalised to الكمباوند site-wide.

### 5. News — replaced with client's deck `public/news/الاخبار.pdf` (47 slides)
- `src/content/news.ts` (generated): 46 articles (slides 27/28 duplicate), each with
  `category` (planning/approvals/infrastructure/security/services/amenities/compounds),
  photos in `public/news/<slug>(-n).webp`, OG images `public/og/news/<slug>.jpg` (old OGs removed).
- Decisions: bike-centre date 10/11/2026 → **2025-11-10** (confirm); public-services slide had no
  photo (uses landscaping's); **deed photo has national ID + registrar name blurred**.
- **Open:** the original PDF is still in `public/` → downloadable unblurred at `/news/الاخبار.pdf`.
  Recommended moving it out of `public/` — awaiting client's OK.
- `/news` page: year timeline (sticky year column, rail with **scroll-progress dot** driven by
  `src/features/news/YearRail.tsx`, rAF-eased transforms); cards (`.news-card`) with topic + date
  meta line, 3-line excerpt, hover lift + green top line. Article pages show extra photos
  (`.article-gallery`).

### 6. Hero (home) — `src/features/home/HeroLayered.tsx`, `src/content/hero.ts`
- `sizes` fixed (`HERO_SIZES`) so phones fetch the 3840 px file (was blurry: fetched ~1080 px).
- **Art direction:** portrait photos on portrait screens (`(max-aspect-ratio: 3/4)`) via
  `getImageProps` + `<picture>` (`HeroArtPhoto`), `mobileBackground` / `mobileFocus` per slide:
  - `public/hero/entrance-fountain-and-gatehouse-mobile-responsive.jpg` (focus 85% 50%)
  - `public/hero/quad-bike-royal-clubhouse-mobile-responsive.jpg` (focus 100% 50%)
  - `public/hero/giant-chess-poolside-royal-mobile-responsive.jpg` (focus 50% 50%)
- Unused: `public/hero/Gemini_Generated_Image_d4szgyd4szgyd4sz.jpg` (2.7 MB) — offered to delete,
  no answer yet.

### 7. Home page — mobile polish (all `max-width: 767px`, desktop untouched)
- **About / HomeIntro** (`HomeIntro.tsx`, `home-intro.css`): full-bleed photo, copy card overlapping,
  facts panel, full-width CTA. Animation: scroll-driven photo drift (named `view-timeline` on
  `.hi-frame` — the frame clips, so `view()` on the img didn't move), title line-by-line mask rise,
  facts rule draws + checks draw (stroke). A "367+" count-up badge was added then **removed at
  client's request**. **← last thing worked on.**
- **Amenities** (`AmenitiesGrid.tsx`, new `AmenitiesScrollFocus.tsx`, `amenities-grid.css`): the
  desktop hover slide now plays on touch screens for the card crossing the screen middle
  (`.is-active`). Tighter type on small phones.
- **FAQ** (`home-faq.css`): intro centred with ruled eyebrow; fixed number column; less bottom gap.
- **News preview** (`NewsPreview.tsx`, new `NewsDots.tsx`, `news-preview.css`): centred heading;
  cards become a swipe row with peek + dots; topic + date meta.
- **Stats band** (`page.tsx`, `v-lines.css`): 2×2 cells with faint teal cross; `dir="ltr"` on figures
  (Arabic showed "+367").
- **Gallery tabs** (`GalleryGrid.tsx`, `gallery.css`): phones show all 6 tabs at once as equal pills
  in a 3-column grid (2 columns under 375px) with a gliding green pill. **Client rejects sideways
  scrolling on phones** ("dumb, bad UX") — avoid horizontal scroll rows. (Note: the home news
  preview is still a swipe row from earlier — may need the same treatment if the client objects.)
- **About page (phones)** (`about/page.tsx`, `about.css`, new `components/ui/InViewOnce.tsx`):
  "Our story" eyebrow + title centred; four promises = compact numbered rows, icon fills green on
  scroll-in; leadership block centred with full-width button.
- **/master-plan on phones** (`room-viewer.css`, `SubpageHeader` new `compactMobile` prop): slim
  header (title only, EN "A chalet's plan"), photo 11rem with description hidden, plan 80% wide,
  no step bar/counter; one row = "Register interest" (start) + prev/next arrows (end). Whole viewer
  fits the first screen (buttons end ≈720px on 390×844). Client kept asking for "more compact".
- **/amenities** (`AmenitiesPage.tsx`, `amenities/page.tsx`, `amenities-page.css`):
  "Serviced daily" showcase is now **scroll-driven** (no hover, no 6s timer). Desktop: panel
  pins (sticky; extra scroll comes from a `::after` spacer — sticky can't travel into padding);
  phones: photo pins, all lines show copy, the line under the photo lights up. Phones also:
  centred headings (`.ap-svc-head`), stats as a 2×2 cross grid, community mosaic as a 2-column
  grid (first + last tile full width, titles only).
- **/news on phones** (`article.css`, `news/page.tsx`): stories are compact rows (thumbnail +
  text), full summaries (no clamp), page 24k → ~12k px; hover look plays on scroll via
  `components/ui/ScrollFocus.tsx` (also used by the amenities community mosaic). Client rule:
  **never cut content** on mobile; replace hover with scroll everywhere.
- **Opening hours removed everywhere** (client): register page tile, `site.hoursAr/En`, the
  `openingHoursSpecification` in `lib/seo.ts`, and the unused `location.hours` message.
- **Financing + register pages (phones)**: centred content, InViewOnce scroll reveals
  (`financing.css`, `register.css`); register contact = centred tiles.
- **Register CTA**: a mobile redesign was made and then **fully reverted** (component and CSS are
  back to original).

### 8. Site-wide
- Header CTA: Arabic "سجل اهتمامك" same box as English (219×42) — `primitives.css` `[dir="rtl"] .nav-cta`.
- Reply-time copy → "as soon as possible" (`messages/*.json` `common.responseTime`, seo register desc).
- Leadership principles hover (`leadership.css`): divider draws green, faint wash, number lifts,
  siblings dim (replaced the green highlight blocks).
- Floating WhatsApp has class `wa-float` (hidden on `/units` mobile when a chalet card is open).
- **Footer** (`Footer.tsx`): hours removed; sales office = `site.salesOfficeAr/En`
  ("فندق الرويال، الطابق الأول" / "Le Royal Hotel, First Floor", also on `/register`);
  mobile: centred, Navigation / Quick Links / Sales Office stacked, headings larger with short green
  rule, phone + WhatsApp on one line with icons and a thin separator. An accordion version was
  made and **reverted** (client disliked it). Desktop footer unchanged apart from removed hours.

---

## Open items / waiting on the client

1. **Restart the dev server** (images stuck) — see gotchas.
2. ~~Move `public/news/الاخبار.pdf` out of `public/`~~ Done 2026-10-12 (deleted; still in git
   history of the public GitHub repo — see the 2026-10-12 section).
3. ~~Delete the unused Gemini hero image~~ Done 2026-10-12 (all unused files removed).
4. Confirm with designer: **S19 vs S21** on the compound plan; bike-centre news date.
5. **Copy that contradicts the new FAQ** (FAQ says prices vary, ask the team; 4 bathrooms; near Ibn
   Sina University & the airport). Still present: 168,000 JD / 0% interest / 24% cash on
   `/financing`, `src/content/pricing.ts`, home intro facts ("Zero-interest plans, direct"),
   stats band "0% interest", footer description ("zero-interest direct financing" — client asked to
   keep it when reverting), `seo.ts` units description, `about/page.tsx`, article footer line;
   "2 baths" in older copy; "41 km from Le Royal" on `/location`, `seo.ts`, `site.locationEn`
   (kept intentionally as the compound's location). Client hasn't decided — ask before changing.
6. English labels not mirrored to the Arabic changes: nav "Units" (AR "خريطة الكمباوند"),
   `/master-plan` title "Every corner, in its place." (AR "مخطط أحد الشاليهات"). Asked, no answer.
7. FAQ English translations → client to proof-read.
8. `src/content/units.ts` still holds the old placeholder `unitPlans` / `unitFilters` (unused).
9. `SOURCE_OF_TRUTH_SUMMARY.md` should be refreshed with this session's changes.
10. Nothing committed — when asked, commit on a branch (repo convention: branch before committing on
    `main`).

---

## 2026-10-12 — launch hardening (security + weight)

- **Dependencies:** `npm audit fix`; Next 15.5.24 → 15.5.27, sharp patched; `overrides` forces
  Next's bundled PostCSS to ^8.5.29. `npm audit --omit=dev` = 0. (Remaining dev-only `braces`
  advisory in eslint-config-next has no fix upstream; not shipped.)
- **Headers** (`next.config.ts`): CSP (allows Turnstile, YouTube, ArcGIS tiles, OSRM, Cloudflare
  Web Analytics), HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, COOP.
  Public media: `Cache-Control: public, max-age=604800`; `images.minimumCacheTTL` = 31 days.
  → **New third-party service = add its host to the CSP. Replaced photo = new file name.**
- **/api/register:** real visitor IP behind Cloudflare (`src/lib/clientIp.ts`: trusts
  `cf-connecting-ip` only from Cloudflare's IP ranges); rejects cross-site posts (Origin check).
- **Images:** the 46 gallery PNGs (1672×941 / 1536×1024) → JPEG q90 4:4:4 mozjpeg, same names
  with `.jpg`, refs updated (135 MB → 23 MB). `motion/cta-loop.mp4` re-encoded 7.7 → 5.8 MB
  (1080p, CRF 28, same frames/colour range).
- **Removed every unreferenced file in `public/`** (client: "anything not used just remove"):
  143 files — the old gallery PNGs, `gallery/img_*.jpg`, Gemini images, `hero/slide-*`,
  `hero.jpg`, hero cutouts, `home/intro-*-v2.webp`, `plans/unit-plan.svg`, create-next-app SVGs,
  `logo*.svg`, stray `public/n`, and **`news/الاخبار.pdf`** (privacy). `public/` 288 → 68 MB.
  All were tracked in git (restorable with `git restore public/<path>` until committed).
  Re-crawl after removal: no 404s; all 187 referenced asset paths exist.
- `DEPLOY.md` now has the launch security checklist (Vercel env vars, Turnstile, Cloudflare
  settings, 2FA).
- **GitHub repo `NaderDweik/gng-ct` is public** and commit `d3b47de` contains the unblurred PDF →
  make the repo private (or purge it from history). No secrets found in history.
