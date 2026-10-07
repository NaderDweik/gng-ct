# Giving Compound — Source of Truth Summary

> Quick-lookup for AI / builders. Prefer this mid-session; escalate to `SOURCE_OF_TRUTH.md` for long FAQ/blog seed copy.
>
> **Refresh rule:** After any meaningful product/design/content change, update this file before ending the turn so the next AI session starts current.
>
> *Last refreshed: 2026-10-03 (financing simplified, article pages, white labels on primary, no em dashes in copy) · mirrors live codebase under `jordangate-redesign-main/`*

---

## Identity (copy/paste)

| Field | Value |
|-------|-------|
| AR company | شركة العطاء للتطوير والتمويل العمراني |
| EN company | Al-Ataa for City Development & Financing |
| Brand | Giving Compound / روح العطاء |
| Contact | د. طارق قازان (Dr. Tarek Qazan) |
| Phone (display) | `+962790029928` |
| Phone / WA (actions) | **TEMP test** `+962795898415` → `https://wa.me/962795898415` — switch back to `962790029928` before shipping |
| Hours | Sun–Thu 9–7 · Sat 10–4 |
| Cert | ISO 9001:2015 |
| Old site | https://giving-city.com/ |
| Live domain | https://giving-estate.com |
| IG | [@spiritgivingdevelopment](https://www.instagram.com/spiritgivingdevelopment/) |
| FB | [SpiritGivingDevelopment](https://www.facebook.com/SpiritGivingDevelopment/) |
| Maps | https://maps.app.goo.gl/PNR3uYsjeDX92fqs7 · ~31.949722, 35.930111 |
| Location | 41 km (~55 min) from Le Royal Hotel → Sahab Al-Hatmiyeh (سحاب الحطمية) · drive times: `content/location.ts` |

**What it is:** First & largest fully-serviced chalet/resort city in the region. Gated residential ownership (NOT a hotel). **367+** private resorts · **500,000 m²** · Spanish style · independent deed (سند ملكية مستقل).

Canonical runtime values: `src/content/site.ts`.

---

## Unit (every chalet)

- **500 m²** · single-floor · Spanish exterior · **3 m privacy walls**
- Interior: 3 BR (master) · 2 baths · jacuzzi · living · equipped kitchen
- Outdoor: main pool + kids pool · 2-car garage · pergola · BBQ · stone courtyards
- Build: Jordan code RC · thermostone · porcelain + LED · Super Crown/Jotun · Italian baths · Spanish facade insulation · AC / satellite / fiber · auto water pumps · pool filtration
- Security: gated + cameras + 3 m walls

---

## Pricing

Canonical: `src/content/pricing.ts` (+ mirrored in `site.stats`).

| | |
|--|--|
| Base | **168,000 JD** |
| Cash | **142,800 JD** (15% off) · immediate move-in |
| Plans | Direct with company · **0% interest** · no bank |

| Plan | Move-in | Down % | Down JD | Monthly |
|------|---------|--------|---------|---------|
| Immediate | 2025 | 35% | 59,000 | from 1,000 JD |
| Mid-term | 2026 | 25% | 42,000 | from 1,000 JD |
| Future | 2027 | 15% | 25,000 | from 1,000 JD |

UI: `PricingShowcase` (home/financing) · `PlanCompare`.

---

## Routes & build maturity

Arabic-first · locales `ar` | `en` via **next-intl** · App Router under `src/app/[locale]/`.

**Header primary nav:** About · Gallery · Units · Amenities · Financing (+ Register CTA, locale switch). Full list in `src/content/nav.ts`. Below 1100px the burger opens a full-screen menu that slides in from the burger's side (RTL-aware): centered links, Register, language, logo at the bottom; locks scroll, closes on Escape/route change.

| Path | AR | Status | Notes |
|------|----|--------|-------|
| `/` | الرئيسية | **Polished** | Cinematic layered hero (`features/home/HeroLayered`, GSAP): 3 auto-advancing slides from `content/hero.ts` (tent pavilion + pool · palms + pergola · garden swing), fixed wordmark with per-slide cut-outs in front (`public/hero/*-cutout.webp`, regenerate with `scripts/hero-cutout.mjs`); pins & recedes on scroll. Section order (top → bottom): About intro (`features/home/HomeIntro` — 3:2 crop (sides trimmed) of a 16:9 photo that assembles once in view from `public/home/intro-{sky,walls,chalet,ground,pool}-v2.webp` (sky fades, walls rise, chalet drops, ground rises, pool settles), then two white lines (`seams`, traced from the layer alpha) draw along the chalet's base (edge to edge) and the pool's lower edge, each trailing off; copy in `content/home-intro.ts`) · destinations · "A day at Giving Compound" (`features/gallery/GalleryDay` — static 7-tile bento (taller bottom row; time tag bottom-start, hover title opens under it and lifts it) with a minimal Day/Night switch (by day a sun with turning rays sits in the top-right corner) (night adds a crescent moon + stars sliding in from the section's top-right corner) that auto-turns to Night 3.5s after the section is in view (once; a press cancels it), lede inside the big tile, sets in `dayScenes`; fits one screen on desktop; Night set is dusk + lit interiors until real night photos exist) · amenities (`features/amenities/AmenitiesGrid`: 2-up horizontal cards, photo flush on the start side + icon/title/line; hover = primary border, the photo window opens across the card (image glides, never rescales) under a dark tint, text turns light and slides to the start edge) · map (`LocationShowcase`: clean map beside one panel — eyebrow, title, place, drive-time list with the auto tour, one Open map link) · stats bar (367+ resorts · 500,000 m² · 500 m² per unit · 0% interest; teal, with the banner V-line motif live in SVG at both sides, darkest green, masked out toward the middle: `components/ui/VLines` + `styles/base/v-lines.css`) · News & articles (`features/news/NewsPreview`, 3 cards from `homeNewsSlugs`) · FAQ · RegisterCta. Compare-plans cards live on /financing only |
| `/about` | من نحن | **Polished** | Full-bleed hero + CountUp stats, pillars, collage, ISO video, socials, leadership link, RegisterCta |
| `/gallery` | المعرض | **Polished** | Cinematic short hero · flush mosaic tabs (tile hover: photo blurs + darkens, centred zoom icon · category · name) · lightbox · 2 YT videos · **no** bottom RegisterCta |
| `/units` | الوحدات المتاحة | **Built** | `SubpageHeader` → `UnitsPlans` intro → unit plan section (`features/units/UnitPlanFeatures`: `public/plans/unit-plan.webp` in a framed panel on the start side, the 10 rooms/spaces as numbered tiles in two columns (Inside / Outdoors, ids via `unitPlanRows`), then a dark facts bar (plot · ownership · price from · move-in, `unitPlanPanel` in `content/master-plan.ts`) with a Register interest CTA) → "floor plans coming soon" notice |
| `/amenities` | المرافق | **Built** | `AmenitiesHoverGrid` |
| `/financing` | التمويل | **Polished** | Header → PricingShowcase picker → Four steps → FAQ |
| `/faq` | الأسئلة الشائعة | **Polished** | `FaqExplorer` (search + sticky cats + accordion) · **no** RegisterCta |
| `/register` | سجل اهتمامك | **Polished** | Compact form → `POST /api/register` → WhatsApp Cloud API template to one sales number (env in `.env.example`; until set, a tap-to-send wa.me fallback). Anti-spam on both sides (`features/register/leadRules.ts`): honeypot, 3s min fill, name/phone/no-links validation, 60s cooldown, per-IP rate limit + per-phone dedupe, optional Turnstile · visit/financing chips · side column: chosen-plan card only when `?plan=` is set (no generic "Prices from" card), then a contact card (`.register-contact`: dark top bar, icon · label · value rows for call, WhatsApp, sales office, hours) and the site-visit note |
| `/leadership` | الإدارة | **Built** | Founder focus · real portrait at `/leadership/tarek-qazan.jpg` · principles in a dark floating box overlapping the founder section's bottom edge; hover sweeps a green highlight over number (block) and text, text turns black · no ISO/CTA band |
| `/location` | الخريطة | **Built** | Leaflet + OSRM · `LocationShowcase` / `LocationLeafletMap` |
| `/services` | خدماتنا | Thin | Simple list from `content/services.ts` — **≠ amenities** |
| `/master-plan` | المخطط العام | **Built** | Property map hero · unit zones · stats · WA/units CTA |
| `/news` | الأخبار | Thin | Seed articles from `content/news.ts` + `[slug]` |
| `/news/[slug]` | مقال | Thin | Article template |

⚠️ **Services ≠ Amenities:** company offerings vs on-site facilities.

**Transparent header** (scroll → solid): `/`, `/about`, `/register`, `/gallery`.

---

## Media

| Asset | Location / value |
|-------|------------------|
| Gallery | `public/gallery/img_1.jpg` … `img_72.jpg` · categories in `content/gallery.ts` |
| Hero slides | `public/hero/` · `content/heroSlides.tsx` |
| Logo | `GivingLogo` component · `public/logo.svg` · `public/logo-dark-text.svg` |
| Founder | `public/leadership/tarek-qazan.jpg` (Dr. Tarek Qazan portrait — live) |
| Unit property map | `public/plans/property-map.png` — home about teaser + `/master-plan` |
| YouTube | Tour `8D8-mb6opx4` · ISO `3Lr4a5EHaRI` (`site.videos`) |

Gallery categories: exteriors · interiors · amenities · construction · aerials (+ All).

---

## Tech stack (as built)

- **Next.js 15.5.x** · React · **Tailwind v4** · App Router
- **next-intl** · Arabic default RTL · EN
- Theme: `src/theme/tokens.ts` → CSS vars injected in locale layout
- Maps: Leaflet + OSRM (not Google embed as primary)
- Deploy: **Vercel** · domain `giving-estate.com`
- SEO: per-page titles/descriptions in `content/seo.ts` → `lib/seo.ts` (`routeMetadata` / `buildMetadata`: canonical, hreflang ar/en/x-default, OG + Twitter). JSON-LD via `components/seo/JsonLd` + `PageJsonLd`: site graph (RealEstateAgent + WebSite + GatedResidenceCommunity) on every page, BreadcrumbList on subpages, RealEstateListing on home/units/financing, FAQPage on /faq, Article on news. OG images: `public/og/default.jpg` + `public/og/news/<slug>.jpg` (1200×630, ~130 KB for WhatsApp previews). Icons: `app/icon.png`, `app/apple-icon.png`, `manifest.ts`. `sitemap.ts` (both locales, hreflang; bump `CONTENT_UPDATED`) · `robots.ts` (blocks `/api/`). Search Console / Bing verification via env `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`. New page → add its route to `content/seo.ts` + `generateMetadata` + `<PageJsonLd>`
- i18n strings: `messages/ar.json` · `messages/en.json`
- Content modules: `src/content/*` (site, gallery, faq, pricing, units, amenities, …)

Key components: `Header` · `Footer` · `WhatsAppFloat` · `HeroCarousel` · `GalleryMosaic` · `GalleryGrid` · `PricingShowcase` · `FaqExplorer` · `RegisterCta` · `RegisterForm` · `CountUp` · `LocationLeafletMap` · `GivingLogo`.

### Code layout (`src/`)

| Folder | Holds | Rule |
|--------|-------|------|
| `app/` | Routes only (`[locale]/…/page.tsx`, layout, sitemap, robots) | Compose features; no reusable UI here |
| `features/<domain>/` | Domain UI: `home` · `gallery` · `pricing` · `faq` · `location` · `amenities` · `units` · `register` | Import files directly (no barrels — mixes server/client components) |
| `components/` | Cross-cutting UI: `layout/` (Header, Footer, WhatsAppFloat) · `brand/` (GivingLogo, map mark) · `ui/` (PageHero, CountUp) · `seo/` (RealEstateJsonLd) | Must not import from `features/` |
| `content/` | Typed bilingual data + content types (e.g. `HeroSlide`) | Pure data; never imports components |
| `styles/` | `globals.css` → ordered `base/*` then `sections/*` partials | Import order = cascade; append, don't reshuffle |
| `theme/tokens.ts` | The only place hex colors live (incl. fixed `logo` + `whatsapp`) | CSS uses `var(--…)` only |
| `i18n/` | Routing (`Locale`, `isLocale`), navigation, `LocalePageProps` | |
| `lib/` | Framework-free helpers (`formatNumber`) | |
| `../motion/` (repo root) | Remotion project: `CtaLoop` (home Register CTA background) · `BannerLines` (inner-page banner backdrop). `cd motion && npm i && npm run render` writes MP4 + poster to `public/motion/`; played by `components/ui/LoopVideo` | Separate package, excluded from Next's tsconfig/eslint; colours come from `theme/tokens.ts`. Licence: Remotion's free licence applies (Giving Spirit has 2 employees, 2026-09-30); a paid company licence is needed if it grows past 3 |

---

## Brand (design — live tokens)

Re-brand by editing `src/theme/tokens.ts` `palette` only (`palette.logo` = fixed logo-artwork greens, not themeable).

| Token | Hex | Role |
|-------|-----|------|
| primary | `#2ABBA3` | Giving Spirit green: buttons, active states, bands. Labels on it = `on-primary` (#181818), never white (2.4:1) |
| secondary | `#181818` | Base dark: footer, deep bands, pricing card, dark-theme page background |
| accent | `#05AB7D` | Supporting green: eyebrows on dark, chips, progress |
| primary-deep | `#018860` | Brand text/links on light surfaces (`primary-ink` in light theme), teal text on white buttons |
| primary-darkest | `#035F46` | `accent-ink` on light, deepest logo tone |
| white | `#FFFFFF` | Surfaces, text on dark |
| overlay | `#181818` | Image scrims |
| logo | `#035F46` · `#018860` · `#05AB7D` · `#2ABBA3` | Layered V in the mark (fixed, not themeable) |

**Theme:** light-only since 2026-09-27. White page; header (solid state), page headers (`SubpageHeader`) and footer use `secondary` #181818 with white text. Dark mode + `ThemeToggle` are commented out, not deleted: restore steps at the bottom of `src/theme/tokens.ts`. **Rule:** brand color as *fill* → `bg-primary` + `text-on-primary`; as *text/line on white* → `*-primary-ink` / `*-accent-ink`; white buttons on dark bands → `fill-light` + `ink-on-light`.

Semantic utilities (use these, not raw `white`/`black`/`neutral-*`): `surface`/`surface-alt`/`surface-tint` · `ink`/`muted`/`subtle`/`line` · on dark: `on-dark` (100%) / `on-dark-muted` (70%) / `on-dark-subtle` (50%) / `line-on-dark` / `fill-on-dark` · `overlay` for all scrims · `focus-ring`. No `brand` alias — use `primary`.

| | |
|--|--|
| Feel | Calm luxury RE · Giving Spirit greens on #181818 · photo-led |
| Body type | **AR:** Cairo (next/font) · **EN:** DM Sans (next/font, `--font-dm-sans`) |
| Display | **AR:** Cairo for RTL display (Optima stack underneath) · **EN:** Kumbh Sans, self-hosted variable 100–900 (`public/fonts/kumbh-sans-latin.woff2`) |
| Locale font switch | `html[lang="en"]` overrides `--font-display` / `--font-body` in `src/styles/base/theme.css` |
| Section headings | One pattern only (`primitives.css`): `.sec-head` (eyebrow+title start, optional lede/CTA end, flush to the section's end edge on desktop) · `.section-eyebrow` · `.section-title` (≤20ch; `.sec-head-wide` lifts the cap + widens the title column for long one-line titles) · `.section-sub`; `.on-dark` recolours all three. Inner-page banners (`.sh`) share the 1280px content width (`.container-gc`) |
| Photo | Project gallery · golden-hour preference |
| Avoid | Purple AI defaults · cream+terracotta cliché · broadsheet hairlines · card clutter in heroes · pill/stat spam in first viewport |

Design rules of thumb (from build): one composition per first viewport · brand as hero signal · full-bleed heroes on promotional pages · cards only when interactive · 2–3 intentional motions.

---

## Copy bank (use consistently)

| AR | EN |
|----|----|
| أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة | First and largest fully-serviced chalet city in the region |
| ٣٦٧+ شاليه خاص | 367+ private resorts |
| ٥٠٠,٠٠٠ متر مربع | 500,000 square meters |
| سند ملكية مستقل | Independent ownership deed |
| بدون فوائد — مباشرة مع الشركة | Zero interest — directly with the company |
| تصميم إسباني فاخر | Luxury Spanish design |
| حاصل على شهادة ISO 9001:2015 | ISO 9001:2015 Certified |
| خصوصية تامة — جدران بارتفاع ٣ أمتار | Complete privacy — 3-meter walls |
| استثمار عقاري مضمون | Guaranteed real estate investment |

Also in `site.copyBank`.

---

## Content seeds

**FAQ categories** (`content/faq.ts`): الشراء والتملك · المواصفات والجودة · الموقع والمرافق · التواصل — full Q&A in SoT §13 / `faq.ts`.

**Blog seeds:** uniqueness · 2026 investment · unit walkthrough · ISO · payment plans · Spanish design · community life — see SoT §12 / `content/news.ts`.

---

## Pending

- [ ] Revert TEMP WhatsApp/dial (`phoneAction` / `whatsapp`) → production `962790029928`
- [ ] Community-wide aerial/master layout (current map is the **single-resort** unit plan)
- [ ] Real unit availability + floor-plan assets (`/units` still gallery placeholders)
- [ ] Deeper services & news presentation (content exists, UI thin)
- [ ] Team bios beyond founder (leadership)
- [ ] Analytics (GA4) · Search Console + Bing verification · Google Business Profile
- [ ] Confirm production DNS/email if needed

**Resolved since original brief:** domain `giving-estate.com` · logo in product · 72 gallery images · FAQ explorer · about/financing/register/gallery/leadership polish · tokenized theme · Leaflet map · Vercel · founder portrait · unit property map on home + master-plan page.

---

## Agent rules

1. Read this summary first; use `SOURCE_OF_TRUTH.md` for long-form copy only.
2. **After shipping a meaningful change, refresh this file** (identity, routes maturity, tokens, pending, WA number).
3. Never merge company services (`/services`) with amenities (`/amenities`).
4. Arabic/RTL default; keep strings in `messages/*` + `content/*`.
5. Display phone can stay public sales number; **action links** currently use TEMP test number — don't "fix" that without explicit ask.
6. Theme changes go through `src/theme/tokens.ts`, not scattered hex.
7. Codebase **is** Giving Compound (not Jordan Gate scaffolding). JG was reference UX only.
8. Prefer matching existing page language (about / home mosaic / FAQ) over inventing a new visual system per page.

---

## 2026-10-03 changes

- Copy rule: no em dashes in any user-facing EN/AR text (use commas, colons, periods, parentheses).
- `--on-primary` is white (labels on the green primary fill).
- Financing page: single "How would you like to pay?" picker (Move in 2025/2026/2027, Pay in full) with a today / monthly / total breakdown; PlanCompare cards removed.
- News: /news grid is 3 columns; article pages have meta row, cover, sticky recent-articles sidebar, brand sign-off + register CTA (`styles/sections/article.css`).
- Register: CTAs "Submit Interest" / "Call Us Directly"; site-visit card plays the CTA video loop under a tint.
- Units plan is an SVG (`public/plans/unit-plan.svg`), frameless with faded edges.
- Leadership: stats row and green glow removed. About: founder avatar uses the real portrait.
