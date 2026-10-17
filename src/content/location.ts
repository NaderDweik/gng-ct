import { site } from "@/content/site";

export const locationCopy = {
  eyebrowAr: "الموقع",
  eyebrowEn: "Location",
  titleAr: "٢٤ كم من جامعة الإسراء عبر طريق القسطل",
  titleEn: "24 km from Isra University via Al-Qastal Road",
  subAr:
    "يقع روح العطاء في المطبّة، على بُعد ٤١ كم من فندق الرويال باتجاه سحاب الحطمية. كمباوند مسوّر بهواء أنظف ومساحة أوسع، مع وصول سهل إلى عمّان والمطار.",
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
  /** Driving distance to the compound (km), rounded; measured with the OSRM router for the
   *  pin moved on 2026-10-17 (scripts/location-routes.mjs prints them). */
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
 * Nearby points of interest, in the client's order (2026-10-17), which the map lists and
 * tours them in. Each one's road runs to the compound's pin (site.coordinates).
 * After moving or adding one, run `node scripts/location-routes.mjs` to redraw its road.
 */
export const nearbyPlaces: NearbyPlace[] = [
  place({ id: "isra", nameAr: "جامعة الإسراء", nameEn: "Isra University", km: 24, coords: { lat: 31.7891885, lng: 35.9287065 } }),
  place({ id: "royal", nameAr: "الدوار الثالث (فندق الرويال)", nameEn: "3rd Circle (Le Royal Hotel)", km: 41, coords: { lat: 31.9532892, lng: 35.9087841 } }),
  place({ id: "ibn-sina", nameAr: "جامعة ابن سينا", nameEn: "Ibn Sina University", km: 30, coords: { lat: 31.741268, lng: 35.943288 } }),
  place({ id: "luminus", nameAr: "كلية لومينس", nameEn: "Luminus College", km: 40, coords: { lat: 31.8981392, lng: 35.868694 } }),
  place({ id: "mushatta", nameAr: "قصر المشتى", nameEn: "Qasr al-Mushatta", km: 12, coords: { lat: 31.7379357, lng: 36.0102195 } }),
  place({ id: "ikea", nameAr: "ايكيا", nameEn: "IKEA", km: 29, coords: { lat: 31.8264344, lng: 35.9013632 } }),
];

/** Le Royal Hotel: the reference point in the address and the FAQ. */
export const royalDrive = { km: 41, minutes: 55 } as const;

export const projectCoords = site.coordinates;
