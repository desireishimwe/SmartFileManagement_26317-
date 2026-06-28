type NodeDef = { id: string; x: number; y: number; r: number; pulse?: boolean; label?: string };

const NODES: NodeDef[] = [
  // Left zone – sit inside the text area
  { id: 'L0', x: 70,  y: 90,  r: 3.5 },
  { id: 'L1', x: 195, y: 45,  r: 3   },
  { id: 'L2', x: 95,  y: 240, r: 3.5 },
  { id: 'L3', x: 235, y: 190, r: 3   },
  { id: 'L4', x: 75,  y: 395, r: 3.5 },
  { id: 'L5', x: 215, y: 435, r: 3   },
  { id: 'L6', x: 305, y: 305, r: 4   },
  // Middle zone
  { id: 'M0', x: 390, y: 75,  r: 3.5 },
  { id: 'M1', x: 490, y: 168, r: 4   },
  { id: 'M2', x: 592, y: 85,  r: 3   },
  { id: 'M3', x: 372, y: 292, r: 8,  pulse: true },
  { id: 'M4', x: 490, y: 362, r: 3.5 },
  { id: 'M5', x: 612, y: 292, r: 3   },
  { id: 'M6', x: 372, y: 452, r: 3.5 },
  { id: 'M7', x: 502, y: 472, r: 3   },
  { id: 'M8', x: 628, y: 432, r: 3.5 },
  // Right zone – dense cluster
  { id: 'R0',  x: 712,  y: 58,  r: 3.5 },
  { id: 'R1',  x: 812,  y: 132, r: 3   },
  { id: 'R2',  x: 912,  y: 58,  r: 3.5 },
  { id: 'R3',  x: 1002, y: 142, r: 10, pulse: true, label: 'Track student fees.' },
  { id: 'R4',  x: 1092, y: 62,  r: 3   },
  { id: 'R5',  x: 1172, y: 142, r: 3.5 },
  { id: 'R6',  x: 692,  y: 268, r: 4   },
  { id: 'R7',  x: 802,  y: 322, r: 3.5 },
  { id: 'R8',  x: 902,  y: 268, r: 3   },
  { id: 'R9',  x: 998,  y: 332, r: 3.5 },
  { id: 'R10', x: 1092, y: 272, r: 9,  pulse: true, label: 'Monitor attendance daily.' },
  { id: 'R11', x: 1178, y: 332, r: 3   },
  { id: 'R12', x: 712,  y: 448, r: 3.5 },
  { id: 'R13', x: 822,  y: 492, r: 3   },
  { id: 'R14', x: 932,  y: 458, r: 3.5 },
  { id: 'R15', x: 1032, y: 492, r: 3   },
  { id: 'R16', x: 1122, y: 458, r: 3.5 },
  { id: 'R17', x: 1188, y: 492, r: 3   },
];

const EDGES: [string, string][] = [
  // Left internal
  ['L0','L1'], ['L0','L2'], ['L1','L3'], ['L2','L3'], ['L2','L4'], ['L3','L6'], ['L4','L5'], ['L5','L6'],
  // Middle internal
  ['M0','M1'], ['M1','M2'], ['M0','M3'], ['M1','M4'], ['M2','M5'],
  ['M3','M4'], ['M4','M5'], ['M3','M6'], ['M4','M7'], ['M5','M8'], ['M6','M7'], ['M7','M8'],
  // Right internal
  ['R0','R1'], ['R1','R2'], ['R2','R3'], ['R3','R4'], ['R4','R5'],
  ['R0','R6'], ['R1','R7'], ['R2','R8'], ['R3','R9'], ['R4','R10'], ['R5','R11'],
  ['R6','R7'], ['R7','R8'], ['R8','R9'], ['R9','R10'], ['R10','R11'],
  ['R6','R12'], ['R7','R13'], ['R8','R14'], ['R9','R15'], ['R10','R16'], ['R11','R17'],
  ['R12','R13'], ['R13','R14'], ['R14','R15'], ['R15','R16'], ['R16','R17'],
  // Long cross-zone edges — these lines cross straight through the text
  ['L1','M0'], ['L3','M3'], ['L6','M4'], ['L5','M6'],
  ['L0','R6'], ['L2','R6'],
  ['L1','R0'], ['L4','R12'],
  ['M0','R0'], ['M1','R1'], ['M2','R2'], ['M5','R8'], ['M8','R14'],
];

const DOTS = [
  { from: 'L0',  to: 'R6',  dur: 3.0, delay: 0.0 },
  { from: 'L1',  to: 'R0',  dur: 3.3, delay: 0.5 },
  { from: 'M1',  to: 'R1',  dur: 1.9, delay: 1.0 },
  { from: 'R3',  to: 'R9',  dur: 2.1, delay: 0.3 },
  { from: 'R10', to: 'R16', dur: 2.0, delay: 1.4 },
  { from: 'L4',  to: 'R12', dur: 3.1, delay: 0.8 },
];

const PILL_W = 168;
const PILL_H = 26;

export function HeroNetworkDiagram() {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  return (
    <svg
      viewBox="600 0 600 500"
      preserveAspectRatio="xMidYMid meet"
      className="hero-network-svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="ndot-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {EDGES.map(([a, b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke="rgba(11,95,151,0.28)"
            strokeWidth="1"
          />
        );
      })}

      {/* Travelling dots */}
      {DOTS.map((d, i) => {
        const fn = nodeMap[d.from], tn = nodeMap[d.to];
        return (
          <circle key={i} r="3.5" fill="#f2c14e" filter="url(#ndot-glow)">
            <animateMotion
              path={`M ${fn.x} ${fn.y} L ${tn.x} ${tn.y} L ${fn.x} ${fn.y}`}
              dur={`${d.dur}s`}
              begin={`${d.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}

      {/* Nodes */}
      {NODES.map((n) => (
        <g key={n.id}>
          {n.pulse && (
            <>
              <circle cx={n.x} cy={n.y} r={n.r + 16} fill="none" stroke="rgba(11,95,151,0.45)" strokeWidth="1">
                <animate attributeName="r"       values={`${n.r + 10};${n.r + 36}`} dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0"                     dur="2.6s" repeatCount="indefinite" />
              </circle>
              <circle cx={n.x} cy={n.y} r={n.r + 7} fill="rgba(11,95,151,0.06)" stroke="rgba(11,95,151,0.25)" strokeWidth="1">
                <animate attributeName="r"       values={`${n.r + 4};${n.r + 22}`} dur="2.6s" begin="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.55;0"                   dur="2.6s" begin="0.9s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          <circle
            cx={n.x} cy={n.y} r={n.r}
            fill={n.pulse ? '#0b5f97' : 'rgba(11,95,151,0.65)'}
            stroke="rgba(11,95,151,0.35)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Tooltip labels */}
      {NODES.filter(n => n.label).map((n) => {
        const pillX = n.x - n.r - 14 - PILL_W;
        const pillY = n.y - PILL_H / 2;
        return (
          <g key={n.id + '-label'}>
            <rect
              x={pillX} y={pillY}
              width={PILL_W} height={PILL_H}
              rx={PILL_H / 2}
              fill="rgba(11,95,151,0.08)"
              stroke="rgba(11,95,151,0.45)"
              strokeWidth="1"
            />
            <text
              x={pillX + PILL_W / 2} y={n.y + 4}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill="#14365d"
              letterSpacing="0.02em"
            >
              {n.label}
            </text>
            <line
              x1={pillX + PILL_W + 1} y1={n.y}
              x2={n.x - n.r - 2}      y2={n.y}
              stroke="rgba(11,95,151,0.45)"
              strokeWidth="1"
            />
          </g>
        );
      })}
    </svg>
  );
}
