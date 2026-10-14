import "server-only";
import { createHash } from "node:crypto";
import manifest from "./audio-manifest.json";
import type { ModuleVideo } from "./types";

// Must match scripts/narration/manifest.mts
const lineId = (text: string, voice: string) =>
  createHash("sha1").update(`${voice}|${text}`).digest("hex").slice(0, 16);

const recorded = new Set<string>(manifest.ids);

/** URL of the recorded narration for each line, or null to fall back to the device voice. */
export function narrationAudio(video: ModuleVideo): (string | null)[][] {
  return video.slides.map((s) =>
    s.say.map((text) => {
      const id = lineId(text, manifest.voice);
      return recorded.has(id) ? `/audio/${id}.mp3` : null;
    }),
  );
}
