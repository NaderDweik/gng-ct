// Conversation regression test: multi-turn chats with what each reply must (or must not)
// do. Add every conversation that went wrong in testing here, then fix the bot until it
// passes. Usage: node chatbot-poc/tools/dialogs.mjs  (prints each chat; exits 1 on failure)
import { readFileSync } from "node:fs";
import { createEmbedder } from "../../public/chatbot/lib/embed.mjs";
import { createSearch } from "../../public/chatbot/lib/core.mjs";
import { createBrain } from "../../public/chatbot/brain.mjs";

const here = (p) => new URL(p, import.meta.url);
const vocab = JSON.parse(readFileSync(here("../../public/chatbot/model/vocab.json"), "utf8"));
const buf = readFileSync(here("../../public/chatbot/model/vectors.bin"));
const kb = JSON.parse(readFileSync(here("../../public/chatbot/model/kb.json"), "utf8"));
const search = createSearch(kb.docs, createEmbedder(vocab, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length)));
const brain = createBrain(search, { phone: "0790029928", starters: kb.starters });

// Each turn: [visitor message, check]. Checks: "chat" = small talk, must not quote the site;
// "answer:<word>" = must answer from the site with <word> in the reply; "ask" = asks to clarify;
// "say:<a|b>" = the reply must contain one of these words.
const DIALOGS = [
  [["كيف الحال", "chat"], ["الحمد الله", "chat"]],
  [["مرحبا كيفك", "chat"], ["تمام", "chat"], ["وين موقعكم", "answer:القسطل"]],
  [["السلام عليكم", "chat"], ["كيفك", "chat"], ["الحمدلله وانتي؟", "chat"]],
  [["اسمعي", "chat"], ["عندي سوال", "chat"], ["في تقسيط؟", "answer:1%"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["حلو كثير", "chat"], ["اه", "say:زيارة"]],
  [["متى التسليم", "answer:تسليم"], ["طيب", "chat"], ["شكرا", "chat"]],
  [["ما شاء الله", "chat"]],
  [["الحمدلله بخير", "chat"]],
  [["يسلمو", "say:العفو|ولو|الرحب|يعافيك"]],
  [["تمام، طيب كم بعيد عن عمان؟", "answer:دقيقة"]],
  [["في مطاعم", "answer:كافيه"]],
  [["متى التسليم", "answer:تسليم"], ["لا", "chat"]],
  [["عندي سؤال عن التقسيط", "answer:1%"], ["ممتاز", "chat"], ["لا شكرا", "chat"]],
  // Asked again: same meaning, different wording each time, never "من الشركة مباشرة".
  [["في تقسيط؟", "answer:1%"], ["في تقسيط؟", "answer:1%"], ["التمويل شو وضعو", "answer:1%"], ["بكم الشاليه", "say:1%"]],
  [["شو الخدمات اللي بتقدموها", "answer:الخدمات"], ["شو خدماتكم", "say:باختصار|أهم"]],
  // Reported 2026-11-01: her name wasn't understood, and "لا بسال عن اسمك" was taken as "no thanks".
  [["اسمع", "chat"], ["ايش اسمك", "say:ليان"], ["لا بسال عن اسمك", "say:ليان"]],
  [["شو اسمك", "say:ليان"], ["نادر", "say:نادر"], ["وين موقعكم", "answer:القسطل"], ["باي", "say:نادر"]],
  [["مين انتي", "say:ليان"], ["تمام", "chat"]],
  [["شو اسمك؟", "say:ليان"], ["اسمي سارة", "say:سارة"]],
  [["انتي بوت؟", "say:رقمية"]],
  [["بدي احكي مع موظف", "say:0790029928"]],
  [["انتي غبية", "say:سامحني"]],
  [["بتحكي انجليزي؟", "say:إنجليزي"]],
  [["شو بتقدري تعملي", "say:زيارة"]],
  [["متى التسليم", "answer:تسليم"], ["لا بسأل عن التقسيط", "answer:1%"]],
  // Reported 2026-11-01: "I have lots of questions" and "what do you sell" got wrong guesses.
  [["شو اسمك", "say:ليان"], ["نادر", "say:نادر"], ["حابب اعرف كثير وعندي كثير اسالة", "say:سؤال|تفضّل|اسأل|ببالك"]],
  [["ايش بتبيعو", "answer:شاليهات"]],
  // Out of context: a human line, never a site search or a wrong guess.
  [["بدي اعرف كل شي عن المشروع", "say:500"]],
  [["حابب اعرف كثير عن التقسيط", "answer:1%"]],
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
  [["غالي كثير", "say:1%|الخطة"]],
  [["في خصم؟", "say:العروض|عرض"]],
  [["عندي شكوى", "say:آسفة|سامحنا"]],
  [["في وظائف عندكم", "say:موارد بشرية|الموارد البشرية"]],
  [["👍", "say:👍"]],
  [["asdfgh", "say:واضحة|فهمت"]],
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
  [["رقمي 0791234567", "say:أحفظ|تنحفظ"]],
  [["بدي حدا يتصل فيني", "say:رقمك|0790029928"]],
  [["شو ايميلكم", "say:0790029928"]],
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
  [["شو الخدمات المتوفره بالكمباند", "answer:الخدمات"]],
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
