import type { Visual } from "@/content/videos/types";
import { Diagram } from "./diagrams";

/**
 * Renders one slide's visual. `step` is the narration segment currently being
 * spoken; items that build up appear one per segment. The first
 * (sayCount − items) segments are treated as an introduction.
 */
export function SlideVisual({ visual, step, sayCount }: { visual: Visual; step: number; sayCount: number }) {
  const shown = (i: number, n: number) => step >= i + Math.max(0, sayCount - n);
  const fade = (on: boolean) =>
    ({
      opacity: on ? 1 : 0,
      transform: on ? "none" : "translateY(0.6cqw)",
      transition: "opacity 450ms ease, transform 450ms ease",
    }) as const;

  switch (visual.kind) {
    case "title":
      return (
        <div className="flex h-full flex-col justify-center bg-ink px-[7cqw] text-white">
          <div className="hazard-stripe absolute inset-x-0 top-0 h-[1.6cqw]" />
          {visual.subtitle && (
            <p className="font-semibold uppercase tracking-[0.2em] text-hivis" style={{ fontSize: "2.3cqw" }}>
              {visual.subtitle}
            </p>
          )}
          <h2 className="mt-[1.5cqw] font-display font-bold uppercase leading-[1.05]" style={{ fontSize: "6cqw" }}>
            {visual.title}
          </h2>
          <div className="hazard-stripe absolute inset-x-0 bottom-0 h-[1.6cqw]" />
        </div>
      );

    case "points":
      return (
        <div className="flex h-full flex-col px-[5cqw] py-[4cqw]">
          {visual.title && (
            <h2 className="font-display font-bold uppercase" style={{ fontSize: "4.2cqw" }}>
              {visual.title}
            </h2>
          )}
          <ul className="mt-[2.5cqw] flex flex-1 flex-col justify-center gap-[1.8cqw]">
            {visual.items.map((it, i) => (
              <li key={i} className="flex items-center gap-[2cqw]" style={fade(shown(i, visual.items.length))}>
                <span
                  className="flex shrink-0 items-center justify-center rounded-[1.2cqw] bg-white shadow-sm"
                  style={{ width: "6.5cqw", height: "6.5cqw", fontSize: "3.6cqw" }}
                >
                  {it.icon ?? "•"}
                </span>
                <span className="font-semibold leading-tight" style={{ fontSize: "3.1cqw" }}>
                  {it.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "steps": {
      const danger = visual.tone === "danger";
      return (
        <div className={`flex h-full flex-col px-[5cqw] py-[3.5cqw] ${danger ? "bg-[#fff4f2]" : ""}`}>
          {visual.title && (
            <h2
              className={`font-display font-bold uppercase ${danger ? "text-stop" : ""}`}
              style={{ fontSize: "4.2cqw" }}
            >
              {danger ? "⚠ " : ""}
              {visual.title}
            </h2>
          )}
          <ol className="mt-[2cqw] flex flex-1 flex-col justify-center gap-[1.4cqw]">
            {visual.items.map((it, i) => (
              <li key={i} className="flex items-center gap-[2cqw]" style={fade(shown(i, visual.items.length))}>
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full font-bold ${
                    danger ? "bg-stop text-white" : "bg-ink text-hivis"
                  }`}
                  style={{ width: "5.6cqw", height: "5.6cqw", fontSize: "2.8cqw" }}
                >
                  {i + 1}
                </span>
                <span className="leading-tight" style={{ fontSize: "3.1cqw" }}>
                  <strong className={danger ? "text-stop" : ""}>{it.label}</strong>
                  {it.text ? <span className="font-medium"> {it.text}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    case "sum":
      return (
        <div className="flex h-full flex-col px-[6cqw] py-[4cqw]">
          {visual.title && (
            <h2 className="font-display font-bold uppercase" style={{ fontSize: "4.2cqw" }}>
              {visual.title}
            </h2>
          )}
          <div className="mt-[2cqw] flex flex-1 flex-col justify-center gap-[1.6cqw]">
            {visual.lines.map((l, i) => (
              <div
                key={i}
                className={`rounded-[1cqw] px-[2.2cqw] py-[1.3cqw] font-bold tabular-nums ${
                  l.result ? "bg-hivis" : "bg-white shadow-sm"
                }`}
                style={{ ...fade(shown(i, visual.lines.length)), fontSize: "3.5cqw" }}
              >
                {l.text}
              </div>
            ))}
          </div>
        </div>
      );

    case "table": {
      const h = visual.highlight;
      // After the intro: segment 1 = row, 2 = column, 3 = cell + verdict
      const base = Math.max(0, sayCount - 3);
      const rowOn = !!h && step >= base;
      const colOn = !!h && step >= base + 1;
      const cellOn = !!h && step >= base + 2;
      return (
        <div className="flex h-full flex-col px-[4cqw] py-[3cqw]">
          {visual.title && (
            <h2 className="font-display font-bold uppercase" style={{ fontSize: "3.6cqw" }}>
              {visual.title}
            </h2>
          )}
          <table className="mt-[1.6cqw] w-full border-collapse tabular-nums" style={{ fontSize: "2.9cqw" }}>
            <thead>
              <tr>
                {visual.head.map((c, j) => (
                  <th
                    key={j}
                    className="border border-line px-[1.4cqw] py-[1cqw] text-left font-bold transition-colors duration-500"
                    style={{ background: colOn && j === h?.col ? "#f5b70055" : "#f1eee6" }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visual.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => {
                    const isCell = cellOn && i === h?.row && j === h?.col;
                    const inRow = rowOn && i === h?.row;
                    const inCol = colOn && j === h?.col;
                    return (
                      <td
                        key={j}
                        className={`border border-line px-[1.4cqw] py-[0.9cqw] transition-colors duration-500 ${
                          j === 0 ? "font-bold" : ""
                        } ${isCell ? "font-black" : ""}`}
                        style={{
                          background: isCell ? "#f5b700" : inRow || inCol ? "#f5b70040" : "#ffffff",
                          outline: isCell ? "0.4cqw solid #16181d" : undefined,
                        }}
                      >
                        {c}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {visual.verdict && (
            <div
              className={`mt-auto rounded-[1cqw] px-[2cqw] py-[1.2cqw] text-center font-bold text-white ${
                visual.verdict.ok ? "bg-go" : "bg-stop"
              }`}
              style={{ ...fade(cellOn), fontSize: "3cqw" }}
            >
              {visual.verdict.ok ? "✓ " : "✗ "}
              {visual.verdict.text}
            </div>
          )}
        </div>
      );
    }

    case "diagram":
      return (
        <div className="h-full w-full p-[1cqw]">
          <Diagram name={visual.name} step={step} props={visual.props} />
        </div>
      );
  }
}
