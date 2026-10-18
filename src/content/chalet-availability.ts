/**
 * Which chalets are on sale, for the /compound map (features/units/CompoundPlan.tsx):
 * these show as available (green on the map, listed in the "Available chalets" sheet /
 * panel); every other chalet shows as unavailable when tapped.
 *
 * From the client's price cards at the sales office (photos of 2026-10-18): each chalet's
 * area and its features («المميزات», word for word). Prices are not shown on the site. A card with no
 * features has an empty list. The Chalets Google Sheet overrides all of this once it loads
 * (lib/chaletsSheet.ts).
 *
 * The card "N1+" has no tag of its own on the plan (N1, N3, N3+, N5…), so it is listed as N1;
 * a sheet row "N1+" is read as N1 too (lib/chaletsSheet.ts).
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

export type ChaletListing = { area: number; features: ChaletFeature[] };

export const chaletListings: Record<string, ChaletListing> = {
  A3: { area: 501, features: [F.facingPark, F.charging] },
  A5: { area: 500, features: [F.facingPark] },
  A6: { area: 506, features: [F.besidePark, F.reception, F.prayer] },
  A7: { area: 590, features: [F.facingPark, F.reception, F.extraArea, F.prayer] },
  "A11+": { area: 500, features: [F.facingPark] },
  "A13+": { area: 500, features: [] },
  "A15+": { area: 500, features: [] },
  "A17+": { area: 500, features: [] },
  B13: { area: 501, features: [F.supermarket] },
  D50: { area: 500, features: [F.facingPark] },
  D54: { area: 465, features: [F.facingPark] },
  D58: { area: 454, features: [F.twoStreets, F.facingPark] },
  E11: { area: 500, features: [F.nearPark, F.nearGolf] },
  E13: { area: 500, features: [] },
  "F1+": { area: 588, features: [F.twoStreets, F.facingGolf] },
  F3: { area: 500, features: [F.courts, F.carPark] },
  F5: { area: 559, features: [F.twoStreets, F.facingGolf, F.gate] },
  I18: { area: 675, features: [F.facingPark] },
  I22: { area: 675, features: [F.facingPark, F.parking] },
  "J4+": { area: 500, features: [] },
  "J6+": { area: 500, features: [] },
  "J8+": { area: 500, features: [] },
  "J10+": { area: 500, features: [F.nearPark] },
  L8: { area: 500, features: [] },
  L12: { area: 500, features: [] },
  L16: { area: 500, features: [] },
  L21: { area: 615, features: [F.twoStreets] },
  M6: { area: 500, features: [F.twoStreets, F.mosque] },
  N1: { area: 500, features: [F.facingGolf, F.restaurants, F.cafes, F.facingPark] },
  N7: { area: 570, features: [F.twoStreets, F.facingGolf, F.facingPark] },
  "T15+": { area: 586, features: [F.courts] },
};

export const availableChaletIds: readonly string[] = Object.keys(chaletListings);

export const isChaletAvailable = (id: string) => id in chaletListings;

/** The Arabic feature line → its English, for features typed into the sheet. */
export const featureEn = (ar: string) => Object.values(F).find((f) => f.ar === ar.trim())?.en;
