# Giving City — Source of Truth Summary

> Quick-lookup for AI / builders. Prefer this mid-session; escalate to `SOURCE_OF_TRUTH.md` for long FAQ/blog seed copy.
>
> **Refresh rule:** After any meaningful product/design/content change, update this file before ending the turn so the next AI session starts current.
>
> *Last refreshed: 2026-09-23 · mirrors live codebase under `jordangate-redesign-main/`*

---

## Identity (copy/paste)

| Field | Value |
|-------|-------|
| AR company | شركة العطاء للتطوير والتمويل العمراني |
| EN company | Al-Ataa for City Development & Financing |
| Brand | Giving City / روح العطاء |
| Contact | د. طارق قازان (Dr. Tarek Qazan) |
| Phone (display) | `+962790029928` |
| Phone / WA (actions) | **TEMP test** `+962795898415` → `https://wa.me/962795898415` — switch back to `962790029928` before shipping |
| Hours | Sun–Thu 9–7 · Sat 10–4 |
| Cert | ISO 9001:2015 |
| Old site | https://giving-city.com/ |
| Live domain | https://giving-estate.com |
| IG | [@giving.city](https://www.instagram.com/giving.city/) · [@alataa_development](https://www.instagram.com/alataa_development/) |
| FB | [alataa.giving](https://www.facebook.com/alataa.giving/) |
| Maps | https://maps.app.goo.gl/PNR3uYsjeDX92fqs7 · ~31.949722, 35.930111 |
| Location | 39 km from Royal Hotel → Sahab Al-Hatmiyeh (سحاب الحطمية) |

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

**Header primary nav:** About · Gallery · Units · Amenities · Financing (+ Register CTA, locale switch). Full list in `src/content/nav.ts`.

| Path | AR | Status | Notes |
|------|----|--------|-------|
| `/` | الرئيسية | **Polished** | Cinematic layered hero (`features/home/HeroLayered`, GSAP): 3 auto-advancing slides from `content/hero.ts` (V sculpture · pavilion · dusk sign), fixed wordmark with per-slide cut-outs in front (`public/hero/*-cutout.webp`, regenerate with `scripts/hero-cutout.mjs`); pins & recedes on scroll, destinations, gallery hover-preview (`features/gallery/GalleryPreview` — checkerboard thumbs → wipe preview, picks `homePreviewPicks`), pricing, map, FAQ preview, RegisterCta |
| `/about` | من نحن | **Polished** | Full-bleed hero + CountUp stats, pillars, collage, ISO video, socials, leadership link, RegisterCta |
| `/gallery` | المعرض | **Polished** | Cinematic short hero · flush mosaic tabs · lightbox · 2 YT videos · **no** bottom RegisterCta |
| `/units` | الوحدات المتاحة | **Built** | `UnitsPlans` + gallery placeholders until real floor plans |
| `/amenities` | المرافق | **Built** | `AmenitiesHoverGrid` |
| `/financing` | التمويل | **Polished** | Plans + showcase + RegisterCta |
| `/faq` | الأسئلة الشائعة | **Polished** | `FaqExplorer` (search + sticky cats + accordion) · **no** RegisterCta |
| `/register` | سجل اهتمامك | **Polished** | Compact form → WhatsApp · visit/financing chips |
| `/leadership` | الإدارة | **Built** | Founder focus · photo `/leadership/tarek-qazan.jpg` (monogram fallback) · principles · no ISO/CTA band |
| `/location` | الخريطة | **Built** | Leaflet + OSRM · `LocationShowcase` / `LocationLeafletMap` |
| `/services` | خدماتنا | Thin | Simple list from `content/services.ts` — **≠ amenities** |
| `/master-plan` | المخطط العام | Stub | Pending asset + WA CTA |
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
| Founder | `public/leadership/tarek-qazan.jpg` |
| YouTube | Tour `8D8-mb6opx4` · ISO `3Lr4a5EHaRI` (`site.videos`) |

Gallery categories: exteriors · interiors · amenities · construction · aerials (+ All).

---

## Tech stack (as built)

- **Next.js 15.5.x** · React · **Tailwind v4** · App Router
- **next-intl** · Arabic default RTL · EN
- Theme: `src/theme/tokens.ts` → CSS vars injected in locale layout
- Maps: Leaflet + OSRM (not Google embed as primary)
- Deploy: **Vercel** · domain `giving-estate.com`
- SEO: `RealEstateJsonLd` · `sitemap.ts` · `robots.ts`
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

---

## Brand (design — live tokens)

Re-brand by editing `src/theme/tokens.ts` `palette` only (`palette.logo` = fixed logo-artwork greens, not themeable).

| Token | Hex | Role |
|-------|-----|------|
| primary | `#425563` | Buttons, links, active |
| secondary | `#2f3d48` | Deep bands, footer, pricing card (deeper than primary) |
| accent | `#d6c3a3` | Eyebrows on dark, chips, gold detail |
| accent-ink | accent 58% + black | Gold **text on light** surfaces (raw accent is 1.7:1 on white — dark bg only) |
| overlay | `#12181e` | Image scrims |
| neutrals | `#f7f7f7`…`#0a0a0a` | Surfaces / ink |

**Light / dark theme:** `tokens.ts` → `themes.light` / `themes.dark` (semantic roles) → CSS vars under `[data-theme]` on `<html>`. Default = OS preference; explicit choice saved in `localStorage["gc-theme"]`; `themeInitScript` sets it pre-paint (no flash). Toggle: `components/ui/ThemeToggle` in header (sun⇄moon morph + circular View-Transition reveal, cross-fade fallback, instant for reduced motion). Map swaps to Esri Dark Gray tiles. **Rule:** brand color as *fill* → `bg-primary`; as *text/line on a themed surface* → `*-primary-ink` / `*-secondary-ink` / `*-accent-ink`; white buttons on dark bands → `fill-light` + `ink-on-light`.

Semantic utilities (use these, not raw `white`/`black`/`neutral-*`): `surface`/`surface-alt`/`surface-tint` · `ink`/`muted`/`subtle`/`line` · on dark: `on-dark` (100%) / `on-dark-muted` (70%) / `on-dark-subtle` (50%) / `line-on-dark` / `fill-on-dark` · `overlay` for all scrims · `focus-ring`. No `brand` alias — use `primary`.

| | |
|--|--|
| Feel | Calm luxury RE · slate + sand gold · photo-led · not corporate blue |
| Body type | **Cairo** (next/font) · Arabic + Latin |
| Display | Optima / Georgia stack (LTR) · Cairo for RTL display |
| Photo | Project gallery · golden-hour preference |
| Avoid | Purple AI defaults · cream+terracotta cliché · broadsheet hairlines · card clutter in heroes · pill/stat spam in first viewport |

Design rules of thumb (from build): one composition per first viewport · brand as hero signal · full-bleed heroes on promotional pages · cards only when interactive · 2–3 intentional motions.

---

## Copy bank (use consistently)

| AR | EN |
|----|----|
| أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة | First and largest fully-serviced chalet city in the region |
| ٣٦٧+ منتجع خاص | 367+ private resorts |
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
- [ ] Master plan image / interactive plan (`/master-plan`)
- [ ] Real unit availability + floor-plan assets (`/units` still gallery placeholders)
- [ ] Deeper services & news presentation (content exists, UI thin)
- [ ] Team bios beyond founder (leadership)
- [ ] Analytics / final SEO pass
- [ ] Confirm production DNS/email if needed

**Resolved since original brief:** domain `giving-estate.com` · logo in product · 72 gallery images in repo · FAQ explorer · about/financing/register/gallery/leadership polish · tokenized theme · Leaflet map · Vercel deploy path.

---

## Agent rules

1. Read this summary first; use `SOURCE_OF_TRUTH.md` for long-form copy only.
2. **After shipping a meaningful change, refresh this file** (identity, routes maturity, tokens, pending, WA number).
3. Never merge company services (`/services`) with amenities (`/amenities`).
4. Arabic/RTL default; keep strings in `messages/*` + `content/*`.
5. Display phone can stay public sales number; **action links** currently use TEMP test number — don't "fix" that without explicit ask.
6. Theme changes go through `src/theme/tokens.ts`, not scattered hex.
7. Codebase **is** Giving City (not Jordan Gate scaffolding). JG was reference UX only.
8. Prefer matching existing page language (about / home mosaic / FAQ) over inventing a new visual system per page.
