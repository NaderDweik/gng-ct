const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1000,
  className: "hs-draw",
};

/** Unit floor plan with dimension ticks, double walls, rooms, and a door swing. */
export function FloorplanIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden>
      <g className="hs-dim">
        <path {...stroke} d="M 28 14 H 86" strokeWidth={1.5} />
        <path {...stroke} d="M 28 10 V 18" strokeWidth={3} />
        <path {...stroke} d="M 86 10 V 18" strokeWidth={3} />
        <path {...stroke} d="M 14 28 V 86" strokeWidth={1.5} />
        <path {...stroke} d="M 10 28 H 18" strokeWidth={3} />
        <path {...stroke} d="M 10 86 H 18" strokeWidth={3} />
      </g>
      <rect {...stroke} x="25" y="25" width="61" height="61" />
      <rect {...stroke} x="30" y="30" width="51" height="51" />
      <path {...stroke} d="M 30 55 H 48 V 72 H 40" />
      <path {...stroke} d="M 48 55 H 60 V 30" />
      <path {...stroke} d="M 60 45 H 81" />
      <path {...stroke} d="M 81 60 H 68 V 72 H 81" />
      <path {...stroke} d="M 48 72 V 81" />
      <path {...stroke} d="M 60 72 V 81" />
      <path {...stroke} d="M 48 73 A 8 8 0 0 1 56 81" strokeWidth={1.5} />
      <g className="hs-door">
        <path {...stroke} d="M 48 81 V 73" />
      </g>
    </svg>
  );
}
