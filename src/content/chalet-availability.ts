/**
 * Which chalets are on sale, for the /compound map (features/units/CompoundPlan.tsx):
 * these show as available (green on the map, listed in the "Available chalets" sheet /
 * panel); every other chalet shows as unavailable when tapped.
 *
 * From the client's price cards at the sales office (photos of 2026-10-18): each chalet's
 * area, its features («المميزات», word for word) and its cash price. A card with no
 * features has an empty list. The Chalets Google Sheet overrides all of this once it loads
 * (lib/chaletsSheet.ts).
 *
 * N1+ has a card but no tag on the plan (the plan has N1, N3, N3+, N5…), so it can't show on
 * the map until the client confirms where it is.
 */

export type ChaletFeature = { ar: string; en: string };

const F = {
  supermarket: { ar: "مقابل سوبر ماركت", en: "Opposite the supermarket" },
  nearPark: { ar: "بالقرب من الحديقة", en: "Near the park" },
  facingPark: { ar: "مقابل الحديقة", en: "Facing the park" },
  besidePark: { ar: "بجانب الحديقة", en: "Next to the park" },
  twoStreets: { ar: "على شارعين", en: "On two streets" },
  mosque: { ar: "بجانب المسجد", en: "Next to the mosque" },
  parking: { ar: "مساحة اصطفاف", en: "Parking space" },
  facingGolf: { ar: "مقابل ملعب جولف", en: "Facing the golf course" },
  nearGolf: { ar: "بالقرب من ملعب جولف", en: "Near the golf course" },
  restaurants: { ar: "مقابل المطاعم", en: "Facing the restaurants" },
  cafes: { ar: "مقابل الكافيهات", en: "Facing the cafés" },
  reception: { ar: "بجانب الرسبشن", en: "Next to reception" },
  prayer: { ar: "بجانب مصلى", en: "Next to a prayer room" },
  gate: { ar: "قريبة من البوابة", en: "Close to the gate" },
  courts: { ar: "مقابل الملاعب", en: "Facing the sports courts" },
  carPark: { ar: "كراج سيارات عام", en: "Public car park" },
  extraArea: { ar: "فرق مساحة", en: "Extra land area" },
  charging: { ar: "محطة شحن مركبات", en: "EV charging station" },
} satisfies Record<string, ChaletFeature>;

export type ChaletListing = { area: number; priceJd: number; features: ChaletFeature[] };

const k = (thousands: number) => thousands * 1000;

export const chaletListings: Record<string, ChaletListing> = {
  A3: { area: 501, priceJd: k(130), features: [F.facingPark, F.charging] },
  A5: { area: 500, priceJd: k(130), features: [F.facingPark] },
  A6: { area: 506, priceJd: k(132), features: [F.besidePark, F.reception, F.prayer] },
  A7: { area: 590, priceJd: k(134), features: [F.facingPark, F.reception, F.extraArea, F.prayer] },
  "A11+": { area: 500, priceJd: k(130), features: [F.facingPark] },
  "A13+": { area: 500, priceJd: k(128), features: [] },
  "A15+": { area: 500, priceJd: k(128), features: [] },
  "A17+": { area: 500, priceJd: k(128), features: [] },
  B13: { area: 501, priceJd: k(130), features: [F.supermarket] },
  D50: { area: 500, priceJd: k(129), features: [F.facingPark] },
  D54: { area: 465, priceJd: k(128), features: [F.facingPark] },
  D58: { area: 454, priceJd: k(128), features: [F.twoStreets, F.facingPark] },
  E11: { area: 500, priceJd: k(129), features: [F.nearPark, F.nearGolf] },
  E13: { area: 500, priceJd: k(128), features: [] },
  "F1+": { area: 588, priceJd: k(133), features: [F.twoStreets, F.facingGolf] },
  F3: { area: 500, priceJd: k(131), features: [F.courts, F.carPark] },
  F5: { area: 559, priceJd: k(132), features: [F.twoStreets, F.facingGolf, F.gate] },
  I18: { area: 675, priceJd: k(134), features: [F.facingPark] },
  I22: { area: 675, priceJd: k(134), features: [F.facingPark, F.parking] },
  "J4+": { area: 500, priceJd: k(128), features: [] },
  "J6+": { area: 500, priceJd: k(128), features: [] },
  "J8+": { area: 500, priceJd: k(128), features: [] },
  "J10+": { area: 500, priceJd: k(128), features: [F.nearPark] },
  L8: { area: 500, priceJd: k(128), features: [] },
  L12: { area: 500, priceJd: k(128), features: [] },
  L16: { area: 500, priceJd: k(128), features: [] },
  L21: { area: 615, priceJd: k(134), features: [F.twoStreets] },
  M6: { area: 500, priceJd: k(130), features: [F.twoStreets, F.mosque] },
  "N1+": { area: 500, priceJd: k(132), features: [F.facingGolf, F.restaurants, F.cafes, F.facingPark] },
  N7: { area: 570, priceJd: k(118), features: [F.twoStreets, F.facingGolf, F.facingPark] },
  "T15+": { area: 586, priceJd: k(132), features: [F.courts] },
};

export const availableChaletIds: readonly string[] = Object.keys(chaletListings);

export const isChaletAvailable = (id: string) => id in chaletListings;

/** The Arabic feature line → its English, for features typed into the sheet. */
export const featureEn = (ar: string) => Object.values(F).find((f) => f.ar === ar.trim())?.en;
