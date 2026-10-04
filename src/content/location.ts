import { site } from "@/content/site";

export const locationCopy = {
  eyebrowAr: "الموقع",
  eyebrowEn: "Location",
  titleAr: "باتجاه سحاب الحطمية.",
  titleEn: "Towards Sahab Al-Hatmiyeh.",
  subAr:
    "يقع Giving Compound في المطبّة، على بُعد ٤١ كم من فندق الرويال باتجاه سحاب الحطمية. مجتمع مسوّر بهواء أنظف ومساحة أوسع، مع وصول سهل إلى عمّان والمطار.",
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
  nearbyTitleAr: "على بُعد دقائق من كل ما يهم",
  nearbyTitleEn: "Minutes from everything that matters",
  openMapAr: "افتح الخريطة",
  openMapEn: "Open map",
  mapShortAr: "المطبّة، سحاب، الأردن",
  mapShortEn: "Al Matabba, Sahab, Jordan",
  projectPinAr: "Giving Compound (روح العطاء)",
  projectPinEn: "Giving Compound",
} as const;

export type NearbyPlace = {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Road distance (km) from Giving Compound, the company's figure. */
  km: number;
  distanceAr: string;
  distanceEn: string;
  /** Where the route ends on the map (OSRM draws the live route there). */
  coords: { lat: number; lng: number };
};

const place = (p: Omit<NearbyPlace, "distanceAr" | "distanceEn">): NearbyPlace => ({
  ...p,
  distanceAr: `${p.km.toLocaleString("ar-JO")} كم`,
  distanceEn: `${p.km} km`,
});

/**
 * The places and routes we measure from, nearest first (company figures).
 * Road endpoints sit where each route reaches its road: Al-Qastal on the airport
 * road, the Development Corridor (100 Street) by Al-Dhuhaybah.
 */
export const nearbyPlaces: NearbyPlace[] = [
  place({ id: "amra", nameAr: "طريق عمرة عبر الحاتمية", nameEn: "Amra Road via Al-Hatimiyah", km: 12, coords: { lat: 31.8065, lng: 36.2808 } }),
  place({ id: "street100", nameAr: "شارع المية عبر الذهيبة", nameEn: "100 Street via Al-Dhuhaybah", km: 18, coords: { lat: 31.8121, lng: 36.0093 } }),
  place({ id: "airport", nameAr: "طريق المطار عبر القسطل", nameEn: "Airport Road via Al-Qastal", km: 22, coords: { lat: 31.75, lng: 35.9333 } }),
  place({ id: "isra", nameAr: "جامعة الإسراء", nameEn: "Isra University", km: 25, coords: { lat: 31.7892, lng: 35.9287 } }),
];

/** Le Royal Hotel: the reference point in the address and the FAQ. */
export const royalDrive = { km: 41, minutes: 55 } as const;

export const projectCoords = site.coordinates;
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${projectCoords.lat},${projectCoords.lng}`;
