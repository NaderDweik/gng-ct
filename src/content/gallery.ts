export type GalleryCategoryId =
  | "all"
  | "community"
  | "resorts"
  | "interiors"
  | "amenities"
  | "construction";

export type GalleryCategory = {
  id: Exclude<GalleryCategoryId, "all">;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  categoryId: Exclude<GalleryCategoryId, "all">;
  nameAr: string;
  nameEn: string;
  categoryTitleAr: string;
  categoryTitleEn: string;
};

export const galleryCategories: GalleryCategory[] = [
  {
    id: "community",
    titleAr: "المجتمع",
    titleEn: "Community",
    descriptionAr: "البوابات والشوارع والكمباوندات والحياة اليومية داخل المجتمع المسوّر.",
    descriptionEn: "Gates, streets, compounds, and everyday life inside the gated community.",
  },
  {
    id: "resorts",
    titleAr: "الشاليهات",
    titleEn: "Resorts",
    descriptionAr: "مسابح خاصة، برجولات، شواء، وجلسات خارجية داخل كل شاليه.",
    descriptionEn: "Private pools, pergolas, BBQ, and outdoor living inside every resort.",
  },
  {
    id: "interiors",
    titleAr: "الداخل",
    titleEn: "Interiors",
    descriptionAr: "مساحات داخلية رحبة بتشطيبات فاخرة وضوء طبيعي.",
    descriptionEn: "Generous interiors with refined finishes and natural light.",
  },
  {
    id: "amenities",
    titleAr: "المرافق",
    titleEn: "Amenities",
    descriptionAr: "الاستقبال، المسجد، الميني غولف، المتجر، والخدمات عبر المجتمع.",
    descriptionEn: "Reception, mosque, mini golf, shop, and services across the community.",
  },
  {
    id: "construction",
    titleAr: "مراحل الإنشاء",
    titleEn: "Construction",
    descriptionAr: "مراحل البناء والتطوير في مشروع Giving Compound.",
    descriptionEn: "Construction and development phases at Giving Compound.",
  },
];

export const galleryCopy = {
  en: {
    eyebrow: "Giving Compound",
    title: "Gallery",
    lead: "From facade to skyline, every angle of the community.",
    allTitle: "All",
    allDescription: "Community, resorts, interiors, amenities, and construction.",
    videosEyebrow: "On camera",
    videosTitle: "See the place before you visit.",
    open: "Open",
    of: "of",
    close: "Close",
    prev: "Previous",
    next: "Next",
    view: "View",
    seeAll: "See all",
  },
  ar: {
    eyebrow: "روح العطاء",
    title: "المعرض",
    lead: "من الواجهة إلى الأفق، كل زاوية في مدينة العطاء.",
    allTitle: "الكل",
    allDescription: "المجتمع، الشاليهات، الداخل، المرافق، ومراحل الإنشاء.",
    videosEyebrow: "على الكاميرا",
    videosTitle: "شاهد المكان قبل الزيارة.",
    open: "فتح",
    of: "من",
    close: "إغلاق",
    prev: "السابق",
    next: "التالي",
    view: "عرض",
    seeAll: "شاهد كل صور",
  },
} as const;

/** Full-bleed hero still for the gallery page. */
export const galleryHeroSrc = "/gallery/compoundPics/palm-roundabout-flower-bed-hd.jpg";

const C = "/gallery/compoundPics";
const R = "/gallery/resortsPics";

type Shot = [src: string, nameEn: string, nameAr: string];

const shots: Record<Exclude<GalleryCategoryId, "all">, Shot[]> = {
  community: [
    [`${C}/main-entrance-gate-sunset.jpg`, "Main entrance gate at sunset", "البوابة الرئيسية وقت الغروب"],
    [`${C}/entrance-fountain-and-gatehouse.jpg`, "Entrance fountain & gatehouse", "نافورة المدخل وغرفة الحراسة"],
    [`${C}/palm-roundabout-flower-bed-hd.jpg`, "Palm roundabout", "دوّار النخيل والزهور"],
    [`${C}/kids-cycling-community-street.jpg`, "Kids cycling through the community", "أطفال يركبون الدراجات في المجتمع"],
    [`${C}/family-walk-compound-t.jpg`, "An evening family walk", "نزهة عائلية مسائية"],
    [`${C}/elderly-couple-stroll-compound-e.jpg`, "A quiet stroll by Compound E", "نزهة هادئة عند كمباوند E"],
    [`${C}/women-walking-compound-n.jpg`, "Friends walking past Compound N", "صديقات يتمشين عند كمباوند N"],
    [`${C}/boys-walking-with-football.jpg`, "Heading out to play football", "في الطريق للعب كرة القدم"],
    [`${C}/compound-c-road-kids-flying-kite.jpg`, "Flying kites at Compound C", "طائرات ورقية عند كمباوند C"],
    [`${C}/security-guards-patrol-compound-o.jpg`, "Security patrol on foot", "دورية أمنية راجلة"],
    [`${C}/compound-a-gate-motorbikes.jpg`, "Compound A gate", "بوابة كمباوند A"],
    [`${C}/compound-b-gate-gardener-landscaping.jpg`, "Compound B gate & landscaping", "بوابة كمباوند B والتنسيق"],
    [`${C}/compound-j-guard-booth.jpg`, "Compound J guard booth", "غرفة حراسة كمباوند J"],
    [`${C}/compound-k-guard-booth.jpg`, "Compound K entrance", "مدخل كمباوند K"],
    [`${C}/compound-m-gate-kids-cycling.jpg`, "Compound M entrance", "مدخل كمباوند M"],
    [`${C}/golf-cart-shuttle-street.jpg`, "Golf-cart shuttle", "التنقل بعربات الغولف"],
  ],
  resorts: [
    [`${R}/swimmer-pool-waterfall.jpg`, "Private pool with waterfall", "مسبح خاص بشلال"],
    [`${R}/pool-and-tent-pavilion.jpg`, "Pool & tent pavilion", "المسبح والخيمة"],
    [`${R}/giant-chess-poolside-royal.jpg`, "Giant chess by the pool", "شطرنج عملاق بجانب المسبح"],
    [`${R}/foosball-kids-pool.jpg`, "Foosball & pool fun", "بيبي فوت ومرح في المسبح"],
    [`${R}/family-lounge-under-pergola.jpg`, "Family lounge under the pergola", "جلسة عائلية تحت البرجولة"],
    [`${R}/family-breakfast-poolside-table.jpg`, "Poolside breakfast", "فطور بجانب المسبح"],
    [`${R}/father-son-bbq-grill.jpg`, "Built-in BBQ grill", "شواء مدمج"],
    [`${R}/garden-lounge-kids-swing.jpg`, "Garden lounge & swing", "جلسة الحديقة والأرجوحة"],
    [`${R}/quad-bike-royal-clubhouse.jpg`, "Quad bike at the resort", "دراجة رباعية في الشاليه"],
    [`${R}/family-arriving-resort-a9-garage.jpg`, "Arriving home: resort A9", "الوصول إلى الشاليه A9"],
    [`${R}/family-entering-resort-front-door.jpg`, "Welcome home", "أهلاً بك في بيتك"],
  ],
  interiors: [
    [`${R}/family-living-room.jpg`, "Family living room", "غرفة المعيشة العائلية"],
    [`${R}/fireplace-horse-sculpture.jpg`, "The fireplace lounge", "جلسة المدفأة"],
    [`${R}/master-bedroom-pool-view.jpg`, "Master bedroom with pool view", "غرفة النوم الرئيسية بإطلالة على المسبح"],
    [`${R}/twin-bedroom-pool-view.jpg`, "Twin bedroom", "غرفة نوم بسريرين"],
    [`${R}/bedroom-walk-in-closet-ensuite.jpg`, "Walk-in closet & ensuite", "غرفة ملابس وحمام داخلي"],
    [`${R}/bathroom-jacuzzi-tub.jpg`, "Bathroom with jacuzzi", "حمام بجاكوزي"],
    [`${R}/kitchen-and-laundry.jpg`, "Fitted kitchen & laundry", "مطبخ مجهز وغسيل"],
    [`${R}/wall-art-decor-detail.jpg`, "Interior details", "تفاصيل الديكور"],
  ],
  amenities: [
    [`${C}/reception-building.jpg`, "Reception", "الاستقبال"],
    [`${C}/mosque-at-sunset.jpg`, "The mosque at sunset", "المسجد وقت الغروب"],
    [`${C}/mini-golf-putting-green.jpg`, "Mini golf", "ميني غولف"],
    [`${C}/community-park-families.jpg`, "Community park", "حديقة المجتمع"],
    [`${C}/fast-shop-mini-market.jpg`, "Fast Shop mini market", "متجر Fast Shop"],
    [`${C}/housekeeping-team.jpg`, "The housekeeping team", "فريق التدبير المنزلي"],
    [`${C}/solar-farm-building-store.jpg`, "Solar farm & building store", "محطة الطاقة الشمسية ومتجر البناء"],
    [`${C}/water-tower-billboard.jpg`, "The water tower", "برج المياه"],
  ],
  construction: [
    [`${C}/construction-crew-building-walls.jpg`, "Building the resorts", "بناء الشاليهات"],
    [`${C}/compound-l-under-construction.jpg`, "Compound L under construction", "كمباوند L قيد الإنشاء"],
    [`${C}/engineers-site-office.jpg`, "Engineers on site", "المهندسون في الموقع"],
    [`${C}/gardeners-landscaping-park.jpg`, "Landscaping the park", "تنسيق الحديقة"],
  ],
};

function buildImages(): GalleryImage[] {
  return galleryCategories.flatMap((cat) =>
    shots[cat.id].map(([src, nameEn, nameAr], i) => ({
      id: `${cat.id}-${String(i + 1).padStart(2, "0")}`,
      src,
      categoryId: cat.id,
      nameAr,
      nameEn,
      categoryTitleAr: cat.titleAr,
      categoryTitleEn: cat.titleEn,
    })),
  );
}

export const galleryImages = buildImages();

/** Curated home-page mosaic — order maps to the tile slots (a…g). */
export type HomeGalleryPick = {
  src: string;
  categoryId: GalleryImage["categoryId"];
  captionAr: string;
  captionEn: string;
};

export const homeGalleryPicks: HomeGalleryPick[] = [
  { src: `${R}/swimmer-pool-waterfall.jpg`, categoryId: "resorts", captionAr: "مسبح خاص لكل شاليه", captionEn: "A private pool in every resort" },
  { src: `${R}/master-bedroom-pool-view.jpg`, categoryId: "interiors", captionAr: "غرفة نوم بإطلالة على المسبح", captionEn: "A bedroom that opens onto the pool" },
  { src: `${C}/main-entrance-gate-sunset.jpg`, categoryId: "community", captionAr: "البوابة الرئيسية", captionEn: "The main gate" },
  { src: `${C}/mini-golf-putting-green.jpg`, categoryId: "amenities", captionAr: "ميني غولف", captionEn: "Mini golf" },
  { src: `${R}/family-living-room.jpg`, categoryId: "interiors", captionAr: "معيشة عائلية دافئة", captionEn: "Warm family living" },
  { src: `${C}/kids-cycling-community-street.jpg`, categoryId: "community", captionAr: "شوارع آمنة للأطفال", captionEn: "Safe streets for kids" },
  { src: `${C}/entrance-fountain-and-gatehouse.jpg`, categoryId: "community", captionAr: "مدخل المجتمع", captionEn: "Community entrance" },
];

/** Home gallery hover-preview — first entry is the default preview. */
export type HomePreviewPick = { src: string; captionAr: string; captionEn: string };

export const homePreviewPicks: HomePreviewPick[] = [
  { src: `${R}/giant-chess-poolside-royal.jpg`, captionAr: "شطرنج عملاق بجانب المسبح", captionEn: "Giant chess by the pool" },
  { src: `${R}/family-lounge-under-pergola.jpg`, captionAr: "جلسة عائلية تحت البرجولة", captionEn: "Family time under the pergola" },
  { src: `${R}/garden-lounge-kids-swing.jpg`, captionAr: "جلسة الحديقة والأرجوحة", captionEn: "Garden lounge & swing" },
  { src: `${C}/reception-building.jpg`, captionAr: "الاستقبال والحدائق", captionEn: "Reception & gardens" },
  { src: `${R}/twin-bedroom-pool-view.jpg`, captionAr: "غرف نوم بإطلالة", captionEn: "Bedrooms with a view" },
  { src: `${C}/mosque-at-sunset.jpg`, captionAr: "المسجد وقت الغروب", captionEn: "The mosque at golden hour" },
  { src: `${R}/father-son-bbq-grill.jpg`, captionAr: "شواء خاص في كل شاليه", captionEn: "A private BBQ in every resort" },
  { src: `${R}/foosball-kids-pool.jpg`, captionAr: "مرح بجانب المسبح", captionEn: "Fun by the pool" },
];

/**
 * Home "A day at Giving Compound" bento — a Day and a Night set, toggled in place.
 * Seven scenes each; slot 0 is the large tile, slot 2 the tall one. `time` is minutes
 * after midnight. Keep these photos distinct from the rest of the home page.
 * There are no true night photos yet: the Night set is dusk + lit interiors.
 */
export type DayScene = {
  src: string;
  time: number;
  titleEn: string;
  titleAr: string;
  /** object-position for the crop (the tall slot 2 needs a narrow subject). */
  focus?: string;
};

export type DayMode = "day" | "night";

export const dayScenes: Record<DayMode, DayScene[]> = {
  day: [
    { src: `${R}/family-breakfast-poolside-table.jpg`, time: 480, titleEn: "Breakfast by the pool", titleAr: "فطور بجانب المسبح" },
    { src: `${C}/boys-walking-with-football.jpg`, time: 630, titleEn: "Out to play", titleAr: "إلى الملعب" },
    { src: `${C}/elderly-couple-stroll-compound-e.jpg`, time: 600, titleEn: "A slow stroll", titleAr: "تمشية هادئة", focus: "30% 60%" },
    { src: `${R}/giant-chess-poolside-royal.jpg`, time: 900, titleEn: "Chess by the water", titleAr: "شطرنج بجانب الماء" },
    { src: `${R}/family-lounge-under-pergola.jpg`, time: 990, titleEn: "Afternoon under the pergola", titleAr: "عصرية تحت البرجولة" },
    { src: `${C}/family-walk-compound-t.jpg`, time: 1020, titleEn: "A family walk", titleAr: "نزهة عائلية", focus: "60% 60%" },
    { src: `${C}/compound-m-gate-kids-cycling.jpg`, time: 1050, titleEn: "Bikes out", titleAr: "جولة بالدراجات", focus: "30% 60%" },
  ],
  night: [
    { src: `${C}/mini-golf-putting-green.jpg`, time: 1110, titleEn: "A round at sunset", titleAr: "جولة غولف عند الغروب" },
    { src: `${C}/golf-cart-shuttle-street.jpg`, time: 1140, titleEn: "The shuttle home", titleAr: "العودة بالعربة", focus: "75% 60%" },
    { src: `${C}/mosque-at-sunset.jpg`, time: 1125, titleEn: "Maghrib at the mosque", titleAr: "المغرب في المسجد", focus: "38% 50%" },
    { src: `${C}/main-entrance-gate-sunset.jpg`, time: 1155, titleEn: "Back through the main gate", titleAr: "العودة عبر البوابة الرئيسية" },
    { src: `${C}/fast-shop-mini-market.jpg`, time: 1170, titleEn: "A last stop at the market", titleAr: "مشوار أخير إلى الماركت" },
    { src: `${R}/fireplace-horse-sculpture.jpg`, time: 1260, titleEn: "Evenings by the fire", titleAr: "سهرة بجانب المدفأة" },
    { src: `${R}/bathroom-jacuzzi-tub.jpg`, time: 1350, titleEn: "A slow soak before bed", titleAr: "استرخاء قبل النوم" },
  ],
};

export const dayCopy = {
  en: {
    eyebrow: "Spaces & lifestyle.",
    title: "A day at Giving Compound.",
    lead: "From breakfast by the pool to evenings by the fire. Switch between day and night inside the community.",
    toggleLabel: "Time of day",
    modes: { day: "Day", night: "Night" },
    cta: "View the full gallery",
  },
  ar: {
    eyebrow: "المساحات ونمط الحياة.",
    title: "يوم في Giving Compound.",
    lead: "من فطور بجانب المسبح إلى سهرة بجانب المدفأة. بدّل بين النهار والليل داخل المجتمع.",
    toggleLabel: "وقت اليوم",
    modes: { day: "نهار", night: "ليل" },
    cta: "شاهد المعرض كاملًا",
  },
} as const;
