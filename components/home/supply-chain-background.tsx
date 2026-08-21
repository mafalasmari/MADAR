/**
 * A quiet, always-on network motif for the hero: nodes and lines suggesting
 * a supply-chain graph, drifting slowly. Pure CSS keyframes (no JS, no
 * per-frame work) so it costs nothing at 60fps and never competes with the
 * foreground copy. Decorative only — hidden from assistive tech.
 */
export function SupplyChainBackground() {
  const nodes = [
    { x: 90, y: 120 }, { x: 260, y: 60 }, { x: 430, y: 160 },
    { x: 610, y: 90 }, { x: 760, y: 190 }, { x: 340, y: 260 },
    { x: 560, y: 300 }, { x: 150, y: 300 },
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [5, 7], [0, 7], [2, 6],
  ];

  return (
    <svg
      viewBox="0 0 860 380"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#9DB1C0"
          strokeWidth={1.25}
          className="madar-flow-line"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 5 : 3.5}
          fill={i % 3 === 0 ? "#F5A623" : "#9DB1C0"}
          className="madar-flow-node"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </svg>
  );
}
