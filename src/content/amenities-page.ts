/**
 * Amenities page content (app/[locale]/amenities). The private chapters reuse
 * `amenityFeatures` (content/amenities.ts) by id, so copy stays in one place.
 */

const C = "/gallery/compoundPics";

export const amenitiesPageCopy = {
  en: {
    crumb: "Amenities",
    heroTitle: "Everything you need, inside the walls.",
    heroSub: "Private amenities in every resort, shared places across the community, and a team that keeps it all running.",
    resortEyebrow: "Inside your resort",
    resortTitle: "Eight things that are yours alone.",
    resortLead: "Every 500 m² resort is a complete private world. Nothing here is shared with the neighbours.",
    communityEyebrow: "Across the community",
    communityTitle: "Shared places, a short walk away.",
    communityLead: "Beyond your walls, a gated community with the everyday essentials (and a few pleasures) within reach.",
  },
  ar: {
    crumb: "المرافق",
    heroTitle: "كل ما تحتاجه، داخل الأسوار.",
    heroSub: "مرافق خاصة في كل شاليه، وأماكن مشتركة عبر الكمباوند، وفريق يحافظ على كل شيء.",
    resortEyebrow: "داخل شاليهك",
    resortTitle: "ثمانية أشياء لك وحدك.",
    resortLead: "كل شاليه بمساحة ٥٠٠ م² عالم خاص متكامل. لا شيء هنا مشترك مع الجيران.",
    communityEyebrow: "عبر الكمباوند",
    communityTitle: "أماكن مشتركة، على بُعد خطوات.",
    communityLead: "خلف أسوارك، كمباوند مسوّر يضم أساسيات الحياة اليومية (وبعض المتعة) على مقربة منك.",
  },
} as const;

/** Private amenities, in chapter order — ids from `amenityFeatures`. */
export const resortChapterIds = ["pool", "interior", "jacuzzi", "bbq", "kids", "green", "walls", "parking"] as const;

export type CommunityPlace = {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  image: string;
  /** Mosaic footprint on wide screens. */
  size: "wide" | "tall" | "normal";
};

export const communityPlaces: CommunityPlace[] = [
  {
    id: "reception",
    titleEn: "Reception",
    titleAr: "الاستقبال",
    bodyEn: "Your first welcome: visits, keys and questions, handled on site.",
    bodyAr: "استقبالك الأول: الزيارات والمفاتيح والاستفسارات، في الموقع.",
    image: `${C}/reception-building.jpg`,
    size: "wide",
  },
  {
    id: "mosque",
    titleEn: "The mosque",
    titleAr: "المسجد",
    bodyEn: "A calm place of prayer within the community.",
    bodyAr: "مكان هادئ للصلاة داخل الكمباوند.",
    image: `${C}/mosque-at-sunset.jpg`,
    size: "tall",
  },
  {
    id: "golf",
    titleEn: "Mini golf",
    titleAr: "ميني غولف",
    bodyEn: "A putting green for slow evenings and friendly rivalries.",
    bodyAr: "ملعب غولف مصغّر للأمسيات الهادئة والمنافسات الودية.",
    image: `${C}/mini-golf-putting-green.jpg`,
    size: "normal",
  },
  {
    id: "park",
    titleEn: "Community park",
    titleAr: "حديقة الكمباوند",
    bodyEn: "Landscaped walkways and shade, open to every family.",
    bodyAr: "ممرات منسقة وظلال، مفتوحة لكل العائلات.",
    image: `${C}/community-park-families.jpg`,
    size: "normal",
  },
  {
    id: "shop",
    titleEn: "Fast Shop",
    titleAr: "متجر Fast Shop",
    bodyEn: "Daily essentials without leaving the gates.",
    bodyAr: "احتياجاتك اليومية دون مغادرة البوابات.",
    image: `${C}/fast-shop-mini-market.jpg`,
    size: "normal",
  },
  {
    id: "streets",
    titleEn: "Safe streets",
    titleAr: "شوارع آمنة",
    bodyEn: "Quiet internal roads where children ride and play.",
    bodyAr: "طرق داخلية هادئة يلعب فيها الأطفال ويركبون دراجاتهم.",
    image: `${C}/kids-cycling-community-street.jpg`,
    size: "wide",
  },
  {
    id: "security",
    titleEn: "Round-the-clock security",
    titleAr: "حراسة على مدار الساعة",
    bodyEn: "Gated entrances, patrols and cameras, day and night.",
    bodyAr: "بوابات مسوّرة ودوريات وكاميرات، ليلًا ونهارًا.",
    image: `${C}/security-guards-patrol-compound-o.jpg`,
    size: "normal",
  },
  {
    id: "housekeeping",
    titleEn: "Housekeeping",
    titleAr: "التدبير المنزلي",
    bodyEn: "An on-site team to keep your resort ready for you.",
    bodyAr: "فريق في الموقع يُبقي شاليهك جاهزًا لك.",
    image: `${C}/housekeeping-team.jpg`,
    size: "wide",
  },
];

export const amenitiesHeroSrc = `${C}/entrance-fountain-and-gatehouse.jpg`;
