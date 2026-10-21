# Giving Compound — Source of Truth Summary

> Quick-lookup for AI / builders. Prefer this mid-session; escalate to `SOURCE_OF_TRUTH.md` for long FAQ/blog seed copy.
>
> **Refresh rule:** After any meaningful product/design/content change, update this file before ending the turn so the next AI session starts current.
>
> *Last refreshed: 2026-10-21 (see "2026-10-21 changes" at the end; the route table above it is partly older) · 2026-10-19 (chalet walkthrough videos in the /chalet room viewer) · 2026-10-18 (blueprint page published; stale identity/deploy lines fixed) · earlier: 2026-10-17 (/financing page removed, Arabic naming: الكمباوند + شركة العطاء للتطوير العقاري, services availability) · mirrors live codebase under `jordangate-redesign-main/`*

---

## Identity (copy/paste)

| Field | Value |
|-------|-------|
| AR company | شركة العطاء للتطوير العقاري |
| EN company | Al-Ataa for City Development & Financing |
| Brand | Giving Compound / روح العطاء |
| Contact | د. طارق قازان (Dr. Tarek Qazan) |
| Phone (display) | `+962790029928` |
| Phone / WA (actions) | `+962790029928` → `https://wa.me/962790029928` (production sales number) |
| Hours | Sun–Thu 9–7 · Sat 10–4 |
| Cert | ISO 9001:2015 |
| Old site | https://giving-city.com/ |
| Live domain | https://giving-estate.com |
| IG | [@spiritgivingdevelopment](https://www.instagram.com/spiritgivingdevelopment/) |
| FB | [SpiritGivingDevelopment](https://www.facebook.com/SpiritGivingDevelopment/) |
| Maps | `site.mapsUrl` → 31.7330683, 36.1140802 (compound pin, 2026-10-17) |
| Location | 41 km (~55 min) from Le Royal Hotel → Sahab Al-Hatmiyeh (سحاب الحطمية) · drive times: `content/location.ts` |

**What it is:** First & largest fully-serviced chalet/resort city in the region. Gated residential ownership (NOT a hotel). **367+** private resorts · **500,000 m²** · Spanish style. (Independent deed: removed site-wide 2026-10-17 at the client's request; one line back on 2026-10-21 by request, as the /chalet banner subtitle «كل شاليه بقوشان مستقل مع الأرض والبناء», Arabic only.)

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
| Cash | **128,000 JD** (24% off) |
| Plans | Direct with company · **0% interest** · no bank |

Installments: **no fixed monthly figure** (the old "1% a month" was removed 2026-10-17 at the client's request). The monthly amount depends on the down payment and the duration the buyer chooses; a calculator where the visitor enters both may come later.

UI: none. The /financing page and `PricingShowcase` were removed 2026-10-17 at the client's request; price figures remain in `content/pricing.ts` for the FAQ and JSON-LD.

---

## Routes & build maturity

Arabic-first · locales `ar` | `en` via **next-intl** · App Router under `src/app/[locale]/`.

**Header primary nav:** About · Gallery · Units · Amenities (+ Register CTA, locale switch). Full list in `src/content/nav.ts`. Below 1100px the burger opens a full-screen menu that slides in from the burger's side (RTL-aware): centered links, Register, language, logo at the bottom; locks scroll, closes on Escape/route change.

| Path | AR | Status | Notes |
|------|----|--------|-------|
| `/` | الرئيسية | **Polished** | Cinematic layered hero (`features/home/HeroLayered`, GSAP): 3 auto-advancing slides from `content/hero.ts` (tent pavilion + pool · palms + pergola · garden swing), fixed wordmark with per-slide cut-outs in front (`public/hero/*-cutout.webp`, regenerate with `scripts/hero-cutout.mjs`); pins & recedes on scroll. Section order (top → bottom): About intro (`features/home/HomeIntro` — 3:2 crop (sides trimmed) of a 16:9 photo that assembles once in view from `public/home/intro-{sky,walls,chalet,ground,pool}-v2.webp` (sky fades, walls rise, chalet drops, ground rises, pool settles), then two white lines (`seams`, traced from the layer alpha) draw along the chalet's base (edge to edge) and the pool's lower edge, each trailing off; copy in `content/home-intro.ts`) · destinations (3 cards: Private resorts → /compound, Community amenities → /amenities, Flexible financing → /register «سجل اهتمامك»; no 1% wording) · "A day at Giving Compound" (`features/gallery/GalleryDay` — static 7-tile bento (taller bottom row; time tag bottom-start, hover title opens under it and lifts it) with a minimal Day/Night switch (by day a sun with turning rays sits in the top-end corner) (night adds a crescent moon + stars sliding in from that corner; RTL mirrors both skies to the top-left) that auto-turns to Night 3.5s after the section is in view (once; a press cancels it), lede inside the big tile, sets in `dayScenes`; fits one screen on desktop; Night set is dusk + lit interiors until real night photos exist) · amenities (`features/amenities/AmenitiesGrid`: 2-up horizontal cards, photo flush on the start side + icon/title/line; hover = primary border, the photo window opens across the card (image glides, never rescales) under a dark tint, text turns light and slides to the start edge) · map (`LocationShowcase`: clean map beside one panel — eyebrow, title, place, drive-time list with the auto tour, one Open map link) · stats bar (367+ resorts · 500,000 m² · 500 m² per unit · 0% interest; teal, with the banner V-line motif live in SVG at both sides, darkest green, masked out toward the middle: `components/ui/VLines` + `styles/base/v-lines.css`) · News & articles (`features/news/NewsPreview`, 3 cards from `homeNewsSlugs`) · FAQ · RegisterCta. No financing page or plan cards (removed 2026-10-17) |
| `/about` | من نحن | **Polished** | Full-bleed hero + CountUp stats, collage, who we are / vision / message cards (`features/home/AboutValues`, copy in `messages/*` `about.who*`/`vision*`/`message*`), pillars, ISO video, socials, leadership link, RegisterCta |
| `/gallery` | المعرض | **Polished** | Cinematic short hero · flush mosaic tabs (tile hover: photo blurs + darkens, centred zoom icon · category · name) · lightbox · 2 YT videos · **no** bottom RegisterCta |
| `/units` | الوحدات المتاحة | **Built** | `SubpageHeader` → `UnitsPlans` intro → unit plan section (`features/units/UnitPlanFeatures`: `public/plans/unit-plan.webp` in a framed panel on the start side, the 10 rooms/spaces as numbered tiles in two columns (Inside / Outdoors, ids via `unitPlanRows`), then a dark facts bar (plot · ownership · price from · move-in, `unitPlanPanel` in `content/master-plan.ts`) with a Register interest CTA) → "floor plans coming soon" notice |
| `/amenities` | المرافق | **Built** | `AmenitiesHoverGrid` |
| ~~`/financing`~~ | ~~التمويل~~ | **Removed 2026-10-17** | Client asked for the page to go. Old links 301 to `/` via `movedPages` in `hosting.config.mjs`; nav/footer/404/sitemap/SEO entries removed; the home "Flexible financing" card came back 2026-10-18, linking to /register |
| `/faq` | الأسئلة الشائعة | **Polished** | `FaqExplorer` (search + sticky cats + accordion) · **no** RegisterCta |
| `/compound` | الكمباوند | **Polished** | Map explorer (`features/units/CompoundPlan`). Plan image: `public/plans/compound/compound-map-v3-{1600,2800,4000}.webp`, high-quality WebP from the client's `compound-map-30mb.jpeg` (4000 x 3400, top 3060px). Availability from `content/chalet-availability.ts`: the 31 chalets on the sales office's price cards (2026-10-18), each with area, cash price and features («المميزات», word for word, English alongside); the card "N1+" has no tag on the plan, so it is listed as N1 (a sheet row "N1+" is read as N1). Cards show the cash price and the features as small tags; details add «سعر الكاش» and the features list (prices hidden 2026-10-18, back by the client's request 2026-10-19). The Chalets Google Sheet overrides all of it (columns السعر كاش (دينار), المميزات, المميزات (إنجليزي)): available plots tinted green with a large check badge (white ring, shadow, soft halo). «شاليهات متاحة» button (`ChaletListings`) sits where the old "Step inside a chalet" pill was and opens a shop-style sheet (bottom sheet on phones; end-edge drawer from tablet up that stops above the floating WhatsApp button); one darker glass shared by every map panel. Compound filter chips, photo cards (placeholder resort photos) → details. Tapping ANY chalet on the map (or search / pick one) opens the same details view: photo strip (mouse drag glides to the nearest photo, edge fades, `lib/useDragScroll`), «متاح» / «غير متاح» (grey lock), facts, footer buttons «سجل اهتمامك» (→ `/register?chalet=ID`) or «عرض الشاليهات المتاحة», plus «ادخل إلى الشاليه» (→ /chalet). No separate chalet card any more. |
| `/chalet` | مخطط احد الشاليهات | **Polished** | Room viewer (`features/master-plan/RoomViewer`): the room's **walkthrough video** plays edge to edge over the space's photo (the photo stays as the still until the video has a frame, and for reduced-motion visitors); the line plan beside it; arrows / plan hover step through 14 spaces. Each **room** on the plan (`PlanArea`) carries its own clip(s): the two bedrooms, the five bathroom rooms (west block split into jacuzzi room, top room, bottom room; east column into upper and lower), the two gardens and the two garages are separate rooms; while a clip plays its room is the only one in colour and the outline sits on it, and when it ends the next room's clip fades in (hover / tap a room jumps to it). Videos: `public/chalet-video/clip-NN.mp4` (1440 wide, ≤2.5 Mbps) + `clip-NN-720.mp4` (960 wide, phones), muted H.264, named by the **sender's numbering** 1 to 20 on the hand-marked plan (x64, x78, x80 = unnumbered extras), encoded from the client's 4K clips of 2026-10-19. Mapping on the rooms in `content/master-plan.ts` (`PlanArea.clips`). Clip 01 (the chalet's front from the street) is not placed. No chalet-size label on the photo (removed 2026-10-19). The old corner clip card (`public/plan-clips`) is gone. |
| `/register` | احجز زيارتك | **Polished** | Sales-office visit booking only (no financing / call-back choice, 2026-10-17): name · phone with country picker (flag + dial code; every country but Israel, 244, pinned Jordan/Gulf/region first then A to Z; search box by name, code or ISO; flags in `public/flags`; `content/countries.ts`, `features/register/CountryPhoneField`) · visit day (next 6 days, Sat to Thu) and hour (10 am to 6 pm), each tile «متاح» / «محجوز» (`features/register/VisitPicker`; availability in `content/visit-slots.ts`: the client's weekly table of booked hours by weekday, 2026-10-17, plus optional per-date overrides) · optional message → opens WhatsApp to the sales number with the request written out (no server). |
| `/leadership` | الإدارة | **Built** | Founder focus · real portrait at `/leadership/tarek-qazan.jpg` · principles in a dark floating box overlapping the founder section's bottom edge; hover sweeps a green highlight over number (block) and text, text turns black · no ISO/CTA band |
| `/location` | الخريطة | **Built** | Leaflet + OSRM · `LocationShowcase` / `LocationLeafletMap` |
| `/services` | خدماتنا (page title AR: «ما بتحتاج إشي من برّا») | **Built** | `features/services/ServicesDirectory`: "Available now" photo viewer + list (22 services, `availableServices` + `servicePhotos`, icons in `ServiceIcon.tsx`), then a dark band with key figures and a "Coming soon" bento (28, `upcomingServices`; sizes in `SOON_SIZE`, packs gap-free at 6 and 2 columns, re-check after list changes). Tiles are full-opacity (no row fade, no traveling line, removed 2026-10-17). Street lighting, water filter, artesian well, dry cleaning and building materials moved to available 2026-10-17 (stand-in photos) — **≠ amenities** |
| `/master-plan` | المخطط العام | **Built** | Property map hero · unit zones · stats · WA/units CTA |
| `/news` | الأخبار | Thin | Seed articles from `content/news.ts` + `[slug]` |
| `/news/[slug]` | مقال | Thin | Article template |

**Location (2026-10-17):** the compound's pin is 31.7330683, 36.1140802 (`site.coordinates`, Plus Code 8G3RP4M7+6J; `site.mapsUrl` points there). Places of interest, in the client's order: Isra University 25 km (the client's figure, 2026-10-18) · 3rd Circle (Le Royal Hotel) 41 km · Ibn Sina University 30 km · Luminus College 40 km · Qasr al-Mushatta 12 km · IKEA 29 km (`content/location.ts`; OSRM driving distances, rounded). Roads: `node scripts/location-routes.mjs` after moving the pin or a place.

**Chalet areas:** `content/chalet-areas.ts`, generated from the client's sheet «مساحات شاليهات.xlsx» (392 of 446 chalets); shown on /compound cards and details. A chalet number listed twice is read as the chalet then its "+" chalet; unclear rows are left out (no area shown).

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
| Chalet walkthrough clips | `public/chalet-video/clip-NN.mp4` + `clip-NN-720.mp4` (23 clips × 2 renditions, ~75 MB; 4K originals stay in the client's WhatsApp / Downloads, not in the repo) |

Gallery categories: exteriors · interiors · amenities · construction · aerials (+ All).

---

## Tech stack (as built)

- **Next.js 15.5.x** · React · **Tailwind v4** · App Router
- **next-intl** · Arabic default RTL · EN
- Theme: `src/theme/tokens.ts` → CSS vars injected in locale layout
- Maps: Leaflet + OSRM (not Google embed as primary)
- Deploy: **Cloudflare Pages** (static `out/`, `npm run build && npm run deploy`; see `DEPLOY.md`, nothing deployed yet as of its last status) · domain `giving-estate.com`
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
| أول وأكبر كمباوند شاليهات مخدوم بالكامل في المنطقة | First and largest fully-serviced chalet city in the region |
| ٣٦٧+ شاليه خاص | 367+ private resorts |
| ٥٠٠,٠٠٠ متر مربع | 500,000 square meters |
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
5. Display phone and action links (`phoneAction` / `whatsapp`) both use the production sales number `962790029928`.
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

## 2026-10-14 changes

- Arabic typography: no letter-spacing anywhere in RTL (it breaks Arabic letter joins); `elements.css` resets all tracking under `[dir="rtl"]`. Arabic `--fs-caption` is 14px to compensate.
- Arabic digits: Cairo's own Arabic-Indic figures (the Amiri "GC Digits" override is removed). `--font-display` has Cairo after Optima so Arabic glyphs/digits never fall to a system serif. Arabic pages format every number by locale (`formatNumber`), including the home stats band, counters and the footer year.
- Brand in Arabic copy is always روح العطاء (`site.nameAr`), never "Giving Compound"/"Giving". Exception: venue names (نادي Giving Royal, Fast Shop). `SubpageHeader` eyebrow defaults to the localized project name.
- About: who we are / vision / message cards added under the story.

## 2026-10-19 changes

- /chalet: the client's walkthrough videos (23 clips, 4K, 9 to 18 s each) replace the photo in the room viewer. Files are named by the sender's number (`clip-NN`); the client corrected the first mapping the same evening: 2 parking · 4 kids' lawn · 5 outdoor lounge · 8 west garden · 9 east garden · 11 master · 13 lower bedroom · 14 upper bedroom · 16 jacuzzi room + its lower neighbour · 17 upper west bathroom · 18 upper east bathroom · 19 lower east bathroom · 20 giant chess; 3 (garage from the street) on the second garage, extras x64/x78 with the pool, x80 on the terraces; 01 unplaced. Rooms of one space are separate `PlanArea`s with their own clips (bathrooms split 2 → 5). Encode recipe: `ffmpeg -an -vf scale=1440:-2 -c:v libx264 -preset slow -crf 28 -maxrate 2500k -bufsize 5000k -movflags +faststart` (phones: scale=960, crf 29, maxrate 1000k).
- /chalet: the «شاليه ٥٠٠ م²» size label over the photo is removed.
- /compound: cash prices are back on the chalet cards and in the details («سعر الكاش» in a bordered box), from `content/chalet-availability.ts` or the sheet column السعر كاش (دينار) (hidden 2026-10-18, restored 2026-10-19 at the client's request).

## 2026-10-21 changes

- **Digits:** English (Latin) digits everywhere, Arabic pages included (Intl tag `ar-JO-u-nu-latn` in `lib/format.ts`; hard-coded ١٢٣ converted). `leadRules.ts` still turns typed Arabic digits into Latin.
- **Nav (header):** About · Gallery · Compound (AR «الكمباوند») · Chalet («الشاليه») · Location («الموقع»); no Amenities. Register button is «احجز زيارتك» everywhere (was سجل اهتمامك). Desktop (1100px+): a WhatsApp-green square beside it replaces the floating WhatsApp button (tablets keep the float). Phones' bottom bar: «احجز زيارتك» · plain «أو» · WhatsApp (icon + «تواصل عبر واتساب», EN "WhatsApp") at half the row.
- **Amenities split:** `/amenities` is gone (301 → `/chalet/amenities`). `/chalet/amenities` («مرافق الشاليه»): the resort chapters + RegisterCta, opened from the /chalet viewer's outlined button beside «احجز زيارتك». `/compound/amenities` («مرافق الكمباوند»): shows the /services content (`features/services/ServicesPageBody`, shared with /services); the old shared-places section is kept commented out in the page. Opened from the /compound map's «مرافق الكمباوند» button (next to «اختر لي شاليهًا»). Neither is in the nav.
- **/compound:** price = monthly instalment «القسط الشهري» from the Chalets sheet column «القسط الشهري (دينار)» only (no hardcoded prices; empty cell = no price); cards say «القسط: N دينار». Available chalets marked with a red location pin (`--map-pin`, `palette.mapPin`), also on the «شاليهات متاحة» button. «اختر لي شاليهًا» picks only available chalets. Banner «اختر الشاليه» · eyebrow «مخطط الكمباوند» · «…على مخطط واحد».
- **/chalet:** banner subtitle «كل شاليه بقوشان مستقل مع الأرض والبناء» (AR only; independent-deed wording back by request in this one place).
- **Services list:** supermarket + café merged («سوبر ماركت وكافيه»), water filter removed (20 available); «إنارة ليلية» with its own night photo; reception uses the reception-building photo; stat «مساحة كل شاليه».
- **/location:** places (nearest first, drive minutes set by the client, not measured): قصر المشتى 10 · جامعة الإسراء 20 · مطار الملكة علياء 23 · ايكيا 28 · الدوار السابع 42 · بوليفارد العبدلي 47. Roads regenerated (`scripts/location-routes.mjs`).
- **/leadership:** quote shortened; department heads (`content/team.ts`, 15, honorifics م. / أ.) in the home services slider (`HomeServicesViewer` with per-slide `node` cards): department photo (blurred, tinted) + frosted inner card; when focused the near-black corner square fills the card and the text turns white.
- **/register:** WhatsApp message has no heading line; place = «كمباوند شاليهات روح العطاء، عمّان، الأردن». Day row runs left to right in Arabic too.
- **/about:** the three cards' copy (من نحن / رؤيتنا / الرسالة, `messages/ar.json`); ISO paragraph removed in AR.
- **FAQ:** instalments answer, documents («إثبات شخصي، ونكتفي بالتنازل والرهن»), deed («وإصدار قوشان…»), purchase steps (project engineer → finance officer), handover, rental via compound management; the management/ROI question removed.
- **News:** owners' association uses the land registry certificate; public services centre uses the storefront photo.

