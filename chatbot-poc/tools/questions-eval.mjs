// Runs every question in a questions file (chatbot-poc/questions.md: "- question — `tag`") through
// Layan, each as the first message of a fresh chat, and scores the reply against its tag.
// Usage: node chatbot-poc/tools/questions-eval.mjs [file] [--split=test|train|all] [--fails] [--json=out.json]
//   --split: questions are split 70/30 by a hash of their text; "train" lines feed phrasings
//   (tools/questions-train.mjs), "test" lines measure how well that generalises.
import { readFileSync, writeFileSync } from "node:fs";
import { createEmbedder } from "../../public/chatbot/lib/embed.mjs";
import { createSearch } from "../../public/chatbot/lib/core.mjs";
import { createBrain } from "../../public/chatbot/brain.mjs";
import { createClassifier } from "../../public/chatbot/lib/classify.mjs";
import { existsSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url);
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--")) ?? new URL("../questions.md", import.meta.url).pathname;
const split = (args.find((a) => a.startsWith("--split=")) ?? "--split=all").slice(8);
const showFails = args.includes("--fails");
const jsonOut = args.find((a) => a.startsWith("--json="))?.slice(7);

/** Same 70/30 split everywhere: a stable hash of the question text. */
export function isTest(q) {
  let h = 2166136261;
  for (const ch of q) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return h % 10 < 3;
}

/** "- question — `tag`" lines. */
export function readQuestions(path) {
  const out = [];
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*[-*]\s+(.+?)\s+[—–-]+\s+`([^`]+)`\s*$/);
    if (m) out.push({ q: m[1].trim(), tag: m[2].trim() });
  }
  return out;
}

/** The site's own FAQ questions (phrasings.json keys) → their short tag. */
export const SITE_TAGS = {
  "ما هو كمباوند شاليهات روح العطاء": "about",
  "أين يقع كمباوند شاليهات روح العطاء": "location",
  "كم يبعد الكمباوند عن عمان والمطار": "distance",
  "ما مساحة الأرض والبناء لكل شاليه": "area",
  "ما المرافق الخاصة المتوفرة في كل شاليه": "chalet-facilities",
  "ما المرافق والخدمات المتوفرة داخل الكمباوند": "compound-facilities",
  "كيف يتم توفير الخصوصية والأمن": "security",
  "كيف يمكنني حجز موعد لمعاينة": "visit",
  "هل يمكنني إجراء معاينة افتراضية": "video-visit",
  "كيف يمكنني معرفة أسعار": "prices",
  "هل تتوفر خيارات تقسيط": "installments",
  "ما الإجراءات والمستندات المطلوبة": "documents",
  "هل توجد رسوم إضافية": "fees",
  "هل يتم تسجيل الشاليه باسم المشتري": "title-deed",
  "ما الخطوات التي يمر بها العميل": "buy-steps",
  "متى يتم تسليم الشاليه": "handover",
  "هل يمكن للمالك تأجير الشاليه": "rent-invest",
  "ما هي الخدمات التي تقدمونها": "services",
  "ما الخدمات القادمة والمستقبلية": "future",
  "ما المرافق داخل الشاليه": "chalet-facilities",
  "ما المرافق العامة داخل الكمباوند": "compound-facilities",
  "من فريق الإدارة": "team",
};
// Answers that also count for a tag (they say the same thing).
const SAME = {
  "chalet-facilities": ["area", "outdoor"],
  area: ["chalet-facilities", "bedrooms"],
  "compound-facilities": ["services", "parks", "golf"],
  services: ["compound-facilities", "housekeeping", "maintenance"],
  about: ["what-sell"],
  "what-sell": ["about"],
  prices: ["installments"],
  installments: ["prices"],
  visit: ["office", "book"],
  office: ["visit", "location"],
  location: ["distance", "nearby"],
  distance: ["location"],
  security: ["gated"],
  gated: ["security"],
  "title-deed": ["documents"],
  documents: ["title-deed", "buy-steps"],
  "buy-steps": ["documents", "title-deed"],
  gym: ["future", "sports"],
  future: ["gym"],
  kids: ["pool", "parks"],
  company: ["founder", "team", "trust"],
  founder: ["company", "team"],
  team: ["founder", "company"],
};

// A reply from a site page or a rule (no tagged answer) still counts when it's plainly about the topic.
const SAYS = {
  mosque: /مسجد|مصلى/, location: /القسطل|«الموقع»/, kitchen: /مطبخ/, gym: /نادي|جيم|سبا/, parks: /حديق/,
  golf: /غولف|جولف/, shop: /ماركت|Fast Shop|متجر/, pool: /مسبح/, jacuzzi: /جاكوزي/, food: /كافيه|مطعم/,
  reception: /استقبال/, security: /حراس|أمن/, kids: /أطفال|اطفال/, bikes: /دراج/,
};

export function docTag(d) {
  if (!d) return null;
  if (d.id) return d.id;
  const q = d.q ?? "";
  for (const [k, v] of Object.entries(SITE_TAGS)) if (q.startsWith(k)) return v;
  return d.kind === "page" ? `page:${d.title}` : `other:${q.slice(0, 30) || d.title}`;
}

export function loadBrain() {
  const vocab = JSON.parse(readFileSync(here("../../public/chatbot/model/vocab.json"), "utf8"));
  const buf = readFileSync(here("../../public/chatbot/model/vectors.bin"));
  const kb = JSON.parse(readFileSync(here("../../public/chatbot/model/kb.json"), "utf8"));
  const units = readFileSync(here("../../src/content/compound-units.ts"), "utf8");
  const chalets = [...units.matchAll(/^\s*\["([A-Z]+\d+\+?)",/gm)].map((m) => m[1]);
  const embedder = createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
  // The trained classifier (tools/train-classifier.mjs), unless NO_CLS=1 (to compare without it).
  let classifier = null;
  const cj = here("../../public/chatbot/model/classifier.json");
  if (existsSync(cj) && !process.env.NO_CLS) {
    const cb = readFileSync(here("../../public/chatbot/model/classifier.bin"));
    classifier = createClassifier(JSON.parse(readFileSync(cj, "utf8")), cb.buffer.slice(cb.byteOffset, cb.byteOffset + cb.length), embedder);
  }
  const clsWeight = Number(process.env.CLS_WEIGHT ?? 0.3);
  const search = createSearch(kb.docs, embedder, { classifier, clsWeight });
  const env = (k, d) => Number(process.env[k] ?? d);
  return createBrain(search, { phone: "0790029928", starters: kb.starters, chalets, trust: env("TRUST", 0.8), offAt: env("OFF_AT", 0.7), chatAt: env("CHAT_AT", 0.85) });
}

/** What the reply did: an answer id, a card, booking, chat, a clarifying question. */
export function outcome(o) {
  const text = (o.parts ?? [o.reply ?? ""]).join("\n");
  if (o.card?.type === "chalet") return `chalet:${o.card.id}`;
  if (o.card?.type === "map") return /ما لقيت شاليه/.test(text) ? "chalet:?" : "map";
  if (o.action === "book") return "book";
  if (o.source) return docTag(o.source);
  if (o.state?.offer && /بتسأل عن|قصدك/.test(text)) return "ask";
  return "nosource";
}

export function judge(tag, o) {
  const got = outcome(o);
  const text = (o.parts ?? [o.reply ?? ""]).join("\n");
  const latin = (text.match(/[a-z]/gi) ?? []).length;
  let ok;
  if (tag.startsWith("multi:")) {
    const [a, b] = tag.slice(6).split("+");
    ok = got === a || got === b || (SAME[a] ?? []).includes(got) || (SAME[b] ?? []).includes(got);
  } else if (tag === "chat" || tag === "off") ok = got === "nosource";
  else if (tag === "persona") ok = got === "nosource" && /ليان|Layan|مساعد[ةه] رقمي|أنا |انا |عمري|جهّزني|اختارلي|بجاوبك/.test(text);
  else if (tag === "contact") ok = /0790029928|962 ?79/.test(text.replace(/\s/g, " "));
  // English: an English reply, or the right answer from the site (in Arabic) for a question about it.
  else if (tag === "english") ok = latin > 20 || !!o.source || !!o.card;
  else if (tag === "map") ok = got === "map";
  else
    ok = got === tag || (SAME[tag] ?? []).includes(got) || (tag === "prices" && got === "map") ||
      (!!SAYS[tag] && /^(other|page|nosource)/.test(got) && SAYS[tag].test(text));
  return { ok, got, text };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const brain = loadBrain();
  const valHash = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.codePointAt(0)) >>> 0; return h % 5 === 0; };
  const all = readQuestions(file).filter(({ q }) =>
    split === "all" || (split === "val" ? !isTest(q) && valHash(q) : (split === "test") === isTest(q)));
  const byTag = {};
  const fails = [];
  const rows = [];
  for (const { q, tag } of all) {
    const o = brain.reply(q, {});
    const { ok, got, text } = judge(tag, o);
    const key = tag.startsWith("multi:") ? "multi" : tag.startsWith("chalet:") ? "chalet" : tag;
    (byTag[key] ??= { ok: 0, n: 0 }).n++;
    if (ok) byTag[key].ok++;
    else fails.push({ q, tag, got, reply: text.slice(0, 90).replace(/\n/g, " ") });
    rows.push({ q, tag, got, ok });
  }
  const pass = all.length - fails.length;
  console.log(`${file.split("/").pop()} [${split}]: ${pass}/${all.length} (${Math.round((100 * pass) / all.length)}%)`);
  const worst = Object.entries(byTag).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);
  console.log(worst.map(([t, { ok, n }]) => `${t} ${ok}/${n}`).join(" · "));
  if (showFails) for (const f of fails) console.log(`✗ [${f.tag} → ${f.got}] ${f.q}\n    ${f.reply}`);
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify(rows, null, 1));
}
