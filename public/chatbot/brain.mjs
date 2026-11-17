// Offline conversation engine: small talk in Jordanian Arabic, then an answer from the
// knowledge base, phrased like a person from the sales team would say it. Replies come
// back as `parts`, each shown as its own chat bubble. `state` round-trips through the
// client so follow-ups like "اه أكيد" or "تمام" make sense.
import { tokens, labelOf } from "./lib/core.mjs";
import { CONVO, KINDS, SPAM, OFF_TOPIC, UNKNOWN, ENGLISH, ON_TOPIC, STRONG_TOPIC, OFF_HINT, LINK, isNoise, emojiReply } from "./convo.mjs";
import { voice } from "./lib/voice.mjs";
export { voice };

// The client's sales follow-up (Nov 2026). Layan promises a phone call only once the visitor has
// left a number (a visit or call request: `state.lead`, set by the chat); before that she asks
// whether they'd like one, and a yes opens the call request (`action: "call"`).
export const CALL_CHIP = "📞 اطلب اتصال من فريق المبيعات";
const CALL = "@call";
const SALES_LINE = "رح يتواصل معك فريق المبيعات هاتفياً بأقرب وقت ممكن.";
const ASK_CALL = "بتحب يتواصل معك فريق المبيعات هاتفياً؟";
const CLOSING = "بتحب يتواصل معك فريق المبيعات هاتفياً بخصوص المشروع؟";
const WANTS_CALL = /^📞|اطلب اتصال|طلب اتصال|سجل(?:ي|يني)? (?:طلب )?اتصال/;
// What Layan offers to explain next, in this order, one topic per reply: the client's list.
// Never rental, readiness, prices or distances (those only when asked).
const OFFER_ORDER = [
  "ما هو كمباوند شاليهات", "ما مساحة الأرض والبناء", "ما المرافق والخدمات المتوفرة داخل", "هل تتوفر خيارات تقسيط", // voice: key
  "ما الإجراءات والمستندات", "هل يتم تسجيل الشاليه", "كيف بضمن إنكم شركة", "شو نوع التشطيبات", "كيف يتم توفير الخصوصية", // voice: key
];
// Kept for the whole chat (reply() carries them over).
const KEEP = ["lead", "noCall", "declined", "offered", "closed"];
// Any question about the internet gets the internet answer (the user's rule, Nov 2026).
const NET = /(?:^|[\s،,.؟?])(?:[بو]?ال|[بو])?(?:انترنت|إنترنت|انترنيت|نت|واي ?فاي|وايفاي|wifi|wi-fi|فايبر|ألياف|الياف|internet)(?=$|[\s،,.؟?!])/i;
const INTERNET = "هل في إنترنت أو واي فاي بالشاليه؟"; // voice: key

// Topic docs carry extra search words after the "؟"; show people only the question.
const label = (q) => (q.includes("؟") ? q.split("؟")[0] + "؟" : q);
// Set by respond() when the visitor corrected us («لا، قصدي…»): the reply starts with a sorry.
let apology = false;
// What Layan said lately in this chat (set by reply()): a wording she used is skipped while
// another is left, so she never says the same line twice in a row of messages.
let said = "";
const pick = (a) => {
  const fresh = a.filter((x) => !said.includes(x));
  if (fresh.length) return fresh[Math.floor(Math.random() * fresh.length)];
  // All used: the one said longest ago.
  return a.reduce((best, x) => (said.lastIndexOf(x) < said.lastIndexOf(best) ? x : best));
};
const has = (re, t) => re.test(t);

const SOCIAL = [
  { id: "salam", re: /(ال)?سلام عليكم|^سلام\b|^السلام/, say: () => pick(["وعليكم السلام ورحمة الله وبركاته 🌿 يا هلا فيك!", "وعليكم السلام، أهلين وسهلين 😊"]) },
  { id: "morning", re: /صباح (ال)?(خير|نور|ورد|فل)/, say: () => pick(["صباح النور والسرور ☀️", "صباح الورد! ☀️ أهلين فيك"]) },
  { id: "evening", re: /مساء (ال)?(خير|نور|ورد|فل)/, say: () => pick(["مساء النور 🌙 أهلين فيك", "مساء الورد والياسمين 🌙"]) },
  { id: "hi", re: /^(مرحبا|مرحبتين|مرحبًا|اهلين|أهلين|اهلا|أهلا|هلا|هاي|هلو|hi|hello|hey|mar7aba|mar7ba|marhaba|marhaban|ahlan|ahlen|ahlain|hala)/i, say: () => pick(["أهلين وسهلين! 😊", "هلا والله، نوّرت 🌿", "مرحبتين! يا هلا فيك 👋"]) },
  { id: "how", re: /كيفك|كيفيك|كيفكيف|كيف حالك|كيف الحال|شو اخبارك|شو أخبارك|شو اخبارك|شخبارك|شلونك|كيفكم|كيف الصحة|ازيك|إزيك|عامل[هة]? ايه|how are you/i, say: () => pick(["الحمدلله تمام، تسلم على السؤال 🙏", "بخير الحمدلله، الله يسلمك 🌿"]) },
];

const ONLY_FILLER = /^[\s؟?!.,،😊🙏👋🌿]*$/;

// Questions about Layan herself and the chat, answered like a person would. `ask` asks the
// visitor's name back (the next short message is then taken as their name).
const PERSONA = [
  { re: /(شو|ايش|إيش|مين|وش|شنو)\s*(هو\s*)?اسمك|اسمك\s*(شو|ايش|إيش)|^اسمك|ما اسمك|(قولي|قوليلي|تقوليلي|احكيلي|اعرف|أعرف|نعرف)\s*(شو\s*)?اسمك|(^|\s)اسمك\s*[؟?]|your name|what.?s your name/i, ask: true,
    say: () => [pick(["اسمي ليان 😊 مساعدة كمباوند شاليهات Giving الرقمية.", "أنا ليان 🌿 المساعدة الرقمية لكمباوند شاليهات Giving."]), "وانت شو اسمك؟"] },
  { re: /(انت|إنت|انتي|إنتي)\s*(بوت|روبوت|انسان|إنسان|انسانه|إنسانة|حقيقي|حقيقيه|ذكاء|ai|بني ?ادم|كمبيوتر|برنامج)|ذكاء اصطناعي|chat ?gpt|are you (a )?(bot|human|real)|بتقدري تفكري|بتفكري|بتحسي/i,
    say: () => ["أنا مساعدة رقمية مش إنسانة 😊 بس بعرف كل شي موجود على موقعنا عن وحدات شاليه ڤيلا والكمباوند.", "وإذا حابب تحكي مع حدا من الفريق، بوصلك فيهم."] },
  { re: /(انت|إنت|انتي|إنتي)\s*(مين|شو|ايش|وش)|(شو|ايش|وش)\s*(انت|انتي|إنتي)(?=$|[\s؟?!.،,])|مين معي|مين انت|مين حضرتك|عرفيني (?:عن|على|ع) حالك|عرفيني عليكي|who are you|shu esmek|sho ismik|esmek|ismik/i, ask: true,
    say: () => ["أنا ليان 😊 المساعدة الرقمية لكمباوند شاليهات Giving، بجاوبك عن وحدات شاليه ڤيلا والكمباوند وبحجزلك زيارة كمان.", "وانت شو اسمك؟"] },
  { re: /كم عمرك|قديش عمرك|how old/i, say: () => ["هههه أنا مساعدة رقمية، عمري من عمر الموقع 😄", "بس بعرف كثير عن كمباوند شاليهات Giving، اسألني!"] },
  { re: /(وين|من وين)\s*(انت|انتي|إنتي|ساكنه|عايشه)|انتي من وين/i, say: () => ["أنا عايشة هون على موقع كمباوند شاليهات Giving 😄", "بس الكمباوند نفسه عبر طريق القسطل، على بعد 20 دقيقة من جامعة الإسراء. بتحب أحكيلك عن موقعه؟"], offer: "أين يقع كمباوند شاليهات روح العطاء وما أبرز مميزات موقعه؟" }, // voice: key
  { re: /مين (عملك|صممك|برمجك|برمجكي|سواكي|عملكي|سواك|عملك)|who (made|built) you/i, say: () => ["فريق كمباوند شاليهات Giving جهّزني عشان أساعد الزوار 😊", "شو حابب تعرف عن الكمباوند؟"] },
  { re: /(بدي|ممكن|بحب|عايز|ابي|أبي|بدنا)\s*(احكي|أحكي|اتواصل|أتواصل|اكلم|أكلم|نحكي)\s*(مع)?\s*(حد|حدا|موظف|انسان|إنسان|الفريق|المبيعات|مسؤول|المسؤول|خدم[هة] العملاء|المدير)|(حدا|حد|موظف|الفريق)\s*(يتصل|يرن|يكلم|يحكي)|يرن (علي|عليي)|اتصلوا (فيي|علي|عليي)|حوليني|بدي (مدير|مسؤول) (المبيعات|البيع)|بدي اكلمه|بدي احكي معهم|talk to (a )?(human|person|agent)|call me/i, contact: true,
    say: (c) => [`أكيد 🌿 ${c}، وبكونوا مبسوطين يساعدوك.`] },
  { re: /(بتفهمي|بتحكي|تحكي)\s*(عربي)/, say: () => ["أكيد! العربي لغتي 😊 ولو كتبت باللهجة أو بأخطاء إملائية بفهم عليك كمان.", "شو حابب تعرف؟"] },
  { kind: (t) => (/متجوز|متزوج|مخطوب|سنقل|single/i.test(t) ? "chat-flirt" : "chat-persona"), re: /متجوز|متزوج|مخطوب|سنقل|single|بتنامي|بتاكلي|بتشربي|ولد ولا بنت|بنت ولا ولد|ذكر ولا انثى/i,
    say: () => [pick(["هههه أنا مساعدة رقمية، ما بنام ولا بتزوج 😄", "😄 أنا مساعدة رقمية، حياتي كلها كمباوند شاليهات Giving!"]), "بس دايمًا صاحية لأسئلتك عن وحدات شاليه ڤيلا والكمباوند."] },
  { re: /ليش اسمك|مين سما(ك|كي)|اسمك حلو/, say: () => ["فريق كمباوند شاليهات Giving اختارلي اسم ليان 🌿 وبحبه كثير!", "شو حابب تعرف عن الكمباوند؟"] },
  { re: /(انت|انتي|إنتي)\s*موظف|بتشتغلي (عندهم|معهم|عندكم)/, say: (c) => ["أنا مساعدة رقمية لكمباوند شاليهات Giving 😊 بجاوب على أسئلتك وبحجزلك زيارة.", `ولما تحب تحكي مع حدا من الفريق، ${c}.`] },
  { re: /(بتحكي|بتفهمي|تحكي)\s*(انجليزي|إنجليزي|انكليزي|english)|do you speak english|speak english/i,
    say: () => ["بفهم شوية إنجليزي، بس بحكي عربي أحسن 😊", "وفريق المبيعات بيحكي إنجليزي، إذا بتحب تحكي معهم مباشرة."] },
  { kind: (t) => (/حلو|بحبك|حبيتك|قمر/.test(t) ? "chat-flirt" : "chat-compliment"), re: /(انتي|إنتي)\s*(حلوه|حلوة|شاطره|شاطرة|ذكيه|ذكية|لطيفه|لطيفة|كثير منيحه|رائعه)|بحبك|حبيتك/i,
    say: () => [pick(["يسلملي قلبك 😊", "تسلم على ذوقك 🌿"]), "شو كمان بقدر أساعدك فيه؟"] },
  { kind: "chat-insult", re: /غبي|غبيه|حمار|حماره|ما بتفهمي|مش فاهمه|ما فهمتي|سخيف|سخيفه|بلا فايده|فاشل|فاشله|تافه|useless|stupid/i,
    say: (c) => ["سامحني إذا ما فهمتك صح 🙏", `جرّب تكتبلي سؤالك بطريقة ثانية، أو ${c}.`] },
  { re: /(شو|ايش|وش)\s*(بتعملي|بتسوي|بتقدري تعملي|بتعرفي تعملي|بتعرفي)|كيف بتساعديني|شو بتقدري|what can you do/i,
    say: () => ["بجاوبك عن أي إشي بخص كمباوند شاليهات Giving: وحدات شاليه ڤيلا، المرافق، الموقع، التمويل والتملك 😊", "وبقدر أحجزلك زيارة للكمباوند من هون بدون ما تطلع من المحادثة."] },
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
const NAME_LEAD = /^(?:(?:انا|أنا|معك|معاك|معكي|هون|هنا)\s+)?(?:اسمي|إسمي|اسمي هو|my name is|i'?m|name)?\s*/i;
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

/**
 * `trust`: the classifier's probability above which its answer wins over plain search;
 * `offAt` / `chatAt`: above which a message is taken as off-topic / small talk.
 */
export function createBrain(kb, { phone, starters, chalets = [], labels = [], trust = 0.5, offAt = 0.6, chatAt = 0.85 }) {
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
  // Offering a person: Layan takes the visitor's name and number herself (the call request).
  const contact = "بقدر أسجّلك طلب اتصال من فريق المبيعات";
  const phoneLine = `رقم فريق المبيعات: ${phone} 📱`;

  const offers = new Map();
  /** An offered topic's question label and spoken name, from the start of its question. */
  function offerOf(prefix) {
    if (!offers.has(prefix)) {
      const h = kb.search(prefix, 10).find((x) => x.d.q && label(x.d.q).startsWith(prefix));
      offers.set(prefix, h?.d.topic ? { q: label(h.d.q), topic: h.d.topic } : null);
    }
    return offers.get(prefix);
  }
  /** The next topic the visitor hasn't been told about or turned down. */
  function nextOffer(state, seen) {
    for (const p of OFFER_ORDER) {
      const o = offerOf(p);
      // Offered once and let pass: move on to the next one (never the same offer twice).
      if (o && !seen[o.q] && !(state.declined ?? []).includes(o.q) && !(state.offered ?? []).includes(o.q)) return o;
    }
    return null;
  }
  /**
   * The end of a reply, the client's way: an answer that needs the sales team gets the call
   * offer (or, once they've left a number, «رح يتواصل معك…»); then one next topic as the last
   * line; when every topic is done, one closing call offer. Returns the chips and the offer.
   */
  function tail(parts, state, seen, salesy) {
    // Every answer offers the sales team's call until the visitor has left a number (the
    // user's rule). After a «no», prices and exact figures still ask; other answers move on to
    // one next topic and keep the call as a button.
    if (!state.lead && (!state.noCall || salesy)) {
      parts.push(ASK_CALL);
      return { suggestions: [CALL_CHIP], offer: CALL };
    }
    if (salesy && state.lead) parts.push(SALES_LINE);
    const next = nextOffer(state, seen);
    if (next) {
      parts.push(pick([`بتحب أوضحلك ${next.topic}؟`, `بتحب أحكيلك عن ${next.topic}؟`]));
      noted.push(next.q);
      return { suggestions: state.lead ? [] : [CALL_CHIP], offer: next.q };
    }
    if (!state.lead && !state.noCall && !state.closed) {
      parts.push(CLOSING);
      return { suggestions: [CALL_CHIP], offer: CALL, closed: true };
    }
    return { suggestions: [], offer: null };
  }
  const SALESY = /فريق المبيعات/;
  // Asks for an amount or an exact figure (price, down payment, fees, discount…): needs the sales team.
  const EXACT = /(?:كم|قديش|اديش|أديش|بقديش|بكم|شو قيم[ةه]|قيم[ةه]|نسب[ةه])\s.*(?:دفع|قسط|سعر|رسوم|عمول|كاش|مقدم|عربون|تكلف|كلف|خصم|تمويل|سنوات|مد[ةه])|الدفع[ةه] (?:الاولى|الأولى|الاولي)|دفع[ةه] (?:اولى|أولى)|(?:رسوم|سعر|دفع|قسط|عمول|تكلف)\S*.*(?:كم|قديش|اديش|أديش|بقديش)|عربون|مقدّم|المقدم|مدة التمويل|مدة التقسيط|سعر الكاش|خصم/;
  // Topics offered during the current reply (kept in `state.offered` by reply()).
  let noted = [];
  /** The call request, or (number already left) the promise of a call. */
  function callNow(parts, state) {
    if (state.lead) {
      parts.push(`أكيد، ${SALES_LINE}`);
      return { parts, kind: "chat-ack" };
    }
    parts.push(pick(["تمام 😊 خلّيني آخذ اسمك ورقمك، وفريق المبيعات بيتواصل معك هاتفياً 👇", "أكيد 🌿 بسجّلك طلب اتصال هلأ، بس بدي اسمك ورقمك 👇"]));
    return { parts, action: "call" };
  }

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
      // Asked for an amount («كم الدفعة الأولى؟»): the wording that sends it to the sales team.
      const exact = EXACT.test(query) ? d.answers.filter((a) => SALESY.test(a)) : [];
      if (exact.length) return { body: exact[times % exact.length], own: true };
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
      parts.push("ممكن تكتبلي سؤالك بكلمات ثانية؟ وإذا بتحب، فريق المبيعات بيجاوبك على كل إشي.");
      return { parts, suggestions: [CALL_CHIP], last: { ...L, alts: [] } };
    }
    const about = hit.d.topic ?? `«${alts[0]}»`;
    const { body } = phrase(hit, L.q, 0);
    parts.push(pick([`سامحني 🙏 يمكن قصدك ${about}؟\n`, `آسفة إذا ما فهمت عليك من أول مرة 🙏 إذا قصدك ${about}:\n`]) + body);
    const rest = alts.slice(1, 3);
    parts.push(rest.length ? "وإذا قصدك إشي ثاني، اختار من هون 👇" : `وإذا لسا مش هاد، ${contact} 🌿`);
    return { parts, source: hit.d, suggestions: rest.length ? rest : [CALL_CHIP], last: { ...L, key: alts[0], score: 0, tried: [...tried, alts[0]] } };
  }

  /** A message that isn't about us, by kind (convo.mjs KINDS): its own words, then back to the compound. */
  function kindReply(kind, t, state, parts) {
    // Greeted back already (SOCIAL) and the rest is just an ok/«ليان»: it's a greeting.
    if ((kind === "chat-ack" || kind === "chat") && parts.length) kind = "chat-greet";
    const k = KINDS[kind];
    if (!k) {
      if (kind === "chat") {
        if (!parts.length) parts.push(pick(["تمام 👌", "أكيد 🌿", "حلو 😊"]));
        parts.push(pick(["شو حابب تعرف عن كمباوند شاليهات Giving؟", "إذا عندك أي سؤال عن وحدات شاليه ڤيلا أو الكمباوند، أنا هون 😊", "خذ راحتك، وأنا هون إذا احتجت إشي 🌿"]));
      } else parts.push(pick(OFF_TOPIC[0]), pick(OFF_TOPIC[1]));
      return { parts, kind: kind === "chat" ? "chat" : "off", suggestions: starters };
    }
    const [first, second] = k.say(t, { name: state.name, contact });
    // Already greeted back (SOCIAL above): no second hello.
    if (!(kind === "chat-greet" && parts.length)) parts.push(pick(first));
    if (second) parts.push(pick(second));
    return { parts, kind, suggestions: k.starters ? starters : [], state: { offer: k.offer ?? null } };
  }
  /** The classifier's reply kind when it leans that way (p ≥ min), else null. */
  const leaning = (cls, min) => {
    if (!cls) return null;
    if (cls.off >= min && cls.off >= cls.chat) return cls.offKind;
    if (cls.chat >= min) return cls.chatKind;
    return null;
  };

  // `state.seen` counts what each question has been answered with, across the whole chat.
  // Buttons are shown in the client's wording; a tap comes back as that text.
  const buttons = new Map();
  for (const q of [...labels, ...starters]) if (voice(q) !== q) buttons.set(voice(q), q);
  function reply(text, state = {}) {
    text = buttons.get(text.trim()) ?? text;
    const seen = { ...(state.seen ?? {}) };
    said = (state.said ?? []).join("\n");
    noted = [];
    const out = respond(text, state, seen);
    if (apology && out.parts?.length && !/سامحني|آسفة/.test(out.parts.join(" ")))
      out.parts[0] = pick(["آسفة على اللبس 🙏", "سامحني، هلأ فهمت عليك 🙏", "آه آسفة، قصدك هيك 🙏"]) + "\n" + out.parts[0];
    said = "";
    const name = out.state?.name ?? state.name;
    // The chalet being talked about stays in focus for a few messages («وكم سعره؟», «احجز زيارة»).
    const shown = out.card?.type === "chalet" ? out.card.id : null;
    const age = shown ? 0 : (state.chaletAge ?? 0) + 1;
    const chalet = shown ?? (state.chalet && age <= 3 && !out.card ? state.chalet : undefined);
    // The last answer (and its runners-up), for «ليش؟», «لا مش هيك» and a repeated question.
    const last = out.last === null ? undefined : out.last ?? state.last;
    const { last: _l, ...rest } = out;
    const recent = [...(state.said ?? []), ...(out.parts ?? [])].slice(-24);
    const kept = Object.fromEntries(KEEP.filter((k) => state[k] !== undefined).map((k) => [k, state[k]]));
    if (noted.length) kept.offered = [...(state.offered ?? []), ...noted];
    if (rest.parts) rest.parts = rest.parts.map(voice);
    if (rest.suggestions) rest.suggestions = rest.suggestions.map((s) => {
      const v = voice(s);
      if (v !== s) buttons.set(v, s);
      return v;
    });
    return { ...rest, state: { ...kept, ...(out.state ?? {}), seen, said: recent, ...(name && { name }), ...(chalet && { chalet, chaletAge: age }), ...(last && { last }) } };
  }

  function respond(text, state, seen) {
    // Stretched letters ("كتيييير", "طيبب", "يسلموو") read as the plain word.
    const raw = text.trim().replace(/(\p{L})\1{2,}/gu, "$1").replace(/(\p{Script=Arabic}{3,})(\p{Script=Arabic})\2(?=[\s؟?!.،,]|$)/gu, "$1$2");
    let t = raw;
    const parts = [];
    let askedHow = false;
    apology = false;

    // «سلام» / «تمام يوسف، سلام» once the chat is under way is a goodbye, not a hello.
    const midChat = !!(state.last || state.name || state.said?.length);
    if (midChat && !/سلام عليكم|السلام/.test(raw) && /(?:^|[\s،,])سلام(?:\s+يا\s+\p{L}+|\s+\p{L}+)?\s*[.!🌿👋]*$/u.test(raw) && tokens(raw).length <= 5)
      return kindReply("chat-bye", raw, state, parts);

    // 1. Small talk the visitor opened with — greet back first, like a person would.
    for (const s of SOCIAL) {
      if (has(s.re, t)) {
        if (s.id === "how") askedHow = true;
        if (!(s.id === "hi" && parts.length)) parts.push(s.say());
        t = strip(t, s.re);
      }
    }
    if (askedHow) parts[parts.length - 1] += " وانت كيفك؟";
    // They opened with a greeting: whatever small talk follows, the message is a greeting.
    const greeted = parts.length > 0;

    // Openers that only get attention ("اسمعي", "عندي سؤال"): strip them, and if nothing
    // follows, invite the question instead of searching for it.
    let opened = false;
    for (let m; (m = t.match(OPENER)) && m[0].trim(); ) { t = t.slice(m[0].length); opened = true; }
    if (opened && (ONLY_FILLER.test(t) || !tokens(t).length)) {
      parts.push(pick(["تفضّل، سمعاك 😊 شو سؤالك؟", "أكيد، اسأل اللي بدك ياه 🌿", "تكرم، كلّي آذان صاغية 😊", "أكيد، تفضّل 🌿 شو حابب تعرف؟"]));
      return { parts, kind: greeted ? "chat-greet" : "chat-ack" };
    }

    // A correction ("لا بسأل عن اسمك"): drop the "no" and answer what follows instead.
    const corrected = t.replace(CORRECTION, "");
    if (corrected !== t && tokens(corrected).length) {
      // Our last answer missed: say sorry before the right one (reply() adds it).
      apology = !!(state.last || state.said?.length);
      t = corrected;
      state = { ...state, offer: null };
    }

    // We asked their name: a short reply with no question in it is their name.
    if (state.askedName && !/[؟?]/.test(t)) {
      const name = t.replace(NAME_LEAD, "").replace(/[.!،,😊🌿]+/g, "").trim();
      const chatty = [...Object.values(CHAT), ...SOCIAL.map((x) => x.re), OPENER, /^(لا|لأ|اه|آه|ايه|إيه|نعم|اكيد|أكيد|مش|ما|بدي|في|شو|كيف)$/]
        .some((re) => new RegExp(re.source, re.flags.replace("g", "")).test(name));
      // Right after «وانت شو اسمك؟» a short reply is their name, even one that matches the site
      // («لمى» ~ «المي», «طارق» = the founder), unless it's plainly a topic word («مسبح», «الموقع»).
      const topical = ON_TOPIC.test(name) || STRONG_TOPIC.test(name);
      if (name && !chatty && name.split(/\s+/).length <= 3 && /^[\p{L}\s]+$/u.test(name) && !PERSONA.some((p) => p.re.test(t)) && !topical) {
        const first = name.split(/\s+/)[0];
        parts.push(pick([`تشرّفنا يا ${first} 🌿`, `أهلين ${first}، تشرّفت فيك 😊`, `يا هلا ${first} 🌿`]));
        parts.push(pick(["كيف بقدر أساعدك اليوم؟", "شو حابب تعرف عن كمباوند شاليهات Giving؟"]));
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
        parts.push(pick(["وإذا في إشي مش واضح، فريق المبيعات بيشرحلك كل التفاصيل 🙏", "وإذا حابب تشوف هاد كله بعينك، بحجزلك زيارة بأي وقت 😊"]));
        return { parts, source: d, suggestions: (state.last.alts ?? []).slice(0, 2) };
      }
    }

    // Questions about Layan herself.
    // An insult wins over the rest («انتي بوت غبي» is rude, not a question about bots).
    const persona = PERSONA.find((p) => p.kind === "chat-insult" && p.re.test(t)) ?? PERSONA.find((p) => p.re.test(t));
    if (persona?.contact || WANTS_CALL.test(t)) return callNow(parts, state);
    if (persona) {
      parts.push(...persona.say(contact));
      const kind = typeof persona.kind === "function" ? persona.kind(t) : persona.kind ?? "chat-persona";
      return { parts, kind, state: { askedName: !!persona.ask, offer: persona.offer ?? null } };
    }

    // 2. Short replies that only make sense against what we said last.
    const short = t.replace(/[؟?!.،,]/g, "").trim();
    let followUp = false;
    // A yes is only a yes on its own ("اه", "أكيد احكيلي", "يلا احكيلي عنها"), not "احكيلي نكتة".
    const YES = "اه|آه|ايه|إيه|اكيد|أكيد|نعم|يلا|ياريت|يا ريت|ok|okay|اوكي|اوك|بحب|بحبه|ماشي|احكيلي|احكي|تفضلي|طبعا|طبعًا|اكيد اكيد|يس|yes|sure|please|بليز|عنها|عنه|كمان|اه والله|ليش لا|ليش لأ|تمام";
    // Opening the call form takes a clear yes; «تمام», «ماشي», «اوكي» after the question are just an ok.
    const ACK = /^(?:(?:تمام|ماشي|اوكي|اوك|ok|okay|حلو|طيب)\s*)+$/i;
    if (state.offer === CALL && ACK.test(short)) state = { ...state, offer: null };
    if (state.offer === CALL && new RegExp(`^(?:(?:${YES})\\s*)+$`, "i").test(short)) return callNow(parts, state);
    if (state.offer && new RegExp(`^(?:(?:${YES})\\s*)+$`, "i").test(short))
      { t = state.offer; followUp = true; }
    else if (state.offer && /^(لا|لأ|مش هلأ|لا شكرا|خلص)/.test(short)) {
      // Turned down: never asked again; a closing «no» ends the chat kindly.
      if (state.offer === CALL && state.closed) return { parts: ["أكيد، شكراً لوقتك، ويعطيك العافية 🌿"], kind: "chat-ack", state: { noCall: true } };
      const declined = state.offer === CALL ? state.declined : [...(state.declined ?? []), state.offer];
      const now = { ...state, declined, ...(state.offer === CALL && { noCall: true }) };
      parts.push(pick(["ولا يهمك! 😊", "تمام، على راحتك 🌿"]));
      const f = tail(parts, now, seen, false);
      if (!f.offer) parts.push("إذا خطر ببالك أي سؤال ثاني أنا هون.");
      return { parts, kind: "chat-ack", suggestions: f.suggestions, state: { offer: f.offer, declined, ...(state.offer === CALL && { noCall: true }), ...(f.closed && { closed: true }) } };
    }
    // Leaving (even with a thank-you: «الله يعطيك العافية، باي») is a goodbye.
    if (/مع السلامه|مع السلامة|(?:^|\s)(?:باي|bye|byee|باي باي)(?=$|\s)|سلام عليكم وداعا|يلا سلام/i.test(short))
      return kindReply("chat-bye", t, state, parts);
    if (/شكر|ميرسي|merci|كفو|يعطي(?:ك|كي|كم) العافي[هة]|مشكور|تسلم|يسلمو|يسلموا|يسلم ايديك|thanks|thank|thx|tnx|shukran|shokran|shukraan|merci|yslamo|ysalmo/i.test(short) && tokens(t).length <= 5 && !/[؟?]/.test(t))
      return kindReply("chat-thanks", t, state, parts);
    if (/^(ه{2,}|😂|🤣|lol)/i.test(short)) return { parts: [pick(["😄 كيف بقدر أساعدك كمان؟", "😄 شو حابب تعرف كمان؟"])], kind: "chat-ack" };

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
        // «منيح» answers «كيفك؟»; after one of our answers it's just «ok, good».
        if (found.wellbeing && !state.askedHow && !greeted && state.last) { found.ack = true; found.wellbeing = false; }
        if (!found.askBack && found.wellbeing && (state.askedHow || !parts.length))
          parts.push(pick(["الحمدلله دايمًا 🌿", "يا رب دايمًا بخير 😊", "الحمدلله، يدوم الفرح 🌿"]));
        if (found.compliment) {
          parts.push(pick(["يسعدلي قلبك 😊 فعلًا المكان بستاهل!", "تسلم على هالكلام الحلو 🌿 والمكان على الطبيعة أحلى!"]));
          parts.push("بتحب نرتبلك زيارة تشوف الكمباوند بعينك؟");
          return { parts, kind: "chat-compliment", state: { offer: "كيف يمكنني حجز موعد لمعاينة الكمباوند؟" } }; // voice: key
        }
        if (!parts.length) parts.push(pick(["تمام 👌", "حلو 👌", "أكيد 🌿"]));
        parts.push(found.wellbeing || found.askBack
          ? pick(["كيف بقدر أساعدك اليوم؟ بتحب تعرف عن وحدات شاليه ڤيلا، الخدمات، ولا الموقع؟", "شو حابب تعرف عن كمباوند شاليهات Giving؟ 😊"])
          : pick(["إذا في إشي ثاني حابب تعرفه، أنا هون 😊", "في إشي ثاني بقدر أساعدك فيه؟"]));
        return { parts, kind: greeted || found.wellbeing || found.askBack ? "chat-greet" : "chat-ack", suggestions: found.wellbeing || found.askBack ? starters : [] };
      }
    }

    // Not a question about the compound (wanting to ask, off-topic, feelings, holidays...):
    // answer like a person. A strong site match on a compound word still wins.
    if (!followUp) {
      const emo = !/[\p{L}]/u.test(t) ? emojiReply(t) : null;
      if (emo) return { parts: [...parts, ...emo], kind: /[😢😭😞😔💔]/u.test(t) ? "chat-feelings" : /[😡🤬👎]/u.test(t) ? "chat-insult" : "chat-ack" };
      if (isNoise(t) && !parts.length) return kindReply("off-spam", t, state, parts);
      const c = CONVO.find((x) => x.re.test(t));
      // "حابب اعرف كثير عن التقسيط": what's left after the "I want to know" part is the question.
      const rest = c ? t.replace(c.re, " ").replace(/^\s*(عن|بخصوص|حول)\s+/, "").trim() : "";
      const restHit = rest && tokens(rest).length ? bestOf(kb.search(rest, 8)) : null;
      if (c && restHit && restHit.score >= 0.3 && ON_TOPIC.test(rest)) t = rest;
      else if (c) {
        const strong = bestOf(kb.search(t, 8));
        // «احكيلي كل شي عن المشروع» is the overview, even when one answer matches its words well.
        if (c.id === "overview" || !(ON_TOPIC.test(t) && strong?.score >= 0.45)) {
          for (const opts of c.say) parts.push(pick(opts));
          const kind = greeted && (!c.kind || c.kind === "chat-ack") ? "chat-greet" : c.kind;
          if (c.action === "call") return { ...callNow(parts.slice(0, -1), state), kind };
          if (c.sales) {
            const f = tail(parts, state, seen, true);
            return { parts, kind, suggestions: f.suggestions, state: { offer: f.offer, ...(f.closed && { closed: true }) } };
          }
          return { parts, kind, suggestions: c.starters ? starters : [], state: { offer: c.offer ?? null } };
        }
      }
    }

    // Prize/ad spam («اربح ايفون، ارسلي رقمك»): a spam reply, never a price answer.
    if (!followUp && SPAM.test(t) && !STRONG_TOPIC.test(t)) return kindReply("off-spam", t, state, parts);

    // Nothing left after the greeting: ask how we can help.
    if (ONLY_FILLER.test(t) || !tokens(t).length) {
      if (!parts.length) parts.push(pick(["أهلين فيك 😊", "يا هلا 🌿"]));
      if (!askedHow) parts.push(pick(["كيف بقدر أساعدك اليوم؟", "شو حابب تعرف عن كمباوند شاليهات Giving؟ اسألني عن أي شي 😊"]));
      return { parts, kind: "chat-greet", suggestions: askedHow ? [] : starters, state: { askedHow } };
    }

    // The classifier's reading of the message, before the hand-written rules below: a rule that
    // keys on one word («سعر», «واتس», «قرض») stands down when the classifier is sure it's
    // about something else («غير سعر الشاليه، في مصاريف تانيه؟» is about fees).
    const early = followUp ? null : kb.search(t, 8).cls;
    const sureOf = (min = 0.8) => (early && early.p >= min ? early.label : null);
    const elsewhere = (...ok) => { const l = sureOf(); return !!l && !l.startsWith("@") && !ok.includes(l); };
    const leansElsewhere = (...ok) => { const l = sureOf(0.5); return !!l && !l.startsWith("@") && !ok.includes(l); };
    if (sureOf(offAt) === "@off" && !STRONG_TOPIC.test(t) && !chaletIn(t)) return kindReply(early.kind, t, state, parts);
    // Small talk: short, or a named kind (persona, flirt, a joke…) that may come as a question.
    const chatty = (cls) => cls.kind !== "chat" ? tokens(t).length <= 12 : tokens(t).length <= 6 && !/[؟?]/.test(t);
    if (sureOf(chatAt) === "@chat" && chatty(early) && !STRONG_TOPIC.test(t)) return kindReply(early.kind, t, state, parts);

    // Clearly not about us (another city's weather, a loan, a car, a job, a link): say so kindly.
    if (!followUp && LINK.test(t) && !STRONG_TOPIC.test(t)) {
      parts.push("ما بقدر أفتح روابط من هون 🙏", pick(["بس إذا عندك سؤال عن وحدات شاليه ڤيلا أو الكمباوند، أنا جاهزة 😊", "بس اسألني عن كمباوند شاليهات Giving وبجاوبك هون 🌿"]));
      return { parts, kind: "off-spam", suggestions: starters };
    }
    if (!followUp && OFF_HINT.test(t) && !STRONG_TOPIC.test(t) && !elsewhere()) {
      const k = early && early.off >= 0.3 ? early.offKind : "off";
      return kindReply(k, t, state, parts);
    }

    // 3. Intents with a fixed, human answer.
    // One chalet by its number («شو تفاصيل A9»، «كم سعر D50»): its card, with its place on the map.
    const chalet = chaletIn(t);
    if (chalet?.id) {
      parts.push(pick([`أكيد 😊 هاي تفاصيل شاليه ڤيلا ${chalet.id}، ومكانه بالكمباوند 👇`, `هاد شاليه ڤيلا ${chalet.id} 🏡 شوف وين موقعه بالضبط 👇`, `تكرم 🌿 هاي كل تفاصيل شاليه ڤيلا ${chalet.id} 👇`]));
      return { parts, card: { type: "chalet", id: chalet.id }, suggestions: ["ما المرافق داخل الشاليه؟", "📅 احجز زيارة"] }; // voice: key
    }
    // «وكم سعره؟», «وين مكانه؟», «متاح؟» right after a chalet's card: about that chalet.
    if (!chalet && state.chalet) {
      const aspect = CHALET_ASPECT.find(([, re]) => re.test(t));
      if (aspect && (IT.test(t) || tokens(t).length <= 2)) {
        const price = aspect[0] === "price" && !state.lead;
        return { parts, card: { type: "chalet", id: state.chalet, aspect: aspect[0] }, ...(price && { state: { offer: CALL }, suggestions: [CALL_CHIP] }) };
      }
    }
    if (chalet?.unknown) {
      parts.push(`ما لقيت شاليه ڤيلا برقم ${chalet.unknown} على مخطط الكمباوند 🤔 ممكن الرقم مكتوب بشكل ثاني؟`);
      parts.push("تقدر تدوّر عليه بنفسك على الخريطة، ووحدات شاليه ڤيلا المتاحة معلّمة عليها 👇");
      return { parts, card: { type: "map" } };
    }
    // The compound map itself.
    if (!/اوصل|توصل|بوصل|اتجاهات|ادوخ|لوكيشن|النقط[هة]|الطريق|location/i.test(t) && /خريط|خارط|خارطه|مخطط|مخطك|\bmap\b|ماب|(شاليه|شاليهات|الشاليهات)\s*(ال)?فاضي|للبيع (هلا|هسا|هلأ|حاليا)|which chalets|available chalets|وين (موقع )?كل شاليه|وين الشاليهات (جوا|داخل)|شاليهات (متاح|متوفر)/i.test(t)) {
      parts.push(pick(["أكيد 🗺️ هاي خريطة الكمباوند، ووحدات شاليه ڤيلا المتاحة معلّمة عليها. كبّر واضغط على أي شاليه ڤيلا تشوف تفاصيله 👇", "تفضّل 🗺️ هاي الخريطة كاملة، اضغط على أي شاليه ڤيلا بتعرف كل إشي عنه 👇"]));
      return { parts, card: { type: "map" } };
    }
    // «متوفر/متاح» is about units unless the visitor means services («شو الخدمات المتوفرة»).
    const W = (re) => new RegExp(`(?:^|[\\s،,.!؟?])(?:${re.source})(?=$|[\\s،,.!؟?])`);
    if (!elsewhere("prices", "installments") && /سعر|اسعار|أسعار|كلف|تكلف|قديش سعر|في وحدات/.test(t) || !elsewhere("prices", "installments") && W(/بكم|بقديش|بكام|بكام ده/).test(t) || !leansElsewhere("prices", "installments", "chalet-count") && (/متوفر|متاح/.test(t) && !/خدم|مرافق|نشاط|العاب|ألعاب|رياض|مي |المي|مياه|مي$|كهربا|نت|واي ?فاي|wifi|اكل|مطعم|محل|سوبر|جول[هة]|افتراض|فيديو|زيار/.test(t))) {
      parts.push(pick(["تفاصيل الأسعار بيوضحها إلك فريق المبيعات 🙏 والتمويل من خلالنا مباشرة.", "الأسعار والوحدات المتوفرة بتختلف حسب شاليه ڤيلا وموقعه، وتفاصيلها بيوضحها إلك فريق المبيعات 🙏", "كل شاليه ڤيلا إله سعره حسب موقعه ومرحلته 🏡 والرقم الدقيق بيوضحه إلك فريق المبيعات."]));
      // «كم السعر وفي تقسيط؟»: the financing part too.
      if (/تقسيط|تمويل|اقساط|أقساط|قسط(?!ل)/.test(t) && !/من خلالنا/.test(parts.join(" "))) parts.push("والتمويل من خلالنا مباشرة، بخيارات سداد مرنة 👌");
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
      parts.push(pick(["وبهالأثناء، شوف وحدات شاليه ڤيلا المتاحة على خريطة الكمباوند تحت 👇", "وتحت خريطة الكمباوند، والوحدات المتاحة معلّمة عليها 🗺️"]));
      const f = tail(parts, state, seen, true);
      return { parts, card: { type: "map" }, suggestions: [...f.suggestions, "📅 احجز زيارة"], state: { offer: f.offer, ...(f.closed && { closed: true }) } };
    }
    // Booking happens inside the chat (the site's chat-booking.ts takes over on `action`).
    if (!elsewhere("visit", "office") && (/زياره|زيارة|موعد|احجز|أحجز|حجز|اشوف الكمباوند|أزور|ازور|نزوركم|(بدي|بدنا|ممكن|حابب|حابين)\s+(اجي|نيجي|نجي|امرق|نمرق)|نيجي العيل|عالطبيع|على الطبيع|\b(book|booking|appointment|a7jez|ahjez|maw3ed)\b/i.test(t) || /معاين/.test(t)) && !/فيديو|افتراض|اونلاين|أونلاين|online|video|كول/i.test(t)) {
      parts.push(pick(["بنتشرّف فيك! 😍 بحجزلك الزيارة من هون، بدون ما تطلع من المحادثة.", "أكيد! 😍 خلّيني أحجزلك زيارة هون بأقل من دقيقة.", "يا هلا! 😍 الزيارة ببلاش وبدون التزام، خلّيني أحجزلك إياها هون."]));
      return { parts, action: "book" };
    }
    if (!elsewhere() && /رقم|تلفون|تلفونات|هاتف|اتصل|يتصل|يرن|واتس|whats|تواصل|موبايل|جوال/i.test(t) && !/رقم (الشاليه|شاليه)/.test(t)) {
      parts.push(`أكيد 🌿 ${phoneLine}`);
      return { parts, suggestions: state.lead ? [] : [CALL_CHIP] };
    }

    // Internet / Wi-Fi / fibre: always the internet answer (yes, it's available), then the rest
    // of a mixed question («شو وضع الانترنت والكهربا»).
    if (!followUp && NET.test(t)) {
      const hit = byLabel(INTERNET);
      if (hit) {
        const key = label(hit.d.q);
        const times = seen[key] ?? 0;
        seen[key] = times + 1;
        parts.push(phrase(hit, t, times).body);
        const rest = t.replace(new RegExp(NET.source, "gi"), " ").replace(/(?:^|\s)(?:و|او|أو|خدم[ةه]|خمة|خدمات|[مويت]?[تي]?توفر[ةه]?|متاح[ةه]?|موجود[ةه]?|في|فيه|هل|شو|وضع|كيف|عندكم|قوي|سريع|بالشاليه|بالكمباوند|الشاليه|الكمباوند)(?=[\s؟?]|$)/g, " ").replace(/[؟?]/g, " ").trim();
        // Only a real second topic («والكهربا»), never leftovers.
        const other = tokens(rest).length ? bestOf(kb.search(rest, 6)) : null;
        if (other && other.score >= 0.35 && other.d !== hit.d && other.d.q) parts.push(pick(["وبالنسبة للشق الثاني:\n", "وكمان:\n"]) + phrase(other, rest, 0).body);
        const f = tail(parts, state, seen, false);
        return { parts, source: hit.d, suggestions: f.suggestions, state: { offer: f.offer, ...(f.closed && { closed: true }) }, last: remember(t, hit, [hit]) };
      }
    }

    // 4. Two questions in one message ("كم المساحة وفي جاكوزي؟"): answer each, in order.
    // Only parts that ask something count («طيب، كم غرفة؟», «عندي دخل محدود، في تقسيط؟» are one question).
    const ASKS = /[؟?]|(?:^|\s)(?:شو|كم|في|فيه|هل|وين|متى|امتى|كيف|قديش|بكم|ايش|إيش|وش|ليش|مين|بقدر|ممكن|فين|ازاي|إيه)(?=\s|$)/;
    const asked = splitQuestions(t).filter((q) => ASKS.test(q));
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
        const f = tail(parts, state, seen, SALESY.test(parts.join("\n")));
        return { parts, source: found[0].top.d, suggestions: f.suggestions, state: { offer: f.offer, ...(f.closed && { closed: true }) } };
      }
    }

    // 5. Look it up.
    const hits = kb.search(t, 8);
    let top = bestOf(hits);

    // The trained classifier (lib/classify.mjs), when it's sure: off-topic, small talk, or the answer.
    const cls = hits.cls;
    if (cls && !followUp) {
      if (cls.label === "@off" && cls.p >= offAt && !STRONG_TOPIC.test(t)) return kindReply(cls.kind, t, state, parts);
      if (cls.label === "@chat" && cls.p >= chatAt && (cls.kind !== "chat" ? tokens(t).length <= 12 : tokens(t).length <= 4) && !STRONG_TOPIC.test(t)) return kindReply(cls.kind, t, state, parts);
      if (!cls.label.startsWith("@") && cls.labels.length && cls.p >= trust && (!top?.d.q || !cls.labels.includes(labelOf(top.d.q)))) {
        const sure = hits.find((h) => h.d.q && cls.labels.includes(labelOf(h.d.q))) ?? byLabel(cls.labels[0]);
        if (sure) top = { ...sure, score: Math.max(sure.score, 0.3) };
      }
    }

    // Score bands (lib/core.mjs, checked with tools/eval.mjs): unrelated questions land
    // around 0.15, real matches from ~0.28. In between, ask instead of guessing.
    const sug = [...new Set(hits.filter((h) => h.d.q).map((h) => label(h.d.q)))];
    // A full English sentence that matched nothing well: answer in English.
    const latin = (t.match(/[a-z]/gi) ?? []).length, arabic = (t.match(/[\u0600-\u06FF]/g) ?? []).length;
    // Arabizi («2addesh el shalih», «shu 3andkom») is Arabic: the search already reads it.
    const arabizi = /[a-z][2375][a-z]|(?:^|\s)[2375][a-z]|(?:^|\s)(?:shu|sho|bdi|baddi|3and\w*|2add?esh|kam|fi|feh|wen|wein|ya3ni|el|lal|mesh|msh)(?=\s|$)/i.test(t);
    const english = latin > 12 && latin > arabic * 2 && t.trim().split(/\s+/).length >= 4 && !arabizi;
    if (!top || top.score < 0.18 || (english && top.score < 0.4)) {
      // About the compound but not on the site: honest, and the team. Anything else: off topic.
      if (!english && !ON_TOPIC.test(t)) return kindReply(leaning(cls, 0.35) ?? "off", t, state, parts);
      const [first, second] = english ? ENGLISH : UNKNOWN;
      parts.push(pick(first), pick(second));
      if (english) return { parts, suggestions: starters };
      const f = tail(parts, state, seen, true);
      return { parts, suggestions: [...f.suggestions, ...starters.slice(0, 2)], state: { offer: f.offer } };
    }
    if (top.score < 0.26 && !followUp && !ON_TOPIC.test(t) && !STRONG_TOPIC.test(t)) {
      // Unsure and nothing in it is about us: a short message is small talk, a longer one off-topic.
      const k = leaning(cls, 0.35);
      if (k) return kindReply(k, t, state, parts);
      return kindReply(tokens(t).length <= 2 && !/[؟?]/.test(t) ? "chat" : "off", t, state, parts);
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
        const f = tail(parts, state, seen, SALESY.test(parts.join("\n")));
        return { parts, source: top.d, suggestions: f.suggestions, state: { offer: f.offer, ...(f.closed && { closed: true }) }, last: remember(t, top, hits) };
      }
      parts.push(pick([`قصدك تسأل عن ${top.d.topic} ولا عن ${rival.d.topic}؟ 🤔`, `بس لأتأكد 🙏 بتسأل عن ${top.d.topic} ولا ${rival.d.topic}؟`]));
      return { parts, suggestions: [label(top.d.q), label(rival.d.q)], last: null };
    }

    // "How do I book a viewing?": book it right here instead of explaining how.
    if (top.d.q?.startsWith("كيف يمكنني حجز موعد لمعاينة") && !/فيديو|افتراض|اونلاين|online|video|كول/i.test(t)) { // voice: key
      parts.push(pick(["بنتشرّف فيك! 😍 بحجزلك الزيارة من هون، بدون ما تطلع من المحادثة.", "أكيد! 😍 خلّيني أحجزلك زيارة هون بأقل من دقيقة.", "يا هلا! 😍 الزيارة ببلاش وبدون التزام، خلّيني أحجزلك إياها هون."]));
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

    const f = tail(parts, state, seen, SALESY.test(body) || EXACT.test(t));
    const related = [...new Set(hits.filter((h) => h.d !== top.d && h.d.q && h.d.kind !== "page").map((h) => label(h.d.q)))]
      .filter((q) => q !== f.offer && q !== label(top.d.q ?? "")).slice(0, 2);
    const suggestions = f.suggestions.length ? [...f.suggestions, ...related.slice(0, 1)] : related;
    return { parts, source: top.d, suggestions, state: { offer: f.offer, ...(f.closed && { closed: true }) }, last: remember(t, top, hits) };
  }

  return { reply };
}
