// Layan's trained classifier (browser + Node): which answer a message means, or "@off" (not
// about us) / "@chat" (small talk). Two views of the message, joined:
//   - meaning: the mean of its token vectors (the meaning model, with the rows training
//     fine-tuned replaced), normalised;
//   - spelling: the mean of learned vectors for its words and their 3–4 letter pieces
//     (fastText-style), so «شلاليه», «الشالية» and «شاليه» look alike, normalised;
// then a small neural network (→ hidden, ReLU → classes).
// Files from chatbot-poc/tools/train-classifier.mjs: classifier.json + classifier.bin.

/** Letters as the spelling view sees them: no diacritics, one alef / ya / ta marbuta. */
export function plain(text) {
  return text
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .replace(/(\p{L})\1{2,}/gu, "$1");
}

/** The spelling view's features: each word (without «ال») and its 3- and 4-letter pieces, hashed. */
export function pieces(text, buckets) {
  const out = [];
  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    return h % buckets;
  };
  for (let w of plain(text).split(/[^\p{L}\p{N}]+/u)) {
    if (!w) continue;
    w = w.replace(/^(وال|بال|فال|كال|لل|ال)(?=..)/, "");
    out.push(hash(`w:${w}`));
    const p = `<${w}>`;
    for (const n of [3, 4]) for (let i = 0; i + n <= p.length; i++) out.push(hash(p.slice(i, i + n)));
  }
  return out;
}

export function createClassifier(meta, buf, embedder) {
  const { classes, dim, hidden, overrides, buckets, gdim, grams: gramIds } = meta;
  const C = classes.length, IN = dim + gdim;
  let at = 0;
  const take = (Type, len) => {
    const a = new Type(buf, at, len);
    at += len * Type.BYTES_PER_ELEMENT;
    return a;
  };
  const align = () => (at = Math.ceil(at / 4) * 4);
  // Fine-tuned token rows, then the spelling vectors in use: int8 with a scale each.
  const oScale = take(Float32Array, overrides.length);
  const oRows = take(Int8Array, overrides.length * dim);
  align();
  const gScale = take(Float32Array, gramIds.length);
  const gRows = take(Int8Array, gramIds.length * gdim);
  align();
  const W1 = take(Float32Array, hidden * IN);
  const b1 = take(Float32Array, hidden);
  const W2 = take(Float32Array, C * hidden);
  const b2 = take(Float32Array, C);
  const tuned = new Map(overrides.map((id, i) => [id, i]));
  const gram = new Map(gramIds.map((id, i) => [id, i]));

  const unit = (v) => {
    let n = 0;
    for (const x of v) n += x * x;
    n = Math.sqrt(n) || 1;
    for (let j = 0; j < v.length; j++) v[j] /= n;
    return v;
  };

  function input(text) {
    const x = new Float32Array(IN);
    const m = x.subarray(0, dim);
    for (const id of embedder.tokenize(text)) {
      const i = tuned.get(id);
      if (i === undefined) {
        const r = embedder.row(id);
        for (let j = 0; j < dim; j++) m[j] += r[j];
      } else for (let j = 0; j < dim; j++) m[j] += oRows[i * dim + j] * oScale[i];
    }
    unit(m);
    const g = x.subarray(dim);
    for (const b of pieces(text, buckets)) {
      const i = gram.get(b);
      if (i !== undefined) for (let j = 0; j < gdim; j++) g[j] += gRows[i * gdim + j] * gScale[i];
    }
    unit(g);
    return x;
  }

  function predict(text) {
    const x = input(text);
    const h = new Float32Array(hidden);
    for (let i = 0; i < hidden; i++) {
      let s = b1[i];
      const off = i * IN;
      for (let j = 0; j < IN; j++) s += W1[off + j] * x[j];
      h[i] = s > 0 ? s : 0;
    }
    const z = new Float32Array(C);
    let max = -Infinity;
    for (let c = 0; c < C; c++) {
      let s = b2[c];
      const off = c * hidden;
      for (let i = 0; i < hidden; i++) s += W2[off + i] * h[i];
      z[c] = s;
      if (s > max) max = s;
    }
    let sum = 0;
    for (let c = 0; c < C; c++) sum += z[c] = Math.exp(z[c] - max);
    for (let c = 0; c < C; c++) z[c] /= sum;
    return z;
  }

  // `docs`: each FAQ question (as shown) → its class, so duplicate answers share one class.
  return { classes, docs: meta.docs, predict };
}

/** Several classifiers trained from different random starts, voting: their answers averaged. */
export function createEnsemble(members) {
  const [first] = members;
  return {
    classes: first.classes,
    docs: first.docs,
    predict(text) {
      const out = new Float32Array(first.classes.length);
      for (const m of members) {
        const p = m.predict(text);
        for (let c = 0; c < out.length; c++) out[c] += p[c] / members.length;
      }
      return out;
    },
  };
}
