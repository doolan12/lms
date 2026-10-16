// Records translated video narration with Google Cloud Text-to-Speech. Runs in GitHub Actions.
//   GOOGLE_TTS_API_KEY=... node --experimental-strip-types scripts/narration/google-tts.mts <lang>
// Picks the most natural voice Google offers for the language (Chirp 3 HD → Neural2 → WaveNet → Standard),
// skips lines already recorded, and writes src/content/videos/audio-manifest.<lang>.json.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { VOICED, speakable } from "../../src/lib/i18n/speech.ts";

const lang = process.argv[2];
const key = process.env.GOOGLE_TTS_API_KEY;
const cfg = VOICED[lang];
if (!cfg?.google) throw new Error(`no Google voice set up for ${lang}`);
if (!key) {
  console.log("GOOGLE_TTS_API_KEY is not set yet — nothing recorded.");
  process.exit(0);
}
const API = "https://texttospeech.googleapis.com/v1";
const manifestPath = `src/content/videos/audio-manifest.${lang}.json`;

type GVoice = { name: string; languageCodes: string[]; ssmlGender: string };
const rank = (n: string) => ["Chirp3-HD", "Chirp-HD", "Neural2", "Wavenet", "Standard"].findIndex((t) => n.includes(`-${t}-`));

async function pickVoice(): Promise<{ name: string; languageCode: string }> {
  // Keep the voice already used, so earlier recordings stay valid.
  const prev = JSON.parse(readFileSync(manifestPath, "utf8")).voice as string;
  for (const locale of cfg.google!) {
    const r = await fetch(`${API}/voices?languageCode=${locale}&key=${key}`);
    if (!r.ok) throw new Error(`voices ${locale}: ${r.status} ${await r.text()}`);
    const voices = (((await r.json()) as { voices?: GVoice[] }).voices ?? []).filter((v) =>
      v.languageCodes.includes(locale),
    );
    if (prev && voices.some((v) => v.name === prev)) return { name: prev, languageCode: locale };
    const usable = voices.filter((v) => rank(v.name) >= 0);
    if (!usable.length) continue;
    usable.sort(
      (a, b) =>
        rank(a.name) - rank(b.name) ||
        Number(b.ssmlGender === "FEMALE") - Number(a.ssmlGender === "FEMALE") ||
        a.name.localeCompare(b.name),
    );
    console.log(`${locale} voices available: ${usable.map((v) => v.name).join(", ")}`);
    return { name: usable[0].name, languageCode: locale };
  }
  throw new Error(`no Google voice found for ${cfg.google!.join(" / ")}`);
}

const voice = await pickVoice();
console.log(`${lang}: using ${voice.name}`);
const table = JSON.parse(readFileSync(`src/content/i18n/${lang}.json`, "utf8")) as Record<string, { t: string }>;
const lines = new Map<string, string>();
for (const [k, { t }] of Object.entries(table)) {
  if (!k.startsWith("V:")) continue;
  const text = speakable(t);
  lines.set(createHash("sha1").update(`${voice.name}|${text}`).digest("hex").slice(0, 16), text);
}

mkdirSync("public/audio", { recursive: true });
const todo = [...lines].filter(([id]) => !existsSync(`public/audio/${id}.mp3`));
console.log(`${lines.size} lines, ${todo.length} to record`);
let fails = 0;
for (const [n, [id, text]] of todo.entries()) {
  const audioConfig: Record<string, unknown> = { audioEncoding: "MP3", sampleRateHertz: 24000 };
  if (!voice.name.includes("Chirp")) audioConfig.speakingRate = 0.95;
  const r = await fetch(`${API}/text:synthesize?key=${key}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ input: { text }, voice, audioConfig }),
  });
  if (!r.ok) {
    fails++;
    console.log(`FAIL ${id} ${r.status} ${(await r.text()).slice(0, 200)} :: ${text.slice(0, 60)}`);
    if (r.status === 403 || r.status === 401) break; // bad key — no point continuing
    continue;
  }
  const { audioContent } = (await r.json()) as { audioContent: string };
  writeFileSync(`public/audio/${id}.mp3`, Buffer.from(audioContent, "base64"));
  console.log(`${n + 1}/${todo.length} ${id} ${text.slice(0, 50)}`);
}
const ids = [...lines.keys()].filter((id) => existsSync(`public/audio/${id}.mp3`));
writeFileSync(manifestPath, JSON.stringify({ voice: voice.name, ids }) + "\n");
console.log(`manifest: ${ids.length}/${lines.size} lines have audio, ${fails} failed`);
