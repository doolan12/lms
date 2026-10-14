// Records narration with Kokoro (open-source, Apache-2.0) — runs in GitHub
// Actions, which can reach Hugging Face. Skips lines already recorded.
//   node scripts/narration/generate.mjs narration.json
import { KokoroTTS } from "kokoro-js";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";

const { voice, lines } = JSON.parse(readFileSync(process.argv[2], "utf8"));
const outDir = "public/audio";
mkdirSync(outDir, { recursive: true });

const todo = lines.filter((l) => !existsSync(`${outDir}/${l.id}.mp3`));
console.log(`voice ${voice}: ${lines.length} lines, ${todo.length} to record`);

if (todo.length) {
  const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });
  let n = 0;
  for (const l of todo) {
    const t0 = Date.now();
    const audio = await tts.generate(l.text, { voice, speed: 0.95 });
    const wav = `${outDir}/${l.id}.wav`;
    await audio.save(wav);
    // Mono 64 kbps MP3: small enough for phones, clear for speech.
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "64k", `${outDir}/${l.id}.mp3`]);
    unlinkSync(wav);
    console.log(`${++n}/${todo.length} ${l.id} ${((Date.now() - t0) / 1000).toFixed(1)}s  ${l.text.slice(0, 60)}`);
  }
}

// Manifest the app imports: which lines have audio.
const have = lines.filter((l) => existsSync(`${outDir}/${l.id}.mp3`)).map((l) => l.id);
writeFileSync("src/content/videos/audio-manifest.json", JSON.stringify({ voice, ids: have }, null, 0) + "\n");
console.log(`manifest: ${have.length}/${lines.length} lines have audio`);
