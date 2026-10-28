// Scores search on questions written differently from phrasings.json (held out), so the
// number shows how well the bot generalises. Usage: node chatbot-poc/tools/eval.mjs
import { readFileSync } from "node:fs";
import { createEmbedder } from "../lib/embed.mjs";
import { createSearch } from "../lib/core.mjs";

const here = (p) => new URL(p, import.meta.url);
const vocab = JSON.parse(readFileSync(here("../model/vocab.json"), "utf8"));
const buf = readFileSync(here("../model/vectors.bin"));
const embedder = createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
const { docs } = JSON.parse(readFileSync(here("../model/kb.json"), "utf8"));

// [question, a word that must appear in the chosen doc's question/title]
const CASES = [
  ["طيب وين بالضبط مكانكم؟", "يقع"], ["المشروع بأي منطقة", "يقع"], ["كم بدي سواقة من عمان", "يبعد"],
  ["المطار قريب؟", "يبعد"], ["الشاليه كم متر مربع", "مساحة"], ["كم غرفة بالشاليه", "مساحة"],
  ["في بركة سباحة خاصة؟", "المرافق"], ["الامن كيف عندكم", "الأمن"], ["في حرس على البوابة؟", "الأمن"],
  ["بدي اعمل معاينة", "موعد"], ["ممكن زيارة يوم الجمعة", "موعد"], ["انا مغترب بقدر اشوفه فيديو", "فيديو"],
  ["الشاليه بكم", "أسعار"], ["عندكم نظام دفعات؟", "تقسيط"], ["بتقبلوا قروض البنوك", "تقسيط"],
  ["شو الاوراق اللي لازم اجيبها", "المستندات"], ["في مصاريف بعد الشراء؟", "رسوم"], ["القوشان باسم مين بطلع", "تسجيل"],
  ["شو اول خطوة للشراء", "الخطوات"], ["امتى بستلم المفتاح", "تسليم"], ["في شي جاهز للسكن", "تسليم"],
  ["بقدر اربح من تأجيره", "تأجير"], ["شو الخدمات المتوفرة هلأ", "الخدمات"], ["شو رح تعملوا بالمستقبل", "القادمة"],
  ["مين بدير قسم الصيانة", "فريق"], ["شو مميزاتكم", "يميّزه"], ["في مطاعم او كافيه", "المرافق"],
  ["في مكان للاطفال يلعبوا", "المرافق"], ["في طاقة شمسية", "الطاقة"], ["في بير مي", "مياه"],
];

function run(useEmbed, opts) {
  const { search } = createSearch(docs, useEmbed ? embedder : null, opts);
  let ok = 0;
  const misses = [];
  for (const [q, want] of CASES) {
    const top = search(q, 1)[0]?.d;
    const hay = `${top?.q ?? ""} ${top?.title ?? ""} ${top?.text?.slice(0, 120) ?? ""}`;
    if (hay.includes(want)) ok++; else misses.push(`${q} → ${top?.q ?? top?.title ?? "-"}`);
  }
  return { ok, misses };
}
if (process.argv[2] === "grid") {
  for (const semWeight of [0.4, 0.5, 0.6, 0.7, 0.8]) for (const semFloor of [0.2, 0.3, 0.4, 0.5])
    console.log(semWeight, semFloor, run(true, { semWeight, semFloor }).ok);
  process.exit();
}
for (const mode of [false, true]) {
  const { ok, misses } = run(mode);
  console.log(`${mode ? "letters + meaning" : "letters only     "}: ${ok}/${CASES.length} (${Math.round((100 * ok) / CASES.length)}%)`);
  if (mode) misses.forEach((m) => console.log("   miss:", m));
}
