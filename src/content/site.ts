export const site = {
  nameAr: "روح العطاء",
  nameEn: "Giving Compound",
  companyAr: "شركة العطاء للتطوير العقاري",
  companyEn: "Al-Ataa for City Development & Financing",
  taglineAr: "أول وأكبر كمباوند شاليهات مخدوم بالكامل في المنطقة",
  taglineEn: "First and largest fully-serviced chalet city in the region",
  /** Shown in the UI (public sales number). */
  phone: "+962790029928",
  /** Where calls, WhatsApp buttons and the register form go (the sales number). */
  phoneAction: "+962790029928",
  whatsapp: "962790029928",
  whatsappUrl: "https://wa.me/962790029928",
  email: "",
  siteUrl: "https://giving-estate.com",
  mapsUrl: "https://www.google.com/maps?q=31.7330683,36.1140802&z=17",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.5!2d35.9301!3d31.9497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU2JzU5LjAiTiAzNcKwNTUnNDguNCJF!5e0!3m2!1sen!2sjo!4v1",
  locationAr: "المطبّة، باتجاه سحاب الحطمية",
  locationEn: "Al Matabba, towards Sahab Al-Hatmiyeh",
  /** Where the sales office is (footer, register page): the company HQ, at the compound since Oct 2026. */
  salesOfficeAr: "الكمباوند، المطبّة، باتجاه سحاب الحطمية، الأردن",
  salesOfficeEn: "The compound, Al Matabba, towards Sahab Al-Hatmiyeh, Jordan",
  /** Project pin — Al Matabba (Google Maps link above). */
  coordinates: { lat: 31.7330683, lng: 36.1140802 },
  social: {
    instagram: "https://www.instagram.com/spiritgivingdevelopment/",
    facebook: "https://www.facebook.com/SpiritGivingDevelopment/",
  },
  contact: "د. طارق قازان",
  contactEn: "Dr. Tarek Qazan",
  /** Portrait of the founder (leadership page, home leadership note). */
  founderPhoto: "/leadership/newimg-tarek-qazan.jpeg",
  iso: "ISO 9001:2015",
  stats: {
    units: 367,
    areaSqm: 500000,
    unitAreaSqm: 500,
    basePriceJd: 168000,
    cashPriceJd: 128000,
    cashDiscountPct: 24,
  },
  /**
   * Played by components/ui/VideoPlayer. Put the original file in public/videos and
   * set `src` (e.g. "/videos/tour.mp4") to serve it from the site; without `src`
   * the YouTube video plays with all of YouTube's interface hidden.
   */
  videos: {
    // Self-hosted since 2026-10-27 (IMG_7221, encoded to 1080p; the old YouTube id stays as a fallback).
    tour: { youtubeId: "8D8-mb6opx4", src: "/videos/tour.mp4", poster: "/videos/tour-poster.jpg" },
    iso: { youtubeId: "3Lr4a5EHaRI", poster: "/videos/iso-poster.webp" },
  } as Record<"tour" | "iso", { youtubeId: string; src?: string; poster: string }>,
  copyBank: {
    ar: {
      firstLargest: "أول وأكبر كمباوند شاليهات مخدوم بالكامل في المنطقة",
      privateResorts: "367+ شاليه خاص",
      area: "500,000 متر مربع",
      zeroInterest: "بدون فوائد، مباشرة مع الشركة",
      spanish: "تصميم إسباني فاخر",
      iso: "حاصل على شهادة ISO 9001:2015",
      privacy: "خصوصية تامة، جدران بارتفاع 3 أمتار",
      investment: "استثمار عقاري مضمون",
    },
    en: {
      firstLargest: "First and largest fully-serviced chalet city in the region",
      privateResorts: "367+ private resorts",
      area: "500,000 square meters",
      zeroInterest: "Zero interest, directly with the company",
      spanish: "Luxury Spanish design",
      iso: "ISO 9001:2015 Certified",
      privacy: "Complete privacy, 3-meter walls",
      investment: "Guaranteed real estate investment",
    },
  },
} as const;

/** WhatsApp buttons and icons: the chat opens with the source line in the page's language
 *  and a new line, so the visitor types their message under it and sales can tell the
 *  lead came from the site. (The register form and FAQ chat add their own text to
 *  site.whatsappUrl.) */
export const whatsappChatUrl = (locale: string) =>
  `${site.whatsappUrl}?text=${encodeURIComponent(
    locale === "ar" ? "المصدر: الموقع الإلكتروني\n" : "Source: Website\n",
  )}`;
