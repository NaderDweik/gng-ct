import { site } from "@/content/site";

export const locationCopy = {
  eyebrowAr: "الموقع",
  eyebrowEn: "Location",
  titleAr: "25 كم من جامعة الإسراء عبر طريق القسطل",
  titleEn: "25 km from Isra University via Al-Qastal Road",
  subAr:
    "يقع روح العطاء في المطبّة، على بُعد ٤١ كم من فندق الرويال باتجاه سحاب الحطمية. مجتمع مسوّر بهواء أنظف ومساحة أوسع، مع وصول سهل إلى عمّان والمطار.",
  subEn:
    "Giving Compound sits in Al Matabba, 41 km from Le Royal Hotel towards Sahab Al-Hatmiyeh. A gated community with cleaner air and more space, with easy access to Amman and the airport.",
  addressLabelAr: "العنوان",
  addressLabelEn: "Address",
  addressAr: "المطبّة، ٤١ كم من فندق الرويال\nباتجاه سحاب الحطمية، الأردن",
  addressEn: "Al Matabba, 41 km from Le Royal Hotel\ntowards Sahab Al-Hatmiyeh, Jordan",
  phoneLabelAr: "الهاتف",
  phoneLabelEn: "Phone",
  deliveryLabelAr: "الاستلام",
  deliveryLabelEn: "Move-in",
  deliveryAr: "حسب الشاليه",
  deliveryEn: "Per chalet",
  nearbyTitleAr: "نقاط الاهتمام القريبة",
  nearbyTitleEn: "Nearby points of interest",
} as const;

export type NearbyPlace = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Road distance (km), when the company has given a figure. */
  km?: number;
  distanceAr: string;
  distanceEn: string;
  /** The pin; its road to the compound is in location-routes.ts (scripts/location-routes.mjs). */
  coords: { lat: number; lng: number };
};

const place = (p: Omit<NearbyPlace, "distanceAr" | "distanceEn">): NearbyPlace => ({
  ...p,
  distanceAr: p.km != null ? `${p.km.toLocaleString("ar-JO")} كم` : "",
  distanceEn: p.km != null ? `${p.km} km` : "",
});

/**
 * Nearby points of interest, in the order the map lists and tours them.
 * After moving or adding one, run `node scripts/location-routes.mjs` to redraw its road.
 */
export const nearbyPlaces: NearbyPlace[] = [
  place({ id: "isra", nameAr: "جامعة الإسراء", nameEn: "Isra University", coords: { lat: 31.7891885, lng: 35.9287065 } }),
  place({ id: "ikea", nameAr: "ايكيا", nameEn: "IKEA", coords: { lat: 31.8264344, lng: 35.9013632 } }),
  place({ id: "ibn-sina", nameAr: "جامعة ابن سينا", nameEn: "Ibn Sina University", coords: { lat: 31.741268, lng: 35.943288 } }),
  place({ id: "hijra", nameAr: "قرية الحجرة", nameEn: "Al-Hijra Village", coords: { lat: 31.721914, lng: 35.952146 } }),
  place({ id: "airport", nameAr: "مطار الملكة علياء", nameEn: "Queen Alia Airport", coords: { lat: 31.7238024, lng: 36.007237 } }),
];

/** Le Royal Hotel: the reference point in the address and the FAQ. */
export const royalDrive = { km: 41, minutes: 55 } as const;

export const projectCoords = site.coordinates;
