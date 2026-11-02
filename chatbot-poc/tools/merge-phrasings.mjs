// Merges writer batches ("- message — `tag`" lines) into chatbot-poc/train-extra.md: drops lines
// that match the sealed sets (questions.md, questions-dev.md, and any questions-*.md given with
// --sealed), duplicates, and unknown tags; prints counts per tag. Never read the batches by hand.
// Usage: node chatbot-poc/tools/merge-phrasings.mjs batch1.md batch2.md ... [--heading="..."]
//        [--sealed=chatbot-poc/questions-test2.md] [--dry]
import { appendFileSync, existsSync, readFileSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url).pathname;
const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith("--"));
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const read = (f) =>
  readFileSync(f, "utf8").split("\n")
    .map((l) => l.match(/^\s*[-*]\s+(.+?)\s+[—–-]+\s+`([^`]+)`\s*$/))
    .filter(Boolean)
    .map((m) => ({ q: m[1].trim(), tag: m[2].trim() }));
const norm = (s) => s.replace(/[؟?!.,،\s]+/g, " ").trim().toLowerCase();

const sealedFiles = [here("../questions.md"), here("../questions-dev.md"), ...(opt("sealed")?.split(",") ?? [])].filter(existsSync);
const sealed = new Set(sealedFiles.flatMap(read).map((x) => norm(x.q)));
const target = here("../train-extra.md");
const seen = new Set(existsSync(target) ? read(target).map((x) => norm(x.q)) : []);
// Known tags: the answer tags already used in training, the reply kinds, and @-classes.
const known = new Set([...read(target).map((x) => x.tag), ...read(here("../questions.md")).map((x) => x.tag), ...(opt("tags")?.split(",") ?? [])]);

const add = [], counts = {};
let sealedHits = 0, dups = 0;
const unknown = {};
for (const f of files)
  for (const x of read(f)) {
    const k = norm(x.q);
    if (sealed.has(k)) { sealedHits++; continue; }
    if (seen.has(k)) { dups++; continue; }
    if (!known.has(x.tag) && !x.tag.startsWith("off-") && !x.tag.startsWith("chat-")) { unknown[x.tag] = (unknown[x.tag] ?? 0) + 1; continue; }
    seen.add(k);
    add.push(x);
    counts[x.tag] = (counts[x.tag] ?? 0) + 1;
  }
if (!args.includes("--dry") && add.length)
  appendFileSync(target, `\n## ${opt("heading") ?? "Batch"}\n${add.map((x) => `- ${x.q} — \`${x.tag}\``).join("\n")}\n`);
console.log(`added ${add.length} · matched sealed ${sealedHits} · duplicates ${dups} · unknown tags ${JSON.stringify(unknown)}`);
console.log(Object.entries(counts).sort((a, b) => a[1] - b[1]).map(([t, n]) => `${t} ${n}`).join(" · "));
