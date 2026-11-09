// Exports the narrated module videos as MP4 files (with captions) for download.
//   BASE=http://localhost:3000 OUT=out node scripts/video/render.mjs [module ...]
// Needs the site running with RENDER_SLIDES=1, Playwright, and ffmpeg.
// Each narration segment becomes a still frame held for the length of its recorded voice line,
// with the same pauses the web player uses (250 ms between lines, 700 ms between slides).
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const ROOT = resolve(new URL("../..", import.meta.url).pathname);
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = resolve(process.env.OUT ?? "out");
const SLIDE_IMAGES = process.env.SLIDE_IMAGES; // optional: folder for one JPG per slide (final state)
const manifest = JSON.parse(readFileSync(join(ROOT, "src/content/videos/audio-manifest.json"), "utf8"));
const recorded = new Set(manifest.ids);
const lineId = (t) => createHash("sha1").update(`${manifest.voice}|${t}`).digest("hex").slice(0, 16);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const srtTime = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

const mods = process.argv.slice(2).map(Number);
const list = mods.length ? mods : [1, 2, 3, 4, 5, 6, 7];
mkdirSync(OUT, { recursive: true });
if (SLIDE_IMAGES) mkdirSync(SLIDE_IMAGES, { recursive: true });

const browser = await chromium.launch(
  process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
);
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const report = [];

for (const m of list) {
  const work = join(OUT, `work-m${m}`);
  mkdirSync(work, { recursive: true });
  await page.goto(`${BASE}/render/${m}`, { waitUntil: "networkidle" });
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r))))));
  await page.waitForTimeout(800);
  // The render page embeds the video's slides and narration text.
  const video = JSON.parse(await page.locator("#video-data").textContent());
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));

  const parts = [];
  const srt = [];
  let t = 0;
  let missing = 0;
  for (const [si, slide] of video.slides.entries()) {
    for (const [k, text] of slide.say.entries()) {
      const png = join(work, `${si}-${k}.png`);
      await page.locator(`[data-frame="${si}-${k}"]`).screenshot({ path: png });
      if (SLIDE_IMAGES && k === slide.say.length - 1) {
        ff(["-i", png, "-q:v", "3", join(SLIDE_IMAGES, `m${m}-s${String(si + 1).padStart(2, "0")}.jpg`)]);
      }
      const gap = k + 1 < slide.say.length ? 0.25 : 0.7;
      const audio = join(ROOT, "public/audio", `${lineId(text)}.mp3`);
      const has = recorded.has(lineId(text)) && existsSync(audio);
      if (!has) missing++;
      // Without a recording, hold the caption for reading time (≈ 2.6 words a second).
      const speak = has ? dur(audio) : Math.max(2, text.split(/\s+/).length / 2.6);
      const len = speak + gap + (si === 0 && k === 0 ? 0.5 : 0);
      const clip = join(work, `${si}-${k}.mp4`);
      const lead = si === 0 && k === 0 ? 500 : 0;
      ff([
        "-loop", "1", "-framerate", "25", "-i", png,
        ...(has ? ["-i", audio] : ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono"]),
        "-filter_complex", `[1:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${lead}|${lead},apad[a]`,
        "-map", "0:v", "-map", "[a]", "-t", len.toFixed(3),
        "-c:v", "libx264", "-tune", "stillimage", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "25",
        "-c:a", "aac", "-b:a", "128k", "-ar", "44100", clip,
      ]);
      const start = t + lead / 1000;
      srt.push(`${srt.length + 1}\n${srtTime(start)} --> ${srtTime(start + speak)}\n${text}\n`);
      t += dur(clip);
      parts.push(clip);
    }
  }
  const name = `forklift-theory-module-${m}-${slug(video.title)}`;
  writeFileSync(join(work, "list.txt"), parts.map((p) => `file '${p}'`).join("\n"));
  writeFileSync(join(OUT, `${name}.srt`), srt.join("\n"));
  ff([
    "-f", "concat", "-safe", "0", "-i", join(work, "list.txt"), "-i", join(OUT, `${name}.srt`),
    "-map", "0", "-map", "1", "-c", "copy", "-c:s", "mov_text", "-metadata:s:s:0", "language=eng",
    "-metadata", `title=Forklift Theory — Module ${m}: ${video.title}`, "-movflags", "+faststart",
    join(OUT, `${name}.mp4`),
  ]);
  const secs = dur(join(OUT, `${name}.mp4`));
  report.push(`- Module ${m} (${name}.mp4): ${Math.floor(secs / 60)}m${Math.round(secs % 60)}s, ${parts.length} lines, ${missing} without voice, broken images: ${broken.length ? broken.join(" ") : "none"}`);
  console.log(report.at(-1));
}
await browser.close();
writeFileSync(join(OUT, "report.md"), `# Video export\n\n${report.join("\n")}\n`);
