  import { site } from "@/content/site";

export const locationCopy = {
  eyebrowAr: "الموقع",
  eyebrowEn: "Location",
  titleAr: "الأردن، عمّان، القسطل، قصر المشتى",
  titleEn: "Jordan, Amman, Al-Qastal, Qasr al-Mushatta",
  subAr:
    "يقع روح العطاء في المطبّة، باتجاه سحاب الحطمية. كمباوند مسوّر بهواء أنظف ومساحة أوسع، مع وصول سهل إلى عمّان والمطار.",
  subEn:
    "Giving Compound sits in Al Matabba, towards Sahab Al-Hatmiyeh. A gated community with cleaner air and more space, with easy access to Amman and the airport.",
  addressLabelAr: "العنوان",
  addressLabelEn: "Address",
  addressAr: "المطبّة\nباتجاه سحاب الحطمية، الأردن",
  addressEn: "Al Matabba\ntowards Sahab Al-Hatmiyeh, Jordan",
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
  /** Driving time to the compound (minutes), shown instead of km since 2026-10-21. The
   *  figures were set by hand on 2026-10-21 (OSRM's own times were unusable near the
   *  compound: it routes the last stretch over farm tracks). Keep the list nearest first. */
  minutes?: number;
  distanceAr: string;
  distanceEn: string;
  /** The pin; its road to the compound is in location-routes.ts (scripts/location-routes.mjs). */
  coords: { lat: number; lng: number };
};

const place = (p: Omit<NearbyPlace, "distanceAr" | "distanceEn">): NearbyPlace => ({
  ...p,
  // Arabic counted noun: 3 to 10 take the plural (دقائق), 11 and up the singular (دقيقة).
  distanceAr: p.minutes != null ? `${p.minutes} ${p.minutes >= 3 && p.minutes <= 10 ? "دقائق" : "دقيقة"}` : "",
  distanceEn: p.minutes != null ? `${p.minutes} min` : "",
});

/**
 * Nearby points of interest (the client's list of 2026-10-21), nearest first by drive time, which the map lists and
 * tours them in. Each one's road runs to the compound's pin (site.coordinates).
 * After moving or adding one, run `node scripts/location-routes.mjs` to redraw its road.
 */
export const nearbyPlaces: NearbyPlace[] = [
  place({ id: "mushatta", nameAr: "قصر المشتى", nameEn: "Qasr al-Mushatta", km: 12, minutes: 10, coords: { lat: 31.7379357, lng: 36.0102195 } }),
  place({ id: "isra", nameAr: "جامعة الإسراء", nameEn: "Isra University", km: 24, minutes: 20, coords: { lat: 31.7891885, lng: 35.9287065 } }),
  place({ id: "airport", nameAr: "مطار الملكة علياء", nameEn: "Queen Alia Airport", km: 16, minutes: 23, coords: { lat: 31.7225, lng: 35.9935 } }),
  place({ id: "ikea", nameAr: "ايكيا", nameEn: "IKEA", km: 29, minutes: 28, coords: { lat: 31.8264344, lng: 35.9013632 } }),
  place({ id: "seventh-circle", nameAr: "الدوار السابع", nameEn: "7th Circle", km: 48, minutes: 42, coords: { lat: 31.9593988, lng: 35.8575522 } }),
  place({ id: "abdali", nameAr: "بوليفارد العبدلي", nameEn: "Abdali Boulevard", km: 44, minutes: 47, coords: { lat: 31.9648636, lng: 35.9040935 } }),
];

/** The FAQ's drive from Amman: the 7th Circle entry above (Le Royal Hotel was dropped in Oct 2026). */
const seventh = nearbyPlaces.find((p) => p.id === "seventh-circle")!;
export const ammanDrive = { km: seventh.km!, minutes: seventh.minutes! } as const;

export const projectCoords = site.coordinates;
