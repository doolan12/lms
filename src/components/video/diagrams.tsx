import type { DiagramName } from "@/content/videos/types";
import { Arrow, Badge, C, Forklift, Ground, Person, Reveal, T } from "./svg-parts";

type P = { step: number; props?: Record<string, string | number | boolean> };

const fmt = (n: number) => n.toLocaleString("en-AU");

function LicenceCard({ step }: P) {
  return (
    <g>
      <rect x={160} y={50} width={480} height={320} rx={20} fill={C.white} stroke={C.ink} strokeWidth={4} />
      <path d="M160,70 Q160,50 180,50 L620,50 Q640,50 640,70 L640,125 L160,125 Z" fill={C.ink} />
      <T x={400} y={98} size={28} weight={800} anchor="middle" fill={C.hivis}>
        HIGH RISK WORK LICENCE
      </T>
      <rect x={190} y={150} width={110} height={140} rx={8} fill={C.sky} stroke={C.line} strokeWidth={2} />
      <circle cx={245} cy={200} r={24} fill={C.steel} />
      <path d="M200,285 Q200,235 245,235 Q290,235 290,285 Z" fill={C.steel} />
      <T x={330} y={170} size={15} weight={600} fill={C.muted}>
        NAME
      </T>
      <T x={330} y={196} size={22} weight={700}>
        Your Name
      </T>
      <rect x={325} y={215} width={290} height={38} rx={8} fill={C.hivis} />
      <T x={340} y={241} size={21} weight={800}>
        LF — Forklift truck
      </T>
      <Reveal show={step >= 1}>
        <rect x={325} y={262} width={290} height={38} rx={8} fill={C.paper} stroke={C.line} strokeWidth={2} />
        <T x={340} y={288} size={19} weight={600} fill={C.inkSoft}>
          LO — Order-picking forklift
        </T>
      </Reveal>
      <T x={400} y={350} size={15} weight={500} anchor="middle" fill={C.muted} italic>
        Example only — this course prepares you for class LF
      </T>
      <T x={400} y={420} size={22} weight={700} anchor="middle">
        Minimum age 18 · renew about every 5 years
      </T>
    </g>
  );
}

function Hierarchy({ step }: P) {
  const bands = [
    ["Eliminate", "remove the hazard", "#1f7a4d"],
    ["Substitute", "use something safer", "#3f8a3b"],
    ["Isolate", "separate people from it", "#7a9a2e"],
    ["Engineering", "mirrors, lights, limiters", "#c9971a"],
    ["Administrative", "procedures, signs, training", "#d9711f"],
    ["PPE", "last line of defence", "#b42318"],
  ];
  const cx = 470;
  return (
    <g>
      <Arrow x1={40} y1={78} x2={40} y2={380} color={C.inkSoft} width={4} />
      <T x={18} y={40} size={16} weight={800} fill={C.go}>
        MOST
      </T>
      <T x={18} y={60} size={16} weight={800} fill={C.go}>
        effective
      </T>
      <T x={18} y={408} size={16} weight={800} fill={C.stop}>
        LEAST
      </T>
      <T x={18} y={428} size={16} weight={800} fill={C.stop}>
        effective
      </T>
      {bands.map(([name, sub, color], i) => {
        const wt = 660 - i * 90;
        const wb = 660 - (i + 1) * 90;
        const y = 28 + i * 66;
        const h = 60;
        return (
          <Reveal key={name} show={step >= i + 1}>
            <polygon
              points={`${cx - wt / 2},${y} ${cx + wt / 2},${y} ${cx + wb / 2},${y + h} ${cx - wb / 2},${y + h}`}
              fill={color}
            />
            <T x={cx} y={y + 28} size={22} weight={800} anchor="middle" fill={C.white}>
              {`${i + 1}. ${name}`}
            </T>
            <T x={cx} y={y + 50} size={14} weight={500} anchor="middle" fill={C.white}>
              {sub}
            </T>
          </Reveal>
        );
      })}
    </g>
  );
}

function PowerLines() {
  return (
    <g>
      <rect x={70} y={70} width={12} height={320} fill={C.kraftDark} />
      <rect x={48} y={80} width={56} height={9} fill={C.kraftDark} />
      <rect x={718} y={70} width={12} height={320} fill={C.kraftDark} />
      <rect x={696} y={80} width={56} height={9} fill={C.kraftDark} />
      <path d="M58,86 Q400,146 742,86" stroke={C.ink} strokeWidth={3} fill="none" />
      <path d="M96,86 Q400,160 704,86" stroke={C.ink} strokeWidth={3} fill="none" />
      <T x={600} y={70} size={18} weight={800} fill={C.stop}>
        ⚡ LIVE
      </T>
    </g>
  );
}

function PowerlineContact({ step, props }: P) {
  const contact = props?.phase === "contact";
  if (!contact) {
    return (
      <g>
        <Ground />
        <PowerLines />
        <Forklift x={250} y={390} s={0.9} mastH={200} forkY={10} load={{ w: 80, h: 60 }} />
        <T x={400} y={40} size={30} weight={900} anchor="middle" fill={C.stop}>
          LOOK UP!
        </T>
        <T x={20} y={428} size={19} weight={800} fill={C.stop}>
          ⚡ Electricity can jump a gap
        </T>
        <Reveal show={step >= 1}>
          <Arrow x1={452} y1={205} x2={452} y2={126} color={C.stop} width={3} both />
          <T x={468} y={168} size={19} weight={800} fill={C.stop}>
            Keep clear — e.g. 3 m
          </T>
          <T x={468} y={190} size={15} weight={600} fill={C.inkSoft}>
            (NSW, lines up to 132 kV)
          </T>
        </Reveal>
        <Reveal show={step >= 2}>
          <Person x={650} y={390} s={0.9} hand />
          <T x={600} y={260} size={18} weight={700} anchor="middle">
            Spotter
          </T>
          <T x={420} y={428} size={19} weight={800}>
            Mast down to travel
          </T>
        </Reveal>
      </g>
    );
  }
  return (
    <g>
      <Ground />
      <Reveal show={step >= 1}>
        <ellipse cx={400} cy={396} rx={330} ry={34} fill={C.stop} fillOpacity={0.1} stroke={C.stop} strokeWidth={3} strokeDasharray="10 7" />
      </Reveal>
      <PowerLines />
      <Forklift x={270} y={390} s={0.9} mastH={303} forkY={30} />
      <polygon
        points="461,117 470,100 474,114 492,108 478,122 494,134 474,130 470,148 462,132 446,140 456,124 442,112"
        fill={C.hivis}
        stroke={C.stop}
        strokeWidth={2}
      />
      <T x={150} y={175} size={20} weight={800} fill={C.stop}>
        Forklift is LIVE
      </T>
      <T x={150} y={198} size={17} weight={700}>
        Driver: STAY ON
      </T>
      <Reveal show={step >= 1}>
        <Person x={765} y={390} s={0.8} hand />
        <Person x={32} y={390} s={0.8} hand />
        <T x={400} y={42} size={24} weight={900} anchor="middle" fill={C.stop}>
          Everyone else: stay at least 8 m away
        </T>
      </Reveal>
    </g>
  );
}

function JumpClear({ step }: P) {
  return (
    <g>
      <Ground />
      <Forklift x={30} y={390} s={0.72} mastH={260} forkY={30} driver={false} />
      <T x={130} y={250} size={44}>
        🔥
      </T>
      <path d="M150,230 Q260,150 330,330" stroke={C.inkSoft} strokeWidth={3} strokeDasharray="8 6" fill="none" />
      <g transform="translate(330 330) rotate(8)">
        <Person x={0} y={0} s={0.85} />
      </g>
      <T x={430} y={60} size={22} weight={800}>
        Jump clear — feet together
      </T>
      <T x={430} y={88} size={17} weight={600} fill={C.inkSoft}>
        Never touch the forklift and the ground
      </T>
      <T x={430} y={110} size={17} weight={600} fill={C.inkSoft}>
        at the same time
      </T>
      <Reveal show={step >= 1}>
        {[420, 480, 540, 600, 660].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={402} rx={9} ry={5} fill={C.ink} />
            <ellipse cx={x + 16} cy={402} rx={9} ry={5} fill={C.ink} />
          </g>
        ))}
        <Arrow x1={200} y1={428} x2={745} y2={428} color={C.stop} width={3} both />
        <T x={590} y={372} size={18} weight={800} anchor="middle" fill={C.stop}>
          Shuffle, feet together — 8 m+
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <rect x={420} y={150} width={350} height={70} rx={12} fill={C.stop} />
        <T x={595} y={180} size={20} weight={800} anchor="middle" fill={C.white}>
          🚫 Don&apos;t go back until the
        </T>
        <T x={595} y={206} size={20} weight={800} anchor="middle" fill={C.white}>
          power is confirmed OFF
        </T>
      </Reveal>
    </g>
  );
}

function ExclusionZone({ step }: P) {
  const cone = (x: number, y: number) => <polygon key={`${x}-${y}`} points={`${x},${y - 18} ${x - 12},${y + 10} ${x + 12},${y + 10}`} fill="#f97316" stroke={C.ink} strokeWidth={2} />;
  return (
    <g>
      <rect x={0} y={0} width={800} height={450} fill="#efebe2" />
      <rect x={240} y={40} width={420} height={110} rx={6} fill={C.sky} stroke={C.ink} strokeWidth={3} />
      <rect x={660} y={50} width={90} height={90} rx={10} fill={C.steel} stroke={C.ink} strokeWidth={3} />
      <T x={450} y={100} size={18} weight={700} anchor="middle">
        Truck — brakes on, wheels chocked
      </T>
      {/* forklift (top view) */}
      <rect x={395} y={150} width={10} height={50} fill={C.ink} />
      <rect x={445} y={150} width={10} height={50} fill={C.ink} />
      <rect x={385} y={200} width={80} height={120} rx={10} fill={C.hivis} stroke={C.ink} strokeWidth={3} />
      <rect x={378} y={208} width={8} height={30} fill={C.ink} />
      <rect x={464} y={208} width={8} height={30} fill={C.ink} />
      <rect x={378} y={286} width={8} height={26} fill={C.ink} />
      <rect x={464} y={286} width={8} height={26} fill={C.ink} />
      <rect x={0} y={385} width={800} height={50} fill={C.hivis} fillOpacity={0.35} />
      <T x={20} y={418} size={18} weight={700}>
        Pedestrian walkway
      </T>
      <T x={18} y={58} size={16} weight={800}>
        Traffic plan:
      </T>
      <T x={18} y={78} size={16} weight={600}>
        keep people and
      </T>
      <T x={18} y={98} size={16} weight={600}>
        forklifts apart
      </T>
      <Reveal show={step >= 1}>
        <rect x={210} y={20} width={570} height={340} fill="none" stroke={C.stop} strokeWidth={4} strokeDasharray="14 9" />
        {cone(210, 20)}
        {cone(780, 20)}
        {cone(210, 360)}
        {cone(780, 360)}
        {cone(495, 360)}
        <rect x={560} y={300} width={200} height={40} rx={6} fill={C.stop} />
        <T x={660} y={327} size={18} weight={800} anchor="middle" fill={C.white}>
          EXCLUSION ZONE
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <Person x={130} y={380} s={1} hand />
        <T x={130} y={270} size={22} weight={900} anchor="middle" fill={C.stop}>
          STOP
        </T>
        <T x={20} y={155} size={17} weight={700} fill={C.stop}>
          Someone walks in?
        </T>
        <T x={20} y={177} size={17} weight={700} fill={C.stop}>
          Stop work.
        </T>
      </Reveal>
    </g>
  );
}

function Prestart({ step }: P) {
  const items = ["Tynes & locking pins", "Mast & chains", "Hydraulic hoses & leaks", "Tyres & wheels", "Overhead guard", "Data plate", "Fluids, fuel / battery"];
  const spots: [number, number][] = [
    [430, 352],
    [330, 200],
    [318, 302],
    [255, 361],
    [196, 88],
    [244, 262],
    [74, 190],
  ];
  return (
    <g>
      <Ground y={400} />
      <Forklift x={40} y={400} s={1.25} forkY={12} driver={false} />
      {/* LPG cylinder on the counterweight */}
      <rect x={42} y={200} width={70} height={42} rx={20} fill="#d0d4da" stroke={C.inkSoft} strokeWidth={3} />
      {/* data plate */}
      <rect x={224} y={272} width={34} height={20} rx={3} fill="#d9dde2" stroke={C.ink} strokeWidth={2} />
      {spots.map(([x, y], i) => (
        <Badge key={i} x={x} y={y} n={i + 1} on={step >= i + 1} />
      ))}
      {items.map((t, i) => {
        const y = 60 + i * 52;
        const on = step >= i + 1;
        const current = step === i + 1;
        return (
          <g key={t} style={{ opacity: on ? 1 : 0.25, transition: "opacity 400ms" }}>
            <rect x={520} y={y - 26} width={270} height={42} rx={8} fill={current ? C.hivis : C.white} stroke={C.line} strokeWidth={2} />
            <Badge x={544} y={y - 5} n={i + 1} />
            <T x={570} y={y + 2} size={17} weight={current ? 800 : 600}>
              {t}
            </T>
          </g>
        );
      })}
      <T x={30} y={40} size={20} weight={800}>
        Engine OFF · walk all the way around
      </T>
    </g>
  );
}

function LotoTag({ step }: P) {
  return (
    <g>
      <path d="M260,60 L440,60 L470,90 L470,400 L230,400 L230,90 Z" fill={C.white} stroke={C.ink} strokeWidth={4} />
      <circle cx={350} cy={92} r={14} fill={C.paper} stroke={C.ink} strokeWidth={3} />
      <path d="M350,78 Q380,20 470,30" stroke={C.inkSoft} strokeWidth={3} fill="none" />
      <rect x={232} y={122} width={236} height={64} fill={C.stop} />
      <T x={350} y={166} size={36} weight={900} anchor="middle" fill={C.white}>
        DANGER
      </T>
      <T x={350} y={226} size={24} weight={900} anchor="middle">
        OUT OF SERVICE
      </T>
      <T x={350} y={256} size={22} weight={800} anchor="middle">
        DO NOT OPERATE
      </T>
      {["Fault:", "Date:", "Name:"].map((l, i) => (
        <g key={l}>
          <T x={252} y={300 + i * 32} size={16} weight={600} fill={C.inkSoft}>
            {l}
          </T>
          <line x1={310} y1={302 + i * 32} x2={448} y2={302 + i * 32} stroke={C.line} strokeWidth={2} />
        </g>
      ))}
      {/* padlock */}
      <path d="M560,190 L560,160 Q560,120 600,120 Q640,120 640,160 L640,190" stroke={C.inkSoft} strokeWidth={12} fill="none" />
      <rect x={540} y={185} width={120} height={95} rx={12} fill={C.hivis} stroke={C.ink} strokeWidth={4} />
      <circle cx={600} cy={225} r={10} fill={C.ink} />
      <rect x={596} y={228} width={8} height={24} fill={C.ink} />
      {/* key removed */}
      <g transform="translate(560 340)">
        <circle cx={0} cy={0} r={18} fill="none" stroke={C.ink} strokeWidth={6} />
        <line x1={18} y1={0} x2={80} y2={0} stroke={C.ink} strokeWidth={6} />
        <line x1={64} y1={0} x2={64} y2={14} stroke={C.ink} strokeWidth={6} />
        <line x1={76} y1={0} x2={76} y2={10} stroke={C.ink} strokeWidth={6} />
        <line x1={-20} y1={-26} x2={96} y2={26} stroke={C.stop} strokeWidth={6} />
      </g>
      <T x={600} y={400} size={18} weight={700} anchor="middle">
        Key out · power isolated
      </T>
      <Reveal show={step >= 0}>
        <T x={400} y={440} size={18} weight={700} anchor="middle" fill={C.stop}>
          Only an authorised person removes the tag
        </T>
      </Reveal>
    </g>
  );
}

function TipOver({ step }: P) {
  return (
    <g>
      <Ground y={400} />
      <g transform="translate(600 400) rotate(13 110 0)">
        <rect x={-112} y={-62} width={42} height={62} rx={8} fill={C.ink} />
        <rect x={70} y={-62} width={42} height={62} rx={8} fill={C.ink} />
        <rect x={-100} y={-140} width={200} height={92} rx={12} fill={C.hivis} stroke={C.ink} strokeWidth={3} />
        <g stroke={C.ink} strokeWidth={8} strokeLinecap="round">
          <line x1={-92} y1={-140} x2={-86} y2={-300} />
          <line x1={92} y1={-140} x2={86} y2={-300} />
          <line x1={-96} y1={-300} x2={96} y2={-300} />
        </g>
        {/* driver leaning away (left) */}
        <g transform="rotate(-24 0 -150)">
          <circle cx={0} cy={-238} r={15} fill={C.ink} />
          <line x1={0} y1={-222} x2={0} y2={-160} stroke={C.hivis} strokeWidth={16} strokeLinecap="round" />
          <line x1={-12} y1={-205} x2={12} y2={-170} stroke={C.go} strokeWidth={5} />
          <line x1={0} y1={-205} x2={-30} y2={-178} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
          <line x1={0} y1={-205} x2={30} y2={-178} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        </g>
      </g>
      <path d="M690,90 Q760,110 770,190" stroke={C.stop} strokeWidth={4} fill="none" />
      <Arrow x1={768} y1={175} x2={771} y2={200} color={C.stop} width={4} />
      <T x={40} y={80} size={40} weight={900} fill={C.stop}>
        ✗ DON&apos;T JUMP
      </T>
      <Reveal show={step >= 1}>
        {["Stay in the seat", "Seatbelt on", "Hold the wheel tight", "Brace your feet", "Lean AWAY from the fall"].map((t, i) => (
          <T key={t} x={40} y={150 + i * 48} size={26} weight={700} fill={i === 4 ? C.go : C.ink}>
            {`✓ ${t}`}
          </T>
        ))}
      </Reveal>
    </g>
  );
}

function StabilityTriangle({ step, props }: P) {
  const outside = props?.cog === "outside";
  const showTri = outside || step >= 1;
  const showCog = outside || step >= 2;
  return (
    <g>
      <T x={30} y={40} size={18} weight={700} fill={C.muted}>
        Seen from above
      </T>
      {/* tynes and mast */}
      <rect x={546} y={185} width={190} height={14} fill={C.ink} />
      <rect x={546} y={281} width={190} height={14} fill={C.ink} />
      <rect x={530} y={170} width={16} height={140} fill={C.inkSoft} />
      {/* wheels */}
      <rect x={470} y={112} width={70} height={34} rx={6} fill={C.ink} />
      <rect x={470} y={334} width={70} height={34} rx={6} fill={C.ink} />
      <rect x={250} y={122} width={56} height={28} rx={6} fill={C.ink} />
      <rect x={250} y={330} width={56} height={28} rx={6} fill={C.ink} />
      {/* body */}
      <rect x={230} y={146} width={300} height={188} rx={20} fill={C.hivis} stroke={C.ink} strokeWidth={3} />
      <rect x={212} y={160} width={46} height={160} rx={16} fill={C.hivisDark} stroke={C.ink} strokeWidth={3} />
      <rect x={330} y={170} width={150} height={140} rx={8} fill="none" stroke={C.ink} strokeWidth={4} />
      <T x={225} y={110} size={16} weight={700} fill={C.inkSoft}>
        Counterweight
      </T>
      <T x={505} y={100} size={16} weight={700} anchor="middle" fill={C.inkSoft}>
        Front wheels (pivot)
      </T>
      <Reveal show={showTri}>
        <polygon points="505,129 505,351 278,240" fill={C.go} fillOpacity={0.28} stroke={C.go} strokeWidth={4} strokeDasharray="10 6" />
        <circle cx={278} cy={240} r={7} fill={C.ink} />
        <T x={240} y={400} size={20} weight={800} fill={C.go}>
          Stability triangle
        </T>
      </Reveal>
      <Reveal show={showCog}>
        {outside ? (
          <g>
            <circle cx={430} cy={240} r={12} fill="none" stroke={C.go} strokeWidth={3} strokeDasharray="4 4" />
            <Arrow x1={445} y1={240} x2={566} y2={240} color={C.stop} width={4} />
            <circle cx={584} cy={240} r={16} fill={C.stop} />
            <T x={600} y={160} size={24} weight={900} fill={C.stop}>
              Outside → TIPS!
            </T>
          </g>
        ) : (
          <g>
            <circle cx={430} cy={240} r={16} fill={C.go} stroke={C.white} strokeWidth={3} />
            <T x={780} y={420} size={20} weight={800} anchor="end" fill={C.go}>
              Centre of gravity inside ✓
            </T>
          </g>
        )}
      </Reveal>
    </g>
  );
}

function DataPlate({ step }: P) {
  const rows = [
    ["Model", "FL-25"],
    ["Rated capacity", "2,500 kg"],
    ["Load centre", "600 mm"],
    ["Max lift height", "4,500 mm"],
    ["Attachment", "Side shifter"],
  ];
  return (
    <g>
      <rect x={170} y={40} width={460} height={310} rx={14} fill="#d9dde2" stroke={C.inkSoft} strokeWidth={4} />
      {[
        [190, 60],
        [610, 60],
        [190, 330],
        [610, 330],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={7} fill={C.steel} stroke={C.inkSoft} strokeWidth={2} />
      ))}
      <T x={400} y={88} size={21} weight={800} anchor="middle">
        FORKLIFT DATA PLATE (example)
      </T>
      {rows.map(([k, v], i) => {
        const y = 135 + i * 44;
        const hi = step >= 1 && (i === 1 || i === 2);
        return (
          <g key={k}>
            <rect x={200} y={y - 28} width={400} height={38} rx={6} fill={hi ? C.hivis : "transparent"} style={{ transition: "fill 400ms" }} />
            <T x={215} y={y} size={20} weight={600} fill={C.inkSoft}>
              {k}
            </T>
            <T x={585} y={y} size={22} weight={800} anchor="end">
              {v}
            </T>
          </g>
        );
      })}
      <Reveal show={step >= 2}>
        <T x={400} y={395} size={21} weight={800} anchor="middle" fill={C.stop}>
          Load further out → LESS capacity
        </T>
        <T x={400} y={428} size={21} weight={800} anchor="middle" fill={C.stop}>
          Lifted higher → LESS capacity
        </T>
      </Reveal>
    </g>
  );
}

function LoadCentre({ step, props }: P) {
  const depth = Number(props?.depth ?? 1200);
  const gap = Number(props?.gap ?? 0);
  const k = 0.4;
  const face = 200;
  const x0 = face + gap * k;
  const w = depth * k;
  const cog = x0 + w / 2;
  const lc = gap + depth / 2;
  return (
    <g>
      <rect x={150} y={90} width={24} height={310} fill={C.inkSoft} />
      <rect x={180} y={150} width={20} height={192} fill={C.ink} />
      <rect x={180} y={330} width={570} height={12} fill={C.ink} />
      <rect x={x0} y={180} width={w} height={150} fill={C.kraft} stroke={C.kraftDark} strokeWidth={3} />
      <line x1={x0} y1={255} x2={x0 + w} y2={255} stroke={C.kraftDark} strokeWidth={2} />
      <T x={face} y={70} size={16} weight={700} anchor="middle" fill={C.muted}>
        front of tynes
      </T>
      <line x1={face} y1={78} x2={face} y2={150} stroke={C.muted} strokeWidth={2} strokeDasharray="5 5" />
      <Arrow x1={x0} y1={160} x2={x0 + w} y2={160} both width={3} />
      <T x={x0 + w / 2} y={148} size={20} weight={800} anchor="middle">
        {`${fmt(depth)} mm deep`}
      </T>
      {gap > 0 && (
        <g>
          <Arrow x1={face} y1={300} x2={x0} y2={300} both width={3} color={C.stop} />
          <T x={(face + x0) / 2} y={270} size={16} weight={800} anchor="middle" fill={C.stop}>
            gap
          </T>
          <T x={(face + x0) / 2} y={290} size={16} weight={800} anchor="middle" fill={C.stop}>
            {`${gap} mm`}
          </T>
        </g>
      )}
      <Reveal show={step >= 1}>
        <line x1={cog} y1={180} x2={cog} y2={330} stroke={C.ink} strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={cog} cy={225} r={16} fill={C.white} stroke={C.ink} strokeWidth={3} />
        <line x1={cog - 16} y1={225} x2={cog + 16} y2={225} stroke={C.ink} strokeWidth={3} />
        <line x1={cog} y1={209} x2={cog} y2={241} stroke={C.ink} strokeWidth={3} />
        <T x={cog + 24} y={218} size={16} weight={700}>
          middle of the load
        </T>
        <T x={(x0 + cog) / 2} y={318} size={17} weight={800} anchor="middle" fill={C.inkSoft}>
          {`half = ${fmt(depth / 2)} mm`}
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <Arrow x1={face} y1={375} x2={cog} y2={375} both width={4} color={C.go} />
        <T x={(face + cog) / 2} y={425} size={26} weight={900} anchor="middle" fill={C.go}>
          {gap > 0 ? `Load centre = ${gap} + ${fmt(depth / 2)} = ${fmt(lc)} mm` : `Load centre = ${fmt(lc)} mm`}
        </T>
      </Reveal>
    </g>
  );
}

function Travel({ step }: P) {
  return (
    <g>
      <Ground />
      <Forklift x={110} y={390} s={1} forkY={14} tilt={5} load={{ w: 130, h: 90 }} />
      <line x1={470} y1={372} x2={560} y2={318} stroke={C.ink} strokeWidth={2} />
      <T x={565} y={316} size={20} weight={800}>
        Load low (100–150 mm)
      </T>
      <line x1={330} y1={168} x2={560} y2={178} stroke={C.ink} strokeWidth={2} />
      <T x={565} y={184} size={20} weight={800}>
        Mast tilted back
      </T>
      <Reveal show={step >= 1}>
        <Arrow x1={620} y1={250} x2={760} y2={250} width={5} color={C.go} />
        <T x={560} y={235} size={18} weight={700}>
          👀 Look where you&apos;re going
        </T>
        <T x={40} y={110} size={18} weight={700} fill={C.stop}>
          View blocked? Reverse, or use a spotter
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <T x={40} y={50} size={22} weight={800}>
          🔒 Seatbelt   🚫 No passengers   🐢 Slow at corners
        </T>
      </Reveal>
    </g>
  );
}

function Ramp({ step, props }: P) {
  const loaded = props?.loaded !== false;
  const angle = -16.7;
  const yAt = (x: number) => 410 - 0.3 * x;
  return (
    <g>
      <polygon points="0,450 0,410 800,170 800,450" fill="#e9e4d8" stroke={C.inkSoft} strokeWidth={3} />
      {loaded ? (
        <g>
          <Forklift x={230} y={yAt(230)} s={0.85} forkY={14} tilt={5} load={{ w: 110, h: 80 }} rotate={angle} />
          <T x={40} y={50} size={26} weight={900}>
            WITH A LOAD: load on the uphill side
          </T>
          <Arrow x1={560} y1={190} x2={720} y2={142} width={5} color={C.go} />
          <T x={520} y={130} size={20} weight={800} fill={C.go}>
            Drive forwards UP
          </T>
          <Arrow x1={190} y1={300} x2={60} y2={339} width={5} color={C.inkSoft} />
          <T x={40} y={290} size={20} weight={800} fill={C.inkSoft}>
            Reverse DOWN
          </T>
        </g>
      ) : (
        <g>
          <Forklift x={560} y={yAt(560)} s={0.85} forkY={14} flip rotate={angle} />
          <T x={40} y={50} size={26} weight={900}>
            NO LOAD: tynes point downhill
          </T>
          <Arrow x1={600} y1={160} x2={740} y2={118} width={5} color={C.inkSoft} />
          <T x={560} y={110} size={20} weight={800} fill={C.inkSoft}>
            Reverse UP
          </T>
          <Arrow x1={200} y1={300} x2={70} y2={339} width={5} color={C.go} />
          <T x={40} y={285} size={20} weight={800} fill={C.go}>
            Drive forwards DOWN
          </T>
          <Reveal show={step >= 1}>
            <rect x={460} y={360} width={320} height={50} rx={10} fill={C.stop} />
            <T x={620} y={393} size={22} weight={800} anchor="middle" fill={C.white}>
              Never turn on a ramp
            </T>
          </Reveal>
        </g>
      )}
    </g>
  );
}

function TrialLift({ step }: P) {
  return (
    <g>
      <Ground />
      <Forklift x={60} y={390} s={1.1} forkY={26} load={{ w: 150, h: 110 }} />
      <Arrow x1={545} y1={388} x2={545} y2={352} width={4} color={C.go} both />
      <T x={560} y={350} size={19} weight={800} fill={C.go}>
        Lift just clear,
      </T>
      <T x={560} y={374} size={19} weight={800} fill={C.go}>
        then stop
      </T>
      <Reveal show={step >= 1}>
        <T x={505} y={90} size={20} weight={800}>
          ✓ Forklift steady?
        </T>
        <T x={505} y={126} size={20} weight={800}>
          ✓ Load secure?
        </T>
        <T x={505} y={176} size={20} weight={800} fill={C.stop}>
          ⚠ Back wheels light?
        </T>
        <T x={530} y={204} size={20} weight={800} fill={C.stop}>
          Lower it straight away
        </T>
      </Reveal>
    </g>
  );
}

function Parked({ step }: P) {
  return (
    <g>
      <Ground />
      <Forklift x={160} y={390} s={1.1} forkY={3} tilt={-3} />
      <T x={40} y={50} size={22} weight={800}>
        Safe, level spot — never block exits,
      </T>
      <T x={40} y={78} size={22} weight={800}>
        walkways or fire equipment
      </T>
      <Reveal show={step >= 1}>
        <circle cx={60} cy={170} r={26} fill={C.white} stroke={C.ink} strokeWidth={4} />
        <T x={60} y={180} size={26} weight={900} anchor="middle">
          N
        </T>
        <circle cx={60} cy={240} r={26} fill={C.stop} />
        <T x={60} y={250} size={26} weight={900} anchor="middle" fill={C.white}>
          P
        </T>
        <T x={18} y={300} size={16} weight={700}>
          Neutral
        </T>
        <T x={18} y={320} size={16} weight={700}>
          Park brake on
        </T>
        <line x1={530} y1={384} x2={600} y2={300} stroke={C.ink} strokeWidth={2} />
        <T x={560} y={290} size={20} weight={800}>
          Tynes flat on the floor
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <T x={520} y={150} size={22} weight={800}>
          🔑 Key out
        </T>
        <T x={520} y={185} size={22} weight={800}>
          ⚡ Power isolated
        </T>
        <T x={520} y={220} size={22} weight={800}>
          📝 Report defects
        </T>
      </Reveal>
    </g>
  );
}

function Lpg({ step }: P) {
  return (
    <g>
      <rect x={300} y={110} width={150} height={250} rx={60} fill="#d0d4da" stroke={C.inkSoft} strokeWidth={4} />
      <rect x={345} y={80} width={60} height={40} rx={6} fill={C.steel} stroke={C.inkSoft} strokeWidth={3} />
      <ellipse cx={375} cy={74} rx={32} ry={9} fill={step >= 2 ? C.go : C.stop} style={{ transition: "fill 400ms" }} />
      <path d="M405,96 Q480,96 520,140" stroke={C.ink} strokeWidth={8} fill="none" />
      <T x={375} y={250} size={34} weight={900} anchor="middle" fill={C.inkSoft}>
        LPG
      </T>
      <rect x={290} y={360} width={170} height={14} fill={C.ink} />
      <T x={30} y={50} size={22} weight={800}>
        🚭 No flames · well ventilated
      </T>
      <Reveal show={step >= 1}>
        <T x={540} y={220} size={22} weight={800}>
          🧤 Gloves
        </T>
        <T x={540} y={255} size={22} weight={800}>
          🥽 Eye protection
        </T>
        <T x={540} y={285} size={16} weight={600} fill={C.inkSoft}>
          LPG can cause cold burns
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <T x={30} y={180} size={20} weight={800} fill={C.go}>
          ✓ Valve closed
        </T>
        <T x={30} y={212} size={20} weight={800} fill={C.go}>
          ✓ Locating pin in
        </T>
        <T x={30} y={244} size={20} weight={800} fill={C.go}>
          ✓ Bottle secure
        </T>
      </Reveal>
      <Reveal show={step >= 3}>
        {[
          [410, 100, 7],
          [422, 86, 5],
          [398, 88, 6],
          [430, 104, 4],
          [416, 70, 5],
        ].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={C.sky} stroke={C.inkSoft} strokeWidth={1.5} />
        ))}
        <T x={540} y={110} size={22} weight={800} fill={C.stop}>
          Bubbles = LEAK
        </T>
        <T x={540} y={140} size={18} weight={700}>
          Check with soapy water —
        </T>
        <T x={540} y={164} size={18} weight={700}>
          never a flame
        </T>
      </Reveal>
    </g>
  );
}

function Charging({ step }: P) {
  return (
    <g>
      <rect x={110} y={240} width={290} height={150} rx={8} fill={C.inkSoft} stroke={C.ink} strokeWidth={3} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={128 + i * 45} y={252} width={36} height={22} rx={4} fill={C.steel} />
      ))}
      <T x={255} y={340} size={24} weight={800} anchor="middle" fill={C.white}>
        BATTERY
      </T>
      <rect x={560} y={180} width={170} height={210} rx={10} fill={C.steel} stroke={C.ink} strokeWidth={3} />
      <rect x={585} y={205} width={120} height={50} rx={6} fill={C.ink} />
      <T x={645} y={240} size={24} weight={900} anchor="middle" fill={step >= 1 ? C.stop : C.go}>
        {step >= 1 ? "OFF" : "ON"}
      </T>
      <T x={645} y={330} size={20} weight={800} anchor="middle">
        CHARGER
      </T>
      <path d="M370,240 Q470,140 560,280" stroke={C.ink} strokeWidth={8} fill="none" />
      {[
        [170, 200],
        [235, 160],
        [300, 125],
        [200, 110],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={22} fill={C.sky} stroke={C.inkSoft} strokeWidth={2} />
          <T x={x} y={y + 6} size={16} weight={800} anchor="middle" fill={C.inkSoft}>
            H₂
          </T>
        </g>
      ))}
      <T x={30} y={50} size={20} weight={800} fill={C.stop}>
        Hydrogen gas can explode — keep it ventilated
      </T>
      <Reveal show={step >= 1}>
        <rect x={420} y={70} width={360} height={74} rx={10} fill={C.stop} />
        <T x={600} y={100} size={19} weight={800} anchor="middle" fill={C.white}>
          Charger OFF before you
        </T>
        <T x={600} y={128} size={19} weight={800} anchor="middle" fill={C.white}>
          connect or disconnect
        </T>
      </Reveal>
      <Reveal show={step >= 2}>
        <T x={110} y={430} size={22} weight={800}>
          🥽 Wear PPE    🚿 Know where the eyewash is
        </T>
      </Reveal>
    </g>
  );
}

const DIAGRAMS: Record<DiagramName, (p: P) => React.ReactElement> = {
  licenceCard: LicenceCard,
  hierarchy: Hierarchy,
  powerlineContact: PowerlineContact,
  jumpClear: JumpClear,
  exclusionZone: ExclusionZone,
  prestart: Prestart,
  lotoTag: LotoTag,
  tipOver: TipOver,
  stabilityTriangle: StabilityTriangle,
  dataPlate: DataPlate,
  loadCentre: LoadCentre,
  travel: Travel,
  ramp: Ramp,
  trialLift: TrialLift,
  parked: Parked,
  charging: Charging,
  lpg: Lpg,
};

export function Diagram({ name, step, props }: { name: DiagramName } & P) {
  const D = DIAGRAMS[name];
  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" role="img" aria-label={name}>
      <D step={step} props={props} />
    </svg>
  );
}
