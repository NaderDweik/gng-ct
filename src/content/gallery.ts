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
    titleAr: "الكمباوند",
    titleEn: "Community",
    descriptionAr: "البوابات والشوارع والكمباوندات والحياة اليومية داخل الكمباوند المسوّر.",
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
    descriptionAr: "الاستقبال، المسجد، الميني غولف، المتجر، والخدمات عبر الكمباوند.",
    descriptionEn: "Reception, mosque, mini golf, shop, and services across the community.",
  },
  {
    id: "construction",
    titleAr: "مراحل الإنشاء",
    titleEn: "Construction",
    descriptionAr: "مراحل البناء والتطوير في كمباوند روح العطاء.",
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
    title: "الصور",
    lead: "من الواجهة إلى الأفق، كل زاوية في كمباوند روح العطاء.",
    allTitle: "الكل",
    allDescription: "الكمباوند، الشاليهات، الداخل، المرافق، ومراحل الإنشاء.",
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
export const galleryHeroSrc = "/gallery/photos/palm-roundabout-sunset.jpg";

const C = "/gallery/compoundPics";
const R = "/gallery/resortsPics";
/** The gallery page's own photo set. */
const P = "/gallery/photos";

type Shot = [src: string, nameEn: string, nameAr: string];

const shots: Record<Exclude<GalleryCategoryId, "all">, Shot[]> = {
  community: [
    [`${P}/main-entrance-gate.jpg`, "The main entrance gate", "البوابة الرئيسية"],
    [`${P}/entrance-fountain-gatehouse.jpg`, "Entrance fountain & gatehouse", "نافورة المدخل وغرفة الحراسة"],
    [`${P}/palm-roundabout-sunset.jpg`, "Palm roundabout at sunset", "دوّار النخيل وقت الغروب"],
    [`${P}/tree-lined-avenue.jpg`, "A tree-lined avenue", "شارع تحفّه الأشجار"],
    [`${P}/v-sculpture-avenue.jpg`, "The avenue and the V sculpture", "الشارع ومجسّم V"],
    [`${P}/compound-walls-sunset.jpg`, "Compound walls at sunset", "أسوار الكمباوند وقت الغروب"],
    [`${P}/golf-cart-shuttle.jpg`, "Golf-cart shuttle", "التنقل بعربات الغولف"],
    [`${P}/compound-a-gate.jpg`, "Compound A gate", "بوابة كمباوند A"],
    [`${P}/compound-b-gate.jpg`, "Compound B gate", "بوابة كمباوند B"],
    [`${P}/compound-j-gate.jpg`, "Compound J gate", "بوابة كمباوند J"],
    [`${P}/compound-k-gate.jpg`, "Compound K gate", "بوابة كمباوند K"],
    [`${P}/compound-m-gate.jpg`, "Compound M gate", "بوابة كمباوند M"],
    [`${P}/compound-n-mini-golf.jpg`, "Compound N beside the mini golf", "كمباوند N بجانب الميني غولف"],
    [`${P}/compound-o-dusk.jpg`, "Compound O at dusk", "كمباوند O عند المغيب"],
    [`${P}/compound-t-gate.jpg`, "Compound T gate", "بوابة كمباوند T"],
  ],
  resorts: [
    [`${P}/royal-resort-pool.jpg`, "The Royal resort pool", "مسبح شاليه رويال"],
    [`${P}/pool-waterfall.jpg`, "Pool waterfall", "شلال المسبح"],
    [`${P}/pool-tent-pavilion.jpg`, "Pool & tent pavilion", "المسبح والخيمة"],
    [`${P}/giant-chess-pool.jpg`, "Giant chess by the pool", "شطرنج عملاق بجانب المسبح"],
    [`${P}/foosball-poolside.jpg`, "Foosball by the pool", "بيبي فوت بجانب المسبح"],
    [`${P}/quad-bike-royal.jpg`, "Quad bike at the Royal resort", "دراجة رباعية في شاليه رويال"],
    [`${P}/pergola-lounge.jpg`, "Lounge under the pergola", "جلسة تحت البرجولة"],
    [`${P}/bbq-stone-dining.jpg`, "Built-in BBQ & stone table", "شواء مدمج وطاولة حجرية"],
    [`${P}/poolside-dining-bbq.jpg`, "Poolside dining", "جلسة طعام بجانب المسبح"],
    [`${P}/garden-chairs-swing.jpg`, "Garden chairs & swing", "كراسي الحديقة والأرجوحة"],
    [`${P}/kids-play-garden.jpg`, "Kids' play garden", "حديقة ألعاب الأطفال"],
    [`${P}/resort-a9-garage.jpg`, "Resort A9+ garage", "كراج الشاليه A9+"],
    [`${P}/resort-a9-entrance.jpg`, "Resort A9+ front door", "مدخل الشاليه A9+"],
  ],
  interiors: [
    [`${P}/living-room.jpg`, "Living room", "غرفة المعيشة"],
    [`${P}/living-room-kitchen.jpg`, "Living room & kitchen", "المعيشة والمطبخ"],
    [`${P}/fireplace-horse-sculpture.jpg`, "The fireplace lounge", "جلسة المدفأة"],
    [`${P}/master-bedroom-pool-view.jpg`, "Master bedroom with pool view", "غرفة النوم الرئيسية بإطلالة على المسبح"],
    [`${P}/master-bedroom-dressing.jpg`, "Master bedroom & dressing area", "غرفة النوم الرئيسية وركن الملابس"],
    [`${P}/dressing-room-ensuite.jpg`, "Dressing room & ensuite", "غرفة ملابس وحمام داخلي"],
    [`${P}/twin-bedroom.jpg`, "Twin bedroom", "غرفة نوم بسريرين"],
    [`${P}/pink-bedroom.jpg`, "Bedroom with a view", "غرفة نوم بإطلالة"],
    [`${P}/bathroom-jacuzzi.jpg`, "Bathroom with jacuzzi", "حمام بجاكوزي"],
    [`${P}/kitchen-laundry.jpg`, "Fitted kitchen & laundry", "مطبخ مجهز وغسيل"],
  ],
  amenities: [
    [`${P}/reception.jpg`, "Reception", "الاستقبال"],
    [`${P}/mosque.jpg`, "The mosque", "المسجد"],
    [`${P}/mini-golf-lawn.jpg`, "Mini golf", "ميني غولف"],
    [`${P}/fast-shop.jpg`, "Fast Shop mini market", "متجر Fast Shop"],
    [`${P}/housekeeping.jpg`, "Housekeeping", "التدبير المنزلي"],
    [`${P}/service-building-a.jpg`, "Service building A", "مبنى الخدمات A"],
    [`${P}/service-building-c.jpg`, "Service building C", "مبنى الخدمات C"],
    [`${P}/service-building-d.jpg`, "Service building D", "مبنى الخدمات D"],
    [`${P}/solar-farm.jpg`, "The solar farm", "محطة الطاقة الشمسية"],
    [`${P}/water-tower.jpg`, "The water tower", "برج المياه"],
    [`${P}/gym-billboard-water-tower.jpg`, "The gym, coming soon", "النادي الرياضي قريباً"],
  ],
  construction: [
    [`${P}/resorts-under-construction.jpg`, "Resorts under construction", "شاليهات قيد الإنشاء"],
    [`${P}/compound-l-construction.jpg`, "Compound L under construction", "كمباوند L قيد الإنشاء"],
    [`${P}/park-landscaping.jpg`, "Landscaping the park", "تنسيق الحديقة"],
    [`${P}/park-paths-planting.jpg`, "New paths & planting", "ممرات وزراعة جديدة"],
    [`${P}/basketball-court-site.jpg`, "Future basketball court", "ملعب كرة السلة المستقبلي"],
    [`${P}/football-pitch-site.jpg`, "Future football pitch", "ملعب كرة القدم المستقبلي"],
    [`${P}/int-cafe-site.jpg`, "Future international café", "المقهى العالمي المستقبلي"],
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
  { src: `${C}/entrance-fountain-and-gatehouse.jpg`, categoryId: "community", captionAr: "مدخل الكمباوند", captionEn: "Community entrance" },
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
    { src: `${P}/royal-resort-pool.jpg`, time: 480, titleEn: "Morning by the pool", titleAr: "صباح بجانب المسبح" },
    { src: `${P}/foosball-poolside.jpg`, time: 630, titleEn: "A round of foosball", titleAr: "جولة بيبي فوت" },
    { src: `${P}/tree-lined-avenue.jpg`, time: 600, titleEn: "A slow stroll", titleAr: "تمشية هادئة", focus: "42% 55%" },
    { src: `${P}/poolside-dining-bbq.jpg`, time: 780, titleEn: "Lunch by the pool", titleAr: "غداء بجانب المسبح" },
    { src: `${P}/pergola-lounge.jpg`, time: 990, titleEn: "Afternoon under the pergola", titleAr: "عصرية تحت البرجولة" },
    { src: `${P}/pool-tent-pavilion.jpg`, time: 900, titleEn: "Shade in the pavilion", titleAr: "ظل الخيمة" },
    { src: `${P}/giant-chess-pool.jpg`, time: 1050, titleEn: "Chess by the water", titleAr: "شطرنج بجانب الماء" },
  ],
  night: [
    { src: `${C}/mini-golf-putting-green.jpg`, time: 1110, titleEn: "A round at sunset", titleAr: "جولة غولف عند الغروب" },
    { src: `${P}/compound-walls-sunset.jpg`, time: 1140, titleEn: "The road home", titleAr: "طريق العودة" },
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
    title: "يوم في كمباوند شاليهات Giving.",
    lead: "من فطور بجانب المسبح إلى سهرة بجانب المدفأة. بدّل بين النهار والليل داخل الكمباوند.",
    toggleLabel: "وقت اليوم",
    modes: { day: "نهار", night: "ليل" },
    cta: "شاهد الصور ",
  },
} as const;
