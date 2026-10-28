// Search over the knowledge base, shared by the build (Node) and the chat (browser).
// Two signals: character-trigram TF-IDF (spelling, prefixes, exact names) and Model2Vec
// meaning (embed.mjs) against each doc's question, phrasings and text.
import { cosine, unpackVec } from "./embed.mjs";

/* ---------- Arabic normalisation ---------- */
const STOP = new Set(
  "في من على الى إلى عن ما ماذا هل هو هي هذا هذه ذلك التي الذي كيف كم شو ايش ايه وين متى لماذا ليش او أو و يا انا انت احنا نحن عندكم عندك فيه في شي شيء بدي اريد ممكن لو مع كل بس وضع وضعو وضعه مين قديش اديش الله لله الحمد حمد بحمد الحمدلله a is"
    .split(" ").map((w) => normWord(w)),
);
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

/** Text the meaning vectors are built from: question, phrasings, and (for passages) the text. */
export const embedTexts = (d) => [d.q, ...(d.phrasings ?? []), d.kind === "faq" && d.q ? null : d.text].filter(Boolean);

/* ---------- Index ---------- */
export function createSearch(rawDocs, embedder, { semWeight = 0.4, semFloor = 0.2 } = {}) {
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

  function search(query, k = 5) {
    const words = tokens(query, true);
    const qv = words.length ? weigh(count(grams(words)), idf) : null;
    const qm = embedder ? embedder.embed(query) : null;
    return docs
      .map((d) => {
        let lex = 0;
        if (qv) {
          let dot = 0;
          for (const [g, w] of qv.v) { const x = d.vec.v.get(g); if (x) dot += w * x; }
          const exact = words.filter((w) => d.words.has(w)).length / words.length;
          lex = (dot / (qv.n * d.vec.n || 1)) * 0.75 + exact * 0.25;
        }
        // Static embeddings sit around 0.2–0.35 for unrelated text; rescale so that reads as 0.
        let sem = 0;
        if (qm) for (const v of d.mvecs) sem = Math.max(sem, cosine(qm, v));
        const semAdj = Math.max(0, (sem - semFloor) / (1 - semFloor));
        const topical = d.list && tokens(d.title).some((w) => words.includes(w)) ? 0.12 : 0;
        const score = (1 - semWeight) * lex + semWeight * semAdj + (d.kind === "faq" ? 0.04 : 0) + topical;
        return { d, score, lex, sem };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
  return { search };
}
