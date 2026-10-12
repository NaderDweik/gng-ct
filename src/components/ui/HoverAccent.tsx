/*
 * Hover treatment for image cards (styles: styles/base/hover-accent.css).
 * The card gets class `hv`; inside its image box:
 *   <HoverGlow /> — primary-green gradient rising from the bottom (sits above the photo's
 *                   dark scrim, under any caption placed after it).
 * Decorative (aria-hidden).
 */

export function HoverGlow() {
  return <span className="hv-glow" aria-hidden />;
}

/** The hover treatment, for image boxes with nothing layered on top. */
export function HoverAccent() {
  return <HoverGlow />;
}
