// Search over the knowledge base, shared by the build (Node) and the chat (browser).
// Two signals: character-trigram TF-IDF (spelling, prefixes, exact names) and Model2Vec
// meaning (embed.mjs) against each doc's question, phrasings and text.
import { cosine, unpackVec } from "./embed.mjs";

/* ---------- Arabic normalisation ---------- */
const STOP = new Set(
  "في من على الى إلى عن ما ماذا هل هو هي هذا هذه ذلك التي الذي كيف كم شو ايش ايه وين متى لماذا ليش او أو و يا انا انت احنا نحن عندكم عندك فيه في شي شيء بدي اريد ممكن لو مع كل بس وضع وضعو وضعه مين قديش اديش موجود موجوده موجودين داخل جوا الله لله الحمد حمد بحمد الحمدلله لا ولا a is"
    .split(" ").map((w) => normWord(w)),
);
// Words that only pad a question («كم غرفة موجودة داخل الشاليه»): left out of the meaning check.
const FILLER = new Set("موجود موجوده موجودين موجودات داخل جوا".split(" ").map((w) => normWord(w)));
// Dialect / everyday words → the wording the site uses.
const SYNONYMS = {
  دفع: "تقسيط سداد", سداد: "تقسيط", اقساط: "تقسيط", قسط: "تقسيط", تمويل: "تقسيط سداد", بنك: "تقسيط سداد",
  وين: "يقع موقع", مكان: "يقع موقع", عنوان: "موقع", بعيد: "دقيقه كم مسافه", مسافه: "دقيقه كم",
  استلام: "تسليم", جاهز: "تسليم جاهزه", مسبح: "مسبح حوض سباحه", بركه: "مسبح", امان: "امن حراسه",
  حمايه: "امن حراسه", كهربا: "كهرباء طاقه", مي: "مياه", ماء: "مياه", سند: "قوشان سند ملكيه", طابو: "قوشان",
  مساحه: "م² مساحه", غرف: "غرفه نوم", زياره: "زياره موعد مكتب", رقم: "تواصل هاتف", تلفون: "تواصل هاتف",
  مطور: "شركه تطوير", شركه: "شركه تطوير", عمان: "عمان دقيقه",
  دفعات: "تقسيط سداد", دفعه: "تقسيط سداد", قروض: "تقسيط سداد", قرض: "تقسيط سداد", مفتاح: "تسليم استلام",
  مطاعم: "كافيه سوبر ماركت", مطعم: "كافيه سوبر ماركت", اكل: "كافيه سوبر ماركت", اطفال: "اطفال ركن",
  // Everyday Jordanian words and spellings.
  ثمن: "سعر اسعار", حق: "سعر", سوبرماركت: "سوبر ماركت", ماركت: "سوبر ماركت", دكان: "سوبر ماركت", بقاله: "سوبر ماركت",
  يفوت: "دخول يدخل", بفوت: "دخول يدخل", فوت: "دخول", يدخل: "دخول", منطقه: "يقع موقع", حي: "يقع موقع",
  جايه: "قادمه مستقبليه", الجايه: "قادمه مستقبليه", جاي: "قادمه", مستقبل: "قادمه مستقبليه",
  مميزات: "يميزه", ميزه: "يميزه", بيميزكم: "يميزه", ولاد: "اطفال", اولاد: "اطفال", صغار: "اطفال", بسكليت: "دراجات",
  مكيف: "تكييف", مكيفات: "تكييف", تدفيه: "تدفئه", شوفاج: "تدفئه", عفش: "اثاث مفروش", كلب: "حيوانات", قطه: "حيوانات",
  جيم: "نادي رياضي", رياضه: "رياضي", دكتور: "عياده", مدرسه: "مدارس", جامع: "مسجد مصلى", نت: "انترنت",
  نشوي: "شواء", شوي: "شواء", مشاوي: "شواء", منقل: "شواء", لحمه: "شواء", اسكن: "تسليم جاهز", سكن: "تسليم جاهز",
  اوصل: "يقع موقع طريق", نوصل: "يقع موقع طريق", بوصل: "يقع موقع طريق", يوصل: "يقع موقع طريق", وصول: "يقع موقع طريق",
  لوكيشن: "يقع موقع", موقعكم: "يقع موقع", خريطه: "يقع موقع", اجيكم: "يقع موقع زياره", نجيكم: "يقع موقع زياره",
  نسكن: "تسليم جاهز", اضمن: "تاجير", ضمان: "تاجير", اضمنه: "تاجير", اجره: "تاجير", شحن: "شحن مركبات",
};
function normWord(w) {
  return w
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .toLowerCase()
    .replace(/^(وال|بال|فال|كال|لل|ال)(?=..)/, "");
}
export function tokens(text, expand = false) {
  const out = [];
  for (const raw of text.split(/[^\p{L}\p{N}²]+/u)) {
    const w = normWord(raw);
    if (w.length < 2 || STOP.has(w)) continue;
    out.push(w);
    if (expand && SYNONYMS[w]) out.push(...SYNONYMS[w].split(" ").map(normWord));
  }
  return out;
}
const grams = (words) => {
  const g = [];
  for (const w of words) {
    const p = ` ${w} `;
    if (p.length <= 4) g.push(p);
    for (let i = 0; i + 3 <= p.length; i++) g.push(p.slice(i, i + 3));
  }
  return g;
};
function count(arr) { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) ?? 0) + 1); return m; }
function weigh(tf, idf) {
  const v = new Map(); let n = 0;
  for (const [g, c] of tf) { const w = (1 + Math.log(c)) * idf(g); v.set(g, w); n += w * w; }
  return { v, n: Math.sqrt(n) };
}

/** Arabizi and English words people mix in → Arabic, for search only. */
const ARABIZI = Object.fromEntries(
  Object.entries({
    شو: "shu sho shou eish esh ish what",
    كيف: "kef kif keef kaif kifak kefak how",
    وين: "wein wen wain where",
    كم: "kam kaam how-much",
    في: "fi fe fee",
    عندكم: "3ndkom 3andkom 3indkom 3ndko 3andko",
    هو: "howe huwe howa",
    هاد: "had hada hadi this",
    ال: "el al",
    بدي: "bdi biddi badi",
    سعر: "si3r sa3r s3r se3r sa3ro si3ro price prices cost",
    تقسيط: "ta2seet taqseet installment installments",
    مسبح: "masba7 masbah pool",
    غرفه: "ghorfeh ghorfe ghorfa ghuraf room rooms bedroom bedrooms",
    حمام: "7ammam hammam bathroom bathrooms",
    شاليه: "shalieh shaleh chalet chalets",
    كمباوند: "compound kombaound",
    موقع: "location ma7al",
    فريق: "team",
    ادار: "manage management ydeer",
    الجو: "weather jaw",
    "طاقه شمسيه": "solar",
    كهرباء: "electricity kahraba",
    مياه: "water mayy",
    قوشان: "deed title ownership",
    ملكيه: "ownership",
    تسليم: "handover delivery",
    زياره: "visit",
    مسجد: "mosque masjed",
    امن: "security",
    حديقه: "garden park",
  }).flatMap(([ar, en]) => en.split(" ").map((w) => [w, ar])),
);

/** Levenshtein distance, giving up (returns max + 1) once it is past `max`. */
function editDistance(a, b, max) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Text the meaning vectors are built from: question, phrasings, and (for passages) the text. */
export const embedTexts = (d) => [d.q, ...(d.phrasings ?? []), d.kind === "faq" && d.q ? null : d.text].filter(Boolean);

/* ---------- Index ---------- */
/** An FAQ doc's question as shown to people (topic docs carry extra words after the "؟"). */
export const labelOf = (q) => (q.includes("؟") ? q.split("؟")[0] + "؟" : q);

/**
 * `classifier` (lib/classify.mjs, trained by tools/train-classifier.mjs): which FAQ answer a
 * message means, as probabilities; each doc's probability is added to its score (× clsWeight).
 * Results carry `.cls`: the classifier's own reading ({ label, p, off, chat }).
 */
export function createSearch(rawDocs, embedder, { semWeight = 0.3, semFloor = 0.2, classifier = null, clsWeight = 0.5 } = {}) {
  const docs = rawDocs.map((d) => {
    // Questions and phrasings count three times: they are how people actually ask.
    const asked = [d.q, ...(d.phrasings ?? [])].filter(Boolean).join(" ");
    const words = d.q ? [...tokens(asked), ...tokens(asked), ...tokens(asked), ...tokens(d.text)] : tokens(`${d.title} ${d.text}`);
    return { ...d, tf: count(grams(words)), words: new Set(words), mvecs: (d.vecs ?? []).map(unpackVec) };
  });
  const df = new Map();
  for (const d of docs) for (const g of d.tf.keys()) df.set(g, (df.get(g) ?? 0) + 1);
  const idf = (g) => Math.log((docs.length + 1) / ((df.get(g) ?? 0) + 1)) + 1;
  for (const d of docs) d.vec = weigh(d.tf, idf);

  // Word-level document frequency: rare words ("غرفه") say more than common ones ("شاليه").
  const wdf = new Map();
  for (const d of docs) for (const w of d.words) wdf.set(w, (wdf.get(w) ?? 0) + 1);
  const widf = (w) => Math.log((docs.length + 1) / ((wdf.get(w) ?? 0) + 1)) + 1;

  // Typo fixing: a word the site never uses is matched to the closest word it does use
  // (one letter off; two for long words), e.g. «كمباونر» → «كمباوند».
  const known = [...wdf.keys()];
  const fixes = new Map();
  function fixWord(w) {
    if (wdf.has(w) || w.length < 5 || /[^\p{Script=Arabic}]/u.test(w)) return w;
    if (fixes.has(w)) return fixes.get(w);
    const max = w.length >= 7 ? 2 : 1;
    let best = w, bestD = max + 1, bestF = 0;
    for (const c of known) {
      if (Math.abs(c.length - w.length) > max) continue;
      const dist = editDistance(w, c, max);
      const f = wdf.get(c);
      if (dist < bestD || (dist === bestD && f > bestF)) { best = c; bestD = dist; bestF = f; }
    }
    const out = bestD <= max ? best : w;
    fixes.set(w, out);
    return out;
  }

  /** The query as the models read it: Arabizi → Arabic, typos → the site's spelling, filler out. */
  function prepare(rawQuery) {
    // Arabizi ("3ndkom", "shu", "si3r") → Arabic, then misspelt words → the site's spelling,
    // in the query itself so the meaning model sees them fixed too.
    const query = rawQuery.replace(/[a-z0-9']+/gi, (w) => ARABIZI[w.toLowerCase()] ?? w).replace(/[\p{L}\p{N}²]+/gu, (raw) => {
      const w = normWord(raw);
      if (w.length < 5 || STOP.has(w)) return raw;
      const f = fixWord(w);
      return f === w ? raw : f;
    });
    // The meaning model averages every word, so filler («موجوده», «داخل») is left out.
    const meant = query.split(/\s+/).filter((raw) => !FILLER.has(normWord(raw.replace(/[^\p{L}\p{N}²]/gu, "")))).join(" ");
    return { query, meant: meant || query };
  }

  // Each FAQ doc's class in the classifier.
  const clsOf = classifier ? new Map(classifier.classes.map((c, i) => [c, i])) : null;
  for (const d of docs) d.cls = classifier && d.q ? classifier.docs[labelOf(d.q)] ?? -1 : -1;
  // Each class's FAQ questions (two FAQ docs can share an answer, hence a class).
  const labelsOf = classifier ? classifier.classes.map((_, i) => Object.keys(classifier.docs).filter((l) => classifier.docs[l] === i)) : null;

  function search(rawQuery, k = 5) {
    const { query, meant } = prepare(rawQuery);
    const words = tokens(query, true);
    const qv = words.length ? weigh(count(grams(words)), idf) : null;
    const qm = embedder ? embedder.embed(meant) : null;
    const probs = classifier ? classifier.predict(meant) : null;
    const asked = tokens(query);
    const askedW = asked.reduce((s, w) => s + widf(w), 0);
    const hits = docs
      .map((d) => {
        let lex = 0;
        if (qv) {
          let dot = 0;
          for (const [g, w] of qv.v) { const x = d.vec.v.get(g); if (x) dot += w * x; }
          // Share of the visitor's words (weighted by how telling each one is) this doc uses.
          const exact = askedW
            ? asked.filter((w) => d.words.has(w)).reduce((s, w) => s + widf(w), 0) / askedW
            : words.filter((w) => d.words.has(w)).length / words.length;
          lex = (dot / (qv.n * d.vec.n || 1)) * 0.75 + exact * 0.25;
        }
        // Static embeddings sit around 0.2–0.35 for unrelated text; rescale so that reads as 0.
        let sem = 0;
        if (qm) for (const v of d.mvecs) sem = Math.max(sem, cosine(qm, v));
        const semAdj = Math.max(0, (sem - semFloor) / (1 - semFloor));
        const topical = d.list && tokens(d.title).some((w) => words.includes(w)) ? 0.12 : 0;
        const p = probs && d.cls >= 0 ? probs[d.cls] : 0;
        const score = (1 - semWeight) * lex + semWeight * semAdj + (d.kind === "faq" ? 0.04 : 0) + topical + clsWeight * p;
        return { d, score, lex, sem, p };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
    if (probs) {
      let best = 0;
      for (let i = 1; i < probs.length; i++) if (probs[i] > probs[best]) best = i;
      hits.cls = { label: classifier.classes[best], labels: labelsOf[best], p: probs[best], off: probs[clsOf.get("@off")] ?? 0, chat: probs[clsOf.get("@chat")] ?? 0 };
    }
    return hits;
  }
  return { search, prepare };
}
