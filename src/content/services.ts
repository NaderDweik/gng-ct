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
  | "road" | "golf" | "trees" | "bike" | "bell" | "mosque" | "flower" | "crane";

export type AvailableService = { id: string; icon: ServiceIconName; titleAr: string; titleEn: string };
export type UpcomingService = { id: string; titleAr: string; titleEn: string };

export const availableServices: AvailableService[] = [
  { id: "walls-gates", icon: "gate", titleAr: "الأسوار والبوابات الأمنية", titleEn: "Security walls & gates" },
  { id: "security", icon: "shield", titleAr: "قسم الأمن والكاميرات", titleEn: "Security & CCTV" },
  { id: "planting", icon: "sprout", titleAr: "قسم الزراعة والري", titleEn: "Planting & irrigation" },
  { id: "housekeeping", icon: "sparkle", titleAr: "قسم نظافة هاوس كيبنغ", titleEn: "Housekeeping" },
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
];

export const upcomingServices: UpcomingService[] = [
  { id: "helipad", titleAr: "مهبط طيران", titleEn: "Helipad" },
  { id: "water-filter", titleAr: "فلتر مياه", titleEn: "Water filtration" },
  { id: "well", titleAr: "بئر ارتوازي", titleEn: "Artesian well" },
  { id: "street-lights", titleAr: "إنارة شوارع", titleEn: "Street lighting" },
  { id: "dry-clean", titleAr: "مركز دراي كلين", titleEn: "Dry cleaning" },
  { id: "transport", titleAr: "مواصلات", titleEn: "Transport" },
  { id: "building-materials", titleAr: "مركز مواد بناء", titleEn: "Building materials" },
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

export const servicesCopy = {
  ar: {
    available: "متاحة الآن",
    availableSub: "خدمات قائمة يستفيد منها السكان والضيوف اليوم.",
    upcoming: "قريبًا",
    upcomingSub: "تُفتتح تباعًا مع اكتمال مراحل المشروع.",
  },
  en: {
    available: "Available now",
    availableSub: "Services residents and guests use today.",
    upcoming: "Coming soon",
    upcomingSub: "Opening in turn as each phase of the project completes.",
  },
} as const;
