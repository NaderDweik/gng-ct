export type GalleryCategoryId =
  | "all"
  | "exteriors"
  | "interiors"
  | "amenities"
  | "construction"
  | "aerials";

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

/** Jordan Gate–style category model, mapped to Giving City image ranges. */
export const galleryCategories: GalleryCategory[] = [
  {
    id: "exteriors",
    titleAr: "الواجهات الخارجية",
    titleEn: "Exteriors",
    descriptionAr: "استكشف واجهات المنتجعات والتصميم الإسباني والإطلالات الخارجية.",
    descriptionEn: "Explore resort facades, Spanish design, and exterior views.",
  },
  {
    id: "interiors",
    titleAr: "الداخل",
    titleEn: "Interiors",
    descriptionAr: "مساحات داخلية رحية بتشطيبات فاخرة وضوء طبيعي.",
    descriptionEn: "Generous interiors with refined finishes and natural light.",
  },
  {
    id: "amenities",
    titleAr: "المرافق",
    titleEn: "Amenities",
    descriptionAr: "مسابح ومساحات معيشة خارجية ومرافق داخل كل وحدة والمجتمع.",
    descriptionEn: "Pools, outdoor living, and amenities across units and the community.",
  },
  {
    id: "construction",
    titleAr: "مراحل الإنشاء",
    titleEn: "Construction",
    descriptionAr: "مراحل البناء والتطوير في مشروع Giving City.",
    descriptionEn: "Construction and development phases at Giving City.",
  },
  {
    id: "aerials",
    titleAr: "إطلالات جوية",
    titleEn: "Aerials",
    descriptionAr: "مشاهد جوية للمجتمع والموقع من الأعلى.",
    descriptionEn: "Aerial views of the community and site from above.",
  },
];

export const galleryCopy = {
  en: {
    eyebrow: "Giving City",
    title: "Gallery",
    lead: "From facade to skyline — every angle of the community.",
    allTitle: "All",
    allDescription: "Exteriors, interiors, amenities, construction, and aerials.",
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
    allDescription: "واجهات، داخل، مرافق، مراحل إنشاء، وإطلالات جوية.",
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
export const galleryHeroSrc = "/gallery/img_25.jpg";

const ranges: Record<Exclude<GalleryCategoryId, "all">, [number, number]> = {
  exteriors: [1, 12],
  interiors: [13, 28],
  amenities: [29, 44],
  construction: [45, 58],
  aerials: [59, 72],
};

function buildImages(): GalleryImage[] {
  const out: GalleryImage[] = [];
  for (const cat of galleryCategories) {
    const [from, to] = ranges[cat.id];
    let n = 0;
    for (let i = from; i <= to; i++) {
      n += 1;
      out.push({
        id: `${cat.id}-${String(n).padStart(2, "0")}`,
        src: `/gallery/img_${i}.jpg`,
        categoryId: cat.id,
        nameAr: `${cat.titleAr} ${n}`,
        nameEn: `${cat.titleEn} ${n}`,
        categoryTitleAr: cat.titleAr,
        categoryTitleEn: cat.titleEn,
      });
    }
  }
  return out;
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
  { src: "/gallery/img_2.jpg", categoryId: "amenities", captionAr: "مسبح خاص لكل منتجع", captionEn: "A private pool in every resort" },
  { src: "/gallery/img_15.jpg", categoryId: "interiors", captionAr: "جناح بمسبح داخلي", captionEn: "Suite with an indoor pool" },
  { src: "/gallery/img_3.jpg", categoryId: "exteriors", captionAr: "واجهات عصرية", captionEn: "Modern facades" },
  { src: "/gallery/img_26.jpg", categoryId: "amenities", captionAr: "ميني غولف", captionEn: "Mini golf" },
  { src: "/gallery/img_7.jpg", categoryId: "interiors", captionAr: "صالات بإطلالة", captionEn: "Lounges with a view" },
  { src: "/gallery/img_25.jpg", categoryId: "exteriors", captionAr: "غروب سحاب", captionEn: "Sunset over Sahab" },
  { src: "/gallery/img_30.jpg", categoryId: "exteriors", captionAr: "مدخل المجتمع", captionEn: "Community entrance" },
];
