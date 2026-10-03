/*
 * The banner's V-line motif as live SVG (the banner itself plays a Remotion render of the
 * same idea: motion/src/BannerLines.tsx). Logomark V outlines draw themselves on and off
 * while drifting, in one stroke colour set by CSS, gathered at the two sides of the band and
 * masked away toward the middle (styles: styles/base/v-lines.css). Decorative only.
 */

// Outline of one V from the logomark (viewBox 0 0 152 178), as in BannerLines.
const V =
  "M25.1182 0.5625L75.6475 104.501L126.177 0.5625L126.451 0H151.295L150.597 1.4375L88.3428 129.497L88.0703 130.057L88.0723 130.061H63.2227L63.2236 130.057L62.9521 129.497L0.698242 1.4375L0 0H24.8438L25.1182 0.5625Z";

/** x / y in % of the 1920×440 field, scale, phase (0–1) in the loop. */
const MARKS = [
  { x: -2, y: 30, s: 1.7, p: 0 },
  { x: 7, y: -35, s: 3.1, p: 0.3 },
  { x: 16, y: 25, s: 2.1, p: 0.62 },
  { x: 74, y: 20, s: 2.2, p: 0.15 },
  { x: 82, y: -40, s: 3.3, p: 0.45 },
  { x: 93, y: 28, s: 1.8, p: 0.78 },
];

export function VLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`vl ${className}`} viewBox="0 0 1920 440" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {MARKS.map((m, i) => (
        <g key={i} className="vl-drift" style={{ animationDelay: `${-m.p * 12}s` }}>
          <g transform={`translate(${(m.x / 100) * 1920} ${(m.y / 100) * 440}) scale(${m.s})`}>
            <path
              d={V}
              pathLength={1}
              strokeWidth={1.5 / m.s}
              style={{ animationDelay: `${-m.p * 12}s` }}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}
