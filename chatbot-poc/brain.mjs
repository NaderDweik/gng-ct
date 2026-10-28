// Offline conversation engine: small talk in Jordanian Arabic, then an answer from the
// knowledge base, phrased like a person from the sales team would say it. Replies come
// back as `parts`, each shown as its own chat bubble. `state` round-trips through the
// client so follow-ups like "اه أكيد" or "تمام" make sense.
import { tokens } from "./lib/core.mjs";

// Topic docs carry extra search words after the "؟"; show people only the question.
const label = (q) => (q.includes("؟") ? q.split("؟")[0] + "؟" : q);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const has = (re, t) => re.test(t);

const SOCIAL = [
  { id: "salam", re: /(ال)?سلام عليكم|^سلام\b|^السلام/, say: () => pick(["وعليكم السلام ورحمة الله وبركاته 🌿 يا هلا فيك!", "وعليكم السلام، أهلين وسهلين 😊"]) },
  { id: "morning", re: /صباح (ال)?(خير|نور|ورد|فل)/, say: () => pick(["صباح النور والسرور ☀️", "صباح الورد! ☀️ أهلين فيك"]) },
  { id: "evening", re: /مساء (ال)?(خير|نور|ورد|فل)/, say: () => pick(["مساء النور 🌙 أهلين فيك", "مساء الورد والياسمين 🌙"]) },
  { id: "hi", re: /^(مرحبا|مرحبتين|مرحبًا|اهلين|أهلين|اهلا|أهلا|هلا|هاي|هلو|hi|hello|hey)/i, say: () => pick(["أهلين وسهلين! 😊", "هلا والله، نوّرت 🌿", "مرحبتين! يا هلا فيك 👋"]) },
  { id: "how", re: /كيفك|كيف حالك|كيف الحال|شو اخبارك|شو أخبارك|شلونك|كيفكم|كيف الصحة/, say: () => pick(["الحمدلله تمام، تسلم على السؤال 🙏", "بخير الحمدلله، الله يسلمك 🌿"]) },
];

const ONLY_FILLER = /^[\s؟?!.,،😊🙏👋🌿]*$/;
// Attention-getters and "I have a question" lead-ins, with common spellings (سؤال/سوال).
const OPENER = /^[\s،,.!]*(?:(?:يا\s*)?ليان|اسمعي(?:ني)?|اسمع(?:ني)?|لو سمحت(?:ي)?|من فضلك|ممكن\s+(?:سؤال|سوال|اسال|اسأل|أسأل|استفسر)|عندي\s+(?:سؤال|سوال|سؤالين|استفسار|كم سؤال)|بدي\s+(?:اسالك|اسألك|أسألك|اسال|اسأل|أسأل|استفسر)|سؤال|سوال|استفسار|ساعديني|ساعدني|بدي مساعد[ةه]|محتاج مساعد[ةه])(?=[\s،,.:!؟?]|$)[\s،,.:!]*/;
// Small talk that carries no question. Each kind is stripped from the message; if nothing
// meaningful is left, Layan answers the small talk instead of searching the site.
const CHAT = {
  askBack: /(?:^|\s)و?(?:انت|انتي|إنت|إنتي|حضرتك)(?:\s+(?:كيفك|كيف حالك|كيفك انتي|شو اخبارك))?(?=[\s؟?!.،,]|$)|و?(?:كيفك|شو اخبارك) (?:انت|انتي|إنتي)/g,
  wellbeing: /الحمد\s*[اﷲ]?\s*ل?لل?ه|الحمدلل?ه|نشكر الله|بخير|منيح(?:ه|ة)?|كويس(?:ه|ة)?|ماشي الحال|زي الفل|تمام التمام|الله يسلم(?:ك|كي|ج)|الله يخلي(?:ك|كي)|يخلي(?:ك|كي)|\b(?:fine|good|great)\b/gi,
  compliment: /حلو(?:ه|ة)?|رائع(?:ه|ة)?|ممتاز(?:ه|ة)?|جميل(?:ه|ة)?|روع(?:ه|ة)|واو+|يا سلام|ما شاء الله|ماشاءالله|خرافي|بجنن|\b(?:wow|nice|amazing|cool)\b/gi,
  ack: /(?:^|\s)(?:طيب|اوكي|أوكي|اوك|ok|okay|ماشي|تمام|فهمت|واضح|ابشر|أبشر|ايوه|ايوا|اه|آه|اوكيه|زين|كثير|جدا|جداً|والله)(?=[\s؟?!.،,]|$)/gi,
};
const strip = (t, re) => t.replace(new RegExp(re.source, re.flags.replace("^", "") + "g"), " ").replace(/^[\s,،.!؟?]+/, "");

export function createBrain(kb, { phone, starters }) {
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
    if (d.answers?.length) return { body: d.answers[times % d.answers.length], own: true };
    const body = answerFrom(top, query);
    return times ? { body: retell(d, body), own: true } : { body };
  }

  // `state.seen` counts what each question has been answered with, across the whole chat.
  function reply(text, state = {}) {
    const seen = { ...(state.seen ?? {}) };
    const out = respond(text, state, seen);
    return { ...out, state: { ...(out.state ?? {}), seen } };
  }

  function respond(text, state, seen) {
    const raw = text.trim();
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

    // 2. Short replies that only make sense against what we said last.
    const short = t.replace(/[؟?!.،,]/g, "").trim();
    let followUp = false;
    if (state.offer && /^(اه|آه|ايه|إيه|اكيد|أكيد|نعم|يلا|ياريت|يا ريت|ok|اوكي|بحب|ماشي|احكيلي|احكي)/i.test(short))
      { t = state.offer; followUp = true; }
    else if (state.offer && /^(لا|لأ|مش هلأ|لا شكرا|خلص)/.test(short))
      return { parts: [pick(["ولا يهمك! 😊", "تمام، على راحتك 🌿"]), "إذا خطر ببالك أي سؤال ثاني أنا هون."] };
    if (/شكر|يعطيك العافيه|يعطيك العافية|مشكور|تسلم|يسلمو|يسلموا|يسلم ايديك|thanks|thank/i.test(short) && tokens(t).length <= 3)
      return { parts: [pick(["العفو، هذا واجبنا 🌿", "ولو! تكرم 🙏", "على الرحب والسعة 😊", "الله يعافيك 🌿"]), pick(["إذا في أي سؤال ثاني أنا موجودة.", "وإذا حاب تشوف الكمباوند على الطبيعة، بنتشرّف بزيارتك بأي وقت."])] };
    if (/مع السلامه|مع السلامة|باي|bye|سلام عليكم وداعا|يلا سلام/i.test(short))
      return { parts: ["بأمان الله 👋 نوّرتنا، ونتشرّف بزيارتك للكمباوند بأي وقت!"] };
    if (/^(ه{2,}|😂|🤣|lol)/i.test(short)) return { parts: ["😄 كيف بقدر أساعدك كمان؟"] };
    if (/(انت|إنت|انتي|إنتي) (مين|شو|بوت|روبوت|انسان|إنسان|حقيقي)|مين معي|مين انت|مين حضرتك/.test(short))
      return { parts: ["أنا المساعدة الرقمية لروح العطاء 😊 مش إنسانة، بس بعرف كل شي موجود على موقعنا عن الشاليهات والكمباوند.", `وإذا حاب تحكي مع حدا من الفريق، ${contact}.`], suggestions: starters };

    // Small talk with no question in it ("الحمد الله", "وانتي؟", "حلو كثير", "طيب"): reply like
    // a person would and move the conversation on; never search the site for it.
    if (!followUp) {
      const found = {};
      let rest = t;
      for (const [kind, re] of Object.entries(CHAT)) rest = rest.replace(re, () => ((found[kind] = true), " "));
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

    // Nothing left after the greeting: ask how we can help.
    if (ONLY_FILLER.test(t) || !tokens(t).length) {
      if (!parts.length) parts.push(pick(["أهلين فيك 😊", "يا هلا 🌿"]));
      if (!askedHow) parts.push(pick(["كيف بقدر أساعدك اليوم؟", "شو حابب تعرف عن روح العطاء؟ اسألني عن أي شي 😊"]));
      return { parts, suggestions: askedHow ? [] : starters, state: { askedHow } };
    }

    // 3. Intents with a fixed, human answer.
    if (/سعر|اسعار|أسعار|كلف|تكلف|بكم|بقديش|قديش سعر|متوفر|متاح|في وحدات/.test(t)) {
      parts.push(pick(["بالنسبة للأسعار والوحدات المتاحة، بتتغيّر باستمرار، فبفضّل يعطيك إياها فريق المبيعات بشكل دقيق 🙏", "الأسعار والوحدات المتوفرة بتختلف حسب الشاليه والموقع، وفريق المبيعات بعطيك آخر التفاصيل أول بأول 🙏"]));
      parts.push(`${contact}، وكمان في تقسيط بقسط شهري 1% بس وبدون فوائد 👌`);
      return { parts, suggestions: ["هل تتوفر خيارات تقسيط لشراء الشاليه؟", "بدي أحجز زيارة"] };
    }
    if (/زياره|زيارة|موعد|احجز|أحجز|اشوف الكمباوند|أزور|ازور/.test(t)) {
      parts.push("بنتشرّف فيك! 😍 تقدر تحجز زيارة من صفحة «احجز زيارتك» على الموقع، تختار اليوم والساعة وبنأكدلك الموعد على واتساب.");
      parts.push(`أوقات الدوام من السبت للخميس، 10 الصبح لـ 6 المسا. وإذا بتحب أسرع، ${contact}.`);
      return { parts };
    }
    if (/رقم|تلفون|هاتف|اتصل|واتس|تواصل/.test(t)) {
      parts.push(`أكيد 🌿 ${contact}، وبكونوا مبسوطين يساعدوك.`);
      return { parts };
    }

    // 4. Look it up.
    const hits = kb.search(t, 8);
    // Prefer a curated FAQ answer, then a content item, over a page passage, when close.
    const best = hits[0];
    const faq = hits.find((h) => h.d.kind === "faq");
    const item = hits.find((h) => h.d.kind === "item");
    const top = faq && faq.score >= best?.score * 0.8 ? faq : item && item.score >= best?.score * 0.8 ? item : best;

    // Score bands (lib/core.mjs, checked with tools/eval.mjs): unrelated questions land
    // around 0.15, real matches from ~0.28. In between, ask instead of guessing.
    const sug = [...new Set(hits.filter((h) => h.d.q).map((h) => label(h.d.q)))];
    if (!top || top.score < 0.18) {
      parts.push(pick(["والله ما متأكدة إني فهمت قصدك 😅", "سامحني، ما وضحت معي الفكرة تمامًا 🙏"]));
      parts.push(sug.length ? "يمكن بتقصد شي من هدول؟" : `جرّب تسألني بطريقة ثانية، أو ${contact}.`);
      return { parts, suggestions: sug.length ? sug.slice(0, 3) : starters };
    }
    if (top.score < 0.26 && top.d.q && !followUp) {
      const guess = label(top.d.q);
      const about = top.d.topic ?? `«${guess}»`;
      parts.push(pick([`بس لأتأكد إني فهمتك صح 🙏 بتسأل عن ${about}؟`, `قصدك بتسأل عن ${about}؟`]));
      return { parts, suggestions: sug.filter((q) => q !== guess).slice(0, 2), state: { offer: guess } };
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
    return { parts, source: top.d, suggestions, state: { offer: offer && r < 0.55 ? offer.q : null } };
  }

  return { reply };
}
