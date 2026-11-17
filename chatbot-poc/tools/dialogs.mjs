// Conversation regression test: multi-turn chats with what each reply must (or must not)
// do. Add every conversation that went wrong in testing here, then fix the bot until it
// passes. Usage: node chatbot-poc/tools/dialogs.mjs  (prints each chat; exits 1 on failure)
import { readFileSync } from "node:fs";

// Layan picks wordings at random; a fixed seed makes every run the same (SEED=n to try others).
let seed = Number(process.env.SEED ?? 1);
Math.random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
import { createEmbedder } from "../../public/chatbot/lib/embed.mjs";
import { createSearch } from "../../public/chatbot/lib/core.mjs";
import { createBrain } from "../../public/chatbot/brain.mjs";
import { judge, loadClassifier } from "./questions-eval.mjs";
import { existsSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url);
const vocab = JSON.parse(readFileSync(here("../../public/chatbot/model/vocab.json"), "utf8"));
const buf = readFileSync(here("../../public/chatbot/model/vectors.bin"));
const kb = JSON.parse(readFileSync(here("../../public/chatbot/model/kb.json"), "utf8"));
const embedder = createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
const classifier = process.env.NO_CLS ? null : loadClassifier(embedder);
const search = createSearch(kb.docs, embedder, { classifier, clsWeight: Number(process.env.CLS_WEIGHT ?? 0.3) });
const units = readFileSync(here("../../src/content/compound-units.ts"), "utf8");
const chalets = [...units.matchAll(/^\s*\["([A-Z]+\d+\+?)",/gm)].map((m) => m[1]);
const brain = createBrain(search, { phone: "062220757", starters: kb.starters, chalets });

// Each turn: [visitor message, check]. Checks: "chat" = small talk, must not quote the site;
// "answer:<word>" = must answer from the site with <word> in the reply; "ask" = asks to clarify;
// "say:<a|b>" = the reply must contain one of these words; "card:chalet:D50[:price]" / "card:map" =
// that card (and follow-up aspect); "book" = starts the booking; "pick:<word>" = a button contains <word>.
const DIALOGS = [
  [["كيف الحال", "chat"], ["الحمد الله", "chat"]],
  [["مرحبا كيفك", "chat"], ["تمام", "chat"], ["وين موقعكم", "answer:القسطل"]],
  [["السلام عليكم", "chat"], ["كيفك", "chat"], ["الحمدلله وانتي؟", "chat"]],
  [["اسمعي", "chat"], ["عندي سوال", "chat"], ["في تقسيط؟", "answer:من خلالنا"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["حلو كثير", "chat"], ["اه", "say:زيارة"]],
  [["متى التسليم", "answer:تسليم"], ["طيب", "chat"], ["شكرا", "chat"]],
  [["ما شاء الله", "chat"]],
  [["الحمدلله بخير", "chat"]],
  [["يسلمو", "say:العفو|ولو|الرحب|يعافيك"]],
  [["تمام، طيب كم بعيد عن عمان؟", "answer:دقيقة"]],
  [["في مطاعم", "answer:كافيه"]],
  [["متى التسليم", "answer:تسليم"], ["لا", "chat"]],
  [["عندي سؤال عن التقسيط", "answer:من خلالنا"], ["ممتاز", "chat"], ["لا شكرا", "chat"]],
  // Asked again: same meaning, different wording each time, never "من الشركة مباشرة".
  [["في تقسيط؟", "answer:من خلالنا"], ["في تقسيط؟", "answer:من خلالنا"], ["التمويل شو وضعو", "answer:من خلالنا"], ["بكم الشاليه", "say:فريق المبيعات"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["شو خدماتكم", "say:باختصار|أهم"]],
  // Reported 2026-11-01: her name wasn't understood, and "لا بسال عن اسمك" was taken as "no thanks".
  [["اسمع", "chat"], ["ايش اسمك", "say:ليان"], ["لا بسال عن اسمك", "say:ليان"]],
  [["شو اسمك", "say:ليان"], ["نادر", "say:نادر"], ["وين موقعكم", "answer:القسطل"], ["باي", "say:نادر"]],
  [["مين انتي", "say:ليان"], ["تمام", "chat"]],
  [["شو اسمك؟", "say:ليان"], ["اسمي سارة", "say:سارة"]],
  [["انتي بوت؟", "say:رقمية"]],
  [["بدي احكي مع موظف", "say:اسمك ورقمك"]],
  [["انتي غبية", "say:سامحني"]],
  [["بتحكي انجليزي؟", "say:إنجليزي"]],
  [["شو بتقدري تعملي", "say:زيارة"]],
  [["متى التسليم", "answer:تسليم"], ["لا بسأل عن التقسيط", "answer:من خلالنا"]],
  // Reported 2026-11-01: "I have lots of questions" and "what do you sell" got wrong guesses.
  [["شو اسمك", "say:ليان"], ["نادر", "say:نادر"], ["حابب اعرف كثير وعندي كثير اسالة", "say:سؤال|تفضّل|اسأل|ببالك"]],
  [["ايش بتبيعو", "answer:شاليهات"]],
  // Out of context: a human line, never a site search or a wrong guess.
  [["بدي اعرف كل شي عن المشروع", "say:500|التملك الخاص"]],
  [["حابب اعرف كثير عن التقسيط", "answer:من خلالنا"]],
  [["مين رح يربح الماتش اليوم", "say:الكورة"]],
  [["كم سعر الشاليه بالريال", "say:الفريق|المبيعات"]],
  [["احكيلي نكتة", "say:😄"]],
  [["شو الطقس بكرا", "say:النشرة"]],
  [["بدي وصفة منسف", "say:أطبخ"]],
  [["احسبلي 5 ضرب 7", "say:شغلي|متخصصة"]],
  [["زهقان", "say:بسيطة|الطفش"]],
  [["رمضان كريم", "say:الله أكرم|يعاد"]],
  [["الو", "say:هون|موجودة"]],
  [["لحظة", "say:وقتك|راحتك|استناك"]],
  [["بس بتفرج", "say:راحتك|ضغط"]],
  [["غالي كثير", "say:التمويل من خلالنا"]],
  [["في خصم؟", "say:العروض|عرض"]],
  [["عندي شكوى", "say:آسفة|سامحنا"]],
  [["في وظائف عندكم", "say:موارد بشرية|الموارد البشرية"]],
  [["👍", "say:👍"]],
  [["asdfgh", "say:واضحة|فهمت|كاملة"]],
  [["انتو مرخصين؟", "answer:قوشان"]],
  [["بدي استأجر شاليه ليلة", "answer:إدارة الكمباوند"]],
  [["مناسب لكبار السن؟", "answer:طابق واحد"]],
  [["بدي اعمل معاينة", "say:بنتشرّف|أحجزلك|احجز"]],
  [["شو رأيك بالسياسة", "say:بعيد"]],
  [["بدي اجيب زوجتي عالزيارة", "say:بنتشرّف|أحجزلك|احجز"]],
  [["شو بتنصحيني", "answer:شوف"]],
  // An offer is pending, but the visitor asks for something else.
  [["ايش بتبيعو", "answer:شاليهات"], ["احكيلي نكتة", "say:😄"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["حلو كثير", "chat"], ["اه اكيد احكيلي", "say:زيارة"]],
  [["رقمي 0791234567", "say:اسمك ورقمك"]],
  [["بدي حدا يتصل فيني", "say:رقمك|062220757"]],
  [["شو ايميلكم", "say:062220757"]],
  [["ابعتلي اللوكيشن", "say:«الموقع»"]],
  [["شو الجديد عندكم", "say:البستان"]],
  [["انتو احسن من غيركم؟", "say:بميّزنا"]],
  [["انا مستعجل", "say:بسرعة|بختصرلك"]],
  [["تصبحي على خير", "say:🌙"]],
  [["Can you tell me something about the weather in London", "say:English|Arabic"]],
  // Reported 2026-11-02: a typo («الكمباونر») got the security answer; filler words («موجوده داخل»)
  // got the facilities list instead of the room count; «الخدمات المتوفرة» got the price reply.
  [["كيف ممكن اوصل للكمباونر؟", "answer:القسطل"]],
  [["كم غرفة موجوده داخل الشاليه؟", "answer:غرف"]],
  [["وين المشروغ", "answer:القسطل"]],
  // (services or the compound's facilities both fit; every wording of either names «صيانة», the price reply doesn't)
  [["شو الخدمات المتوفره بالكمباند", "answer:صيانة"]],
  // Memory (2026-11-02): follow-ups about the chalet just shown.
  [["شو تفاصيل الشاليه D50", "card:chalet:D50"], ["وكم سعره؟", "card:chalet:D50:price"], ["وين مكانه", "card:chalet:D50:where"], ["متاح؟", "card:chalet:D50:status"], ["بدي احجزه", "book"]],
  [["دال خمسين", "card:chalet:D50"], ["قديش مساحته", "card:chalet:D50:area"]],
  [["شاليه ان سبعه", "card:chalet:N7"], ["شو مميزاته", "card:chalet:N7:features"]],
  // ...but a new topic after the card is a new question, not about the chalet.
  [["A9", "card:chalet:A9"], ["في مسجد بالكمباوند؟", "say:مسجد|مصلى"]],
  // «ليش؟ / وضحيلي» expands the last answer.
  [["في تقسيط؟", "answer:من خلالنا"], ["وضحيلي", "say:تفصيل|أوضحلك|بالتفصيل"]],
  // «لا مش هيك» after a wrong answer: sorry + the next-best answer + buttons.
  [["كم غرفة نوم بالشاليه", "answer:غرف"], ["لا مش هيك", "say:سامحني|آسفة"]],
  [["كم غرفة نوم بالشاليه", "answer:غرف"], ["ما فهمتي علي", "say:سامحني|آسفة"]],
  // Asking for the detail picks the variant that has it.
  [["الغرفة الرئيسية فيها شرفة؟", "say:شرفة"]],
];

// More chats from chatbot-poc/dialogs-extra.md ("## title" then "> message | check" lines). Extra
// checks there: "topic:<tag>" / "kind:<kind>" (scored like questions-eval.mjs), "name:<Name>" (the
// reply says it), "sorry" (apologises and tries again), "any" (no check, just context).
const extraFile = here("../dialogs-extra.md").pathname;
const CORE = DIALOGS.length; // chats above: must all pass. Chats from the file: scored.
if (existsSync(extraFile)) {
  let cur = null;
  for (const line of readFileSync(extraFile, "utf8").split("\n")) {
    if (/^##\s/.test(line)) DIALOGS.push((cur = []));
    const m = line.match(/^>\s*(.+?)\s*\|\s*(\S+)\s*$/);
    if (m && cur) cur.push([m[1], m[2]]);
  }
}
const only = process.env.ONLY; // ONLY=word: just the chats with a message containing it

let failed = 0, extraTurns = 0, extraFailed = 0, extraChats = 0, extraChatsOk = 0;
const lastAnswer = new Map();
for (const [di, dialog] of DIALOGS.entries()) {
  const extra = di >= CORE;
  let chatOk = true;
  if (!dialog.length || (only && !dialog.some(([m]) => m.includes(only)))) continue;
  let state = {};
  console.log("—");
  lastAnswer.clear();
  const replies = new Set();
  for (const [msg, check] of dialog) {
    const prevOffer = state.offer;
    const r = brain.reply(msg, state);
    state = r.state || {};
    const text = r.parts.join(" / ").replace(/\n/g, " ");
    const [kind, word] = check.split(":");
    const card = r.card ? [r.card.type, r.card.id, r.card.aspect].filter(Boolean).join(":") : "";
    const ok =
      kind === "card" ? card === check.slice(5) :
      kind === "book" ? r.action === "book" :
      kind === "pick" ? (r.suggestions ?? []).some((x) => x.includes(word)) :
      kind === "chat" ? !r.source :
      kind === "ask" ? !r.source && /فهمتك|قصدك/.test(text) :
      kind === "say" ? new RegExp(word).test(text) :
      kind === "topic" || kind === "kind" ? judge(word, r).ok ||
        // «تمام/ماشي» right after «بتحب أحكيلك عن…؟» is a yes: answering the offer is right.
        (word === "chat-ack" && !!prevOffer && !!r.source) :
      kind === "name" ? text.includes(word) :
      kind === "sorry" ? /سامحني|آسفة|اسفة/.test(text) :
      kind === "any" ? true :
      !!r.source && text.includes(word);
    // A repeated question must not come back word for word.
    // ...and no reply in a chat comes back word for word.
    const repeat = (r.source && lastAnswer.get(r.source.q) === text) || (!!text && replies.has(text));
    if (r.source) lastAnswer.set(r.source.q, text);
    replies.add(text);
    const bad = !ok || repeat || /الشركة مباشرة/.test(text);
    if (extra) { extraTurns++; if (bad) { extraFailed++; chatOk = false; } }
    else if (bad) failed++;
    console.log(`${ok && !repeat ? "✓" : "✗"} ${msg}${ok ? "" : `  [${check}${r.kind ? ` · got ${r.kind}` : ""}]`}${repeat ? "  [repeated word for word]" : ""}\n    ${text.slice(0, 150)}`);
  }
  if (extra && dialog.length) { extraChats++; if (chatOk) extraChatsOk++; }
}
if (extraChats) console.log(`\nnew chats (dialogs-extra.md): ${extraTurns - extraFailed}/${extraTurns} turns, ${extraChatsOk}/${extraChats} whole chats pass`);
console.log(failed ? `\n${failed} failing turn(s) in the core chats` : "\ncore chats: all turns pass");
process.exit(failed ? 1 : 0);
