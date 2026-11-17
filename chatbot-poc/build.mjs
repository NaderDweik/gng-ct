// Builds public/chatbot/model/kb.json for the in-browser chat: every doc from knowledge.mjs, its extra
// phrasings (phrasings.json), and the bot's own answers (meaning vectors are computed on the phone
// at load, core.mjs). Run with `npm run chatbot:kb` after content changes (reads out/ from `npm run build`).
import { readFileSync, writeFileSync } from "node:fs";
import { collectDocs } from "./knowledge.mjs";
import { homeFaqPreview } from "../src/content/faq.ts";

// The client's rules (Nov 2026): Layan never states the 1% figure or interest, even when quoting
// the site. Such sentences are dropped from site text (the wording itself is fixed when she speaks).
const NEVER = /1\s?%|١٪|واحد بالمي[ةه]|فوائد|فائدة|فايدة|سحاب|الحطمي|الدوار السابع/;
const scrub = (text) =>
  text.split("\n").map((line) => line.split(/(?<=[.!؟])\s+/).filter((s) => !NEVER.test(s)).join(" ")).filter((l) => l.trim()).join("\n");

const here = (p) => new URL(p, import.meta.url);
const label = (q) => (q.includes("؟") ? q.split("؟")[0] + "؟" : q);

const phrasings = JSON.parse(readFileSync(here("phrasings.json"), "utf8"));
const topics = JSON.parse(readFileSync(here("topics.json"), "utf8"));
// Answers written for the bot, used instead of the site's wording (rotated on repeats).
const answers = JSON.parse(readFileSync(here("answers.json"), "utf8"));

// Layan's own Q&A (qa.json), written from the site's content.
const qa = JSON.parse(readFileSync(here("qa.json"), "utf8")).entries.map((e) => ({
  kind: "faq", id: e.id, title: e.title, url: e.url, q: e.q, text: e.answers[0], match: e.match,
  phrasings: e.phrasings, answers: e.answers, topic: e.topic,
}));
const ids = new Set();
for (const e of qa) {
  if (ids.has(e.id)) throw new Error(`qa.json: duplicate id ${e.id}`);
  ids.add(e.id);
}

const docs = [...(await collectDocs()), ...qa].map((d) => {
  // Meaning vectors are worked out on the phone at load (core.mjs), not shipped: ~1 MB less.
  if (d.id) return d;
  const extra = d.q ? phrasings[label(d.q)] : undefined;
  const topic = d.q && d.kind === "faq" ? topics[label(d.q)] : undefined;
  const own = d.q && d.kind === "faq" ? answers[label(d.q)] : undefined;
  const doc = { ...d, ...(extra && { phrasings: extra }), ...(topic && { topic }), ...(own && { answers: own }) };
  if (doc.text && !doc.match) doc.text = scrub(doc.text) || doc.title || "";
  return doc;
});

const unused = Object.keys(phrasings).filter((k) => !docs.some((d) => d.q && label(d.q) === k));
if (unused.length) console.warn(`phrasings.json keys with no matching question:\n  ${unused.join("\n  ")}`);

const starters = ["شو الخدمات اللي بتقدموها؟", ...homeFaqPreview.slice(0, 3).map((f) => f.qAr)];
writeFileSync(here("../public/chatbot/model/kb.json"), JSON.stringify({ starters, docs }));
console.log(`kb.json: ${docs.length} docs (${docs.filter((d) => d.kind === "page").length} site passages), ${docs.filter((d) => d.phrasings).length} with phrasings`);
