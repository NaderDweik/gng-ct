// Conversation regression test: multi-turn chats with what each reply must (or must not)
// do. Add every conversation that went wrong in testing here, then fix the bot until it
// passes. Usage: node chatbot-poc/tools/dialogs.mjs  (prints each chat; exits 1 on failure)
import { readFileSync } from "node:fs";
import { createEmbedder } from "../lib/embed.mjs";
import { createSearch } from "../lib/core.mjs";
import { createBrain } from "../brain.mjs";

const here = (p) => new URL(p, import.meta.url);
const vocab = JSON.parse(readFileSync(here("../model/vocab.json"), "utf8"));
const buf = readFileSync(here("../model/vectors.bin"));
const kb = JSON.parse(readFileSync(here("../model/kb.json"), "utf8"));
const search = createSearch(kb.docs, createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length)));
const brain = createBrain(search, { phone: "0790029928", starters: kb.starters });

// Each turn: [visitor message, check]. Checks: "chat" = small talk, must not quote the site;
// "answer:<word>" = must answer from the site with <word> in the reply; "ask" = asks to clarify;
// "say:<a|b>" = the reply must contain one of these words.
const DIALOGS = [
  [["كيف الحال", "chat"], ["الحمد الله", "chat"]],
  [["مرحبا كيفك", "chat"], ["تمام", "chat"], ["وين موقعكم", "answer:يقع"]],
  [["السلام عليكم", "chat"], ["كيفك", "chat"], ["الحمدلله وانتي؟", "chat"]],
  [["اسمعي", "chat"], ["عندي سوال", "chat"], ["في تقسيط؟", "answer:1%"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["حلو كثير", "chat"], ["اه", "say:زيارة"]],
  [["متى التسليم", "answer:تسليم"], ["طيب", "chat"], ["شكرا", "chat"]],
  [["ما شاء الله", "chat"]],
  [["الحمدلله بخير", "chat"]],
  [["يسلمو", "say:العفو|ولو|الرحب|يعافيك"]],
  [["تمام، طيب كم بعيد عن عمان؟", "answer:دقيقة"]],
  [["في مطاعم", "ask"]],
  [["متى التسليم", "answer:تسليم"], ["لا", "chat"]],
  [["عندي سؤال عن التقسيط", "answer:1%"], ["ممتاز", "chat"], ["لا شكرا", "chat"]],
  // Asked again: same meaning, different wording each time, never "من الشركة مباشرة".
  [["في تقسيط؟", "answer:1%"], ["في تقسيط؟", "answer:1%"], ["التمويل شو وضعو", "answer:1%"], ["بكم الشاليه", "say:1%"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["شو خدماتكم", "say:باختصار|أهم"]],
];

let failed = 0;
const lastAnswer = new Map();
for (const dialog of DIALOGS) {
  let state = {};
  console.log("—");
  lastAnswer.clear();
  for (const [msg, check] of dialog) {
    const r = brain.reply(msg, state);
    state = r.state || {};
    const text = r.parts.join(" / ").replace(/\n/g, " ");
    const [kind, word] = check.split(":");
    const ok =
      kind === "chat" ? !r.source :
      kind === "ask" ? !r.source && /فهمتك|قصدك/.test(text) :
      kind === "say" ? new RegExp(word).test(text) :
      !!r.source && text.includes(word);
    // A repeated question must not come back word for word.
    const repeat = r.source && lastAnswer.get(r.source.q) === text;
    if (r.source) lastAnswer.set(r.source.q, text);
    if (!ok || repeat || /الشركة مباشرة/.test(text)) failed++;
    console.log(`${ok ? "✓" : "✗"} ${msg}\n    ${text.slice(0, 150)}`);
  }
}
console.log(failed ? `\n${failed} failing turn(s)` : "\nall turns pass");
process.exit(failed ? 1 : 0);
