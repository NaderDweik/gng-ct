// Teaches Layan from chatbot-poc/questions.md: every "train" question (70%, see questions-eval.mjs)
// tagged with an answer that the bot currently gets wrong is added to that answer's phrasings
// (qa.json for Layan's own answers, phrasings.json for the site's FAQ). The "test" 30% is never
// added, so `questions-eval.mjs --split=test` still measures how well the bot generalises.
// Usage: node chatbot-poc/tools/questions-train.mjs [file]   then: npm run chatbot:kb
import { readFileSync, writeFileSync } from "node:fs";
import { SITE_TAGS, isTest, judge, loadBrain, readQuestions } from "./questions-eval.mjs";

const here = (p) => new URL(p, import.meta.url);
const file = process.argv[2] ?? here("../questions.md").pathname;
const qaPath = here("../qa.json");
const phPath = here("../phrasings.json");
const qa = JSON.parse(readFileSync(qaPath, "utf8"));
const ph = JSON.parse(readFileSync(phPath, "utf8"));

const byId = new Map(qa.entries.map((e) => [e.id, e]));
const siteKey = (tag) => {
  const prefix = Object.entries(SITE_TAGS).find(([, t]) => t === tag)?.[0];
  return prefix ? Object.keys(ph).find((k) => k.startsWith(prefix)) : undefined;
};

const MAX_WORDS = 7;
const brain = loadBrain();
let added = 0;
const skipped = {};
for (const { q, tag } of readQuestions(file)) {
  if (isTest(q)) continue;
  // Each question belongs to one answer; chat, off-topic, cards and booking are rules, not phrasings.
  const target = byId.get(tag) ?? siteKey(tag);
  if (!target) {
    skipped[tag.split(":")[0]] = (skipped[tag.split(":")[0]] ?? 0) + 1;
    continue;
  }
  // Long stories ("انا وزوجتي وعنا 3 ولاد...") make an answer pull in everything; keep phrasings short.
  if (q.split(/\s+/).length > MAX_WORDS) continue;
  if (judge(tag, brain.reply(q, {})).ok) continue;
  const list = typeof target === "string" ? (ph[target] ??= []) : (target.phrasings ??= []);
  if (!list.includes(q)) {
    list.push(q);
    added++;
  }
}
writeFileSync(qaPath, `${JSON.stringify(qa, null, 2)}\n`);
writeFileSync(phPath, `${JSON.stringify(ph, null, 2)}\n`);
console.log(`added ${added} phrasings; not phrasing-based: ${JSON.stringify(skipped)}`);
