/**
 * Which chalets are on sale, for the /compound map (features/units/CompoundPlan.tsx):
 * these show as available (green on the map, listed in the "Available chalets" sheet /
 * panel); every other chalet shows as unavailable when tapped.
 *
 * PLACEHOLDER: an even spread across the compounds until the client sends the real list.
 * Replace the ids below (as printed on the plan, e.g. "D24"); nothing else needs changing.
 */
export const availableChaletIds: readonly string[] = [
  "B8", "D1", "D13", "D28", "D52", "G10", "I12", "K1", "L12",
  "M2", "M8", "O12", "P5", "P17", "P29", "Q10", "Q22", "R2",
  "R14", "R27", "R44", "S2", "S14", "T1", "T13", "W3",
];

const available = new Set(availableChaletIds);

export const isChaletAvailable = (id: string) => available.has(id);
