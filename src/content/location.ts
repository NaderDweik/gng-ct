import { site } from "@/content/site";

export const locationCopy = {
  eyebrowAr: "الموقع",
  eyebrowEn: "Location",
  titleAr: "باتجاه سحاب الحطمية.",
  titleEn: "Towards Sahab Al-Hatmiyeh.",
  subAr:
    "يقع Giving City في المطبّة، على بُعد ٣٦ كم من فندق الرويال باتجاه سحاب الحطمية — مجتمع مسوّر بهواء أنظف ومساحة أوسع، مع وصول سهل إلى عمّان والمطار.",
  subEn:
    "Giving City sits in Al Matabba, 36 km from Le Royal Hotel towards Sahab Al-Hatmiyeh — a gated community with cleaner air and more space, with easy access to Amman and the airport.",
  addressLabelAr: "العنوان",
  addressLabelEn: "Address",
  addressAr: "المطبّة — ٣٦ كم من فندق الرويال\nباتجاه سحاب الحطمية، الأردن",
  addressEn: "Al Matabba — 36 km from Le Royal Hotel\ntowards Sahab Al-Hatmiyeh, Jordan",
  phoneLabelAr: "الهاتف",
  phoneLabelEn: "Phone",
  deliveryLabelAr: "الاستلام",
  deliveryLabelEn: "Move-in",
  deliveryAr: "حسب الخطة ٢٠٢٥–٢٠٢٧",
  deliveryEn: "Per plan 2025–2027",
  nearbyTitleAr: "على بُعد دقائق من كل ما يهم",
  nearbyTitleEn: "Minutes from everything that matters",
  openMapAr: "افتح الخريطة",
  openMapEn: "Open map",
  mapShortAr: "المطبّة، سحاب — الأردن",
  mapShortEn: "Al Matabba, Sahab — Jordan",
  projectPinAr: "Giving City — روح العطاء",
  projectPinEn: "Giving City",
} as const;

export type NearbyPlace = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Road distance and free-flow drive time from the project pin (OSRM, 2026-09). */
  km: number;
  minutes: number;
  timeAr: string;
  timeEn: string;
  coords: { lat: number; lng: number };
};

const place = (p: Omit<NearbyPlace, "timeAr" | "timeEn">): NearbyPlace => ({
  ...p,
  timeAr: `${p.minutes.toLocaleString("ar-JO")} دقيقة`,
  timeEn: `${p.minutes} min`,
});

/**
 * Drive-time destinations from the project pin (OSRM draws the live route).
 * Distances/times were measured on OSRM's road network from the pin below;
 * they're free-flow, so rush hour in Amman adds a few minutes.
 */
export const nearbyPlaces: NearbyPlace[] = [
  place({ id: "sahab", nameAr: "سحاب", nameEn: "Sahab", km: 21.3, minutes: 16, coords: { lat: 31.8787, lng: 36.0043 } }),
  place({ id: "downtown", nameAr: "وسط البلد", nameEn: "Downtown Amman", km: 34.9, minutes: 29, coords: { lat: 31.9516, lng: 35.9393 } }),
  place({ id: "royal", nameAr: "فندق الرويال", nameEn: "Le Royal Hotel", km: 35.9, minutes: 30, coords: { lat: 31.9533, lng: 35.9088 } }),
  place({ id: "abdali", nameAr: "بوليفارد العبدلي", nameEn: "Abdali Boulevard", km: 40.1, minutes: 31, coords: { lat: 31.9642, lng: 35.9067 } }),
  place({ id: "marka", nameAr: "ماركا", nameEn: "Marka", km: 41, minutes: 32, coords: { lat: 31.9808, lng: 35.9853 } }),
  place({ id: "citymall", nameAr: "سيتي مول", nameEn: "City Mall", km: 46, minutes: 37, coords: { lat: 31.9805, lng: 35.838 } }),
  place({ id: "airport", nameAr: "مطار الملكة علياء الدولي", nameEn: "Queen Alia International Airport", km: 42.3, minutes: 38, coords: { lat: 31.7226, lng: 35.9929 } }),
  place({ id: "madaba", nameAr: "مادبا", nameEn: "Madaba", km: 48.6, minutes: 41, coords: { lat: 31.7166, lng: 35.7944 } }),
  place({ id: "deadsea", nameAr: "البحر الميت", nameEn: "Dead Sea", km: 79.5, minutes: 63, coords: { lat: 31.7196, lng: 35.5897 } }),
];

export const projectCoords = site.coordinates;
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${projectCoords.lat},${projectCoords.lng}`;
