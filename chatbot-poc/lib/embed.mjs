// Model2Vec sentence embeddings in plain JS (browser + Node): Unigram (SentencePiece)
// tokenizer with Viterbi segmentation, then the mean of the tokens' static vectors,
// L2-normalised. Model files come from tools/prune-model.mjs.

const PUNCT = /([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;

export function createEmbedder({ dim, tokens }, vectorsBuf) {
  const n = tokens.length;
  const scales = new Float32Array(vectorsBuf, 0, n);
  const q = new Int8Array(vectorsBuf, n * 4, n * dim);
  const vocab = new Map();
  let maxLen = 1, minScore = 0;
  tokens.forEach(([t, s], id) => {
    vocab.set(t, { id, s });
    maxLen = Math.max(maxLen, [...t].length);
    minScore = Math.min(minScore, s);
  });
  const UNK = minScore - 10;

  function normalize(text) {
    return text.normalize("NFKC").replace(PUNCT, " $1 ").replace(/\s+/g, " ").trim();
  }

  // Best-scoring split of the string into vocabulary pieces (unknown chars become -1).
  function tokenize(text) {
    const chars = [..."▁" + normalize(text).replace(/ /g, "▁")];
    const L = chars.length;
    const best = new Float64Array(L + 1).fill(-Infinity);
    const from = new Int32Array(L + 1);
    const ids = new Int32Array(L + 1);
    best[0] = 0;
    for (let i = 0; i < L; i++) {
      if (best[i] === -Infinity) continue;
      let piece = "";
      for (let j = i; j < Math.min(L, i + maxLen); j++) {
        piece += chars[j];
        const hit = vocab.get(piece);
        const sc = hit ? hit.s : j === i ? UNK : null;
        if (sc === null) continue;
        if (best[i] + sc > best[j + 1]) { best[j + 1] = best[i] + sc; from[j + 1] = i; ids[j + 1] = hit ? hit.id : -1; }
      }
    }
    const out = [];
    for (let k = L; k > 0; k = from[k]) if (ids[k] >= 0) out.push(ids[k]);
    return out.reverse();
  }

  function embed(text) {
    const v = new Float32Array(dim);
    const ids = tokenize(text);
    for (const id of ids) {
      const s = scales[id], off = id * dim;
      for (let j = 0; j < dim; j++) v[j] += q[off + j] * s;
    }
    let norm = 0;
    for (const x of v) norm += x * x;
    norm = Math.sqrt(norm) || 1;
    for (let j = 0; j < dim; j++) v[j] /= norm;
    return v;
  }

  return { embed, tokenize, dim };
}

export const cosine = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

// Compact storage for precomputed vectors (kb.json): int8 → base64.
export function packVec(v) {
  const b = new Int8Array(v.length);
  for (let i = 0; i < v.length; i++) b[i] = Math.max(-127, Math.min(127, Math.round(v[i] * 127)));
  let s = "";
  for (const x of new Uint8Array(b.buffer)) s += String.fromCharCode(x);
  return btoa(s);
}
export function unpackVec(str) {
  const bin = atob(str);
  const v = new Float32Array(bin.length);
  let norm = 0;
  for (let i = 0; i < bin.length; i++) { const x = (bin.charCodeAt(i) << 24) >> 24; v[i] = x; norm += x * x; }
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < v.length; i++) v[i] /= norm;
  return v;
}
