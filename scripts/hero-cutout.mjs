/**
 * Regenerates the hero foreground cut-outs: same frame as the photo, everything
 * except the subject transparent, so it can sit in front of the wordmark.
 *   node scripts/hero-cutout.mjs            # all presets
 *   node scripts/hero-cutout.mjs sign       # one preset
 * Each preset is tuned to its photo — retune if the photo changes.
 */
import sharp from "sharp";

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Point-in-polygon (even-odd). */
const inside = (pts, x, y) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const presets = {
  /** Entrance "V" sculpture against the sunset sky — separated by colour. */
  v: {
    src: "public/gallery/img_30.jpg",
    out: "public/hero/entrance-v-cutout.webp",
    mask(data, W, H) {
      const alpha = Buffer.alloc(W * H);
      const x0 = Math.round(W * 0.49), x1 = Math.round(W * 0.636);
      const y0 = Math.round(H * 0.08), y1 = Math.round(H * 0.47), fadeFrom = Math.round(H * 0.41);
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const i = (y * W + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
          const fade = y < fadeFrom ? 1 : 1 - (y - fadeFrom) / (y1 - fadeFrom);
          // Sky is bright (~190 luma); the sculpture is dark teal; wires are dark but grey.
          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          alpha[y * W + x] = Math.round((1 - smooth(120, 165, luma)) * smooth(4, 14, g - r) * fade * 255);
        }
      dropSpecks(alpha, W, x0, y0, x1, y1, 2500);
      return alpha;
    },
  },
  /** "giving" sign + cap + pole at dusk — a traced outline (it's geometric). */
  sign: {
    src: "public/gallery/img_51.jpg",
    out: "public/hero/dusk-sign-cutout.webp",
    mask(_data, W, H) {
      const pts = [
        [930, 600], [1800, 513], [1800, 272], [2136, 270], [2136, 479], [2264, 466],
        [2264, 1306], [2160, 1306], [2160, H], [1780, H], [1780, 1308], [930, 1310],
      ];
      const alpha = Buffer.alloc(W * H);
      for (let y = 250; y < H; y++)
        for (let x = 900; x < 2300; x++) if (inside(pts, x + 0.5, y + 0.5)) alpha[y * W + x] = 255;
      return alpha;
    },
  },
};

/** Zero out connected regions smaller than `min` px inside the box (JPEG sky specks). */
function dropSpecks(alpha, W, x0, y0, x1, y1, min) {
  const bw = x1 - x0, bh = y1 - y0, lab = new Int32Array(bw * bh), sizes = [0], stack = [];
  const at = (i) => alpha[(y0 + ((i / bw) | 0)) * W + x0 + (i % bw)];
  let id = 0;
  for (let i = 0; i < bw * bh; i++) {
    if (lab[i] || at(i) < 40) continue;
    id++;
    let size = 0;
    stack.push(i);
    lab[i] = id;
    while (stack.length) {
      const k = stack.pop();
      size++;
      const kx = k % bw, ky = (k / bw) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = kx + dx, ny = ky + dy;
        if (nx < 0 || ny < 0 || nx >= bw || ny >= bh) continue;
        const q = ny * bw + nx;
        if (lab[q] || at(q) < 40) continue;
        lab[q] = id;
        stack.push(q);
      }
    }
    sizes.push(size);
  }
  for (let i = 0; i < bw * bh; i++) if (sizes[lab[i]] < min) alpha[(y0 + ((i / bw) | 0)) * W + x0 + (i % bw)] = 0;
}

async function build(name) {
  const p = presets[name];
  const { data, info } = await sharp(p.src).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const alpha = p.mask(data, W, H);
  // Soften edges ~1px.
  const soft = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).extractChannel(0).raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = soft[i] < 40 ? 0 : soft[i];
  }
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 88, alphaQuality: 90 }).toFile(p.out);
  console.log(name, "→", p.out, `${W}×${H}`);
}

const names = process.argv.slice(2);
for (const n of names.length ? names : Object.keys(presets)) await build(n);
