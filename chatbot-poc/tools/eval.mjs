// Scores search on questions written differently from phrasings.json (held out), so the
// number shows how well the bot generalises. Usage: node chatbot-poc/tools/eval.mjs
import { readFileSync } from "node:fs";
import { createEmbedder } from "../../public/chatbot/lib/embed.mjs";
import { createSearch } from "../../public/chatbot/lib/core.mjs";

const here = (p) => new URL(p, import.meta.url);
const vocab = JSON.parse(readFileSync(here("../../public/chatbot/model/vocab.json"), "utf8"));
const buf = readFileSync(here("../../public/chatbot/model/vectors.bin"));
const embedder = createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
const { docs } = JSON.parse(readFileSync(here("../../public/chatbot/model/kb.json"), "utf8"));

// [question, a word that must appear in the chosen doc's question/title]
const CASES = [
  ["طيب وين بالضبط مكانكم؟", "يقع"], ["المشروع بأي منطقة", "يقع"], ["كم بدي سواقة من عمان", "يبعد"],
  ["المطار قريب؟", "يبعد|#nearby"], ["الشاليه كم متر مربع", "مساحة"], ["كم غرفة بالشاليه", "مساحة|#bedrooms"],
  ["في بركة سباحة خاصة؟", "المرافق|#pool"], ["الامن كيف عندكم", "الأمن"], ["في حرس على البوابة؟", "الأمن"],
  ["بدي اعمل معاينة", "موعد"], ["ممكن زيارة يوم الجمعة", "موعد"], ["انا مغترب بقدر اشوفه فيديو", "فيديو"],
  ["الشاليه بكم", "أسعار"], ["عندكم نظام دفعات؟", "تقسيط"], ["بتقبلوا قروض البنوك", "تقسيط"],
  ["شو الاوراق اللي لازم اجيبها", "المستندات"], ["في مصاريف بعد الشراء؟", "رسوم"], ["القوشان باسم مين بطلع", "تسجيل"],
  ["شو اول خطوة للشراء", "الخطوات"], ["امتى بستلم المفتاح", "تسليم"], ["في شي جاهز للسكن", "تسليم"],
  ["بقدر اربح من تأجيره", "تأجير"], ["شو الخدمات المتوفرة هلأ", "الخدمات"], ["شو رح تعملوا بالمستقبل", "القادمة"],
  ["مين بدير قسم الصيانة", "فريق"], ["شو مميزاتكم", "يميّزه"], ["في مطاعم او كافيه", "المرافق|#food"],
  ["في مكان للاطفال يلعبوا", "المرافق|#kids"], ["في طاقة شمسية", "الطاقة"], ["في بير مي", "مياه"],
];

// The larger held-out set (eval-cases.json). "#id" = that qa.json entry; "?" = not on the site,
// so the best match must stay below the bot's answer threshold (it asks / refers to the team).
const { cases: HELD, fresh: FRESH } = JSON.parse(readFileSync(here("eval-cases.json"), "utf8"));

function run(useEmbed, opts, cases = CASES) {
  const { search } = createSearch(docs, useEmbed ? embedder : null, opts);
  let ok = 0;
  const misses = [];
  for (const [q, want] of cases) {
    const hit = search(q, 1)[0];
    const top = hit?.d;
    const hay = `${top?.q ?? ""} ${top?.title ?? ""} ${top?.text?.slice(0, 120) ?? ""}`;
    // "a|b": either target counts (e.g. a qa.json entry or the site's own item saying the same).
    const one = (w) => (w.startsWith("#") ? top?.id === w.slice(1) : hay.includes(w));
    const pass = want.split("|").some((w) => (w === "?" ? !hit || hit.score < 0.26 : one(w)));
    if (pass) ok++; else misses.push(`${q} → ${top?.id ? "#" + top.id : top?.q ?? top?.title ?? "-"} (${hit?.score.toFixed(2)})`);
  }
  return { ok, misses };
}
if (process.argv[2] === "grid") {
  for (const semWeight of [0.4, 0.5, 0.6, 0.7, 0.8]) for (const semFloor of [0.2, 0.3, 0.4, 0.5])
    console.log(semWeight, semFloor, run(true, { semWeight, semFloor }).ok);
  process.exit();
}
for (const [name, cases] of [["original 30", CASES], ["held-out 60", HELD], ["fresh 30 (never tuned on)", FRESH]]) {
  console.log(`— ${name}`);
  for (const mode of [false, true]) {
    const { ok, misses } = run(mode, undefined, cases);
    console.log(`${mode ? "letters + meaning" : "letters only     "}: ${ok}/${cases.length} (${Math.round((100 * ok) / cases.length)}%)`);
    if (mode && process.argv[2] === "misses") misses.forEach((m) => console.log("   miss:", m));
  }
}
