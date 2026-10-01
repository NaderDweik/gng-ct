/*
 * Hover treatment for image cards (styles: styles/base/hover-accent.css).
 * The card gets class `hv`; inside its image box:
 *   <HoverGlow />  — primary-green gradient rising from the bottom (sits above the photo's
 *                    dark scrim, under any caption placed after it)
 *   <HoverBadge /> — a block flush in the top end corner that pops in, playing a pre-rendered
 *                    3D Giving Spirit V rocking slowly left ↔ right (public/brand/v-3d-logo.webp,
 *                    source: scripts/v-3d-sprite.html) while the card is hovered.
 * Both are decorative (aria-hidden).
 */

export function HoverGlow() {
  return <span className="hv-glow" aria-hidden />;
}

export function HoverBadge() {
  return (
    <span className="hv-badge" aria-hidden>
      <span className="hv-sprite" />
    </span>
  );
}

/** Glow + badge together, for image boxes with nothing layered on top. */
export function HoverAccent() {
  return (
    <>
      <HoverGlow />
      <HoverBadge />
    </>
  );
}
