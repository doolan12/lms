// Shared drawing parts for the video diagrams. All diagrams use an 800 × 450
// viewBox (16:9) so they scale to any screen.

export const C = {
  ink: "#16181d",
  inkSoft: "#3b3f47",
  muted: "#6b7079",
  line: "#d7d4cc",
  paper: "#faf8f3",
  hivis: "#f5b700",
  hivisDark: "#c99600",
  go: "#1f7a4d",
  stop: "#b42318",
  kraft: "#c8955c",
  kraftDark: "#9c6b37",
  steel: "#8a8f98",
  sky: "#eaf1f6",
  white: "#ffffff",
};

export function T({
  x,
  y,
  children,
  size = 22,
  weight = 600,
  anchor = "start",
  fill = C.ink,
  italic = false,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  italic?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      fill={fill}
      fontStyle={italic ? "italic" : undefined}
      style={{ fontFamily: "inherit" }}
    >
      {children}
    </text>
  );
}

/** Fades content in once `show` is true (keeps layout stable). */
export function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <g style={{ opacity: show ? 1 : 0, transition: "opacity 450ms ease" }} aria-hidden={!show}>
      {children}
    </g>
  );
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.ink,
  width = 3,
  both = false,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  both?: boolean;
  dashed?: boolean;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (x: number, y: number, ang: number) => {
    const s = 6 + width * 2;
    const p1 = [x - s * Math.cos(ang - 0.45), y - s * Math.sin(ang - 0.45)];
    const p2 = [x - s * Math.cos(ang + 0.45), y - s * Math.sin(ang + 0.45)];
    return <polygon points={`${x},${y} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={color} />;
  };
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "8 6" : undefined}
      />
      {head(x2, y2, a)}
      {both && head(x1, y1, a + Math.PI)}
    </g>
  );
}

export function Person({
  x,
  y,
  s = 1,
  color = C.ink,
  hand = false,
  vest = true,
}: {
  x: number;
  y: number;
  s?: number;
  color?: string;
  /** Raised "stop" hand */
  hand?: boolean;
  vest?: boolean;
}) {
  // (x, y) = feet on the ground
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={5} strokeLinecap="round" fill="none">
      <circle cx={0} cy={-72} r={10} fill={color} stroke="none" />
      <line x1={0} y1={-60} x2={0} y2={-26} stroke={vest ? C.hivis : color} strokeWidth={9} />
      <line x1={0} y1={-26} x2={-9} y2={0} />
      <line x1={0} y1={-26} x2={9} y2={0} />
      {hand ? (
        <>
          <line x1={0} y1={-52} x2={14} y2={-78} />
          <line x1={0} y1={-52} x2={-14} y2={-34} />
        </>
      ) : (
        <>
          <line x1={0} y1={-52} x2={-13} y2={-32} />
          <line x1={0} y1={-52} x2={13} y2={-32} />
        </>
      )}
    </g>
  );
}

/**
 * Side view of a counterbalance forklift facing right.
 * (x, y) is where the rear of the forklift meets the ground.
 * forkY = height of the tynes above the ground (diagram units).
 * tilt = mast tilt in degrees (positive = back towards the driver).
 */
export function Forklift({
  x,
  y,
  s = 1,
  forkY = 10,
  tilt = 0,
  mastH = 230,
  load,
  driver = true,
  flip = false,
  rotate = 0,
}: {
  x: number;
  y: number;
  s?: number;
  forkY?: number;
  tilt?: number;
  mastH?: number;
  load?: { w: number; h: number; gap?: number };
  driver?: boolean;
  flip?: boolean;
  rotate?: number;
}) {
  const fy = -forkY;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -s : s} ${s})`}>
      {/* overhead guard */}
      <g stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none">
        <line x1={62} y1={-118} x2={72} y2={-236} />
        <line x1={176} y1={-118} x2={182} y2={-236} />
        <line x1={58} y1={-236} x2={192} y2={-236} />
      </g>
      {/* driver */}
      {driver && (
        <g>
          <circle cx={118} cy={-196} r={13} fill={C.ink} />
          <path d="M108,-182 L104,-140 L140,-140" stroke={C.hivis} strokeWidth={14} fill="none" strokeLinecap="round" />
          <line x1={118} y1={-170} x2={150} y2={-158} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      {/* seat */}
      <path d="M92,-118 L92,-158 Q92,-166 100,-166 L108,-166 L108,-134 L132,-134 L132,-118 Z" fill={C.inkSoft} />
      {/* steering */}
      <line x1={150} y1={-118} x2={160} y2={-158} stroke={C.ink} strokeWidth={5} />
      <line x1={150} y1={-162} x2={172} y2={-152} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      {/* body */}
      <rect x={12} y={-122} width={192} height={88} rx={12} fill={C.hivis} stroke={C.ink} strokeWidth={3} />
      {/* counterweight */}
      <path d="M0,-40 L0,-100 Q0,-124 24,-124 L48,-124 L48,-38 Z" fill={C.hivisDark} stroke={C.ink} strokeWidth={3} />
      {/* wheels */}
      <circle cx={56} cy={-27} r={27} fill={C.ink} />
      <circle cx={56} cy={-27} r={10} fill={C.steel} />
      <circle cx={172} cy={-31} r={31} fill={C.ink} />
      <circle cx={172} cy={-31} r={12} fill={C.steel} />
      {/* mast, carriage, tynes, load */}
      <g transform={`rotate(${-tilt} 212 -6)`}>
        <rect x={204} y={-mastH} width={15} height={mastH - 6} fill={C.inkSoft} />
        <rect x={219} y={fy - 72} width={10} height={72} fill={C.ink} />
        <g stroke={C.ink} strokeWidth={3}>
          <line x1={222} y1={fy - 72} x2={222} y2={fy - 118} />
          <line x1={229} y1={fy - 72} x2={229} y2={fy - 118} />
          <line x1={219} y1={fy - 118} x2={233} y2={fy - 118} />
          <line x1={219} y1={fy - 95} x2={233} y2={fy - 95} />
        </g>
        <rect x={227} y={fy - 62} width={7} height={62} fill={C.ink} />
        <rect x={227} y={fy - 7} width={118} height={7} rx={2} fill={C.ink} />
        {load && (
          <g>
            <rect
              x={234 + (load.gap ?? 0)}
              y={fy - 7 - load.h}
              width={load.w}
              height={load.h}
              fill={C.kraft}
              stroke={C.kraftDark}
              strokeWidth={3}
            />
            <line
              x1={234 + (load.gap ?? 0)}
              y1={fy - 7 - load.h / 2}
              x2={234 + (load.gap ?? 0) + load.w}
              y2={fy - 7 - load.h / 2}
              stroke={C.kraftDark}
              strokeWidth={2}
            />
          </g>
        )}
      </g>
    </g>
  );
}

export function Ground({ y = 390 }: { y?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={800} height={450 - y} fill="#e9e4d8" />
      <line x1={0} y1={y} x2={800} y2={y} stroke={C.inkSoft} strokeWidth={3} />
    </g>
  );
}

export function Badge({ x, y, n, on = true, color = C.ink }: { x: number; y: number; n: number | string; on?: boolean; color?: string }) {
  return (
    <g style={{ opacity: on ? 1 : 0.15, transition: "opacity 400ms" }}>
      <circle cx={x} cy={y} r={17} fill={color} stroke={C.white} strokeWidth={3} />
      <T x={x} y={y + 7} size={19} weight={800} anchor="middle" fill={C.hivis}>
        {n}
      </T>
    </g>
  );
}
