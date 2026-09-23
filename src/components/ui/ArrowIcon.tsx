type Props = { className?: string };

/**
 * Hairline arrow: a thin shaft with a slim open head. The shaft extends on
 * hover of a `.group`-style parent (see `.lux-arrow` in gallery-mosaic.css).
 * Points in reading direction; flipped for RTL in CSS.
 */
export function ArrowIcon({ className = "" }: Props) {
  return (
    <span className={`lux-arrow ${className}`} aria-hidden>
      <span className="lux-arrow-shaft" />
      <svg className="lux-arrow-head" width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
