/**
 * /services — what runs in the compound today, and what is coming.
 * `availableServices` is the company's current list (the "completed now"
 * brochure); `upcomingServices` is the rest of the 46-service plan. When a
 * service opens, move it from upcoming to available and give it an icon
 * (features/services/ServiceIcon.tsx).
 * Page: app/[locale]/services/page.tsx → features/services/ServicesDirectory.tsx.
 */

/** Line icons drawn in features/services/ServiceIcon.tsx. */
export type ServiceIconName =
  | "gate" | "shield" | "sprout" | "sparkle" | "drop" | "wrench" | "cart" | "cup" | "bolt"
  | "road" | "golf" | "trees" | "bike" | "bell" | "mosque" | "flower" | "crane"
  | "lamp" | "filter" | "well" | "hanger" | "bricks";

export type AvailableService = { id: string; icon: ServiceIconName; titleAr: string; titleEn: string };
export type UpcomingService = { id: string; titleAr: string; titleEn: string };

export const availableServices: AvailableService[] = [
  { id: "walls-gates", icon: "gate", titleAr: "الأسوار والبوابات الأمنية", titleEn: "Security walls & gates" },
  { id: "security", icon: "shield", titleAr: "قسم الأمن والكاميرات", titleEn: "Security & CCTV" },
  { id: "planting", icon: "sprout", titleAr: "قسم الزراعة والري", titleEn: "Planting & irrigation" },
  { id: "housekeeping", icon: "sparkle", titleAr: "قسم النظافة والتدبير المنزلي", titleEn: "Housekeeping" },
  { id: "water", icon: "drop", titleAr: "ضخ المياه على مدار الساعة", titleEn: "24/7 water pumping" },
  { id: "maintenance", icon: "wrench", titleAr: "قسم الصيانة والمتابعة", titleEn: "Maintenance & follow-up" },
  { id: "supermarket", icon: "cart", titleAr: "سوبر ماركت", titleEn: "Supermarket" },
  { id: "cafe", icon: "cup", titleAr: "كافيه", titleEn: "Café" },
  { id: "power", icon: "bolt", titleAr: "كهرباء ٣ فاز لكل شاليه", titleEn: "3-phase power per chalet" },
  { id: "streets", icon: "road", titleAr: "شوارع معبّدة", titleEn: "Paved streets" },
  { id: "golf", icon: "golf", titleAr: "ملعب جولف", titleEn: "Golf course" },
  { id: "gardens", icon: "trees", titleAr: "حدائق عامة", titleEn: "Public gardens" },
  { id: "bikes", icon: "bike", titleAr: "دراجات هوائية", titleEn: "Bicycles" },
  { id: "reception", icon: "bell", titleAr: "استقبال ضيوف", titleEn: "Guest reception" },
  { id: "prayer", icon: "mosque", titleAr: "مصلى", titleEn: "Prayer hall" },
  { id: "sidewalks", icon: "flower", titleAr: "زراعة الأرصفة", titleEn: "Planted sidewalks" },
  { id: "development", icon: "crane", titleAr: "قسم تطوير", titleEn: "Development department" },
  { id: "street-lights", icon: "lamp", titleAr: "إنارة شوارع", titleEn: "Street lighting" },
  { id: "water-filter", icon: "filter", titleAr: "فلتر مياه", titleEn: "Water filtration" },
  { id: "well", icon: "well", titleAr: "بئر ارتوازي", titleEn: "Artesian well" },
  { id: "dry-clean", icon: "hanger", titleAr: "مركز دراي كلين", titleEn: "Dry cleaning" },
  { id: "building-materials", icon: "bricks", titleAr: "مركز مواد بناء", titleEn: "Building materials" },
];

export const upcomingServices: UpcomingService[] = [
  { id: "helipad", titleAr: "مهبط طيران", titleEn: "Helipad" },
  { id: "transport", titleAr: "مواصلات", titleEn: "Transport" },
  { id: "dog-care", titleAr: "مركز عناية بالكلاب", titleEn: "Dog care" },
  { id: "football", titleAr: "ملعب كرة قدم", titleEn: "Football pitch" },
  { id: "fruit-picking", titleAr: "مركز قطف ثمار", titleEn: "Fruit picking" },
  { id: "bazaar", titleAr: "مركز بازارات", titleEn: "Bazaar centre" },
  { id: "equestrian", titleAr: "نادي فروسية", titleEn: "Equestrian club" },
  { id: "water-games", titleAr: "ألعاب مائية", titleEn: "Water games" },
  { id: "trips", titleAr: "مركز رحلات", titleEn: "Trips centre" },
  { id: "schools", titleAr: "مدارس", titleEn: "Schools" },
  { id: "clothing", titleAr: "مركز ملابس", titleEn: "Clothing store" },
  { id: "outdoor-cinema", titleAr: "سينما خارجية", titleEn: "Outdoor cinema" },
  { id: "basketball", titleAr: "ملعب كرة سلة", titleEn: "Basketball court" },
  { id: "nursery", titleAr: "حضانة أطفال", titleEn: "Nursery" },
  { id: "bird-park", titleAr: "حديقة طيور", titleEn: "Bird park" },
  { id: "emergency", titleAr: "مركز طوارئ", titleEn: "Emergency centre" },
  { id: "tennis", titleAr: "ملعب كرة تنس", titleEn: "Tennis court" },
  { id: "clinic", titleAr: "عيادة طبية", titleEn: "Medical clinic" },
  { id: "pharmacy", titleAr: "صيدلية", titleEn: "Pharmacy" },
  { id: "mosque", titleAr: "مسجد", titleEn: "Mosque" },
  { id: "events-hall", titleAr: "قاعة مناسبات", titleEn: "Events hall" },
  { id: "indoor-cinema", titleAr: "سينما داخلية", titleEn: "Indoor cinema" },
  { id: "ev-charging", titleAr: "محطة شحن مركبات", titleEn: "EV charging" },
  { id: "restaurant", titleAr: "مطعم", titleEn: "Restaurant" },
  { id: "beauty-women", titleAr: "بيوتي سنتر سيدات", titleEn: "Women's beauty centre" },
  { id: "beauty-men", titleAr: "بيوتي سنتر رجالي", titleEn: "Men's grooming" },
  { id: "spa", titleAr: "مركز عناية واسترخاء (سبا)", titleEn: "Spa" },
  { id: "gym", titleAr: "نادي رياضي (جيم)", titleEn: "Gym" },
];

const C = "/gallery/compoundPics";

/**
 * Photo shown in the /services viewer for each available service. Café, 3-phase
 * power, street lighting, water filtration, the well and dry cleaning have no photo
 * of their own yet, so they use the closest shot; swap these when real photos exist.
 */
export const servicePhotos: Record<string, string> = {
  "walls-gates": `${C}/main-entrance-gate-sunset.jpg`,
  security: `${C}/security-guards-patrol-compound-o.jpg`,
  planting: `${C}/gardeners-landscaping-park.jpg`,
  housekeeping: `${C}/housekeeping-team.jpg`,
  water: `${C}/water-tower-billboard.jpg`,
  maintenance: `${C}/engineers-site-office.jpg`,
  supermarket: `${C}/fast-shop-mini-market.jpg`,
  cafe: `${C}/reception-building.jpg`,
  power: `${C}/solar-farm-building-store.jpg`,
  streets: `${C}/golf-cart-shuttle-street.jpg`,
  golf: `${C}/mini-golf-putting-green.jpg`,
  gardens: `${C}/community-park-families.jpg`,
  bikes: `${C}/kids-cycling-community-street.jpg`,
  reception: `${C}/entrance-fountain-and-gatehouse.jpg`,
  prayer: `${C}/mosque-at-sunset.jpg`,
  sidewalks: `${C}/palm-roundabout-flower-bed-hd.jpg`,
  development: `${C}/construction-crew-building-walls.jpg`,
  "street-lights": `${C}/women-walking-compound-n.jpg`,
  "water-filter": `${C}/water-tower-billboard.jpg`,
  well: `${C}/water-tower-billboard.jpg`,
  "dry-clean": `${C}/housekeeping-team.jpg`,
  "building-materials": `${C}/solar-farm-building-store.jpg`,
};

export const servicesCopy = {
  ar: {
    available: "متاحة الآن",
    availableSub: "خدمات قائمة يستفيد منها السكان والضيوف اليوم.",
    upcoming: "قريبًا",
    upcomingSub: "تُفتتح تباعًا مع اكتمال مراحل الكمباوند.",
  },
  en: {
    available: "Available now",
    availableSub: "Services residents and guests use today.",
    upcoming: "Coming soon",
    upcomingSub: "Opening in turn as each phase of the project completes.",
  },
} as const;

/** Key figures under the /services page header (moved from the amenities page). */
export const serviceStats = {
  en: {
    security: "Security, every day",
    walls: "Private walls around every resort",
    area: "Of private resort, per unit",
    units: "Private resorts in the community",
  },
  ar: {
    security: "أمن طوال اليوم",
    walls: "أسوار خاصة حول كل شاليه",
    area: "شاليه خاص لكل وحدة",
    units: "شاليه خاص في الكمباوند",
  },
} as const;
