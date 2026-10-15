// Lists the translated video narration lines to record, per voiced language.
//   node --experimental-strip-types scripts/narration/manifest-i18n.mts <lang> > lines.json
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { VOICED, speakable } from "../../src/lib/i18n/speech.ts";

const lang = process.argv[2];
const cfg = VOICED[lang];
if (!cfg) throw new Error(`no voice for ${lang}`);
const table = JSON.parse(readFileSync(`src/content/i18n/${lang}.json`, "utf8")) as Record<string, { t: string }>;
const lines = new Map<string, { id: string; text: string }>();
for (const [k, { t }] of Object.entries(table)) {
  if (!k.startsWith("V:")) continue;
  const text = speakable(t);
  const id = createHash("sha1").update(`${cfg.voice}|${text}`).digest("hex").slice(0, 16);
  lines.set(id, { id, text });
}
process.stdout.write(JSON.stringify({ lang, voice: cfg.voice, kokoroLang: cfg.kokoroLang, lines: [...lines.values()] }));
