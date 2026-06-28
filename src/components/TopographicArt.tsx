type Ring = { cx: number; cy: number; rx: number; ry: number; rotate: number; color: string };

const RINGS: Ring[] = [
  // Left blob — outer to inner, drifting upper-right, rotating more
  { cx: 338, cy: 248, rx: 172, ry: 140, rotate: -18, color: '#bbf7d0' },
  { cx: 340, cy: 245, rx: 153, ry: 124, rotate: -20, color: '#86efac' },
  { cx: 342, cy: 242, rx: 134, ry: 109, rotate: -22, color: '#4ade80' },
  { cx: 344, cy: 239, rx: 117, ry:  95, rotate: -24, color: '#22c55e' },
  { cx: 346, cy: 236, rx: 100, ry:  81, rotate: -26, color: '#16a34a' },
  { cx: 348, cy: 233, rx:  83, ry:  67, rotate: -28, color: '#16a34a' },
  { cx: 350, cy: 230, rx:  68, ry:  54, rotate: -30, color: '#15803d' },
  { cx: 352, cy: 227, rx:  53, ry:  41, rotate: -32, color: '#166534' },
  { cx: 354, cy: 224, rx:  39, ry:  30, rotate: -34, color: '#15803d' },
  { cx: 356, cy: 221, rx:  26, ry:  19, rotate: -36, color: '#166534' },
  // Right blob — outer to inner, drifting lower-left, rotating opposite
  { cx: 700, cy: 258, rx: 196, ry: 178, rotate:  10, color: '#bbf7d0' },
  { cx: 698, cy: 261, rx: 175, ry: 159, rotate:   8, color: '#86efac' },
  { cx: 696, cy: 264, rx: 155, ry: 141, rotate:   6, color: '#4ade80' },
  { cx: 694, cy: 267, rx: 136, ry: 123, rotate:   4, color: '#22c55e' },
  { cx: 692, cy: 270, rx: 118, ry: 106, rotate:   2, color: '#16a34a' },
  { cx: 690, cy: 273, rx: 100, ry:  90, rotate:   0, color: '#16a34a' },
  { cx: 688, cy: 276, rx:  83, ry:  75, rotate:  -2, color: '#15803d' },
  { cx: 686, cy: 279, rx:  67, ry:  60, rotate:  -4, color: '#166534' },
  { cx: 684, cy: 282, rx:  52, ry:  46, rotate:  -6, color: '#15803d' },
  { cx: 682, cy: 285, rx:  38, ry:  33, rotate:  -8, color: '#166534' },
  { cx: 680, cy: 288, rx:  25, ry:  21, rotate: -10, color: '#15803d' },
];

export function TopographicArt() {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="topo-art-svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="topo-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#topo-glow)">
        {RINGS.map((r, i) => (
          <ellipse
            key={i}
            cx={r.cx} cy={r.cy}
            rx={r.rx} ry={r.ry}
            transform={`rotate(${r.rotate} ${r.cx} ${r.cy})`}
            fill="none"
            stroke={r.color}
            strokeWidth="1.4"
            opacity={0.82}
          />
        ))}
      </g>
    </svg>
  );
}
