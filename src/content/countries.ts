/**
 * Country codes for the /register phone field (features/register/CountryPhoneField.tsx):
 * Jordan first (the default), then the Gulf and the region, then where most expatriate
 * buyers live. Flags come from country-flag-icons (inline SVG, nothing loaded from outside).
 * To add one: its ISO code, dialling code (digits, no "+") and both names.
 */

export type CountryIso =
  | "JO" | "SA" | "AE" | "KW" | "QA" | "BH" | "OM" | "IQ" | "PS" | "LB" | "SY" | "EG"
  | "TR" | "US" | "CA" | "GB" | "DE" | "FR" | "SE" | "NL" | "AU";

export type Country = { iso: CountryIso; dial: string; ar: string; en: string };

export const countries: Country[] = [
  { iso: "JO", dial: "962", ar: "الأردن", en: "Jordan" },
  { iso: "SA", dial: "966", ar: "السعودية", en: "Saudi Arabia" },
  { iso: "AE", dial: "971", ar: "الإمارات", en: "United Arab Emirates" },
  { iso: "KW", dial: "965", ar: "الكويت", en: "Kuwait" },
  { iso: "QA", dial: "974", ar: "قطر", en: "Qatar" },
  { iso: "BH", dial: "973", ar: "البحرين", en: "Bahrain" },
  { iso: "OM", dial: "968", ar: "عُمان", en: "Oman" },
  { iso: "IQ", dial: "964", ar: "العراق", en: "Iraq" },
  { iso: "PS", dial: "970", ar: "فلسطين", en: "Palestine" },
  { iso: "LB", dial: "961", ar: "لبنان", en: "Lebanon" },
  { iso: "SY", dial: "963", ar: "سوريا", en: "Syria" },
  { iso: "EG", dial: "20", ar: "مصر", en: "Egypt" },
  { iso: "TR", dial: "90", ar: "تركيا", en: "Türkiye" },
  { iso: "US", dial: "1", ar: "الولايات المتحدة", en: "United States" },
  { iso: "CA", dial: "1", ar: "كندا", en: "Canada" },
  { iso: "GB", dial: "44", ar: "المملكة المتحدة", en: "United Kingdom" },
  { iso: "DE", dial: "49", ar: "ألمانيا", en: "Germany" },
  { iso: "FR", dial: "33", ar: "فرنسا", en: "France" },
  { iso: "SE", dial: "46", ar: "السويد", en: "Sweden" },
  { iso: "NL", dial: "31", ar: "هولندا", en: "Netherlands" },
  { iso: "AU", dial: "61", ar: "أستراليا", en: "Australia" },
];

export const defaultCountry: CountryIso = "JO";
