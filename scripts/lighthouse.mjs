#!/usr/bin/env node
/**
 * Run Lighthouse for mobile + desktop and write HTML (+ JSON) reports.
 *
 * Usage:
 *   npm run test
 *   LIGHTHOUSE_URL=http://localhost:3000/ar npm run test
 *   CHROME_PATH=/path/to/chrome npm run test
 *
 * Expects the site to already be running (npm run dev or npm run start).
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const URL = process.env.LIGHTHOUSE_URL || "http://localhost:3000/en";
const OUT_DIR = join(process.cwd(), "lighthouse-reports");
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/var/lib/flatpak/app/com.google.Chrome/current/active/files/extra/chrome",
  "/var/lib/flatpak/app/com.google.Chrome/current/active/files/bin/chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/snap/bin/chromium",
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  return null;
}

function run(label, args) {
  console.log(`\n→ Lighthouse (${label})…`);
  const result = spawnSync("npx", ["--yes", "lighthouse", ...args], {
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const chrome = findChrome();
if (!chrome) {
  console.error(
    "No Chrome/Chromium found. Install one, or set CHROME_PATH to the binary.\n" +
      "On Bazzite/Flatpak Chrome:\n" +
      "  export CHROME_PATH=/var/lib/flatpak/app/com.google.Chrome/current/active/files/extra/chrome",
  );
  process.exit(1);
}

process.env.CHROME_PATH = chrome;
mkdirSync(OUT_DIR, { recursive: true });

const chromeFlags = "--no-sandbox --headless=new --disable-gpu";
const shared = [
  URL,
  "--quiet",
  "--chrome-flags=" + chromeFlags,
  "--output=html",
  "--output=json",
];

const mobileOut = join(OUT_DIR, `${stamp}-mobile`);
const desktopOut = join(OUT_DIR, `${stamp}-desktop`);

run("mobile", [...shared, `--output-path=${mobileOut}`]);
run("desktop", [...shared, "--preset=desktop", `--output-path=${desktopOut}`]);

const mobileHtml = `${mobileOut}.report.html`;
const desktopHtml = `${desktopOut}.report.html`;

console.log("\nReports written:");
console.log(`  mobile:  ${mobileHtml}`);
console.log(`  desktop: ${desktopHtml}`);
console.log(`\nOpen: ${pathToFileURL(mobileHtml).href}`);
console.log(`Open: ${pathToFileURL(desktopHtml).href}`);
