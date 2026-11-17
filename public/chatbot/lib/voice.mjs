// The client's wording rules (Nov 2026), applied to everything Layan says and to the question
// labels she shows as buttons. The answer data is already written this way; this is the
// safety net for site passages and older lines.
//   · the project is «كمباوند شاليهات Giving» (never «روح العطاء»)
//   · a unit is «شاليه ڤيلا», many units are «وحدات شاليه ڤيلا»
//   · payment is «التمويل» (never تقسيط/أقساط/قسط), and never «بدون فوائد»: «التمويل من خلالنا»
// Prices, the 1% monthly figure and interest are never stated (answer data and brain.mjs).

export const BRAND = "كمباوند شاليهات Giving";
const UNIT = "شاليه ڤيلا";
const UNITS = "وحدات شاليه ڤيلا";
// Keeps «كمباوند شاليهات Giving» out of the «شاليهات» rule below.
const KEEP = "\u0001";

const RULES = [
  // The project's name.
  [/(?:كمباوند\s+)?(?:شاليهات\s+)?روح\s+العطاء/g, BRAND],
  [/(ل)?شركة\s+العطاء\s+للتطوير\s+العقاري(?:\s+وأعمار\s+المدن)?/g, (_, l) => `${l ? "لل" : "ال"}شركة المطوّرة ل${BRAND}`],
  [/كمباوند شاليهات Giving/g, KEEP],
  // Units, with the article/prepositions and attached pronouns («شاليهك» → «شاليه ڤيلا تبعك»).
  [/(^|[^\p{L}])([وفبل]?)(?:ال|(?<=ل)ل)?شاليهات(هم|كم|نا)(?![\p{L}])/gu, (_, a, p, s) => `${a}${p}${UNITS} ${s === "هم" ? "تبعتهم" : s === "كم" ? "تبعتكم" : "تبعتنا"}`],
  [/(^|[^\p{L}])([وفبل]?)(?:ال|(?<=ل)ل)?شاليهات(?![\p{L}])/gu, (_, a, p) => `${a}${p}${UNITS}`],
  [/(^|[^\p{L}])([وفبل]?)شاليه(ك|ه|ي|كم|نا|ها)(?![\p{L}])/gu, (_, a, p, s) => `${a}${p}${UNIT} ${{ ك: "تبعك", ه: "تبعه", ي: "تبعي", كم: "تبعكم", نا: "تبعنا", ها: "تبعها" }[s]}`],
  [/(^|[^\p{L}])([وفبل]?)(?:ال|(?<=ل)ل)?شالي[هة](?!\s*ڤيلا)(?![\p{L}])/gu, (_, a, p) => `${a}${p}${UNIT}`],
  [new RegExp(KEEP, "g"), BRAND],
  // Financing.
  [/(?:بدون|بلا|من غير)\s+(?:أي\s+|اي\s+)?(?:فوائد|فايدة|فائدة)/g, "من خلالنا مباشرة"],
  [/تقسيط|أقساط|اقساط/g, "تمويل"],
  [/(ال)?قسط(?:ه|ها)?\s+(ال)?شهري/g, (_, a) => (a ? "الدفعة الشهرية ضمن التمويل" : "دفعة شهرية ضمن التمويل")],
  // Numbers as digits (site text quoted as is).
  [/ثلاثي(?:\s+ال)?\s*فاز/g, "3 فاز"],
  [/خمسمي[ةه] متر(?: مربع)?/g, "500 م²"],
  [/ثلاث (غرف|أمتار|حمامات)/g, "3 $1"],
  [/أربع (غرف|حمامات)/g, "4 $1"],
  [/عشر سنوات/g, "10 سنوات"],
];

/** Layan's wording for one text (a reply bubble or a button label). */
export function voice(text) {
  if (!text) return text;
  let out = text;
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out;
}

/** Things Layan must never say (checked by tools/voice-check.mjs over every written answer). */
export const BANNED = [
  [/روح العطاء/, "the old project name"],
  [/شالي[هة](?!\s*ڤيلا|ات Giving)/, "«شاليه» without «ڤيلا»"],
  [/تقسيط|أقساط|اقساط|(?:^|\s)(?:ال)?قسط(?!ل)/, "instalments (say التمويل)"],
  [/فوائد|فايدة|فائدة/, "interest"],
  [/1\s?%|١٪|واحد بالمي[ةه]/, "the 1% figure"],
  [/سحاب|الحطمي[ةه]|حتمي[ةه]/, "Sahab/Hatmiyeh in the location"],
  [/الدوار السابع|42 د/, "the 7th Circle time"],
  [/مصدر دخل|دخل إلك/, "rental income promises"],
  // Numbers are written as digits («500 م²», «3 غرف»), never in words.
  [/(?:^|[\s،(])(?:خمسمي[ةه]|ثلاثمي[ةه]|ستمي[ةه]|ميتين|ثلاث[ةه]?|تلات[ةه]?|أربع[ةه]?|اربع[ةه]?|خمس[ةه]?|ست[ةه]|سبع[ةه]?|ثمان[يةه]|تمان[يةه]|تسع[ةه]?|عشر[ةه]?|عشرين|ثلاثين|أربعين|خمسين|ألفين|الفين|ثلاثي)(?=[\s،.!؟)]|$)/, "a number in words (write digits)"],
];
