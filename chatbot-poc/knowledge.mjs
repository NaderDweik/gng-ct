// Collects the chatbot's knowledge (Node only, run by build.mjs): the FAQ, the Arabic fields
// of src/content/*.ts, and every Arabic page of the built site (out/*.html, from
// `npm run build`) cut into short passages. Search lives in lib/core.mjs.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { faqCategories } from "../src/content/faq.ts";

const OUT = new URL("../out/", import.meta.url).pathname;

/* ---------- Site pages → passages ---------- */
const decode = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));

const SKIP_PAGES = ["404.html", "privacy.html", "cookies.html", "terms.html", "register.html"];
// Unit cards (availability) and UI chrome: the client doesn't want availability quoted.
// The site FAQ's old instalment wording is replaced by answers.json, so skip it in passages.
const NOISE = /متاح|محجوز|مباع|التفاصيل|العودة إلى|اقرأ المزيد|سداد مرنة|\d+\/\d+$/;

async function htmlFiles(dir, rel = "") {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const r = path.join(rel, e.name);
    if (e.isDirectory()) { if (!["en", "_next", "_img"].includes(e.name)) files.push(...(await htmlFiles(path.join(dir, e.name), r))); }
    // Legal pages and the 404 only add noise to answers.
    else if (e.name.endsWith(".html") && !SKIP_PAGES.includes(r)) files.push(r);
  }
  return files;
}

async function pagePassages() {
  let files;
  try { files = await htmlFiles(OUT); } catch { return []; }
  const seen = new Set(), passages = [];
  for (const f of files) {
    const html = await readFile(path.join(OUT, f), "utf8");
    const title = decode((html.match(/<title>([^<]*)/)?.[1] ?? f).split("|")[0].trim());
    const main = html.slice(html.indexOf("<main"), html.lastIndexOf("</main>")) || html;
    const lines = decode(
      main.replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/g, "")
        .replace(/<\/(p|h[1-6]|li|div|section|dd|dt|figcaption|blockquote|br)>|<br\s*\/?>/g, "\n")
        .replace(/<[^>]+>/g, " "),
    ).split("\n").map((l) => l.replace(/\s+/g, " ").trim())
      .filter((l) => l.length >= 25 && !NOISE.test(l) && /[؀-ۿ]/.test(l) && !seen.has(l) && seen.add(l));
    // Group neighbouring lines into ~350-char passages so answers keep their context.
    let buf = "";
    for (const l of lines) {
      if (buf && buf.length + l.length > 350) { passages.push({ kind: "page", title, url: "/" + f.replace(/(index)?\.html$/, ""), text: buf }); buf = ""; }
      buf += (buf ? " " : "") + l;
    }
    if (buf) passages.push({ kind: "page", title, url: "/" + f.replace(/(index)?\.html$/, ""), text: buf });
  }
  return passages;
}

/* ---------- Index ---------- */
export async function collectDocs() {
  const faqs = faqCategories.flatMap((c) => c.items).map((f) => ({ kind: "faq", title: "الأسئلة الشائعة", url: "/faq", q: f.qAr, text: f.aAr }));
  // The location page draws its drive times on the client, so read them from the source.
  const loc = await readFile(new URL("../src/content/location.ts", import.meta.url), "utf8");
  const drives = [...loc.matchAll(/nameAr: "([^"]+)"[^\n]*?minutes: (\d+)/g)].map(([, n, m]) => `${n} حوالي ${m} دقيقة`);
  faqs.push({
    kind: "faq", title: "الموقع", url: "/location",
    q: "كم يبعد الكمباوند عن عمان والمطار، وما المسافة ووقت الوصول بالسيارة؟",
    text: `${loc.match(/subAr:\s*"([^"]+)"/)?.[1] ?? ""}\nأوقات الوصول بالسيارة: ${drives.join("، ")}.`,
  });
  faqs.push(...(await contentDocs()));
  return [...faqs, ...(await pagePassages())];
}

/* ---------- src/content/*.ts → topic docs ----------
 * Much of the site (services, amenities, team, master plan) is drawn on the client, so the
 * built HTML misses it. Read the Arabic fields straight from the content files instead:
 * every titled item becomes a doc, and each topic gets an overview doc listing its items. */
const TOPICS = [
  { file: "services.ts", split: "export const upcomingServices", title: "الخدمات", url: "/services",
    q: ["ما هي الخدمات التي تقدمونها في الكمباوند؟ شو خدماتكم المتوفرة حاليًا", "ما الخدمات القادمة والمستقبلية في الكمباوند؟ شو رح يصير"],
    lead: ["الخدمات المتوفرة حاليًا في الكمباوند:", "وهذه خدمات قادمة ضمن خطة التطوير:"] },
  { file: "amenities.ts", title: "مرافق الشاليه", url: "/chalet/amenities",
    q: ["ما المرافق داخل الشاليه؟ شو في بالشاليه مسبح جاكوزي حديقة"], lead: ["كل شاليه فيه:"] },
  { file: "amenities-page.ts", title: "مرافق الكمباوند", url: "/compound/amenities",
    q: ["ما المرافق العامة داخل الكمباوند؟ شو في بالكمباوند"], lead: ["داخل الكمباوند تلاقي:"] },
  { file: "master-plan.ts", title: "المخطط العام", url: "/compound",
    q: ["ما مكونات المخطط العام للكمباوند؟ مناطق ومرافق المخطط"], lead: ["المخطط العام للكمباوند يضم:"] },
  { file: "team.ts", title: "فريق الإدارة", url: "/leadership",
    q: ["من فريق الإدارة ورؤساء الأقسام؟ مين المسؤولين والمدراء"], lead: ["رؤساء الأقسام في الشركة:"] },
  { file: "home-intro.ts", title: "عن روح العطاء", url: "/", q: ["ما هو روح العطاء؟ عرفني على المشروع"], lead: [""] },
];
const ITEM_START = /^(title|name|q)Ar$/;

function arFields(src) {
  const out = [];
  const re = /(\w+Ar)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|`([^`]*)`|\[([^\]]*)\])/g;
  for (const m of src.matchAll(re)) {
    const val = m[2] ?? m[3] ?? [...(m[4] ?? "").matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]).join("، ");
    if (val && /[؀-ۿ]/.test(val) && !/\$\{/.test(val)) out.push([m[1], val.replace(/\\n/g, " ").trim()]);
  }
  return out;
}

function items(src) {
  const list = [];
  let cur = null;
  for (const [key, val] of arFields(src)) {
    // Skip UI labels, honorifics ("م.", "أ.") and section taglines ending in a full stop.
    if (/^(eyebrow|label|cta|alt|seo|meta)/i.test(key) || val.length <= 3 || (key === "titleAr" && /\.$/.test(val))) continue;
    // amenities.ts lists shortAr before titleAr, so a short line after a titled item opens the next one.
    if ((ITEM_START.test(key) || key === "shortAr") && (!cur || cur.title)) { cur = { title: "", body: [] }; list.push(cur); }
    if (!cur) { cur = { title: "", body: [] }; list.push(cur); }
    if (ITEM_START.test(key) && !cur.title) cur.title = val;
    else if (!cur.body.includes(val)) cur.body.push(val);
  }
  // Team rows read better as "name – department".
  for (const it of list) if (it.body.length === 1 && /قسم/.test(it.body[0])) { it.title = `${it.title} – ${it.body[0]}`; it.body = []; }
  return list.filter((it) => it.title || it.body.length);
}

async function contentDocs() {
  const docs = [];
  for (const t of TOPICS) {
    const src = await readFile(new URL(`../src/content/${t.file}`, import.meta.url), "utf8").catch(() => "");
    const parts = t.split ? [src.slice(0, src.indexOf(t.split)), src.slice(src.indexOf(t.split))] : [src];
    parts.forEach((part, i) => {
      const its = items(part);
      const titled = its.filter((it) => it.title && it.title.length < 70);
      if (titled.length > 2)
        docs.push({ kind: "faq", list: true, title: t.title, url: t.url, q: t.q[i] ?? t.q[0],
          text: `${t.lead[i] ?? t.lead[0]}\n${titled.map((it) => `• ${it.title}`).join("\n")}` });
      else if (its.length)
        docs.push({ kind: "faq", title: t.title, url: t.url, q: t.q[i] ?? t.q[0], text: its.map((it) => [it.title, ...it.body].filter(Boolean).join(": ")).join("\n") });
      for (const it of its) if (it.title && it.body.length)
        docs.push({ kind: "item", title: t.title, url: t.url, q: it.title, text: `${it.title}: ${it.body.join(" ")}` });
    });
  }
  return docs;
}
