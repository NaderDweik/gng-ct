// Trains Layan's classifier (public/chatbot/lib/classify.mjs): which answer a message means, or
// "@off" / "@chat". Plain JS (no Python, no GPU), with the same tokenizer, vectors and letter
// pieces as the browser, so what is measured here is what visitors get.
//   Data: each FAQ doc's question + phrasings (kb.json), chatbot-poc/train-extra.md (written for
//   training only), the "train" 70% of questions.md, off-topic templates, and a few misspelt
//   copies of everything. Never: the "test" 30% of questions.md or questions-dev.md.
//   Model: [meaning (fine-tuned token vectors) ‖ spelling (learned letter-piece vectors)]
//          → hidden (ReLU, dropout) → classes.
//   Output: public/chatbot/model/classifier.{json,bin}
// Usage: node chatbot-poc/tools/train-classifier.mjs [--epochs=20] [--hidden=192] [--aug=3]
//        [--gdim=64] [--seed=1] [--dev]   (--dev: score chatbot-poc/questions-dev.md each epoch)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createEmbedder } from "../../public/chatbot/lib/embed.mjs";
import { createSearch, labelOf } from "../../public/chatbot/lib/core.mjs";
import { createClassifier, pieces } from "../../public/chatbot/lib/classify.mjs";
import { docTag, isTest, readQuestions } from "./questions-eval.mjs";

const here = (p) => new URL(p, import.meta.url);
const arg = (name, def) => Number(process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? def);
const EPOCHS = arg("epochs", 20), H = arg("hidden", 192), AUG = arg("aug", 3), GD = arg("gdim", 64);
const BUCKETS = 1 << 16;
const SHOW_DEV = process.argv.includes("--dev");
// --out=classifier-2 writes classifier-2.{json,bin} (ensemble members); default "classifier".
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "classifier";
let seed = arg("seed", 1);
const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const pickR = (a) => a[Math.floor(rand() * a.length)];

/* ---------- Data ---------- */
const vocab = JSON.parse(readFileSync(here("../../public/chatbot/model/vocab.json"), "utf8"));
const vbuf = readFileSync(here("../../public/chatbot/model/vectors.bin"));
const embedder = createEmbedder(vocab, vbuf.buffer.slice(vbuf.byteOffset, vbuf.byteOffset + vbuf.length));
const kb = JSON.parse(readFileSync(here("../../public/chatbot/model/kb.json"), "utf8"));
const { prepare } = createSearch(kb.docs, embedder);

// One class per answer: FAQ docs that are the same answer (same tag) share it.
const faqs = kb.docs.filter((d) => d.kind === "faq" && d.q);
const classes = [...new Set(faqs.map((d) => docTag(d))), "@off", "@chat"];
const classOf = new Map(classes.map((c, i) => [c, i]));
const docs = Object.fromEntries(faqs.map((d) => [labelOf(d.q), classOf.get(docTag(d))]));
const tagClass = (tag) => (tag === "off" ? classOf.get("@off") : tag === "chat" || tag === "persona" ? classOf.get("@chat") : classOf.get(tag));

const raw = []; // { text, c }
for (const d of faqs) for (const t of [labelOf(d.q), ...(d.phrasings ?? [])]) raw.push({ text: t, c: classOf.get(docTag(d)) });
const extra = here("../train-extra.md").pathname;
if (existsSync(extra)) for (const { q, tag } of readQuestions(extra)) { const c = tagClass(tag); if (c !== undefined) raw.push({ text: q, c }); }
for (const { q, tag } of readQuestions(here("../questions.md").pathname)) {
  if (isTest(q)) continue;
  const c = tagClass(tag);
  if (c !== undefined) raw.push({ text: q, c });
}

/* Off-topic examples from templates, so "about us / not about us" has plenty of examples. */
const OFF_T = [
  () => `${pickR(["كم سعر", "بكم", "قديش حق", "كام سعر"])} ${pickR(["الايفون", "غرام الذهب", "البنزين", "الدولار", "سياره كيا", "تذكره الطياره", "كيلو اللحمه", "البلايستيشن", "اللابتوب", "الشقه بعبدون"])}`,
  () => `${pickR(["وين", "فين", "وين في"])} ${pickR(["احسن مطعم", "صيدليه مناوبه", "محطه بنزين", "محل موبايلات", "كوفي شوب", "مول", "صالون حلاقه", "دكتور اسنان"])} ${pickR(["بعمان", "بالزرقا", "باربد", "قريب علي", "هسا"])}`,
  () => `${pickR(["شو رايك ب", "بتعرفي ", "مين "])}${pickR(["ميسي", "ترامب", "عمرو دياب", "فيروز", "رئيس امريكا", "الملكه رانيا"])}`,
  () => `${pickR(["كيف", "شو الطريقه", "علميني كيف"])} ${pickR(["اعمل كيكه", "اطبخ مقلوبه", "اتعلم انجليزي", "انحف", "اصلح الغساله", "افتح حساب بنك", "اجدد رخصتي", "انام بسرعه"])}`,
  () => `${pickR(["بدي", "ممكن", "ابي"])} ${pickR(["شغل", "وظيفه", "قرض", "نكته", "قصيده", "ترجمه لهاي الجمله", "اسم لابني", "وصفه اكل"])}`,
  () => `${pickR(["شو الطقس", "بدها تشتي", "كم درجه الحراره"])} ${pickR(["بالعقبه", "بدبي", "باسطنبول", "بلندن", "بكره"])}`,
  () => `${pickR(["مين فاز", "امتى", "شو نتيجه"])} ${pickR(["الماتش", "مباراه النشامي", "الدوري", "كاس العالم", "برشلونه"])}`,
  () => `${pickR(["شو عاصمه", "كم عدد سكان", "وين بتقع"])} ${pickR(["استراليا", "كندا", "اليابان", "البرازيل"])}`,
  () => pickR(["راسي بوجعني", "عندي امتحان بكرا", "زهقان", "مش عارف شو اعمل بحياتي", "الانترنت عندي بطيء", "جاري مزعج", "سيارتي خربت", "ابني ما بدو يدرس", "شو بتنصحيني اتابع مسلسل", "احكيلي نكته"]),
];
for (let i = 0; i < 400; i++) raw.push({ text: pickR(OFF_T)(), c: classOf.get("@off") });

/* Typo augmentation: the mistakes people make on phones. */
const SWAPS = [["ة", "ه"], ["ه", "ة"], ["ى", "ي"], ["ي", "ى"], ["أ", "ا"], ["إ", "ا"], ["آ", "ا"], ["ض", "ظ"], ["ث", "س"], ["ذ", "ز"], ["ق", "ء"], ["ؤ", "و"], ["ئ", "ي"]];
const NEAR = { ض: "صش", ص: "ضث", ث: "صق", ق: "ثف", ف: "قغ", غ: "فع", ع: "غه", ه: "عخ", خ: "هح", ح: "خج", ش: "سض", س: "شي", ي: "سب", ب: "يل", ل: "با", ا: "لت", ت: "ان", ن: "تم", م: "نك", ك: "مط", ر: "ؤل", و: "ةز", ز: "وظ", د: "جذ" };
function typo(text) {
  const words = text.split(" ");
  const n = 1 + Math.floor(rand() * 2);
  for (let k = 0; k < n; k++) {
    const i = Math.floor(rand() * words.length);
    let w = words[i];
    if (!w || w.length < 3 || !/\p{Script=Arabic}/u.test(w)) continue;
    const r = rand(), p = 1 + Math.floor(rand() * (w.length - 1));
    if (r < 0.2) w = w.slice(0, p) + w.slice(p + 1);
    else if (r < 0.35) w = w.slice(0, p - 1) + w[p] + w[p - 1] + w.slice(p + 1);
    else if (r < 0.45) w = w.slice(0, p) + w[p - 1] + w.slice(p);
    else if (r < 0.65) { const [a, b] = pickR(SWAPS); w = w.replace(a, b); }
    else if (r < 0.8) { const nb = NEAR[w[p]]; if (nb) w = w.slice(0, p) + pickR([...nb]) + w.slice(p + 1); }
    else if (r < 0.9 && i + 1 < words.length) { words[i + 1] = w + words[i + 1]; w = ""; }
    else w = w.replace(/^(ال|بال|وال)/, "");
    words[i] = w;
  }
  const out = words.filter(Boolean);
  if (out.length > 3 && rand() < 0.15) out.splice(Math.floor(rand() * out.length), 1);
  if (rand() < 0.25) out.unshift(pickR(["مرحبا", "لو سمحت", "بدي اسأل", "سؤال", "يعني", "طيب", "اهلين", "السلام عليكم", "ممكن اعرف", "استفسار"]));
  return out.join(" ");
}

const encode = (text) => { const m = prepare(text).meant; return { m, ids: embedder.tokenize(m), gs: pieces(m, BUCKETS) }; };
const T = [];
for (const r of raw) {
  T.push({ ...encode(r.text), c: r.c });
  for (let k = 0; k < AUG; k++) T.push({ ...encode(typo(r.text)), c: r.c });
}
const train = T.filter((x) => x.ids.length || x.gs.length);

/* Distillation (--teachers=a,b,c: earlier models' files, without extension): the target becomes
   half the label, half the teachers' averaged answer, so one model learns what the vote knows. */
const teacherArg = process.argv.find((a) => a.startsWith("--teachers="))?.slice(11);
if (teacherArg) {
  const teachers = teacherArg.split(",").map((f) => {
    const b = readFileSync(`${f}.bin`);
    return createClassifier(JSON.parse(readFileSync(`${f}.json`, "utf8")), b.buffer.slice(b.byteOffset, b.byteOffset + b.length), embedder);
  });
  const C0 = classes.length;
  for (const ex of train) {
    const avg = new Float32Array(C0);
    for (const t of teachers) { const p = t.predict(ex.m); for (let c = 0; c < C0; c++) avg[c] += p[c] / teachers.length; }
    ex.soft = avg;
  }
  console.log(`distilling from ${teachers.length} teachers`);
}
const devPath = here("../questions-dev.md").pathname;
const DEV = SHOW_DEV && existsSync(devPath)
  ? readQuestions(devPath).map(({ q, tag }) => ({ ...encode(q), c: tagClass(tag) })).filter((x) => x.c !== undefined)
  : [];
console.log(`classes ${classes.length} · examples ${raw.length} (+${AUG} typo copies each → ${train.length})${DEV.length ? ` · dev ${DEV.length}` : ""}`);

/* ---------- Model ---------- */
const D = embedder.dim, N = embedder.size, C = classes.length, IN = D + GD;
const base = new Float32Array(N * D);
for (let id = 0; id < N; id++) base.set(embedder.row(id), id * D);
const E = base.slice();
const G = Float32Array.from({ length: BUCKETS * GD }, () => (rand() * 2 - 1) / GD);
const xavier = (n, a, b) => Float32Array.from({ length: n }, () => (rand() * 2 - 1) * Math.sqrt(6 / (a + b)));
const W1 = xavier(H * IN, IN, H), b1 = new Float32Array(H), W2 = xavier(C * H, H, C), b2 = new Float32Array(C);
const params = [W1, b1, W2, b2];
const grads = params.map((p) => new Float32Array(p.length));
const adam = params.map((p) => ({ m: new Float32Array(p.length), v: new Float32Array(p.length) }));
const sparse = (rows, width) => ({ m: new Float32Array(rows * width), v: new Float32Array(rows * width), t: new Int32Array(rows), width });
const eAdam = sparse(N, D), gAdam = sparse(BUCKETS, GD);
const LR = arg("lr", 2e-3), ELR = arg("elr", 1e-3), GLR = arg("glr", 1e-2), DROP = arg("drop", 0.2), B1 = 0.9, B2 = 0.999, EPS = 1e-8, SMOOTH = 0.05, WD = 1e-4;
let step = 0;

function forward(ex, training) {
  const x = new Float32Array(IN);
  const nm = { rM: 1, rG: 1 };
  if (ex.ids.length) {
    for (const id of ex.ids) for (let j = 0; j < D; j++) x[j] += E[id * D + j];
    let r = 0;
    for (let j = 0; j < D; j++) r += x[j] * x[j];
    nm.rM = Math.sqrt(r) || 1;
    for (let j = 0; j < D; j++) x[j] /= nm.rM;
  }
  if (ex.gs.length) {
    for (const b of ex.gs) for (let j = 0; j < GD; j++) x[D + j] += G[b * GD + j];
    let r = 0;
    for (let j = 0; j < GD; j++) r += x[D + j] ** 2;
    nm.rG = Math.sqrt(r) || 1;
    for (let j = 0; j < GD; j++) x[D + j] /= nm.rG;
  }
  const z1 = new Float32Array(H), a = new Float32Array(H), mask = new Uint8Array(H);
  for (let i = 0; i < H; i++) {
    let v = b1[i];
    const off = i * IN;
    for (let j = 0; j < IN; j++) v += W1[off + j] * x[j];
    z1[i] = v;
    mask[i] = !training || rand() >= DROP ? 1 : 0;
    a[i] = v > 0 && mask[i] ? (training ? v / (1 - DROP) : v) : 0;
  }
  const p = new Float32Array(C);
  let max = -Infinity;
  for (let c = 0; c < C; c++) {
    let v = b2[c];
    for (let i = 0; i < H; i++) v += W2[c * H + i] * a[i];
    p[c] = v;
    if (v > max) max = v;
  }
  let sum = 0;
  for (let c = 0; c < C; c++) sum += p[c] = Math.exp(p[c] - max);
  for (let c = 0; c < C; c++) p[c] /= sum;
  return { x, nm, z1, a, mask, p };
}

function backward(ex, f, eGrad, gGrad) {
  const [gW1, gb1, gW2, gb2] = grads;
  const dl = new Float32Array(C);
  for (let c = 0; c < C; c++) {
    const hard = SMOOTH / C + (c === ex.c ? 1 - SMOOTH : 0);
    dl[c] = f.p[c] - (ex.soft ? 0.5 * hard + 0.5 * ex.soft[c] : hard);
  }
  const da = new Float32Array(H);
  for (let c = 0; c < C; c++) {
    gb2[c] += dl[c];
    for (let i = 0; i < H; i++) { gW2[c * H + i] += dl[c] * f.a[i]; da[i] += W2[c * H + i] * dl[c]; }
  }
  const dx = new Float32Array(IN);
  for (let i = 0; i < H; i++) {
    if (f.z1[i] <= 0 || !f.mask[i]) continue;
    const dz = da[i] / (1 - DROP);
    gb1[i] += dz;
    const off = i * IN;
    for (let j = 0; j < IN; j++) { gW1[off + j] += dz * f.x[j]; dx[j] += W1[off + j] * dz; }
  }
  // Each half: back through its normalisation and its sum, to the rows it used.
  const toRows = (from, width, r, list, store) => {
    let xd = 0;
    for (let j = 0; j < width; j++) xd += f.x[from + j] * dx[from + j];
    const g = new Float32Array(width);
    for (let j = 0; j < width; j++) g[j] = (dx[from + j] - f.x[from + j] * xd) / r;
    for (const id of list) {
      let acc = store.get(id);
      if (!acc) store.set(id, (acc = new Float32Array(width)));
      for (let j = 0; j < width; j++) acc[j] += g[j];
    }
  };
  if (ex.ids.length) toRows(0, D, f.nm.rM, ex.ids, eGrad);
  if (ex.gs.length) toRows(D, GD, f.nm.rG, ex.gs, gGrad);
}

function sparseStep(table, opt, store, lr, batch) {
  const w = opt.width;
  for (const [id, g] of store) {
    const t = ++opt.t[id], d1 = 1 - B1 ** t, d2 = 1 - B2 ** t;
    for (let j = 0; j < w; j++) {
      const k = id * w + j, gi = g[j] / batch;
      opt.m[k] = B1 * opt.m[k] + (1 - B1) * gi;
      opt.v[k] = B2 * opt.v[k] + (1 - B2) * gi * gi;
      table[k] -= (lr * (opt.m[k] / d1)) / (Math.sqrt(opt.v[k] / d2) + EPS);
    }
  }
}

function update(batch, eGrad, gGrad) {
  step++;
  const c1 = 1 - B1 ** step, c2 = 1 - B2 ** step;
  params.forEach((p, k) => {
    const g = grads[k], { m, v } = adam[k];
    for (let i = 0; i < p.length; i++) {
      const gi = g[i] / batch + WD * p[i];
      m[i] = B1 * m[i] + (1 - B1) * gi;
      v[i] = B2 * v[i] + (1 - B2) * gi * gi;
      p[i] -= (LR * (m[i] / c1)) / (Math.sqrt(v[i] / c2) + EPS);
      g[i] = 0;
    }
  });
  sparseStep(E, eAdam, eGrad, ELR, batch);
  sparseStep(G, gAdam, gGrad, GLR, batch);
}

const accuracy = (set) => set.filter((ex) => { const { p } = forward(ex, false); let b = 0; for (let c = 1; c < C; c++) if (p[c] > p[b]) b = c; return b === ex.c; }).length / set.length;

const BATCH = 32;
for (let epoch = 1; epoch <= EPOCHS; epoch++) {
  for (let i = train.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [train[i], train[j]] = [train[j], train[i]]; }
  let loss = 0;
  for (let i = 0; i < train.length; i += BATCH) {
    const eGrad = new Map(), gGrad = new Map();
    const chunk = train.slice(i, i + BATCH);
    for (const ex of chunk) {
      const f = forward(ex, true);
      loss -= Math.log(f.p[ex.c] + 1e-9);
      backward(ex, f, eGrad, gGrad);
    }
    update(chunk.length, eGrad, gGrad);
  }
  console.log(`epoch ${epoch}: loss ${(loss / train.length).toFixed(3)}${DEV.length ? ` · dev ${(100 * accuracy(DEV)).toFixed(1)}%` : ""}`);
}

/* ---------- Export ---------- */
const quantRows = (table, width, ids) => {
  const scale = new Float32Array(ids.length), rows = new Int8Array(ids.length * width);
  ids.forEach((id, i) => {
    let m = 0;
    for (let j = 0; j < width; j++) m = Math.max(m, Math.abs(table[id * width + j]));
    const s = m / 127 || 1;
    scale[i] = s;
    for (let j = 0; j < width; j++) rows[i * width + j] = Math.round(table[id * width + j] / s);
  });
  return [scale, rows];
};
const changed = [];
for (let id = 0; id < N; id++) if (eAdam.t[id]) changed.push(id);
const usedGrams = [];
for (let b = 0; b < BUCKETS; b++) if (gAdam.t[b]) usedGrams.push(b);
const bytes = [];
const push = (a) => bytes.push(Buffer.from(a.buffer, a.byteOffset, a.byteLength));
const align = () => { const len = bytes.reduce((s, b) => s + b.length, 0); if (len % 4) bytes.push(Buffer.alloc(4 - (len % 4))); };
quantRows(E, D, changed).forEach(push);
align();
quantRows(G, GD, usedGrams).forEach(push);
align();
[W1, b1, W2, b2].forEach(push);
const out = Buffer.concat(bytes);
writeFileSync(here(`../../public/chatbot/model/${OUT}.bin`), out);
writeFileSync(
  here(`../../public/chatbot/model/${OUT}.json`),
  JSON.stringify({ classes, docs, dim: D, hidden: H, gdim: GD, buckets: BUCKETS, overrides: changed, grams: usedGrams }),
);
console.log(`classifier.bin ${(out.length / 1024).toFixed(0)} KB · ${changed.length} tuned tokens · ${usedGrams.length} letter pieces`);
