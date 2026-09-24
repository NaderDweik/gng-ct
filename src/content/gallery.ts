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
    titleAr: "المنتجعات",
    titleEn: "Resorts",
    descriptionAr: "مسابح خاصة، برجولات، شواء، وجلسات خارجية داخل كل منتجع.",
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
    descriptionAr: "مراحل البناء والتطوير في مشروع Giving City.",
    descriptionEn: "Construction and development phases at Giving City.",
  },
];

export const galleryCopy = {
  en: {
    eyebrow: "Giving City",
    title: "Gallery",
    lead: "From facade to skyline — every angle of the community.",
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
    lead: "من الواجهة إلى الأفق — كل زاوية في مدينة العطاء.",
    allTitle: "الكل",
    allDescription: "المجتمع، المنتجعات، الداخل، المرافق، ومراحل الإنشاء.",
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
    [`${C}/main-entrance-gate-sunset.png`, "Main entrance gate at sunset", "البوابة الرئيسية وقت الغروب"],
    [`${C}/entrance-fountain-and-gatehouse.png`, "Entrance fountain & gatehouse", "نافورة المدخل وغرفة الحراسة"],
    [`${C}/palm-roundabout-flower-bed-hd.jpg`, "Palm roundabout", "دوّار النخيل والزهور"],
    [`${C}/kids-cycling-community-street.png`, "Kids cycling through the community", "أطفال يركبون الدراجات في المجتمع"],
    [`${C}/family-walk-compound-t.png`, "An evening family walk", "نزهة عائلية مسائية"],
    [`${C}/elderly-couple-stroll-compound-e.png`, "A quiet stroll by Compound E", "نزهة هادئة عند كمباوند E"],
    [`${C}/women-walking-compound-n.png`, "Friends walking past Compound N", "صديقات يتمشين عند كمباوند N"],
    [`${C}/boys-walking-with-football.png`, "Heading out to play football", "في الطريق للعب كرة القدم"],
    [`${C}/compound-c-road-kids-flying-kite.png`, "Flying kites at Compound C", "طائرات ورقية عند كمباوند C"],
    [`${C}/security-guards-patrol-compound-o.png`, "Security patrol on foot", "دورية أمنية راجلة"],
    [`${C}/compound-a-gate-motorbikes.png`, "Compound A gate", "بوابة كمباوند A"],
    [`${C}/compound-b-gate-gardener-landscaping.png`, "Compound B gate & landscaping", "بوابة كمباوند B والتنسيق"],
    [`${C}/compound-j-guard-booth.png`, "Compound J guard booth", "غرفة حراسة كمباوند J"],
    [`${C}/compound-k-guard-booth.png`, "Compound K entrance", "مدخل كمباوند K"],
    [`${C}/compound-m-gate-kids-cycling.png`, "Compound M entrance", "مدخل كمباوند M"],
    [`${C}/golf-cart-shuttle-street.png`, "Golf-cart shuttle", "التنقل بعربات الغولف"],
  ],
  resorts: [
    [`${R}/swimmer-pool-waterfall.png`, "Private pool with waterfall", "مسبح خاص بشلال"],
    [`${R}/pool-and-tent-pavilion.png`, "Pool & tent pavilion", "المسبح والخيمة"],
    [`${R}/giant-chess-poolside-royal.png`, "Giant chess by the pool", "شطرنج عملاق بجانب المسبح"],
    [`${R}/foosball-kids-pool.png`, "Foosball & pool fun", "بيبي فوت ومرح في المسبح"],
    [`${R}/family-lounge-under-pergola.png`, "Family lounge under the pergola", "جلسة عائلية تحت البرجولة"],
    [`${R}/family-breakfast-poolside-table.png`, "Poolside breakfast", "فطور بجانب المسبح"],
    [`${R}/father-son-bbq-grill.png`, "Built-in BBQ grill", "شواء مدمج"],
    [`${R}/garden-lounge-kids-swing.png`, "Garden lounge & swing", "جلسة الحديقة والأرجوحة"],
    [`${R}/quad-bike-royal-clubhouse.png`, "Quad bike at the resort", "دراجة رباعية في المنتجع"],
    [`${R}/family-arriving-resort-a9-garage.png`, "Arriving home — resort A9", "الوصول إلى المنتجع A9"],
    [`${R}/family-entering-resort-front-door.png`, "Welcome home", "أهلاً بك في بيتك"],
  ],
  interiors: [
    [`${R}/family-living-room.png`, "Family living room", "غرفة المعيشة العائلية"],
    [`${R}/fireplace-horse-sculpture.png`, "The fireplace lounge", "جلسة المدفأة"],
    [`${R}/master-bedroom-pool-view.png`, "Master bedroom with pool view", "غرفة النوم الرئيسية بإطلالة على المسبح"],
    [`${R}/twin-bedroom-pool-view.png`, "Twin bedroom", "غرفة نوم بسريرين"],
    [`${R}/bedroom-walk-in-closet-ensuite.png`, "Walk-in closet & ensuite", "غرفة ملابس وحمام داخلي"],
    [`${R}/bathroom-jacuzzi-tub.png`, "Bathroom with jacuzzi", "حمام بجاكوزي"],
    [`${R}/kitchen-and-laundry.png`, "Fitted kitchen & laundry", "مطبخ مجهز وغسيل"],
    [`${R}/wall-art-decor-detail.png`, "Interior details", "تفاصيل الديكور"],
  ],
  amenities: [
    [`${C}/reception-building.png`, "Reception", "الاستقبال"],
    [`${C}/mosque-at-sunset.png`, "The mosque at sunset", "المسجد وقت الغروب"],
    [`${C}/mini-golf-putting-green.png`, "Mini golf", "ميني غولف"],
    [`${C}/community-park-families.png`, "Community park", "حديقة المجتمع"],
    [`${C}/fast-shop-mini-market.png`, "Fast Shop mini market", "متجر Fast Shop"],
    [`${C}/housekeeping-team.png`, "The housekeeping team", "فريق التدبير المنزلي"],
    [`${C}/solar-farm-building-store.png`, "Solar farm & building store", "محطة الطاقة الشمسية ومتجر البناء"],
    [`${C}/water-tower-billboard.png`, "The water tower", "برج المياه"],
  ],
  construction: [
    [`${C}/construction-crew-building-walls.png`, "Building the resorts", "بناء المنتجعات"],
    [`${C}/compound-l-under-construction.png`, "Compound L under construction", "كمباوند L قيد الإنشاء"],
    [`${C}/engineers-site-office.png`, "Engineers on site", "المهندسون في الموقع"],
    [`${C}/gardeners-landscaping-park.png`, "Landscaping the park", "تنسيق الحديقة"],
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
  { src: `${R}/swimmer-pool-waterfall.png`, categoryId: "resorts", captionAr: "مسبح خاص لكل منتجع", captionEn: "A private pool in every resort" },
  { src: `${R}/master-bedroom-pool-view.png`, categoryId: "interiors", captionAr: "غرفة نوم بإطلالة على المسبح", captionEn: "A bedroom that opens onto the pool" },
  { src: `${C}/main-entrance-gate-sunset.png`, categoryId: "community", captionAr: "البوابة الرئيسية", captionEn: "The main gate" },
  { src: `${C}/mini-golf-putting-green.png`, categoryId: "amenities", captionAr: "ميني غولف", captionEn: "Mini golf" },
  { src: `${R}/family-living-room.png`, categoryId: "interiors", captionAr: "معيشة عائلية دافئة", captionEn: "Warm family living" },
  { src: `${C}/kids-cycling-community-street.png`, categoryId: "community", captionAr: "شوارع آمنة للأطفال", captionEn: "Safe streets for kids" },
  { src: `${C}/entrance-fountain-and-gatehouse.png`, categoryId: "community", captionAr: "مدخل المجتمع", captionEn: "Community entrance" },
];

/** Home gallery hover-preview — first entry is the default preview. */
export type HomePreviewPick = { src: string; captionAr: string; captionEn: string };

export const homePreviewPicks: HomePreviewPick[] = [
  { src: `${R}/giant-chess-poolside-royal.png`, captionAr: "شطرنج عملاق بجانب المسبح", captionEn: "Giant chess by the pool" },
  { src: `${R}/family-lounge-under-pergola.png`, captionAr: "جلسة عائلية تحت البرجولة", captionEn: "Family time under the pergola" },
  { src: `${R}/garden-lounge-kids-swing.png`, captionAr: "جلسة الحديقة والأرجوحة", captionEn: "Garden lounge & swing" },
  { src: `${C}/reception-building.png`, captionAr: "الاستقبال والحدائق", captionEn: "Reception & gardens" },
  { src: `${R}/twin-bedroom-pool-view.png`, captionAr: "غرف نوم بإطلالة", captionEn: "Bedrooms with a view" },
  { src: `${C}/mosque-at-sunset.png`, captionAr: "المسجد وقت الغروب", captionEn: "The mosque at golden hour" },
  { src: `${R}/father-son-bbq-grill.png`, captionAr: "شواء خاص في كل منتجع", captionEn: "A private BBQ in every resort" },
  { src: `${R}/foosball-kids-pool.png`, captionAr: "مرح بجانب المسبح", captionEn: "Fun by the pool" },
];

/**
 * Home "A day at Giving City" strip — chronological. `time` is minutes after
 * midnight (drives the clock, sun and sky); `shape` / `align` set the film-strip
 * rhythm. Keep these photos distinct from the rest of the home page.
 */
export type DayChapter = {
  src: string;
  time: number;
  titleEn: string;
  titleAr: string;
  shape: "tall" | "wide" | "square";
  align: "start" | "center" | "end";
};

export const dayChapters: DayChapter[] = [
  { src: `${R}/family-breakfast-poolside-table.png`, time: 480, titleEn: "Breakfast by the pool", titleAr: "فطور بجانب المسبح", shape: "wide", align: "end" },
  { src: `${C}/boys-walking-with-football.png`, time: 630, titleEn: "Out to play", titleAr: "إلى الملعب", shape: "tall", align: "start" },
  { src: `${R}/family-lounge-under-pergola.png`, time: 990, titleEn: "Afternoon under the pergola", titleAr: "عصرية تحت البرجولة", shape: "wide", align: "center" },
  { src: `${C}/mini-golf-putting-green.png`, time: 1050, titleEn: "A round on the green", titleAr: "جولة على العشب", shape: "square", align: "end" },
  { src: `${R}/giant-chess-poolside-royal.png`, time: 1095, titleEn: "Chess by the water", titleAr: "شطرنج بجانب الماء", shape: "wide", align: "start" },
  { src: `${C}/mosque-at-sunset.png`, time: 1125, titleEn: "Maghrib at the mosque", titleAr: "المغرب في المسجد", shape: "tall", align: "center" },
  { src: `${R}/fireplace-horse-sculpture.png`, time: 1260, titleEn: "Evenings by the fire", titleAr: "سهرة بجانب المدفأة", shape: "wide", align: "end" },
  { src: `${R}/bathroom-jacuzzi-tub.png`, time: 1350, titleEn: "A slow soak before bed", titleAr: "استرخاء قبل النوم", shape: "square", align: "start" },
];

export const dayCopy = {
  en: {
    eyebrow: "Spaces & lifestyle.",
    title: "A day at Giving City.",
    lead: "From breakfast by the pool to evenings by the fire — scroll through one day inside the community.",
    endTitle: "And tomorrow, it starts again.",
    cta: "View the full gallery",
    phases: ["Morning", "Midday", "Afternoon", "Golden hour", "Sunset", "Evening", "Night"],
  },
  ar: {
    eyebrow: "المساحات ونمط الحياة.",
    title: "يوم في Giving City.",
    lead: "من فطور بجانب المسبح إلى سهرة بجانب المدفأة — مرّر لتعيش يومًا كاملًا داخل المجتمع.",
    endTitle: "وغدًا، يبدأ اليوم من جديد.",
    cta: "شاهد المعرض كاملًا",
    phases: ["الصباح", "الظهيرة", "العصر", "الساعة الذهبية", "الغروب", "المساء", "الليل"],
  },
} as const;
