// Narrated "video" lessons: a sequence of slides. Each slide has a visual and
// one or more narration segments (`say`). Segments are spoken one after another;
// visuals that build up (points, steps, sums, some diagrams) reveal one more
// item per segment, so the picture follows the voice.

export type DiagramName =
  | "licenceCard"
  | "hierarchy"
  | "powerlineContact"
  | "jumpClear"
  | "exclusionZone"
  | "prestart"
  | "lotoTag"
  | "tipOver"
  | "stabilityTriangle"
  | "dataPlate"
  | "loadCentre"
  | "travel"
  | "ramp"
  | "trialLift"
  | "parked"
  | "charging"
  | "lpg";

export type Visual =
  | { kind: "title"; title: string; subtitle?: string }
  | { kind: "points"; title?: string; items: { icon?: string; text: string }[] }
  | { kind: "steps"; title?: string; tone?: "danger" | "normal"; items: { label: string; text?: string }[] }
  | { kind: "sum"; title?: string; lines: { text: string; result?: boolean }[] }
  | {
      kind: "table";
      title?: string;
      head: string[];
      rows: string[][];
      /** Highlight a row, then a column, then the cell — one per segment after the first. */
      highlight?: { row: number; col: number };
      verdict?: { text: string; ok: boolean };
    }
  | { kind: "diagram"; name: DiagramName; props?: Record<string, string | number | boolean> };

export type Slide = { visual: Visual; say: string[] };

export type ModuleVideo = {
  module: number;
  title: string;
  slides: Slide[];
};

/** Rough running time at a normal speaking pace (~150 words a minute). */
export function videoMinutes(v: ModuleVideo) {
  const words = v.slides.flatMap((s) => s.say).join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 150));
}
