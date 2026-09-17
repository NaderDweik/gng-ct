/** Gallery images — local paths after migration; fallback to remote CDN of current site */
export type GalleryCategory =
  | "all"
  | "exteriors"
  | "interiors"
  | "amenities"
  | "construction"
  | "aerials";

export type GalleryImage = {
  id: number;
  src: string;
  remoteSrc: string;
  category: GalleryCategory;
  altAr: string;
  altEn: string;
};

function categorize(n: number): GalleryCategory {
  if (n <= 12) return "exteriors";
  if (n <= 28) return "interiors";
  if (n <= 44) return "amenities";
  if (n <= 58) return "construction";
  return "aerials";
}

export const galleryImages: GalleryImage[] = Array.from({ length: 72 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    src: `/gallery/img_${n}.jpg`,
    remoteSrc: `https://giving-city.com/images/img_${n}.jpg`,
    category: categorize(n),
    altAr: `Giving City — صورة ${n}`,
    altEn: `Giving City — image ${n}`,
  };
});

export const galleryCategories: { id: GalleryCategory; labelAr: string; labelEn: string }[] = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  { id: "exteriors", labelAr: "الواجهات", labelEn: "Exteriors" },
  { id: "interiors", labelAr: "الداخل", labelEn: "Interiors" },
  { id: "amenities", labelAr: "المرافق", labelEn: "Amenities" },
  { id: "construction", labelAr: "الإنشاء", labelEn: "Construction" },
  { id: "aerials", labelAr: "جوي", labelEn: "Aerials" },
];
