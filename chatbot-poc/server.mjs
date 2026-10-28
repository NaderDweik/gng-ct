// Chatbot POC: standalone static server, not part of the Next site or the Cloudflare build.
// The chat runs entirely in the visitor's browser (brain.mjs + lib/ + model/); this only
// serves files. `npm run chatbot` rebuilds model/kb.json first (build.mjs).
import http from "node:http";
import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

const PORT = Number(process.env.CHATBOT_PORT) || 4100;
const ROOT = new URL(".", import.meta.url).pathname;
const PUBLIC = new URL("../public/", import.meta.url).pathname;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".mjs": "text/javascript", ".json": "application/json", ".bin": "application/octet-stream",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml",
};
// Only these leave the POC folder; tools/, .cache/ and the Node-only build files stay private.
const SERVED = /^\/(index\.html|brain\.mjs|lib\/[\w-]+\.mjs|model\/(vocab\.json|vectors\.bin|kb\.json))$/;
const gz = new Map();

http
  .createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const rel = p === "/" ? "/index.html" : p;
    const file = SERVED.test(rel) ? path.join(ROOT, rel) : path.join(PUBLIC, path.normalize(rel));
    const type = TYPES[path.extname(file)];
    if (!type || !(file.startsWith(ROOT) || file.startsWith(PUBLIC)) || (!SERVED.test(rel) && !file.startsWith(PUBLIC)))
      return res.writeHead(404).end();
    try {
      let body = await readFile(file);
      // The model never changes between builds; kb.json does, so it is always revalidated.
      const cache = /^\/model\/(vocab\.json|vectors\.bin)$/.test(rel) ? "public, max-age=86400" : "no-cache";
      const headers = { "content-type": type, "cache-control": cache };
      if (/gzip/.test(req.headers["accept-encoding"] ?? "") && !/image|font/.test(type)) {
        const key = `${file}:${body.length}`;
        if (!gz.has(key)) gz.set(key, gzipSync(body));
        body = gz.get(key);
        headers["content-encoding"] = "gzip";
      }
      res.writeHead(200, { ...headers, "content-length": body.length }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  })
  .listen(PORT, () => console.log(`Chatbot POC (runs on-device) → http://localhost:${PORT}`));
