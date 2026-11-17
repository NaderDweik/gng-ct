// Checks every written answer, spoken topic and fixed reply against the client's wording rules
// (public/chatbot/lib/voice.mjs BANNED). Prints each offence; exits 1 when there is one.
//   node chatbot-poc/tools/voice-check.mjs
import { readFileSync } from "node:fs";
import { BANNED } from "../../public/chatbot/lib/voice.mjs";

const here = (p) => new URL(p, import.meta.url);
const load = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const texts = [];
for (const [q, list] of Object.entries(load("../answers.json"))) list.forEach((a, i) => texts.push([`answers «${q.slice(0, 30)}» #${i}`, a]));
for (const e of load("../qa.json").entries) {
  e.answers.forEach((a, i) => texts.push([`qa ${e.id} #${i}`, a]));
  texts.push([`qa ${e.id} topic`, e.topic]);
}
for (const [q, t] of Object.entries(load("../topics.json"))) texts.push([`topic «${q.slice(0, 30)}»`, t]);
// Fixed replies in the code: string literals only (regexes that read the visitor's words are fine).
for (const f of ["../../public/chatbot/brain.mjs", "../../public/chatbot/convo.mjs", "../../src/components/chatbot/chat-engine.ts", "../../src/components/chatbot/chat-map.ts", "../../src/components/chatbot/chat-booking.ts", "../../src/components/chatbot/ChatWidget.tsx"]) {
  const src = readFileSync(here(f), "utf8");
  src.split("\n").forEach((line, n) => {
    // Comments, and question keys the chat shows through voice() («// voice: key»).
    if (/^\s*(\/\/|\*)/.test(line) || /voice: key/.test(line)) return;
    for (const m of line.matchAll(/"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\\n]|\\.)*)`|>([^<>{}\n]*[؀-ۿ][^<>{}\n]*)</g)) {
      const s = m[1] ?? m[2] ?? m[3];
      if (/[؀-ۿ]/.test(s) && !/^[\s|()?:\\[\]^$.*+]*$/.test(s) && !/\|/.test(s)) texts.push([`${f.split("/").pop()}:${n + 1}`, s]);
    }
  });
}
let bad = 0;
for (const [where, t] of texts)
  for (const [re, why] of BANNED)
    if (re.test(t)) {
      bad++;
      console.log(`${where} — ${why}\n   ${t.replace(/\n/g, " ⏎ ").slice(0, 160)}`);
    }
console.log(bad ? `\n${bad} problems in ${texts.length} texts` : `voice ok: ${texts.length} texts`);
process.exit(bad ? 1 : 0);
