// Renders every composition to ../public/motion as MP4 (H.264, plays everywhere) plus a poster frame.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const OUT = "../public/motion";
mkdirSync(OUT, { recursive: true });
const run = (args) => execFileSync("npx", ["remotion", ...args], { stdio: "inherit" });

for (const [id, file, crf] of [["CtaLoop", "cta-loop", 31], ["BannerLines", "banner-lines-full", 30]]) {
  run(["render", "src/index.ts", id, `${OUT}/${file}.mp4`, "--codec=h264", `--crf=${crf}`, "--muted", "--pixel-format=yuv420p"]);
  run(["still", "src/index.ts", id, `${OUT}/${file}.jpg`, "--frame=0", "--jpeg-quality=80"]);
}
