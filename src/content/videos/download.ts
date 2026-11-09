import type { ModuleVideo } from "./types";

// MP4 exports of the module videos, published by .github/workflows/render-videos.yml
// to the repository's "videos" release. File names must match scripts/video/render.mjs.
const RELEASE = "https://github.com/doolan12/lms/releases/download/videos";
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function videoDownloads(v: ModuleVideo) {
  const name = `forklift-theory-module-${v.module}-${slug(v.title)}`;
  return { mp4: `${RELEASE}/${name}.mp4`, srt: `${RELEASE}/${name}.srt` };
}
