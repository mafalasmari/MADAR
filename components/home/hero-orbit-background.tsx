/**
 * The hero's "rotating orbit + floating particles" backdrop. Pure CSS/SVG —
 * no WebGL here, deliberately: the real 3D engine is reserved for the
 * journey section below, and a second Three.js canvas above the fold would
 * only compete with it for frame budget on the exact devices least able to
 * afford it. This reads as the same orbit motif (see VisionMap's rings and
 * the brand's own "مدار" = orbit concept) at zero runtime cost.
 *
 * Particle coordinates are pre-computed (not derived from Math.cos/sin at
 * render time): trig functions can return results that differ in their
 * last bit between the server's V8 and the browser's, which — once
 * serialized to a decimal string of different length — is exactly the kind
 * of value React's hydration check treats as a client/server mismatch.
 */
const PARTICLES: { x: number; y: number; big: boolean }[] = [
  { x: 623.5, y: 472.6, big: true },
  { x: 584.7, y: 636.4, big: false },
  { x: 385.6, y: 564.4, big: false },
  { x: 207.2, y: 629.8, big: true },
  { x: 170.1, y: 448.9, big: false },
  { x: 250.5, y: 330.3, big: false },
  { x: 250, y: 140.2, big: true },
  { x: 432.7, y: 167.3, big: false },
  { x: 510.4, y: 277.4, big: false },
  { x: 689.8, y: 322.4, big: true },
];

const CENTER = 400;

export function HeroOrbitBackground() {
  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]"
    >
      <g className="madar-orbit-spin">
        <circle cx={CENTER} cy={CENTER} r={165} fill="none" stroke="#9DB1C0" strokeWidth={1} strokeDasharray="2 10" opacity={0.5} />
      </g>
      <g className="madar-orbit-spin-reverse">
        <circle cx={CENTER} cy={CENTER} r={235} fill="none" stroke="#1B75BB" strokeWidth={1} strokeDasharray="1 9" opacity={0.45} />
      </g>
      <g className="madar-orbit-spin">
        <circle cx={CENTER} cy={CENTER} r={300} fill="none" stroke="#F5A623" strokeWidth={1.25} strokeDasharray="3 12" opacity={0.55} />
      </g>

      {PARTICLES.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.big ? 4 : 2.5}
          fill={p.big ? "#F5A623" : "#9DB1C0"}
          className="madar-particle-drift"
          style={{ animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </svg>
  );
}
