// Builds model/kb.json for the in-browser chat: every doc from knowledge.mjs, its extra
// phrasings (phrasings.json), and precomputed meaning vectors. Needs model/ from
// tools/prune-model.mjs. Run by `npm run chatbot`.
import { readFileSync, writeFileSync } from "node:fs";
import { collectDocs } from "./knowledge.mjs";
import { createEmbedder, packVec } from "./lib/embed.mjs";
import { embedTexts } from "./lib/core.mjs";
import { homeFaqPreview } from "../src/content/faq.ts";

const here = (p) => new URL(p, import.meta.url);
const label = (q) => (q.includes("؟") ? q.split("؟")[0] + "؟" : q);

const vocab = JSON.parse(readFileSync(here("model/vocab.json"), "utf8"));
const buf = readFileSync(here("model/vectors.bin"));
const embedder = createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
const phrasings = JSON.parse(readFileSync(here("phrasings.json"), "utf8"));
const topics = JSON.parse(readFileSync(here("topics.json"), "utf8"));
// Answers written for the bot, used instead of the site's wording (rotated on repeats).
const answers = JSON.parse(readFileSync(here("answers.json"), "utf8"));

const docs = (await collectDocs()).map((d) => {
  const extra = d.q ? phrasings[label(d.q)] : undefined;
  const topic = d.q && d.kind === "faq" ? topics[label(d.q)] : undefined;
  const own = d.q && d.kind === "faq" ? answers[label(d.q)] : undefined;
  const doc = { ...d, ...(extra && { phrasings: extra }), ...(topic && { topic }), ...(own && { answers: own }) };
  return { ...doc, vecs: embedTexts(doc).map((t) => packVec(embedder.embed(t))) };
});

const unused = Object.keys(phrasings).filter((k) => !docs.some((d) => d.q && label(d.q) === k));
if (unused.length) console.warn(`phrasings.json keys with no matching question:\n  ${unused.join("\n  ")}`);

const starters = ["شو الخدمات اللي بتقدموها؟", ...homeFaqPreview.slice(0, 3).map((f) => f.qAr)];
writeFileSync(here("model/kb.json"), JSON.stringify({ starters, docs }));
console.log(`kb.json: ${docs.length} docs (${docs.filter((d) => d.kind === "page").length} site passages), ${docs.filter((d) => d.phrasings).length} with phrasings`);
