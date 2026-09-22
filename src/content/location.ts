import { site } from "@/content/site";

export const locationCopy = {
  eyebrowAr: "الموقع",
  eyebrowEn: "Location",
  titleAr: "باتجاه سحاب الحطمية.",
  titleEn: "Towards Sahab Al-Hatmiyeh.",
  subAr:
    "يقع Giving City على بُعد ٣٩ كم من فندق الرويال باتجاه سحاب الحطمية — مجتمع مسوّر بهواء أنظف ومساحة أوسع، مع وصول سهل إلى عمّان والمطار.",
  subEn:
    "Giving City sits 39 km from the Royal Hotel towards Sahab Al-Hatmiyeh — a gated community with cleaner air and more space, with easy access to Amman and the airport.",
  addressLabelAr: "العنوان",
  addressLabelEn: "Address",
  addressAr: "٣٩ كم من فندق الرويال\nباتجاه سحاب الحطمية، الأردن",
  addressEn: "39 km from the Royal Hotel\ntowards Sahab Al-Hatmiyeh, Jordan",
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
  mapShortAr: "سحاب الحطمية، الأردن",
  mapShortEn: "Sahab Al-Hatmiyeh, Jordan",
  projectPinAr: "Giving City — روح العطاء",
  projectPinEn: "Giving City",
} as const;

export type NearbyPlace = {
  id: string;
  nameAr: string;
  nameEn: string;
  timeAr: string;
  timeEn: string;
  coords: { lat: number; lng: number };
};

/** Drive-time destinations from the project pin (OSRM draws the live route). */
export const nearbyPlaces: NearbyPlace[] = [
  {
    id: "royal",
    nameAr: "فندق الرويال",
    nameEn: "Royal Hotel",
    timeAr: "٣٥ دقيقة",
    timeEn: "35 min",
    coords: { lat: 31.972, lng: 35.835 },
  },
  {
    id: "sahab",
    nameAr: "سحاب",
    nameEn: "Sahab",
    timeAr: "١٢ دقيقة",
    timeEn: "12 min",
    coords: { lat: 31.87, lng: 36.005 },
  },
  {
    id: "airport",
    nameAr: "مطار الملكة علياء الدولي",
    nameEn: "Queen Alia International Airport",
    timeAr: "٢٥ دقيقة",
    timeEn: "25 min",
    coords: { lat: 31.7238, lng: 36.0072 },
  },
  {
    id: "marka",
    nameAr: "ماركا",
    nameEn: "Marka",
    timeAr: "٢٠ دقيقة",
    timeEn: "20 min",
    coords: { lat: 31.972, lng: 35.995 },
  },
  {
    id: "abdali",
    nameAr: "بوليفارد العبدلي",
    nameEn: "Abdali Boulevard",
    timeAr: "٤٠ دقيقة",
    timeEn: "40 min",
    coords: { lat: 31.9642, lng: 35.9067 },
  },
  {
    id: "citymall",
    nameAr: "سيتي مول",
    nameEn: "City Mall",
    timeAr: "٣٨ دقيقة",
    timeEn: "38 min",
    coords: { lat: 31.9805, lng: 35.838 },
  },
  {
    id: "downtown",
    nameAr: "وسط البلد",
    nameEn: "Downtown Amman",
    timeAr: "٤٢ دقيقة",
    timeEn: "42 min",
    coords: { lat: 31.9539, lng: 35.9106 },
  },
  {
    id: "madaba",
    nameAr: "مادبا",
    nameEn: "Madaba",
    timeAr: "٣٥ دقيقة",
    timeEn: "35 min",
    coords: { lat: 31.716, lng: 35.794 },
  },
  {
    id: "deadsea",
    nameAr: "البحر الميت",
    nameEn: "Dead Sea",
    timeAr: "٥٥ دقيقة",
    timeEn: "55 min",
    coords: { lat: 31.717, lng: 35.585 },
  },
];

export const projectCoords = site.coordinates;
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${projectCoords.lat},${projectCoords.lng}`;
