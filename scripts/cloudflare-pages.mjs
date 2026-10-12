/*
 * Finishes `next build`'s static export (out/) for Cloudflare Pages. `npm run build` runs it.
 *
 *  1. Arabic, the default language, moves from out/ar/ to the root: "/units" is the Arabic page
 *     and "/en/units" the English one, the same URLs the middleware gives under `next dev`.
 *  2. out/_redirects: old /ar/... links go to the same page without the prefix, and renamed pages
 *     to their new address (hosting.config.mjs).
 *  3. out/_headers: security headers and caching (hosting.config.mjs).
 *  4. out/_img/: every photo in public/ resized to next/image's widths, as WebP, under the names
 *     src/lib/imageLoader.ts asks for. Encoded files are cached in node_modules/.cache/cf-images,
 *     so a rebuild only encodes new or changed photos.
 *  5. Checks: every resized photo a page asks for exists, a 404.html is at the root, and Pages'
 *     limits hold.
 */
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { mediaCacheControl, mediaExtensions, movedPages, securityHeaders } from "../hosting.config.mjs";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "out");
const pub = path.join(root, "public");
const cacheDir = path.join(root, "node_modules/.cache/cf-images");

const { imageConfigDefault } = createRequire(import.meta.url)("next/dist/shared/lib/image-config.js");
const WIDTHS = [...imageConfigDefault.imageSizes, ...imageConfigDefault.deviceSizes];
const QUALITY = { s: 75, h: 90 }; // keep the letters in sync with src/lib/imageLoader.ts
const RASTER = /\.(jpe?g|png|webp|avif)$/i;

// Cloudflare Pages limits (free plan).
const MAX_FILES = 20_000;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_HEADER_RULES = 100;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
}

const exists = (p) => fs.access(p).then(() => true, () => false);

/* 1. Arabic at the root ------------------------------------------------------------------- */

async function moveArabicToRoot() {
  const ar = path.join(out, "ar");
  if (!(await exists(ar))) throw new Error("out/ar/ is missing: run `next build` first.");
  // The site's own Arabic 404 (app/[locale]/404) takes the place of Next's plain one.
  if (await exists(path.join(ar, "404.html"))) await fs.rm(path.join(out, "404.html"), { force: true });
  const moves = [
    [path.join(out, "ar.html"), path.join(out, "index.html")],
    [path.join(out, "ar.txt"), path.join(out, "index.txt")],
    ...(await walk(ar)).map((file) => [file, path.join(out, path.relative(ar, file))]),
  ];
  for (const [, to] of moves) {
    if (await exists(to)) throw new Error(`Arabic page would overwrite ${path.relative(out, to)}`);
  }
  for (const [from, to] of moves) {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.rename(from, to);
  }
  await fs.rm(ar, { recursive: true });
  return moves.length;
}

/* 2. _redirects ------------------------------------------------------------------------- */

const redirects = [
  "# Written by scripts/cloudflare-pages.mjs from hosting.config.mjs; edit that instead.",
  "# Renamed pages.",
  ...movedPages.flatMap(({ from, to }) => [`${from} ${to} 301`, `/en${from} /en${to} 301`]),
  "# Arabic lives at the root; old /ar links drop the prefix.",
  "/ar / 301",
  "/ar/* /:splat 301",
].join("\n") + "\n";

/* 3. _headers --------------------------------------------------------------------------- */

async function headersFile() {
  const rule = (pattern, headers) => `${pattern}\n${headers.map((h) => `  ${h}`).join("\n")}`;
  const rules = [
    rule("/*", securityHeaders({ dev: false }).map(({ key, value }) => `${key}: ${value}`)),
    // Next.js puts a content hash in every file name here.
    rule("/_next/static/*", ["Cache-Control: public, max-age=31536000, immutable"]),
    rule("/_img/*", [`Cache-Control: ${mediaCacheControl}`]),
  ];
  // Media in each public/ folder, by extension: a folder-wide rule would also catch the
  // Arabic pages now sharing a folder (out/news/), and a site-wide /*.woff2 would double up
  // with /_next/static/*.
  const media = new RegExp(`\\.(${mediaExtensions.join("|")})$`, "i");
  const pairs = new Set();
  for (const file of await walk(pub)) {
    const rel = path.relative(pub, file).split(path.sep);
    const ext = file.match(media)?.[1].toLowerCase();
    if (rel.length > 1 && ext) pairs.add(`/${rel[0]}/*.${ext}`);
  }
  for (const pattern of [...pairs].sort()) rules.push(rule(pattern, [`Cache-Control: ${mediaCacheControl}`]));
  // The free *.pages.dev address stays out of search results; giving-estate.com is the real one.
  rules.push(rule("https://:project.pages.dev/*", ["X-Robots-Tag: noindex"]));
  if (rules.length > MAX_HEADER_RULES) throw new Error(`_headers has ${rules.length} rules (Pages allows ${MAX_HEADER_RULES})`);
  return `# Written by scripts/cloudflare-pages.mjs from hosting.config.mjs; edit that instead.\n${rules.join("\n")}\n`;
}

/* 4. Resized photos --------------------------------------------------------------------- */

async function encode(buffer, hash, target, tier) {
  const cached = path.join(cacheDir, `${hash}-${target}${tier}.webp`);
  if (!(await exists(cached))) {
    const webp = await sharp(buffer)
      .rotate()
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY[tier], smartSubsample: tier === "h", effort: 4 })
      .toBuffer();
    await fs.writeFile(cached, webp);
  }
  return cached;
}

async function resizePhotos() {
  await fs.mkdir(cacheDir, { recursive: true });
  const photos = (await walk(pub)).filter((f) => RASTER.test(f));
  let encoded = 0;
  let files = 0;

  async function one(file) {
    const buffer = await fs.readFile(file);
    const hash = createHash("sha1").update(buffer).digest("hex").slice(0, 16);
    const meta = await sharp(buffer).metadata();
    // EXIF orientations 5–8 turn the photo a quarter: the stored height is the width shown.
    const shown = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
    const rel = "/" + path.relative(pub, file).split(path.sep).join("/");
    for (const tier of Object.keys(QUALITY)) {
      for (const width of WIDTHS) {
        const target = Math.min(width, shown);
        const before = await exists(path.join(cacheDir, `${hash}-${target}${tier}.webp`));
        const cached = await encode(buffer, hash, target, tier);
        if (!before) encoded++;
        const dest = path.join(out, "_img", `${rel}-${width}${tier}.webp`);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.copyFile(cached, dest);
        files++;
      }
    }
  }

  // A few photos at a time; sharp already spreads each one over several threads.
  const queue = [...photos];
  const workers = Math.max(2, Math.min(6, Math.floor(os.availableParallelism() / 2)));
  await Promise.all(Array.from({ length: workers }, async () => {
    for (let file; (file = queue.shift()); ) await one(file);
  }));
  return { photos: photos.length, files, encoded };
}

/* 5. Checks ----------------------------------------------------------------------------- */

async function check() {
  const all = await walk(out);
  const missing = new Set();
  for (const file of all.filter((f) => f.endsWith(".html"))) {
    const html = await fs.readFile(file, "utf8");
    for (const [url] of html.matchAll(/\/_img\/[^\s"',)]+?-\d+[sh]\.webp/g)) {
      if (!(await exists(path.join(out, decodeURI(url))))) missing.add(url);
    }
  }
  if (missing.size) throw new Error(`Pages ask for resized photos that weren't made:\n  ${[...missing].slice(0, 20).join("\n  ")}`);
  // Without a top-level 404.html, Pages answers every unknown path with the home page (status 200).
  if (!all.includes(path.join(out, "404.html"))) throw new Error("out/404.html is missing");
  if (all.length > MAX_FILES) throw new Error(`out/ has ${all.length} files (Pages allows ${MAX_FILES})`);
  const sizes = await Promise.all(all.map(async (f) => [f, (await fs.stat(f)).size]));
  const big = sizes.filter(([, size]) => size > MAX_FILE_BYTES);
  if (big.length) throw new Error(`Files over Pages' 25 MiB limit: ${big.map(([f]) => path.relative(out, f)).join(", ")}`);
  return { files: all.length, bytes: sizes.reduce((sum, [, size]) => sum + size, 0) };
}

/* ---------------------------------------------------------------------------------------- */

const started = Date.now();
const moved = await moveArabicToRoot();
await fs.writeFile(path.join(out, "_redirects"), redirects);
await fs.writeFile(path.join(out, "_headers"), await headersFile());
const img = await resizePhotos();
const total = await check();
console.log(
  `cloudflare-pages: ${moved} Arabic files moved to the root; ${img.photos} photos → ${img.files} resized files ` +
    `(${img.encoded} newly encoded); out/ = ${total.files} files, ${(total.bytes / 1024 ** 2).toFixed(0)} MB; ` +
    `${((Date.now() - started) / 1000).toFixed(0)} s`,
);
