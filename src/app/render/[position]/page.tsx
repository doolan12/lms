// Renders every frame of a module video, one stage per narration segment, for the
// video-export job (scripts/video/render.mjs). Only enabled when RENDER_SLIDES=1.
import { notFound } from "next/navigation";
import { MODULE_VIDEOS } from "@/content/videos";
import { SlideVisual } from "@/components/video/SlideVisual";
import { illustration } from "@/content/illustrations";

type Props = { params: Promise<{ position: string }> };

export default async function RenderFrames({ params }: Props) {
  if (process.env.RENDER_SLIDES !== "1") notFound();
  const pos = Number((await params).position);
  const base = MODULE_VIDEOS[pos];
  if (!base) notFound();
  const art = illustration(`m${pos}`);
  return (
    <div style={{ width: 1920 }}>
      <script id="video-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(base).replace(/</g, "\\u003c") }} />
      {base.slides.map((s, si) => {
        const visual = si === 0 && s.visual.kind === "title" && art ? { ...s.visual, image: art } : s.visual;
        return s.say.map((_, k) => (
          <div
            key={`${si}-${k}`}
            data-frame={`${si}-${k}`}
            className="relative overflow-hidden bg-paper"
            style={{ width: 1920, height: 1080, containerType: "inline-size" }}
          >
            <SlideVisual visual={visual} step={k} sayCount={s.say.length} />
          </div>
        ));
      })}
    </div>
  );
}
