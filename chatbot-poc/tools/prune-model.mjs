// One-off: shrink potion-multilingual-128M (Model2Vec, 500k tokens × 256, 512 MB) to the
// tokens Arabic and English visitors use, stored as int8 with a per-row scale.
// Input: chatbot-poc/.cache/{tokenizer.json, model.safetensors} from
//   https://huggingface.co/minishlab/potion-multilingual-128M
// Output: chatbot-poc/model/{vocab.json, vectors.bin}
import { readFileSync, openSync, readSync, writeFileSync, mkdirSync } from "node:fs";

const cache = new URL("../.cache/", import.meta.url);
const outDir = new URL("../model/", import.meta.url);
const LATIN_KEEP = Number(process.argv[2]) || 12000;

const vocab = JSON.parse(readFileSync(new URL("tokenizer.json", cache), "utf8")).model.vocab; // [token, score][]
const fd = openSync(new URL("model.safetensors", cache), "r");
const hb = Buffer.alloc(8); readSync(fd, hb, 0, 8, 0);
const headerLen = Number(hb.readBigUInt64LE(0));
const hjson = Buffer.alloc(headerLen); readSync(fd, hjson, 0, headerLen, 8);
const header = JSON.parse(hjson.toString());
const [rows, dim] = header.embeddings.shape;
const base = 8 + headerLen + header.embeddings.data_offsets[0];

const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const LATIN = /^▁?[a-z0-9]+$/i;
const PUNCT = /^▁?[\p{P}\p{S}]{1,2}$|^▁$/u;
const latin = [];
const keep = [];
vocab.forEach(([tok, score], id) => {
  if (id < 2) return; // [PAD], [UNK]
  if (AR.test(tok) || PUNCT.test(tok)) keep.push(id);
  else if (LATIN.test(tok)) latin.push(id);
});
latin.sort((a, b) => vocab[b][1] - vocab[a][1]);
keep.push(...latin.slice(0, LATIN_KEEP));
keep.sort((a, b) => a - b);

const n = keep.length;
const scales = new Float32Array(n);
const q = new Int8Array(n * dim);
const row = Buffer.alloc(dim * 4);
keep.forEach((id, i) => {
  readSync(fd, row, 0, row.length, base + id * dim * 4);
  const f = new Float32Array(row.buffer, row.byteOffset, dim);
  let max = 0;
  for (const x of f) max = Math.max(max, Math.abs(x));
  const s = max / 127 || 1;
  scales[i] = s;
  for (let j = 0; j < dim; j++) q[i * dim + j] = Math.round(f[j] / s);
});

mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("vocab.json", outDir), JSON.stringify({ dim, tokens: keep.map((id) => vocab[id]) }));
writeFileSync(new URL("vectors.bin", outDir), Buffer.concat([Buffer.from(scales.buffer), Buffer.from(q.buffer)]));
console.log(`kept ${n} of ${rows} tokens (${n - LATIN_KEEP} Arabic/punct + ${Math.min(LATIN_KEEP, latin.length)} Latin), ${((n * (dim + 4)) / 1e6).toFixed(1)} MB vectors`);
