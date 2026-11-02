// One-off: shrink potion-multilingual-128M (Model2Vec, 500k tokens × 256, 512 MB) to the
// tokens Arabic and English visitors use, stored as int8 (or int4) with a per-row scale.
// Optionally rotates the vectors onto their own main directions (PCA over the kept tokens) and
// keeps only the first --dims of them: means of rotated vectors keep their cosines, so search and
// the classifier see the same meaning in fewer numbers.
// Input: chatbot-poc/.cache/{tokenizer.json, model.safetensors} from
//   https://huggingface.co/minishlab/potion-multilingual-128M
// Output: public/chatbot/model/{vocab.json, vectors.bin}
// Usage: node chatbot-poc/tools/prune-model.mjs [--latin=12000] [--dims=256] [--bits=8|4]
import { readFileSync, openSync, readSync, writeFileSync, mkdirSync } from "node:fs";

const cache = new URL("../.cache/", import.meta.url);
const outDir = new URL("../../public/chatbot/model/", import.meta.url);
const arg = (name, def) => Number(process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? def);
const LATIN_KEEP = arg("latin", 12000), BITS = arg("bits", 8);

const vocab = JSON.parse(readFileSync(new URL("tokenizer.json", cache), "utf8")).model.vocab; // [token, score][]
const fd = openSync(new URL("model.safetensors", cache), "r");
const hb = Buffer.alloc(8); readSync(fd, hb, 0, 8, 0);
const headerLen = Number(hb.readBigUInt64LE(0));
const hjson = Buffer.alloc(headerLen); readSync(fd, hjson, 0, headerLen, 8);
const header = JSON.parse(hjson.toString());
const [rows, dim] = header.embeddings.shape;
const base = 8 + headerLen + header.embeddings.data_offsets[0];
const DIMS = Math.min(arg("dims", dim), dim);

const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const LATIN = /^▁?[a-z0-9]+$/i;
const PUNCT = /^▁?[\p{P}\p{S}]{1,2}$|^▁$/u;
const latin = [];
const keep = [];
vocab.forEach(([tok], id) => {
  if (id < 2) return; // [PAD], [UNK]
  if (AR.test(tok) || PUNCT.test(tok)) keep.push(id);
  else if (LATIN.test(tok)) latin.push(id);
});
latin.sort((a, b) => vocab[b][1] - vocab[a][1]);
keep.push(...latin.slice(0, LATIN_KEEP));
keep.sort((a, b) => a - b);

const n = keep.length;
const F = new Float32Array(n * dim);
const row = Buffer.alloc(dim * 4);
keep.forEach((id, i) => {
  readSync(fd, row, 0, row.length, base + id * dim * 4);
  F.set(new Float32Array(row.buffer, row.byteOffset, dim), i * dim);
});

/* PCA (uncentred, so dot products survive): eigenvectors of the rows' Gram matrix, by Jacobi. */
function topDirections(k) {
  const A = Array.from({ length: dim }, () => new Float64Array(dim));
  for (let i = 0; i < n; i++) {
    const o = i * dim;
    for (let a = 0; a < dim; a++) { const x = F[o + a]; if (x) for (let b = a; b < dim; b++) A[a][b] += x * F[o + b]; }
  }
  for (let a = 0; a < dim; a++) for (let b = 0; b < a; b++) A[a][b] = A[b][a];
  const V = Array.from({ length: dim }, (_, a) => { const r = new Float64Array(dim); r[a] = 1; return r; });
  for (let sweep = 0; sweep < 12; sweep++) {
    let off = 0;
    for (let p = 0; p < dim; p++) for (let q = p + 1; q < dim; q++) off += A[p][q] ** 2;
    if (off < 1e-18) break;
    for (let p = 0; p < dim; p++) for (let q = p + 1; q < dim; q++) {
      if (Math.abs(A[p][q]) < 1e-15) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let r = 0; r < dim; r++) { const ap = A[r][p], aq = A[r][q]; A[r][p] = c * ap - s * aq; A[r][q] = s * ap + c * aq; }
      for (let r = 0; r < dim; r++) { const ap = A[p][r], aq = A[q][r]; A[p][r] = c * ap - s * aq; A[q][r] = s * ap + c * aq; }
      for (let r = 0; r < dim; r++) { const vp = V[r][p], vq = V[r][q]; V[r][p] = c * vp - s * vq; V[r][q] = s * vp + c * vq; }
    }
  }
  const order = [...Array(dim).keys()].sort((a, b) => A[b][b] - A[a][a]);
  const total = order.reduce((s, a) => s + A[a][a], 0);
  const kept = order.slice(0, k).reduce((s, a) => s + A[a][a], 0);
  console.log(`PCA: ${k} of ${dim} directions keep ${((100 * kept) / total).toFixed(1)}% of the variance`);
  return order.slice(0, k).map((a) => Float64Array.from(V, (r) => r[a])); // k × dim
}

let out = F, D = dim;
if (DIMS < dim) {
  const P = topDirections(DIMS);
  out = new Float32Array(n * DIMS);
  for (let i = 0; i < n; i++) for (let k = 0; k < DIMS; k++) {
    let s = 0;
    const p = P[k], o = i * dim;
    for (let j = 0; j < dim; j++) s += p[j] * F[o + j];
    out[i * DIMS + k] = s;
  }
  D = DIMS;
}

// int8: one byte per number. int4: two per byte (low nibble first), values -7..7.
const top = BITS === 4 ? 7 : 127;
const scales = new Float32Array(n);
const q = new Int8Array(n * D);
for (let i = 0; i < n; i++) {
  let max = 0;
  for (let j = 0; j < D; j++) max = Math.max(max, Math.abs(out[i * D + j]));
  const s = max / top || 1;
  scales[i] = s;
  for (let j = 0; j < D; j++) q[i * D + j] = Math.round(out[i * D + j] / s);
}
let body = new Uint8Array(q.buffer);
if (BITS === 4) {
  body = new Uint8Array(Math.ceil((n * D) / 2));
  for (let k = 0; k < n * D; k++) body[k >> 1] |= (q[k] & 15) << ((k & 1) * 4);
}

mkdirSync(outDir, { recursive: true });
const bytes = scales.byteLength + body.byteLength;
writeFileSync(new URL("vocab.json", outDir), JSON.stringify({ dim: D, bits: BITS, bytes, tokens: keep.map((id) => [vocab[id][0], Math.round(vocab[id][1] * 1e4) / 1e4]) }));
writeFileSync(new URL("vectors.bin", outDir), Buffer.concat([Buffer.from(scales.buffer), Buffer.from(body)]));
console.log(`kept ${n} of ${rows} tokens (${n - Math.min(LATIN_KEEP, latin.length)} Arabic/punct + ${Math.min(LATIN_KEEP, latin.length)} Latin) × ${D} dims at ${BITS} bits: ${(bytes / 1e6).toFixed(1)} MB`);
