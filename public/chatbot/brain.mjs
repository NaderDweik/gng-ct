// Offline conversation engine: small talk in Jordanian Arabic, then an answer from the
// knowledge base, phrased like a person from the sales team would say it. Replies come
// back as `parts`, each shown as its own chat bubble. `state` round-trips through the
// client so follow-ups like "اه أكيد" or "تمام" make sense.
import { tokens } from "./lib/core.mjs";
import { CONVO, OFF_TOPIC, UNKNOWN, ENGLISH, ON_TOPIC, STRONG_TOPIC, OFF_HINT, LINK, isNoise, emojiReply } from "./convo.mjs";

// Topic docs carry extra search words after the "؟"; show people only the question.
const label = (q) => (q.includes("؟") ? q.split("؟")[0] + "؟" : q);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const has = (re, t) => re.test(t);

const SOCIAL = [
  { id: "salam", re: /(ال)?سلام عليكم|^سلام\b|^السلام/, say: () => pick(["وعليكم السلام ورحمة الله وبركاته 🌿 يا هلا فيك!", "وعليكم السلام، أهلين وسهلين 😊"]) },
  { id: "morning", re: /صباح (ال)?(خير|نور|ورد|فل)/, say: () => pick(["صباح النور والسرور ☀️", "صباح الورد! ☀️ أهلين فيك"]) },
  { id: "evening", re: /مساء (ال)?(خير|نور|ورد|فل)/, say: () => pick(["مساء النور 🌙 أهلين فيك", "مساء الورد والياسمين 🌙"]) },
  { id: "hi", re: /^(مرحبا|مرحبتين|مرحبًا|اهلين|أهلين|اهلا|أهلا|هلا|هاي|هلو|hi|hello|hey)/i, say: () => pick(["أهلين وسهلين! 😊", "هلا والله، نوّرت 🌿", "مرحبتين! يا هلا فيك 👋"]) },
  { id: "how", re: /كيفك|كيفيك|كيفكيف|كيف حالك|كيف الحال|شو اخبارك|شو أخبارك|شو اخبارك|شخبارك|شلونك|كيفكم|كيف الصحة|ازيك|إزيك|عامل[هة]? ايه|how are you/i, say: () => pick(["الحمدلله تمام، تسلم على السؤال 🙏", "بخير الحمدلله، الله يسلمك 🌿"]) },
];

const ONLY_FILLER = /^[\s؟?!.,،😊🙏👋🌿]*$/;

// Questions about Layan herself and the chat, answered like a person would. `ask` asks the
// visitor's name back (the next short message is then taken as their name).
const PERSONA = [
  { re: /(شو|ايش|إيش|مين|وش|شنو)\s*(هو\s*)?اسمك|اسمك\s*(شو|ايش|إيش)|^اسمك|ما اسمك|your name|what.?s your name/i, ask: true,
    say: () => [pick(["اسمي ليان 😊 مساعدة روح العطاء الرقمية.", "أنا ليان 🌿 المساعدة الرقمية لروح العطاء."]), "وانت شو اسمك؟"] },
  { re: /(انت|إنت|انتي|إنتي)\s*(بوت|روبوت|انسان|إنسان|انسانه|إنسانة|حقيقي|حقيقيه|ذكاء|ai|بني ?ادم|كمبيوتر|برنامج)|ذكاء اصطناعي|chat ?gpt|are you (a )?(bot|human|real)|بتقدري تفكري|بتفكري|بتحسي/i,
    say: () => ["أنا مساعدة رقمية مش إنسانة 😊 بس بعرف كل شي موجود على موقعنا عن الشاليهات والكمباوند.", "وإذا حابب تحكي مع حدا من الفريق، بوصلك فيهم."] },
  { re: /(انت|إنت|انتي|إنتي)\s*(مين|شو|ايش|وش)|(شو|ايش|وش)\s*(انت|انتي|إنتي)(?=$|[\s؟?!.،,])|مين معي|مين انت|مين حضرتك|عرفيني عن حالك|who are you/i, ask: true,
    say: () => ["أنا ليان 😊 المساعدة الرقمية لروح العطاء، بجاوبك عن الشاليهات والكمباوند وبحجزلك زيارة كمان.", "وانت شو اسمك؟"] },
  { re: /كم عمرك|قديش عمرك|how old/i, say: () => ["هههه أنا مساعدة رقمية، عمري من عمر الموقع 😄", "بس بعرف كثير عن روح العطاء، اسألني!"] },
  { re: /(وين|من وين)\s*(انت|انتي|إنتي|ساكنه|عايشه)|انتي من وين/i, say: () => ["أنا عايشة هون على موقع روح العطاء 😄", "بس الكمباوند نفسه بالقسطل قرب قصر المشتى، بتحب أحكيلك عن موقعه؟"], offer: "أين يقع كمباوند شاليهات روح العطاء وما أبرز مميزات موقعه؟" },
  { re: /مين (عملك|صممك|برمجك|برمجكي|سواكي|عملكي|سواك|عملك)|who (made|built) you/i, say: () => ["فريق روح العطاء جهّزني عشان أساعد الزوار 😊", "شو حابب تعرف عن الكمباوند؟"] },
  { re: /(بدي|ممكن|بحب|عايز|ابي|أبي|بدنا)\s*(احكي|أحكي|اتواصل|أتواصل|اكلم|أكلم|نحكي)\s*(مع)?\s*(حد|حدا|موظف|انسان|إنسان|الفريق|المبيعات|مسؤول|المسؤول|خدم[هة] العملاء|المدير)|(حدا|حد|موظف|الفريق)\s*(يتصل|يرن|يكلم|يحكي)|يرن (علي|عليي)|اتصلوا (فيي|علي|عليي)|حوليني|بدي (مدير|مسؤول) (المبيعات|البيع)|بدي اكلمه|بدي احكي معهم|talk to (a )?(human|person|agent)|call me/i, contact: true,
    say: (c) => [`أكيد 🌿 ${c}، وبكونوا مبسوطين يساعدوك.`] },
  { re: /(بتفهمي|بتحكي|تحكي)\s*(عربي)/, say: () => ["أكيد! العربي لغتي 😊 ولو كتبت باللهجة أو بأخطاء إملائية بفهم عليك كمان.", "شو حابب تعرف؟"] },
  { re: /متجوز|متزوج|مخطوب|سنقل|single|بتنامي|بتاكلي|بتشربي|ولد ولا بنت|بنت ولا ولد|ذكر ولا انثى/i,
    say: () => [pick(["هههه أنا مساعدة رقمية، ما بنام ولا بتزوج 😄", "😄 أنا مساعدة رقمية، حياتي كلها روح العطاء!"]), "بس دايمًا صاحية لأسئلتك عن الشاليهات والكمباوند."] },
  { re: /ليش اسمك|مين سما(ك|كي)|اسمك حلو/, say: () => ["فريق روح العطاء اختارلي اسم ليان 🌿 وبحبه كثير!", "شو حابب تعرف عن الكمباوند؟"] },
  { re: /(انت|انتي|إنتي)\s*موظف|بتشتغلي (عندهم|معهم|عندكم)/, say: (c) => ["أنا مساعدة رقمية لروح العطاء 😊 بجاوب على أسئلتك وبحجزلك زيارة.", `ولما تحب تحكي مع حدا من الفريق، ${c}.`] },
  { re: /(بتحكي|بتفهمي|تحكي)\s*(انجليزي|إنجليزي|انكليزي|english)|do you speak english|speak english/i,
    say: () => ["بفهم شوية إنجليزي، بس بحكي عربي أحسن 😊", "وفريق المبيعات بيحكي إنجليزي، إذا بتحب تحكي معهم مباشرة."] },
  { re: /(انتي|إنتي)\s*(حلوه|حلوة|شاطره|شاطرة|ذكيه|ذكية|لطيفه|لطيفة|كثير منيحه|رائعه)|بحبك|حبيتك/i,
    say: () => [pick(["يسلملي قلبك 😊", "تسلم على ذوقك 🌿"]), "شو كمان بقدر أساعدك فيه؟"] },
  { re: /غبي|غبيه|حمار|حماره|ما بتفهمي|مش فاهمه|ما فهمتي|سخيف|سخيفه|بلا فايده|useless|stupid/i,
    say: (c) => ["سامحني إذا ما فهمتك صح 🙏", `جرّب تكتبلي سؤالك بطريقة ثانية، أو ${c}.`] },
  { re: /(شو|ايش|وش)\s*(بتعملي|بتسوي|بتقدري تعملي|بتعرفي تعملي|بتعرفي)|كيف بتساعديني|شو بتقدري|what can you do/i,
    say: () => ["بجاوبك عن أي إشي بخص روح العطاء: الشاليهات، المرافق، الموقع، التقسيط والتملك 😊", "وبقدر أحجزلك زيارة للكمباوند من هون بدون ما تطلع من المحادثة."] },
];
// "You got me wrong", with nothing else in it: try the next-best answer to the last question.
const WRONG = /^(?:لا+\s*[،,]?\s*)?(?:مش هيك|مش هاد|مش هذا|مش هذ[اه] قصدي|مش قصدي|مو هيك|مو هذا|مش هاد اللي سألت عنه|مش هاد قصدي|مش هيك قصدي|غلط|خطأ|ما فهمتي(?:ني)?|ما فهمتيني|مش فاهمتني|مش فاهمه علي|ما جاوبتي(?:ني)?|ما جاوبتي على سؤالي|مش جوابي|مش سؤالي|مش هاد سؤالي|you misunderstood|wrong|not what i asked)(?:\s+(?:يا ليان|ليان|والله|قصدي|علي|عليي|عليا|عليه))*\s*[؟?!.😅🙄]*$/i;
// "Tell me more" about whatever was answered last.
const MORE = /^(?:طي?ب\s+)?(?:و?ليش|ليه|يعني كيف|يعني شو|كيف يعني|شو يعني|وضح|وضحي|وضحيلي|وضحلي|فسري|فسريلي|احكيلي (?:اكثر|أكثر|اكتر|كمان|عنه|عنها)|تفاصيل (?:اكثر|أكثر|اكتر)|بدي تفاصيل(?: اكثر| أكثر| اكتر)?|بالتفصيل|زيديني|شو كمان|وبعدين|مثل شو|زي ايش|زي شو|كيف هيك|كمل|كملي)\s*[؟?!.]*$/;
// A follow-up about the chalet just shown («وكم سعره؟», «وين مكانه؟», «متاح؟»): what it asks about.
const CHALET_ASPECT = [
  ["price", /سعر|بكم|بكام|قديش حق|كم حق|القسط|قسطه|ثمن/],
  ["where", /وين|فين|مكان|موقع|خريط|وريني|فرجيني|ورجيني/],
  ["status", /متاح|فاضي|متوفر|مباع|انباع|محجوز|لسا موجود|لسه موجود|available/i],
  ["area", /مساح|كم متر|قديش متر|اديش متر|ارضه|أرضه/],
  ["features", /مميزات|ميزات|شو بميز|شو مميز|شو حلو فيه|شو فيه|ليش هاد/],
];
// It refers to "it" / "this chalet" rather than naming something else.
const IT = /(?:سعر|مكان|موقع|مساحت|حق|قسط|مميزات|ميزات|ارض|أرض|وضع)(?:ه|و)(?=[\s؟?!.،,]|$)|(?:هاد|هذا|هيدا|ها)\s*الشالي[هة]|هالشالي[هة]|الشالي[هة] (?:هاد|هذا|هيدا)|متاح|فاضي|محجوز|انباع/;

// "لا" / "مش هيك" + the real question: a correction, not a "no thanks".
const CORRECTION = /^(?:لا+|لأ|مش هيك|مش هاد|مش هذا|مش قصدي|مو هيك|no)\s*[،,.!]*\s*(?:(?:انا\s*)?(?:بسال|بسأل|بسئل|سالت|سألت|قصدي|اقصد|أقصد|بقصد|كنت بسال|كنت بسأل)\s*(?:عن)?)?\s*/i;
// The visitor telling us their name after we asked.
const NAME_LEAD = /^(?:(?:انا|أنا)\s+)?(?:اسمي|إسمي|my name is|i'?m)?\s*/i;
// Attention-getters and "I have a question" lead-ins, with common spellings (سؤال/سوال).
const OPENER = /^[\s،,.!]*(?:(?:يا\s*)?ليان|اسمعي(?:ني)?|اسمع(?:ني)?|لو سمحت(?:ي)?|من فضلك|ممكن\s+(?:سؤال|سوال|اسال|اسأل|أسأل|استفسر)|عندي\s+(?:سؤال|سوال|سؤالين|استفسار|كم سؤال)|بدي\s+(?:اسالك|اسألك|أسألك|اسال|اسأل|أسأل|استفسر)|سؤال|سوال|استفسار|ساعديني|ساعدني|بدي مساعد[ةه]|محتاج مساعد[ةه])(?=[\s،,.:!؟?]|$)[\s،,.:!]*/;
// Small talk that carries no question. Each kind is stripped from the message; if nothing
// meaningful is left, Layan answers the small talk instead of searching the site.
const CHAT = {
  askBack: /(?:^|\s)و?(?:انت|انتي|إنت|إنتي|حضرتك)(?:\s+(?:كيفك|كيف حالك|كيفك انتي|شو اخبارك))?(?=[\s؟?!.،,]|$)|و?(?:كيفك|شو اخبارك) (?:انت|انتي|إنتي)/g,
  wellbeing: /الحمد\s*[اﷲ]?\s*ل?لل?ه|الحمدلل?ه|نشكر الله|بخير|منيح(?:ه|ة)?|كويس(?:ه|ة)?|ماشي الحال|زي الفل|تمام التمام|الله يسلم(?:ك|كي|ج)|الله يخلي(?:ك|كي)|يخلي(?:ك|كي)|\b(?:fine|good|great)\b/gi,
  compliment: /بتجنن|حلو+(?:ه|ة)?|رائع(?:ه|ة)?|ممتاز(?:ه|ة)?|جميل(?:ه|ة)?|روع(?:ه|ة)|واو+|يا سلام|ما شاء الله|ماشاءالله|خرافي|بجنن|\b(?:wow|nice|amazing|cool)\b/gi,
  ack: /(?:^|\s)(?:طيب+|ماشي|فهمت عليك|فهمت عليكي|خليني اشوف|خليني افكر|بفكر|okay|اوكي|أوكي|اوك|ok|okay|ماشي|تمام|فهمت|واضح|ابشر|أبشر|ايوه|ايوا|اه|آه|اوكيه|زين|كثير|جدا|جداً|والله)(?=[\s؟?!.،,]|$)/gi,
};
const strip = (t, re) => t.replace(new RegExp(re.source, re.flags.replace("^", "") + "g"), " ").replace(/^[\s,،.!؟?]+/, "");

// Prefer a curated FAQ answer, then a content item, over a page passage, when close.
function bestOf(hits) {
  const best = hits[0];
  const faq = hits.find((h) => h.d.kind === "faq");
  const item = hits.find((h) => h.d.kind === "item");
  return faq && faq.score >= best?.score * 0.8 ? faq : item && item.score >= best?.score * 0.8 ? item : best;
}

// Splits "كم المساحة وفي مسبح؟ وشو الخدمات" into its questions: at question marks, and at
// "و" / "،" right before a question word. "مسبح وجاكوزي" (no question word) stays whole.
const Q_WORDS = "كم|شو|هل|في|فيه|فيش|وين|متى|امتى|كيف|قديش|اديش|بكم|ايش|مين|ليش|عندكم|بقدر|ممكن";
const SPLIT = new RegExp(`[؟?]+|\\s*[،,]\\s*(?=(?:${Q_WORDS})\\s)|\\s+و(?=(?:${Q_WORDS})\\s)`);
function splitQuestions(text) {
  return text.split(SPLIT).map((q) => q.trim()).filter((q) => tokens(q).length > 0);
}

// Chalet numbers said in Arabic: «دال خمسين» → D50, «ان ٧» → N7, «شاليه اي 9» → A9.
const LETTER_NAMES = [
  ["A", "ايه|إيه|أيه|اي|الف|ألف"], ["B", "بي|باء"], ["C", "سي"], ["D", "دي|دال"], ["E", "إي|ئي"],
  ["F", "اف|إف|فاء"], ["J", "جي|جيه|جاي"], ["K", "كي|كاف"], ["L", "إل|ايل|لام"], ["M", "ام|إم|ميم"],
  ["N", "ان|إن|نون"], ["Q", "كيو"], ["R", "ار|آر|راء"], ["S", "اس|إس|سين"], ["T", "تي|تاء"],
  ["U", "يو"], ["W", "دبليو"], ["Z", "زد|زي"],
];
const UNITS = { واحد: 1, اثنين: 2, تنين: 2, ثنتين: 2, ثلاث: 3, ثلاثه: 3, تلاته: 3, تلات: 3, اربع: 4, اربعه: 4, خمس: 5, خمسه: 5, ست: 6, سته: 6, سبع: 7, سبعه: 7, ثمان: 8, ثمانيه: 8, تمانيه: 8, تسع: 9, تسعه: 9 };
const TENS = { عشر: 10, عشره: 10, عشرين: 20, ثلاثين: 30, تلاتين: 30, اربعين: 40, خمسين: 50, ستين: 60, سبعين: 70, ثمانين: 80, تمانين: 80, تسعين: 90 };
const TEENS = { احدعش: 11, حداعش: 11, اطنعش: 12, اثنعش: 12, ثلطعش: 13, تلطعش: 13, اربعطعش: 14, خمسطعش: 15, ستطعش: 16, سبعطعش: 17, ثمنطعش: 18, تمنطعش: 18, تسعطعش: 19 };
function arabicNumber(words) {
  // "واحد وخمسين" → 51, "خمسين" → 50, "سبعه" → 7, "١٥" → 15.
  const w = words.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660)).replace(/[ةه]$/u, "ه").trim();
  if (/^\d{1,3}$/.test(w)) return Number(w);
  const n = (x) => UNITS[x] ?? UNITS[x.replace(/ه$/, "")] ?? TENS[x] ?? TEENS[x];
  const m = w.match(/^(\S+)\s+و\s*(\S+)$/);
  if (m && UNITS[m[1]] && TENS[m[2]]) return UNITS[m[1]] + TENS[m[2]];
  return n(w) ?? null;
}
function arabicChalet(text) {
  const t = text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660));
  for (const [L, names] of LETTER_NAMES) {
    const re = new RegExp(`(?:^|[\\s،,])(?:${names})\\s*-?\\s*((?:\\d{1,3})|(?:[\\u0600-\\u06FF]+(?:\\s+و\\s*[\\u0600-\\u06FF]+)?))(\\s*(?:\\+|بلس))?(?=$|[\\s؟?!.،,])`);
    const m = t.match(re);
    if (!m) continue;
    const num = arabicNumber(m[1]);
    if (num) return `${t} ${L}${num}${m[2] ? "+" : ""}`;
  }
  return t;
}

export function createBrain(kb, { phone, starters, chalets = [] }) {
  // Chalet numbers on the compound plan («A9», «D50», «A11+»), for questions about one chalet.
  const chaletIds = new Map(chalets.map((id) => [id.toUpperCase(), id]));
  /** The chalet a message names: { id } when it's on the plan, { unknown } when it only looks like one. */
  function chaletIn(text) {
    text = arabicChalet(text);
    // «A 9» with a space only in an Arabic message: in English, «a 2 bedroom» isn't chalet A2.
    text = text.replace(/\s*(plus|بلس)\b/gi, "+");
    const arabic = /[\u0600-\u06FF]/.test(text) || /^\s*[A-Za-z]\s?-?\s?\d{1,2}\+?\s*[؟?]?\s*$/.test(text);
    const short = text.trim().split(/\s+/).length <= 3;
    const m = text.match(arabic || short ? /(?<![A-Za-z])([A-Za-z])\s?-?\s?(\d{1,3})(\s?\+)?(?!\d)/ : /(?<![A-Za-z])([A-Za-z])-?(\d{1,3})(\+)?(?![\d\w])/);
    if (!m) return null;
    const name = `${m[1].toUpperCase()}${m[2]}`;
    const id = chaletIds.get(name + (m[3] ? "+" : "")) ?? chaletIds.get(name) ?? chaletIds.get(`${name}+`);
    if (id) return { id };
    return /شاليه|شالية|رقم|وحده|وحدة|بيت|فيلا|سعر|sa3r|si3r|s3r/i.test(text) ? { unknown: name } : null;
  }
  const contact = `تقدر تحكي مع فريق المبيعات مباشرة على ${phone} أو واتساب`;

  function answerFrom(hit, query) {
    const d = hit.d;
    if (d.list) {
      const lines = d.text.split("\n");
      const bullets = lines.slice(1);
      // A specific question ("مين مدير المبيعات") gets the matching line, not the whole list.
      const topic = new Set([...tokens(d.title), ...tokens(lines[0]), ...tokens(label(d.q))]);
      const specific = tokens(query, true).filter((w) => !topic.has(w));
      // Keep only the lines sharing the most question words (so "قسم" alone doesn't match every row).
      const hitsPer = bullets.map((b) => tokens(b).filter((w) => specific.includes(w)).length);
      const top = Math.max(0, ...hitsPer);
      const match = top ? bullets.filter((_, i) => hitsPer[i] === top) : [];
      if (match.length === 1) {
        // One hit: answer with that item's full description when we have it.
        const name = match[0].replace(/^• /, "");
        const detail = kb.search(name, 3).find((h) => h.d.kind === "item" && h.d.q === name);
        return detail ? detail.d.text.replace(/^([^:]+):\s*/, "$1 — ") : name;
      }
      if (match.length && match.length <= 3) return match.map((b) => b.replace(/^• /, "")).join("\n");
      const shown = bullets.slice(0, 10).join("\n");
      return `${lines[0]}\n${shown}${bullets.length > 10 ? `\n…وغيرها كثير (${bullets.length} بالمجمل)` : ""}`;
    }
    if (d.kind === "page") {
      // Keep the 2–3 sentences of the passage that best match the question.
      const qw = new Set(tokens(query, true));
      const sents = d.text.split(/(?<=[.!؟])\s+/).filter((s) => s.length > 15);
      const best = sents
        .map((s, i) => ({ s, i, n: tokens(s).filter((w) => qw.has(w)).length }))
        .sort((a, b) => b.n - a.n).slice(0, 3).sort((a, b) => a.i - b.i).map((x) => x.s);
      return best.join(" ") || d.text;
    }
    return d.text.replace(/^[^:]{0,60}:\s*/, (m) => (d.kind === "item" ? `${m.slice(0, -2)} — ` : m));
  }

  const opener = (q) =>
    /^(في|فيه|هل|بتقدروا|بقدر|ممكن|عندكم)/.test(q.trim())
      ? pick(["أكيد! ", "إيه أكيد 😊 ", "طبعًا، ", ""])
      : pick(["تكرم عينك 🌿\n", "سؤال حلو 👌\n", "أكيد، خليني أحكيلك:\n", "", ""]);

  function offerFrom(hits, used) {
    // Only offer topics with a spoken name (topics.json), never a raw FAQ question.
    const next = hits.find((h) => h.d !== used && h.d.topic && h.d.topic !== used.topic && h.score > 0.08);
    return next ? { q: label(next.d.q), topic: next.d.topic } : null;
  }

  // Same meaning, different shape, for a question Layan already answered in this chat.
  function retell(d, body) {
    const items = body.split("\n").filter((l) => l.startsWith("• ")).map((l) => l.slice(2));
    if (d.list && items.length > 2)
      return pick([`باختصار، أبرزها: ${items.slice(0, 3).join("، ")}، وغيرها.`, `يعني أهم إشي: ${items.slice(0, 3).join("، ")} 👌`]);
    const first = body.split(/(?<=[.!؟])\s+/)[0].replace(/^(نعم|إيه|ايه)[،,]?\s*/, "");
    return pick([`باختصار: ${first}`, `يعني بالمختصر، ${first}`]);
  }

  // Written answers (answers.json) rotate through their variants; site text is given in
  // full the first time and retold in short after that.
  function phrase(top, query, times) {
    const d = top.d;
    if (d.answers?.length) {
      // A detail the visitor named («شرفة», «مدفأة») picks a variant that mentions it.
      const general = new Set([...tokens(label(d.q ?? "")), ...tokens(d.topic ?? "")]);
      const specific = tokens(query, true).filter((w) => !general.has(w) && w.length > 2);
      const norm = (x) => tokens(x).join(" ");
      const fit = specific.length ? d.answers.filter((a) => specific.some((w) => norm(a).includes(w))) : [];
      const pool = fit.length && fit.length < d.answers.length ? fit : d.answers;
      return { body: pool[times % pool.length], own: true };
    }
    const body = answerFrom(top, query);
    return times ? { body: retell(d, body), own: true } : { body };
  }

  /** The doc behind a question label (an FAQ question as Layan shows it). */
  function byLabel(key) {
    const hits = kb.search(key, 6);
    return hits.find((h) => h.d.q && label(h.d.q) === key) ?? null;
  }
  /** What to remember about an answer: the question, the answer, and the runners-up. */
  function remember(q, top, hits) {
    const key = top.d.q ? label(top.d.q) : null;
    const alts = [...new Set(hits.filter((h) => h.d !== top.d && h.d.q && h.d.kind !== "page" && h.score > 0.12 && h.d.topic !== top.d.topic).map((h) => label(h.d.q)))].slice(0, 3);
    return { q, key, score: Math.round(top.score * 100) / 100, alts, tried: key ? [key] : [] };
  }
  const sameQuestion = (a, b) => {
    const x = new Set(tokens(a)), y = new Set(tokens(b));
    if (!x.size || !y.size) return false;
    const both = [...x].filter((w) => y.has(w)).length;
    return both / new Set([...x, ...y]).size >= 0.75;
  };
  /** The last answer was wrong: say sorry and give the next-best one, with the others as buttons. */
  function recover(state, parts) {
    const L = state.last;
    const tried = L.tried ?? [];
    const alts = (L.alts ?? []).filter((a) => !tried.includes(a));
    const hit = alts.length ? byLabel(alts[0]) : null;
    if (!hit) {
      parts.push(pick(["سامحني إني ما فهمت عليك صح 🙏", "آسفة، شكلي ما فهمت قصدك 🙏"]));
      parts.push(`ممكن تكتبلي سؤالك بكلمات ثانية؟ أو ${contact} وبيجاوبوك على كل إشي.`);
      return { parts, suggestions: ["بدي احكي مع حدا من الفريق"], last: { ...L, alts: [] } };
    }
    const about = hit.d.topic ?? `«${alts[0]}»`;
    const { body } = phrase(hit, L.q, 0);
    parts.push(pick([`سامحني 🙏 يمكن قصدك ${about}؟\n`, `آسفة إذا ما فهمت عليك من أول مرة 🙏 إذا قصدك ${about}:\n`]) + body);
    const rest = alts.slice(1, 3);
    parts.push(rest.length ? "وإذا قصدك إشي ثاني، اختار من هون 👇" : `وإذا لسا مش هاد، ${contact} 🌿`);
    return { parts, source: hit.d, suggestions: rest.length ? rest : ["بدي احكي مع حدا من الفريق"], last: { ...L, key: alts[0], score: 0, tried: [...tried, alts[0]] } };
  }

  // `state.seen` counts what each question has been answered with, across the whole chat.
  function reply(text, state = {}) {
    const seen = { ...(state.seen ?? {}) };
    const out = respond(text, state, seen);
    const name = out.state?.name ?? state.name;
    // The chalet being talked about stays in focus for a few messages («وكم سعره؟», «احجز زيارة»).
    const shown = out.card?.type === "chalet" ? out.card.id : null;
    const age = shown ? 0 : (state.chaletAge ?? 0) + 1;
    const chalet = shown ?? (state.chalet && age <= 3 && !out.card ? state.chalet : undefined);
    // The last answer (and its runners-up), for «ليش؟», «لا مش هيك» and a repeated question.
    const last = out.last === null ? undefined : out.last ?? state.last;
    const { last: _l, ...rest } = out;
    return { ...rest, state: { ...(out.state ?? {}), seen, ...(name && { name }), ...(chalet && { chalet, chaletAge: age }), ...(last && { last }) } };
  }

  function respond(text, state, seen) {
    // Stretched letters ("كتيييير", "طيبب", "يسلموو") read as the plain word.
    const raw = text.trim().replace(/(\p{L})\1{2,}/gu, "$1").replace(/(\p{Script=Arabic}{3,})(\p{Script=Arabic})\2(?=[\s؟?!.،,]|$)/gu, "$1$2");
    let t = raw;
    const parts = [];
    let askedHow = false;

    // 1. Small talk the visitor opened with — greet back first, like a person would.
    for (const s of SOCIAL) {
      if (has(s.re, t)) {
        if (s.id === "how") askedHow = true;
        if (!(s.id === "hi" && parts.length)) parts.push(s.say());
        t = strip(t, s.re);
      }
    }
    if (askedHow) parts[parts.length - 1] += " وانت كيفك؟";

    // Openers that only get attention ("اسمعي", "عندي سؤال"): strip them, and if nothing
    // follows, invite the question instead of searching for it.
    let opened = false;
    for (let m; (m = t.match(OPENER)) && m[0].trim(); ) { t = t.slice(m[0].length); opened = true; }
    if (opened && (ONLY_FILLER.test(t) || !tokens(t).length)) {
      parts.push(pick(["تفضّل، سمعاك 😊 شو سؤالك؟", "أكيد، اسأل اللي بدك ياه 🌿", "تكرم، كلّي آذان صاغية 😊", "أكيد، تفضّل 🌿 شو حابب تعرف؟"]));
      return { parts };
    }

    // A correction ("لا بسأل عن اسمك"): drop the "no" and answer what follows instead.
    const corrected = t.replace(CORRECTION, "");
    if (corrected !== t && tokens(corrected).length) {
      t = corrected;
      state = { ...state, offer: null };
    }

    // We asked their name: a short reply with no question in it is their name.
    if (state.askedName && !/[؟?]/.test(t)) {
      const name = t.replace(NAME_LEAD, "").replace(/[.!،,😊🌿]+/g, "").trim();
      const chatty = [...Object.values(CHAT), ...SOCIAL.map((x) => x.re), OPENER, /^(لا|لأ|اه|آه|ايه|إيه|نعم|اكيد|أكيد|مش|ما|بدي|في|شو|كيف)$/]
        .some((re) => new RegExp(re.source, re.flags.replace("g", "")).test(name));
      if (name && !chatty && name.split(/\s+/).length <= 3 && /^[\p{L}\s]+$/u.test(name) && !PERSONA.some((p) => p.re.test(t)) && (kb.search(name, 1)[0]?.score ?? 0) < 0.3) {
        const first = name.split(/\s+/)[0];
        parts.push(pick([`تشرّفنا يا ${first} 🌿`, `أهلين ${first}، تشرّفت فيك 😊`, `يا هلا ${first} 🌿`]));
        parts.push(pick(["كيف بقدر أساعدك اليوم؟", "شو حابب تعرف عن روح العطاء؟"]));
        return { parts, suggestions: starters, state: { name: first } };
      }
    }

    // «لا مش هيك», «ما فهمتي»: the last answer missed; offer the next-best one.
    if (state.last && WRONG.test(t.trim())) return recover(state, parts);
    // «ليش؟», «وضحيلي», «احكيلي أكثر»: more about the last answer.
    if (state.last?.key && MORE.test(t.trim())) {
      const hit = byLabel(state.last.key);
      if (hit) {
        const d = hit.d;
        const longest = d.answers?.length ? [...d.answers].sort((a, b) => b.length - a.length)[0] : answerFrom(hit, state.last.q);
        parts.push(pick(["بتفصيل أكثر 🌿\n", "خليني أوضحلك أكثر:\n", "تكرم، بالتفصيل:\n"]) + longest);
        parts.push(pick([`وإذا في إشي مش واضح، ${contact} وبيشرحولك كل التفاصيل 🙏`, "وإذا حابب تشوف هاد كله بعينك، بحجزلك زيارة بأي وقت 😊"]));
        return { parts, source: d, suggestions: (state.last.alts ?? []).slice(0, 2) };
      }
    }

    // Questions about Layan herself.
    const persona = PERSONA.find((p) => p.re.test(t));
    if (persona) {
      parts.push(...persona.say(contact));
      return { parts, state: { askedName: !!persona.ask, offer: persona.offer ?? null } };
    }

    // 2. Short replies that only make sense against what we said last.
    const short = t.replace(/[؟?!.،,]/g, "").trim();
    let followUp = false;
    // A yes is only a yes on its own ("اه", "أكيد احكيلي", "يلا احكيلي عنها"), not "احكيلي نكتة".
    const YES = "اه|آه|ايه|إيه|اكيد|أكيد|نعم|يلا|ياريت|يا ريت|ok|okay|اوكي|اوك|بحب|بحبه|ماشي|احكيلي|احكي|تفضلي|طبعا|طبعًا|اكيد اكيد|يس|yes|sure|please|بليز|عنها|عنه|كمان|اه والله|ليش لا|ليش لأ|تمام";
    if (state.offer && new RegExp(`^(?:(?:${YES})\\s*)+$`, "i").test(short))
      { t = state.offer; followUp = true; }
    else if (state.offer && /^(لا|لأ|مش هلأ|لا شكرا|خلص)/.test(short))
      return { parts: [pick(["ولا يهمك! 😊", "تمام، على راحتك 🌿"]), "إذا خطر ببالك أي سؤال ثاني أنا هون."] };
    if (/شكر|يعطي(?:ك|كي|كم) العافي[هة]|مشكور|تسلم|يسلمو|يسلموا|يسلم ايديك|thanks|thank/i.test(short) && tokens(t).length <= 5 && !/[؟?]/.test(t))
      return { parts: [pick(["العفو، هذا واجبنا 🌿", "ولو! تكرم 🙏", "على الرحب والسعة 😊", "الله يعافيك 🌿"]), pick(["إذا في أي سؤال ثاني أنا موجودة.", "وإذا حاب تشوف الكمباوند على الطبيعة، بنتشرّف بزيارتك بأي وقت."])] };
    if (/مع السلامه|مع السلامة|باي|bye|سلام عليكم وداعا|يلا سلام/i.test(short))
      return { parts: [`بأمان الله${state.name ? ` يا ${state.name}` : ""} 👋 نوّرتنا، ونتشرّف بزيارتك للكمباوند بأي وقت!`] };
    if (/^(ه{2,}|😂|🤣|lol)/i.test(short)) return { parts: ["😄 كيف بقدر أساعدك كمان؟"] };

    // Small talk with no question in it ("الحمد الله", "وانتي؟", "حلو كثير", "طيب"): reply like
    // a person would and move the conversation on; never search the site for it.
    if (!followUp) {
      const found = {};
      let rest = t;
      for (const [kind, re] of Object.entries(CHAT)) rest = rest.replace(re, () => ((found[kind] = true), " "));
      // "المكان بجنن", "الويب سايت تبعكم حلو": a compliment about us is still just a compliment.
      if (found.compliment) rest = rest.replace(/المكان|المشروع|الشاليهات|الشاليه|الكمباوند|الويب ?سايت|الموقع|الصور|تبعكم|عندكم|بصراح[هة]|والله|كتير|كثير|عن جد|اشي|إشي/g, " ");
      const chatOnly = Object.keys(found).length && !tokens(rest.replace(/[^\p{L}\p{N}\s]/gu, " ")).length;
      if (chatOnly) {
        if (found.askBack) parts.push(pick(["الحمدلله بخير، الله يسلمك 😊", "تمام الحمدلله، تسلم على ذوقك 🌿"]));
        // After "وانت كيفك؟" a plain "تمام" is an answer about how they are, too.
        if (state.askedHow && found.ack) found.wellbeing = true;
        if (!found.askBack && found.wellbeing && (state.askedHow || !parts.length))
          parts.push(pick(["الحمدلله دايمًا 🌿", "يا رب دايمًا بخير 😊", "الحمدلله، يدوم الفرح 🌿"]));
        if (found.compliment) {
          parts.push(pick(["يسعدلي قلبك 😊 فعلًا المكان بستاهل!", "تسلم على هالكلام الحلو 🌿 والمكان على الطبيعة أحلى!"]));
          parts.push("بتحب نرتبلك زيارة تشوف الكمباوند بعينك؟");
          return { parts, state: { offer: "كيف يمكنني حجز موعد لمعاينة الكمباوند؟" } };
        }
        if (!parts.length) parts.push(pick(["تمام 👌", "حلو 👌", "أكيد 🌿"]));
        parts.push(found.wellbeing || found.askBack
          ? pick(["كيف بقدر أساعدك اليوم؟ بتحب تعرف عن الشاليهات، الخدمات، ولا الموقع؟", "شو حابب تعرف عن روح العطاء؟ 😊"])
          : pick(["إذا في إشي ثاني حابب تعرفه، أنا هون 😊", "في إشي ثاني بقدر أساعدك فيه؟"]));
        return { parts, suggestions: found.wellbeing || found.askBack ? starters : [] };
      }
    }

    // Not a question about the compound (wanting to ask, off-topic, feelings, holidays...):
    // answer like a person. A strong site match on a compound word still wins.
    if (!followUp) {
      const emo = !/[\p{L}]/u.test(t) ? emojiReply(t) : null;
      if (emo) return { parts: [...parts, ...emo] };
      if (isNoise(t) && !parts.length)
        return { parts: [pick(["ما وصلتني الرسالة واضحة 😅", "ممم ما فهمت عليك 😅"]), "شو حابب تعرف عن روح العطاء؟"], suggestions: starters };
      const c = CONVO.find((x) => x.re.test(t));
      // "حابب اعرف كثير عن التقسيط": what's left after the "I want to know" part is the question.
      const rest = c ? t.replace(c.re, " ").replace(/^\s*(عن|بخصوص|حول)\s+/, "").trim() : "";
      const restHit = rest && tokens(rest).length ? bestOf(kb.search(rest, 8)) : null;
      if (c && restHit && restHit.score >= 0.3 && ON_TOPIC.test(rest)) t = rest;
      else if (c) {
        const strong = bestOf(kb.search(t, 8));
        if (!(ON_TOPIC.test(t) && strong?.score >= 0.45)) {
          for (const opts of c.say) parts.push(pick(opts));
          return { parts, suggestions: c.starters ? starters : [], state: { offer: c.offer ?? null } };
        }
      }
    }

    // Nothing left after the greeting: ask how we can help.
    if (ONLY_FILLER.test(t) || !tokens(t).length) {
      if (!parts.length) parts.push(pick(["أهلين فيك 😊", "يا هلا 🌿"]));
      if (!askedHow) parts.push(pick(["كيف بقدر أساعدك اليوم؟", "شو حابب تعرف عن روح العطاء؟ اسألني عن أي شي 😊"]));
      return { parts, suggestions: askedHow ? [] : starters, state: { askedHow } };
    }

    // Clearly not about us (another city's weather, a loan, a car, a job, a link): say so kindly.
    if (!followUp && LINK.test(t) && !STRONG_TOPIC.test(t)) {
      parts.push("ما بقدر أفتح روابط من هون 🙏", "بس إذا عندك سؤال عن الشاليهات أو الكمباوند، أنا جاهزة 😊");
      return { parts, suggestions: starters };
    }
    if (!followUp && OFF_HINT.test(t) && !STRONG_TOPIC.test(t)) {
      parts.push(pick(OFF_TOPIC[0]), pick(OFF_TOPIC[1]));
      return { parts, suggestions: starters };
    }

    // 3. Intents with a fixed, human answer.
    // One chalet by its number («شو تفاصيل A9»، «كم سعر D50»): its card, with its place on the map.
    const chalet = chaletIn(t);
    if (chalet?.id) {
      parts.push(pick([`أكيد 😊 هاي تفاصيل الشاليه ${chalet.id}، ومكانه بالكمباوند 👇`, `هاد الشاليه ${chalet.id} 🏡 شوف وين موقعه بالضبط 👇`, `تكرم 🌿 هاي كل تفاصيل الشاليه ${chalet.id} 👇`]));
      return { parts, card: { type: "chalet", id: chalet.id }, suggestions: ["ما المرافق داخل الشاليه؟", "📅 احجز زيارة"] };
    }
    // «وكم سعره؟», «وين مكانه؟», «متاح؟» right after a chalet's card: about that chalet.
    if (!chalet && state.chalet) {
      const aspect = CHALET_ASPECT.find(([, re]) => re.test(t));
      if (aspect && (IT.test(t) || tokens(t).length <= 2)) return { parts, card: { type: "chalet", id: state.chalet, aspect: aspect[0] } };
    }
    if (chalet?.unknown) {
      parts.push(`ما لقيت شاليه برقم ${chalet.unknown} على مخطط الكمباوند 🤔 ممكن الرقم مكتوب بشكل ثاني؟`);
      parts.push("تقدر تدوّر عليه بنفسك على الخريطة، والشاليهات المتاحة معلّمة عليها 👇");
      return { parts, card: { type: "map" } };
    }
    // The compound map itself.
    if (/خريط|خارط|خارطه|مخطط|مخطك|\bmap\b|ماب|(شاليه|شاليهات|الشاليهات)\s*(ال)?فاضي|للبيع (هلا|هسا|هلأ|حاليا)|which chalets|available chalets|وين (موقع )?كل شاليه|وين الشاليهات (جوا|داخل)|شاليهات (متاح|متوفر)/i.test(t)) {
      parts.push(pick(["أكيد 🗺️ هاي خريطة الكمباوند، والشاليهات المتاحة معلّمة عليها. كبّر واضغط على أي شاليه تشوف تفاصيله 👇", "تفضّل 🗺️ هاي الخريطة كاملة، اضغط على أي شاليه بتعرف كل إشي عنه 👇"]));
      return { parts, card: { type: "map" } };
    }
    // «متوفر/متاح» is about units unless the visitor means services («شو الخدمات المتوفرة»).
    const W = (re) => new RegExp(`(?:^|[\\s،,.!؟?])(?:${re.source})(?=$|[\\s،,.!؟?])`);
    if (/سعر|اسعار|أسعار|كلف|تكلف|قديش سعر|في وحدات/.test(t) || W(/بكم|بقديش|بكام|بكام ده/).test(t) || (/متوفر|متاح/.test(t) && !/خدم|مرافق|نشاط|العاب|ألعاب|رياض|مي |المي|مياه|مي$|كهربا|نت|واي ?فاي|wifi|اكل|مطعم|محل|سوبر|جول[هة]|افتراض|فيديو|زيار/.test(t))) {
      parts.push(pick(["بالنسبة للأسعار والوحدات المتاحة، بتتغيّر باستمرار، فبفضّل يعطيك إياها فريق المبيعات بشكل دقيق 🙏", "الأسعار والوحدات المتوفرة بتختلف حسب الشاليه والموقع، وفريق المبيعات بعطيك آخر التفاصيل أول بأول 🙏"]));
      parts.push(`${contact}، وكمان في تقسيط بقسط شهري 1% بس وبدون فوائد 👌`);
      // «بكم الشاليه وفي رسوم غيره؟»: answer the other question too.
      const PRICE = /سعر|اسعار|أسعار|كلف|تكلف|بكم|بقديش|بكام|متوفر|متاح|تقسيط|اقساط|أقساط|قسط/;
      for (const q of splitQuestions(t.replace(/\s+و(?=(?:في|فيه|كمان|شو|كم|هل)\s)/g, "؟ "))) {
        if (PRICE.test(q)) continue;
        const other = bestOf(kb.search(q, 6));
        if (other && other.score >= 0.3 && other.d.q) {
          parts.push(pick(["وعن سؤالك الثاني:\n", "وبالنسبة للشق الثاني:\n"]) + phrase(other, q, 0).body);
          break;
        }
      }
      parts.push(pick(["وبهالأثناء، شوف الشاليهات المتاحة على خريطة الكمباوند، واضغط على أي واحد بتشوف تفاصيله 👇", "وإذا حابب، تصفّح الشاليهات المتاحة على الخريطة واختار اللي بعجبك 👇"]));
      return { parts, card: { type: "map" }, suggestions: ["هل تتوفر خيارات تقسيط لشراء الشاليه؟", "📅 احجز زيارة"] };
    }
    // Booking happens inside the chat (the site's chat-booking.ts takes over on `action`).
    if ((/زياره|زيارة|موعد|احجز|أحجز|حجز|اشوف الكمباوند|أزور|ازور|نزوركم|(بدي|بدنا|ممكن|حابب|حابين)\s+(اجي|نيجي|نجي|امرق|نمرق)|نيجي العيل|عالطبيع|على الطبيع|\b(book|booking|appointment|a7jez|ahjez|maw3ed)\b/i.test(t) || /معاين/.test(t)) && !/فيديو|افتراض|اونلاين|أونلاين|online|video|كول/i.test(t)) {
      parts.push(pick(["بنتشرّف فيك! 😍 بحجزلك الزيارة من هون، بدون ما تطلع من المحادثة.", "أكيد! 😍 خلّيني أحجزلك زيارة هون بأقل من دقيقة."]));
      return { parts, action: "book" };
    }
    if (/رقم|تلفون|تلفونات|هاتف|اتصل|يتصل|يرن|واتس|whats|تواصل|موبايل|جوال/i.test(t) && !/رقم (الشاليه|شاليه)/.test(t)) {
      parts.push(`أكيد 🌿 ${contact}، وبكونوا مبسوطين يساعدوك.`);
      return { parts };
    }

    // 4. Two questions in one message ("كم المساحة وفي جاكوزي؟"): answer each, in order.
    const asked = splitQuestions(t);
    if (asked.length > 1 && !followUp) {
      const found = [];
      for (const q of asked) {
        const top = bestOf(kb.search(q, 8));
        if (top && top.score >= 0.3 && !found.some((f) => f.top.d === top.d)) found.push({ top, q });
      }
      if (found.length > 1) {
        found.forEach(({ top, q }, i) => {
          const key = top.d.q ? label(top.d.q) : top.d.text.slice(0, 40);
          const times = seen[key] ?? 0;
          seen[key] = times + 1;
          const { body } = phrase(top, q, times);
          parts.push((i ? pick(["وبالنسبة لسؤالك الثاني:\n", "وعن الشق الثاني:\n", "وكمان:\n"]) : opener(raw)) + body);
        });
        parts.push(pick(["في إشي ثاني حابب تعرفه؟ 😊", "إذا عندك أي سؤال ثاني، أنا هون 🌿"]));
        return { parts, source: found[0].top.d, suggestions: [] };
      }
    }

    // 5. Look it up.
    const hits = kb.search(t, 8);
    const top = bestOf(hits);

    // Score bands (lib/core.mjs, checked with tools/eval.mjs): unrelated questions land
    // around 0.15, real matches from ~0.28. In between, ask instead of guessing.
    const sug = [...new Set(hits.filter((h) => h.d.q).map((h) => label(h.d.q)))];
    // A full English sentence that matched nothing well: answer in English.
    const latin = (t.match(/[a-z]/gi) ?? []).length, arabic = (t.match(/[\u0600-\u06FF]/g) ?? []).length;
    const english = latin > 12 && latin > arabic * 2 && t.trim().split(/\s+/).length >= 4;
    if (!top || top.score < 0.18 || (english && top.score < 0.4)) {
      // About the compound but not on the site: honest, and the team. Anything else: off topic.
      const [first, second] = english ? ENGLISH : ON_TOPIC.test(t) ? UNKNOWN : OFF_TOPIC;
      parts.push(pick(first), pick(second));
      return { parts, suggestions: starters };
    }
    if (top.score < 0.26 && !followUp && !ON_TOPIC.test(t) && !STRONG_TOPIC.test(t)) {
      // Unsure and nothing in it is about us: a short message is small talk, a longer one off-topic.
      if (tokens(t).length <= 2 && !/[؟?]/.test(t)) {
        parts.push(pick(["تمام 👌", "أكيد 🌿", "حلو 😊"]), pick(["شو حابب تعرف عن روح العطاء؟", "إذا عندك أي سؤال عن الشاليهات أو الكمباوند، أنا هون 😊"]));
        return { parts, suggestions: starters };
      }
      parts.push(pick(OFF_TOPIC[0]), pick(OFF_TOPIC[1]));
      return { parts, suggestions: starters };
    }
    if (top.score < 0.26 && top.d.q && !followUp) {
      const guess = label(top.d.q);
      const about = top.d.topic ?? `«${guess}»`;
      parts.push(pick([`بس لأتأكد إني فهمتك صح 🙏 بتسأل عن ${about}؟`, `قصدك بتسأل عن ${about}؟`]));
      return { parts, suggestions: sug.filter((q) => q !== guess).slice(0, 2), state: { offer: guess } };
    }

    // The same question again after an unsure answer: that answer missed, try the next one.
    if (!followUp && state.last && state.last.score < 0.4 && sameQuestion(t, state.last.q) && (state.last.alts ?? []).length) return recover(state, parts);
    // Two answers nearly tied: ask which, with both as buttons, instead of guessing.
    const rival = hits.find((h) => h.d !== top.d && h.d.kind === "faq" && h.d.topic && h.d.topic !== top.d.topic);
    if (!followUp && tokens(t).length > 1 && top.d.topic && rival && top.score < 0.42 && rival.score >= top.score - 0.012) {
      // «امتى التسليم والقوشان؟»: both were asked, joined by «و». Answer both.
      if (/\sو\S/.test(t)) {
        [top, rival].forEach((h, i) => {
          const key = label(h.d.q);
          const times = seen[key] ?? 0;
          seen[key] = times + 1;
          parts.push((i ? pick(["وعن الشق الثاني:\n", "وكمان:\n"]) : opener(raw)) + phrase(h, t, times).body);
        });
        parts.push(pick(["في إشي ثاني حابب تعرفه؟ 😊", "إذا عندك أي سؤال ثاني، أنا هون 🌿"]));
        return { parts, source: top.d, suggestions: [], last: remember(t, top, hits) };
      }
      parts.push(pick([`قصدك تسأل عن ${top.d.topic} ولا عن ${rival.d.topic}؟ 🤔`, `بس لأتأكد 🙏 بتسأل عن ${top.d.topic} ولا ${rival.d.topic}؟`]));
      return { parts, suggestions: [label(top.d.q), label(rival.d.q)], last: null };
    }

    // "How do I book a viewing?": book it right here instead of explaining how.
    if (top.d.q?.startsWith("كيف يمكنني حجز موعد لمعاينة") && !/فيديو|افتراض|اونلاين|online|video|كول/i.test(t)) {
      parts.push(pick(["بنتشرّف فيك! 😍 بحجزلك الزيارة من هون، بدون ما تطلع من المحادثة.", "أكيد! 😍 خلّيني أحجزلك زيارة هون بأقل من دقيقة."]));
      return { parts, action: "book" };
    }

    const key = top.d.q ? label(top.d.q) : top.d.text.slice(0, 40);
    const times = seen[key] ?? 0;
    seen[key] = times + 1;
    const { body, own } = phrase(top, t, times);
    const lead = times ? pick(["زي ما حكيتلك 😊\n", "بس للتأكيد،\n", "مرة ثانية وبطريقة أبسط:\n"])
      : followUp ? pick(["تمام 👌\n", "أكيد 🌿\n"])
      : own || /^(نعم|لا)/.test(body) ? "" : opener(raw);
    parts.push(lead + body);

    const offer = offerFrom(hits, top.d);
    const r = Math.random();
    if (offer && r < 0.55) parts.push(pick([`بتحب أحكيلك كمان عن ${offer.topic}؟`, `على فكرة، كثير ناس بسألوا عن ${offer.topic}، بتحب أحكيلك؟`, `إذا حابب، بحكيلك كمان عن ${offer.topic} 😊`]));
    else if (r < 0.75) parts.push(pick(["في إشي ثاني حابب تعرفه؟ 😊", "إذا عندك أي سؤال ثاني، أنا هون 🌿"]));
    else if (r < 0.9) parts.push("وإذا حاب تشوف الكمباوند بعينك، بنرتبلك زيارة بأي وقت 😊");

    const suggestions = [...new Set(hits.filter((h) => h.d !== top.d && h.d.q && h.d.kind !== "page").map((h) => label(h.d.q)))]
      .filter((q) => q !== offer?.q && q !== label(top.d.q ?? "")).slice(0, 2);
    return { parts, source: top.d, suggestions, state: { offer: offer && r < 0.55 ? offer.q : null }, last: remember(t, top, hits) };
  }

  return { reply };
}
