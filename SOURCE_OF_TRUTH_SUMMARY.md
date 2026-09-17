# Giving City — Source of Truth Summary

> Quick-lookup companion to `SOURCE_OF_TRUTH.md`. Prefer this during coding; escalate to the full doc for FAQ copy, blog seeds, and edge cases.

---

## Identity (copy/paste)

| Field | Value |
|-------|-------|
| AR company | شركة العطاء للتطوير والتمويل العمراني |
| EN company | Al-Ataa for City Development & Financing |
| Brand | Giving City / Giving City Resorts / روح العطاء للتطوير العقاري |
| Contact | د. طارق قازان (Dr. Tarek Qazan) |
| Phone / WA | +962790029928 → `https://wa.me/962790029928` |
| Hours | Sun–Thu 9–7 · Sat 10–4 |
| Cert | ISO 9001:2015 |
| Old site | https://giving-city.com/ |
| **New domain** | **giving-estate.com** |
| IG | [@giving.city](https://www.instagram.com/giving.city/) · [@alataa_development](https://www.instagram.com/alataa_development/) |
| FB | [alataa.giving](https://www.facebook.com/alataa.giving/) |
| Maps | https://maps.app.goo.gl/PNR3uYsjeDX92fqs7 · ~31°56'59.0"N 35°55'48.4"E |
| Location | 39 km from Royal Hotel → Sahab Al-Hatmiyeh (سحاب الحطمية), Greater Amman |

**What it is:** First & largest fully-serviced chalet/resort city in the ME. Gated residential ownership (NOT a hotel). 367+ private resorts · 500,000 m² · Spanish style · independent deed (سند ملكية مستقل).

---

## Unit (every chalet)

- **500 m²** · single-floor · Spanish exterior · **3 m privacy walls**
- Interior: 3 BR (master) · 2 baths · jacuzzi · living · equipped kitchen
- Outdoor: main pool + kids pool · 2-car garage · pergola · BBQ · stone courtyards
- Build: Jordan code RC · thermostone · porcelain + LED · Super Crown/Jotun · Italian baths · Spanish facade insulation · AC / satellite / fiber · auto water pumps · pool filtration
- Security: gated + cameras + 3 m walls

---

## Pricing

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

---

## 13-Page Sitemap (routes)

Arabic-first labels. Suggested path slugs for Next.js:

| # | AR | EN | Path | Job |
|---|----|----|------|-----|
| 12 | الصفحة الرئيسية | Home | `/` | Hero, stats, features, gallery teaser, pricing CTA, map, WA float |
| 1 | من نحن | About | `/about` | Story, stats, ISO, socials, Dr. Tarek |
| 2 | المعرض | Gallery | `/gallery` | Filterable 72+ imgs + lightbox + 2 YT embeds |
| 3 | خدماتنا | Services | `/services` | **Company** services (dev, finish, PM, finance, after-sale, legal) |
| 4 | المخطط العام | Master Plan | `/master-plan` | Layout / zoning / phases (asset pending) |
| 5 | التمويل | Financing | `/financing` | 3 plans + cash + calculator + WA CTA |
| 6 | الإدارة | Leadership | `/leadership` | Dr. Tarek + team (details pending) |
| 7 | مرافق المشروع | Amenities | `/amenities` | **On-site** utilities & community facilities |
| 8 | الخريطة | Map | `/location` | Embed + directions + landmarks |
| 9 | الأخبار والمقالات | News | `/news` | Listing + article pages (7 seed topics) |
| 10 | الأسئلة الشائعة | FAQ | `/faq` | Accordion by category (full copy in SoT §13) |
| 11 | سجل اهتمامك | Register | `/register` | Form + WA + preferred time |
| 13 | شقق متاحة | Units | `/units` | Available / reserved / sold + filters (data pending) |

⚠️ **Page 3 ≠ Page 7:** خدماتنا = company offerings · مرافق المشروع = physical community amenities.

---

## Media

- Gallery migrate: `giving-city.com/images/img_1.jpg` … `img_72.jpg` + hero `giving-city.com/img/public/1.jpg`
- YouTube: tour `8D8-mb6opx4` · ISO `3Lr4a5EHaRI`
- Logo: **pending** → text placeholder until client delivers

---

## Tech stack (required)

- **Next.js** + React · **Tailwind** · **Arabic-first RTL** (EN later via next-intl)
- SEO: AR meta/OG · `RealEstateListing` schema · sitemap · CWV · WebP/AVIF · lazy gallery
- Integrations: `wa.me/962790029928` · Maps · YouTube · contact form · analytics TBD
- Target: mobile-first · Lighthouse 90+

---

## Brand (design)

| | |
|--|--|
| Feel | Warm · generous · Mediterranean luxury · premium RE (not corporate blue) |
| Palette | Terracotta / sand / olive + navy / gold accents |
| Type | Arabic-first (IBM Plex Arabic / Noto Sans Arabic) |
| Photo | Golden hour · lifestyle · aerials |
| Avoid | Blue-corporate templates · stock clutter · busy cards in hero |

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

---

## Content seeds (lookup)

**Blog (7):** uniqueness · 2026 investment · unit walkthrough · ISO explained · payment plans · Spanish design · community life — titles/keywords in SoT §12.

**FAQ categories:** الشراء والتملك · المواصفات والجودة · الموقع والمرافق · التواصل — full Q&A in SoT §13.

---

## Pending (blockers)

- [ ] Logo / brand assets
- [ ] Hi-res photography
- [ ] Master plan image (p4)
- [ ] Team bios/photos (p6)
- [ ] Unit availability data (p13)
- [ ] Hosting / analytics

**Resolved:** p3/p7 separate · blog seeds · FAQ · domain `giving-estate.com`

---

## Agent rules

1. Read `SOURCE_OF_TRUTH.md` for authoritative detail; use **this file** mid-build.
2. Never merge company services (p3) with amenities (p7).
3. Arabic/RTL default; keep all UI strings i18n-ready.
4. Lead CTA default = WhatsApp `+962790029928`.
5. Placeholder text logo until assets arrive.
6. Current codebase may still be Jordan Gate scaffolding — rebuild toward this brief (Next.js), not preserve JG branding.

*Summary generated: 2026-09-17 · from SOURCE_OF_TRUTH.md*
