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
    eyebrow: "Visual Experience",
    title: "Project Gallery",
    allTitle: "All",
    allDescription:
      "Browse the complete Giving City gallery across exteriors, interiors, amenities, construction and aerials.",
  },
  ar: {
    eyebrow: "التجربة المرئية الفاخرة",
    title: "المعرض",
    allTitle: "الكل",
    allDescription:
      "تصفح معرض Giving City الكامل عبر الواجهات الخارجية، والداخل، والمرافق، ومراحل الإنشاء، والإطلالات الجوية.",
  },
} as const;

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
