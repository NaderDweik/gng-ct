import { AbsoluteFill, useCurrentFrame } from "remotion";
import { palette } from "../../src/theme/tokens";

/*
 * Inner-page banner backdrop: large V-logomark outlines in the logo greens slowly drawing
 * themselves on and off while drifting, on the slate band colour. Rendered at full strength;
 * the site fades it with CSS opacity over the same slate. Periodic in the loop
 * length, so it repeats seamlessly. Kept faint: the page title sits on top.
 */
export const BANNER_FRAMES = 360; // 12s @ 30fps

// Outline of one V from the logomark (viewBox 0 0 152 178).
const V = "M25.1182 0.5625L75.6475 104.501L126.177 0.5625L126.451 0H151.295L150.597 1.4375L88.3428 129.497L88.0703 130.057L88.0723 130.061H63.2227L63.2236 130.057L62.9521 129.497L0.698242 1.4375L0 0H24.8438L25.1182 0.5625Z";

const MARKS = [
  { x: 6, y: 18, s: 2.3, c: palette.logo.deep, phase: 0 },
  { x: 20, y: -30, s: 3.4, c: palette.logo.mid, phase: 0.22 },
  { x: 68, y: 10, s: 2.8, c: palette.logo.light, phase: 0.48 },
  { x: 84, y: -40, s: 3.9, c: palette.logo.teal, phase: 0.7 },
  { x: 45, y: 52, s: 1.8, c: palette.logo.teal, phase: 0.86 },
];

export const BannerLines = () => {
  const t = useCurrentFrame() / BANNER_FRAMES; // 0 → 1 over the loop
  return (
    <AbsoluteFill style={{ backgroundColor: palette.secondary }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 440" preserveAspectRatio="xMidYMid slice">
        {MARKS.map((m, i) => {
          const a = 2 * Math.PI * (t + m.phase);
          const draw = 0.5 - 0.5 * Math.cos(a); // 0 → 1 → 0 per loop
          const x = (m.x / 100) * 1920 + 40 * Math.sin(a);
          const y = (m.y / 100) * 440 + 14 * Math.cos(a);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${m.s})`}>
              <path
                d={V}
                pathLength={1}
                fill="none"
                stroke={m.c}
                strokeWidth={1.4 / m.s}
                strokeOpacity={1} /* visibility is set by CSS (.sh-video opacity) */
                strokeDasharray="1 1"
                strokeDashoffset={1 - draw}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
