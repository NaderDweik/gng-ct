import type { Metadata } from "next";
import { site } from "@/content/site";
import { brandAr, brandEn, seoPages, type SeoRoute } from "@/content/seo";
import { basePriceJd } from "@/content/pricing";
import { faqCategories } from "@/content/faq";
import type { Article } from "@/content/news";

type Locale = "ar" | "en";

export const DEFAULT_OG_IMAGE = "/og/default.jpg";

/** Absolute URL for a path in a locale (ar has no prefix — `localePrefix: "as-needed"`). */
export function localeUrl(locale: Locale, path = "") {
  return `${site.siteUrl}${locale === "en" ? "/en" : ""}${path}`;
}

/** canonical + hreflang (ar, en, x-default → ar) for one path. */
export function languageAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ar: localeUrl("ar", path),
      en: localeUrl("en", path),
      "x-default": localeUrl("ar", path),
    },
  };
}

type PageSeo = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  /** Home: skip the " | brand" title template. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  absoluteTitle,
  type = "website",
  publishedTime,
}: PageSeo): Metadata {
  const isAr = locale === "ar";
  const brand = isAr ? brandAr : brandEn;
  const fullTitle = absoluteTitle ? title : `${title} | ${brand}`;
  const images = [{ url: image, width: 1200, height: 630, alt: fullTitle }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: languageAlternates(locale, path),
    openGraph: {
      type,
      url: localeUrl(locale, path),
      siteName: isAr ? `${brandAr} | ${brandEn}` : `${brandEn} | ${brandAr}`,
      title: fullTitle,
      description,
      locale: isAr ? "ar_JO" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_JO"],
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** Metadata for a static route from content/seo.ts. */
export async function routeMetadata(
  params: Promise<{ locale: string }>,
  route: SeoRoute,
): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "en" ? "en" : "ar";
  const copy = seoPages[route];
  const isAr = locale === "ar";
  return buildMetadata({
    locale,
    path: route,
    title: isAr ? copy.titleAr : copy.titleEn,
    description: isAr ? copy.descAr : copy.descEn,
    absoluteTitle: route === "",
  });
}

/* ------------------------------------------------------------------ */
/* Structured data (schema.org JSON-LD)                                 */
/* ------------------------------------------------------------------ */

export const ORG_ID = `${site.siteUrl}/#organization`;
export const WEBSITE_ID = `${site.siteUrl}/#website`;
export const PLACE_ID = `${site.siteUrl}/#place`;

const address = (locale: Locale) => ({
  "@type": "PostalAddress",
  streetAddress: locale === "ar" ? site.locationAr : site.locationEn,
  addressLocality: locale === "ar" ? "سحاب" : "Sahab",
  addressRegion: locale === "ar" ? "عمّان" : "Amman",
  addressCountry: "JO",
});

const geo = {
  "@type": "GeoCoordinates",
  latitude: site.coordinates.lat,
  longitude: site.coordinates.lng,
};

/** Organization + WebSite + the community itself — rendered on every page. */
export function siteGraph(locale: Locale) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": ORG_ID,
        name: isAr ? site.companyAr : site.companyEn,
        alternateName: [site.companyEn, site.companyAr, site.nameEn, site.nameAr],
        url: site.siteUrl,
        logo: `${site.siteUrl}/icon-512.png`,
        image: `${site.siteUrl}${DEFAULT_OG_IMAGE}`,
        telephone: site.phone,
        address: address(locale),
        geo,
        hasMap: site.mapsUrl,
        areaServed: { "@type": "Country", name: "Jordan" },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "09:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "10:00",
            closes: "16:00",
          },
        ],
        founder: { "@type": "Person", name: isAr ? site.contact : site.contactEn },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: site.iso,
          credentialCategory: "certification",
        },
        sameAs: [site.social.instagram, site.social.facebook],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: site.siteUrl,
        name: isAr ? brandAr : brandEn,
        alternateName: isAr ? brandEn : brandAr,
        inLanguage: ["ar", "en"],
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "GatedResidenceCommunity",
        "@id": PLACE_ID,
        name: isAr ? site.nameAr : site.nameEn,
        description: isAr ? site.taglineAr : site.taglineEn,
        address: address(locale),
        geo,
        hasMap: site.mapsUrl,
        url: site.siteUrl,
        image: `${site.siteUrl}${DEFAULT_OG_IMAGE}`,
      },
    ],
  };
}

/** The chalet offer — home, units and financing. */
export function listingJsonLd(locale: Locale, path: string) {
  const isAr = locale === "ar";
  const copy = seoPages[path as SeoRoute] ?? seoPages[""];
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: isAr ? "شاليه خاص ٥٠٠ م² في روح العطاء" : "Private 500 m² chalet at Giving Compound",
    description: isAr ? copy.descAr : copy.descEn,
    url: localeUrl(locale, path),
    image: `${site.siteUrl}${DEFAULT_OG_IMAGE}`,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: basePriceJd,
      priceCurrency: "JOD",
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
    about: {
      "@type": "SingleFamilyResidence",
      numberOfRooms: 3,
      numberOfBedrooms: 3,
      numberOfBathroomsTotal: 2,
      floorSize: { "@type": "QuantitativeValue", value: site.stats.unitAreaSqm, unitCode: "MTK" },
      amenityFeature: ["Private pool", "Kids pool", "Jacuzzi", "2-car garage", "Pergola", "BBQ area"].map(
        (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
      ),
      containedInPlace: { "@id": PLACE_ID },
    },
  };
}

/** Home → page breadcrumb trail. */
export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  const home = { name: locale === "ar" ? "الرئيسية" : "Home", path: "" };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localeUrl(locale, item.path),
    })),
  };
}

/** Every FAQ answer, as FAQPage. */
export function faqJsonLd(locale: Locale) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqCategories.flatMap((c) =>
      c.items.map((q) => ({
        "@type": "Question",
        name: isAr ? q.qAr : q.qEn,
        acceptedAnswer: { "@type": "Answer", text: isAr ? q.aAr : q.aEn },
      })),
    ),
  };
}

export const articleOgImage = (slug: string) => `/og/news/${slug}.jpg`;

/** One news article, as Article. */
export function articleJsonLd(locale: Locale, a: Article) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isAr ? a.titleAr : a.titleEn,
    description: isAr ? a.excerptAr : a.excerptEn,
    image: [`${site.siteUrl}${articleOgImage(a.slug)}`],
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: locale,
    keywords: a.keywords.join(", "),
    mainEntityOfPage: localeUrl(locale, `/news/${a.slug}`),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
