// Lists every narration line in the module videos with a stable id, so the
// audio generator only records lines that are new or changed.
//   node --experimental-strip-types scripts/narration/manifest.mts > narration.json
import { createHash } from "node:crypto";
import { module1, module2, module3 } from "../../src/content/videos/modules-1-3.ts";
import { module4, module5, module6, module7 } from "../../src/content/videos/modules-4-7.ts";

export const VOICE = process.env.NARRATION_VOICE ?? "af_heart";

export const lineId = (text: string, voice = VOICE) =>
  createHash("sha1").update(`${voice}|${text}`).digest("hex").slice(0, 16);

const lines = [module1, module2, module3, module4, module5, module6, module7].flatMap((m) =>
  m.slides.flatMap((s) => s.say.map((text) => ({ id: lineId(text), text }))),
);
const unique = [...new Map(lines.map((l) => [l.id, l])).values()];
process.stdout.write(JSON.stringify({ voice: VOICE, lines: unique }, null, 2));
