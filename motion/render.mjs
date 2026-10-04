// Renders every composition to ../public/motion as MP4 (H.264, plays everywhere) plus a poster frame.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const OUT = "../public/motion";
mkdirSync(OUT, { recursive: true });
const run = (args) => execFileSync("npx", ["remotion", ...args], { stdio: "inherit" });

// The CTA loop is full-bleed photography (1920×1080, photos upscaled to 2560 px), so it
// gets light compression; the banner is thin lines and stays small.
const only = process.argv[2];
for (const [id, file, crf, jpeg] of [["CtaLoop", "cta-loop", 19, 90], ["BannerLines", "banner-lines-full", 30, 80]]) {
  if (only && only !== id) continue;
  run(["render", "src/index.ts", id, `${OUT}/${file}.mp4`, "--codec=h264", `--crf=${crf}`, "--muted", "--pixel-format=yuv420p"]);
  run(["still", "src/index.ts", id, `${OUT}/${file}.jpg`, "--frame=0", `--jpeg-quality=${jpeg}`]);
}
