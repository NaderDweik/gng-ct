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
    resortTitle: "Five things that are yours alone.",
    resortLead: "Every 500 m² resort is a complete private world. Nothing here is shared with the neighbours.",
    communityEyebrow: "Across the community",
    communityTitle: "Shared places, a short walk away.",
    communityLead: "Beyond your walls, a gated community with the everyday essentials (and a few pleasures) within reach.",
    servicesEyebrow: "Serviced daily",
    servicesTitle: "The quiet work behind it all.",
    servicesLead: "Infrastructure and people that keep Giving Compound running, so your time here is only yours.",
    stats: {
      security: "Security, every day",
      walls: "Private walls around every resort",
      area: "Of private resort, per unit",
      units: "Private resorts in the community",
    },
  },
  ar: {
    crumb: "المرافق",
    heroTitle: "كل ما تحتاجه، داخل الأسوار.",
    heroSub: "مرافق خاصة في كل شاليه، وأماكن مشتركة عبر المجتمع، وفريق يحافظ على كل شيء.",
    resortEyebrow: "داخل شاليهك",
    resortTitle: "خمسة أشياء لك وحدك.",
    resortLead: "كل شاليه بمساحة ٥٠٠ م² عالم خاص متكامل. لا شيء هنا مشترك مع الجيران.",
    communityEyebrow: "عبر المجتمع",
    communityTitle: "أماكن مشتركة، على بُعد خطوات.",
    communityLead: "خلف أسوارك، مجتمع مسوّر يضم أساسيات الحياة اليومية (وبعض المتعة) على مقربة منك.",
    servicesEyebrow: "خدمة يومية",
    servicesTitle: "العمل الهادئ خلف كل شيء.",
    servicesLead: "بنية تحتية وفريق عمل يحافظان على Giving Compound، ليبقى وقتك هنا لك وحدك.",
    stats: {
      security: "أمن طوال اليوم",
      walls: "أسوار خاصة حول كل شاليه",
      area: "شاليه خاص لكل وحدة",
      units: "شاليه خاص في المجتمع",
    },
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
    image: `${C}/reception-building.png`,
    size: "wide",
  },
  {
    id: "mosque",
    titleEn: "The mosque",
    titleAr: "المسجد",
    bodyEn: "A calm place of prayer within the community.",
    bodyAr: "مكان هادئ للصلاة داخل المجتمع.",
    image: `${C}/mosque-at-sunset.png`,
    size: "tall",
  },
  {
    id: "golf",
    titleEn: "Mini golf",
    titleAr: "ميني غولف",
    bodyEn: "A putting green for slow evenings and friendly rivalries.",
    bodyAr: "ملعب غولف مصغّر للأمسيات الهادئة والمنافسات الودية.",
    image: `${C}/mini-golf-putting-green.png`,
    size: "normal",
  },
  {
    id: "park",
    titleEn: "Community park",
    titleAr: "حديقة المجتمع",
    bodyEn: "Landscaped walkways and shade, open to every family.",
    bodyAr: "ممرات منسقة وظلال، مفتوحة لكل العائلات.",
    image: `${C}/community-park-families.png`,
    size: "normal",
  },
  {
    id: "shop",
    titleEn: "Fast Shop",
    titleAr: "متجر Fast Shop",
    bodyEn: "Daily essentials without leaving the gates.",
    bodyAr: "احتياجاتك اليومية دون مغادرة البوابات.",
    image: `${C}/fast-shop-mini-market.png`,
    size: "normal",
  },
  {
    id: "streets",
    titleEn: "Safe streets",
    titleAr: "شوارع آمنة",
    bodyEn: "Quiet internal roads where children ride and play.",
    bodyAr: "طرق داخلية هادئة يلعب فيها الأطفال ويركبون دراجاتهم.",
    image: `${C}/kids-cycling-community-street.png`,
    size: "wide",
  },
  {
    id: "security",
    titleEn: "Round-the-clock security",
    titleAr: "حراسة على مدار الساعة",
    bodyEn: "Gated entrances, patrols and cameras, day and night.",
    bodyAr: "بوابات مسوّرة ودوريات وكاميرات، ليلًا ونهارًا.",
    image: `${C}/security-guards-patrol-compound-o.png`,
    size: "normal",
  },
  {
    id: "housekeeping",
    titleEn: "Housekeeping",
    titleAr: "التدبير المنزلي",
    bodyEn: "An on-site team to keep your resort ready for you.",
    bodyAr: "فريق في الموقع يُبقي شاليهك جاهزًا لك.",
    image: `${C}/housekeeping-team.png`,
    size: "wide",
  },
];

export type ServiceLine = { id: string; titleEn: string; titleAr: string; bodyEn: string; bodyAr: string };

/** The infrastructure behind the community (from content/services.ts, reworded). */
export const serviceLines: ServiceLine[] = [
  {
    id: "water",
    titleEn: "Water systems",
    titleAr: "أنظمة المياه",
    bodyEn: "Automatic pumps and a reliable supply to every unit.",
    bodyAr: "مضخات أوتوماتيكية وتزويد موثوق لكل وحدة.",
  },
  {
    id: "pools",
    titleEn: "Pool care",
    titleAr: "صيانة المسابح",
    bodyEn: "Advanced filtration and routine maintenance.",
    bodyAr: "فلترة متقدمة وصيانة دورية.",
  },
  {
    id: "fiber",
    titleEn: "Fiber & satellite",
    titleAr: "ألياف ضوئية وستلايت",
    bodyEn: "Fiber internet, satellite and AC-ready homes.",
    bodyAr: "إنترنت ألياف ضوئية وستلايت ومنازل جاهزة للتكييف.",
  },
  {
    id: "power",
    titleEn: "Power & solar",
    titleAr: "الكهرباء والطاقة الشمسية",
    bodyEn: "Completed utility connections, backed by an on-site solar farm.",
    bodyAr: "توصيلات مرافق مكتملة، مدعومة بمحطة طاقة شمسية في الموقع.",
  },
  {
    id: "roads",
    titleEn: "Internal roads",
    titleAr: "الطرق الداخلية",
    bodyEn: "An easy-access road network with golf-cart shuttles.",
    bodyAr: "شبكة طرق سهلة الوصول مع تنقل بعربات الغولف.",
  },
  {
    id: "gardens",
    titleEn: "Landscaping",
    titleAr: "تنسيق الحدائق",
    bodyEn: "Gardeners tending green spaces across 500,000 m².",
    bodyAr: "بستانيون يعتنون بالمساحات الخضراء على ٥٠٠,٠٠٠ م².",
  },
];

export const amenitiesHeroSrc = `${C}/entrance-fountain-and-gatehouse.png`;
