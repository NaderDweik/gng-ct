import type { ReactNode } from "react";
import type { ServiceIconName } from "@/content/services";

/*
 * Line icons for /services: 24×24, drawn with currentColor strokes so they take
 * the colour of their card (styles: styles/sections/services-directory.css).
 */

const paths: Record<ServiceIconName, ReactNode> = {
  gate: (<><path d="M4 21V10a8 8 0 0 1 16 0v11" /><path d="M3 21h18" /><path d="M9.5 21v-7.5h5V21" /><path d="M12 13.5V21" /></>),
  shield: (<><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>),
  bell: (<><path d="M4 18h16" /><path d="M6 18a6 6 0 0 1 12 0" /><path d="M12 12V10" /><path d="M10 10h4" /><path d="M3 21h18" /></>),
  road: (<><path d="M8 3L5 21M16 3l3 18" /><path d="M12 4v3M12 10.5v3M12 17v3" /></>),
  drop: (<><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></>),
  bolt: (<><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></>),
  sparkle: (<><path d="M11 3l1.8 4.2L17 9l-4.2 1.8L11 15l-1.8-4.2L5 9l4.2-1.8z" /><path d="M18 14l.8 1.7 1.7.8-1.7.8L18 19l-.8-1.7-1.7-.8 1.7-.8z" /></>),
  bike: (<><circle cx="6" cy="16" r="3.5" /><circle cx="18" cy="16" r="3.5" /><path d="M6 16l3.5-7h6L18 16" /><path d="M9.5 9L12 16h-6" /><path d="M8 6h3" /></>),
  wrench: (<><path d="M14.5 4.5a4 4 0 0 0 5 5L11 18a2.1 2.1 0 0 1-3-3z" /><path d="M14.5 4.5L16 8l3.5 1.5" /></>),
  golf: (<><path d="M8 20V3l9 3.5L8 10" /><ellipse cx="8" cy="20" rx="5" ry="1.5" /></>),
  trees: (<><path d="M8 11l-4 7h8z" /><path d="M8 18v3" /><path d="M16 5l-4.5 9h9z" /><path d="M16 14v7" /><path d="M3 21h18" /></>),
  cart: (<><path d="M3 4h2l2.4 11h10.2L20 7H6.2" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></>),
  mosque: (<><path d="M8 14c0-3.2 2.3-5.2 6-7 3.7 1.8 6 3.8 6 7" /><path d="M8 14v7h12v-7" /><path d="M14 7V4" /><path d="M12.5 21v-3.5a1.5 1.5 0 0 1 3 0V21" /><path d="M4 21V10l1-2 1 2v11" /><path d="M2.5 21h19" /></>),
  cup: (<><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" /><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" /><path d="M9 3.5v2.5M12.5 3.5v2.5" /></>),
  sprout: (<><path d="M12 20v-8" /><path d="M12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z" /><path d="M12 14.5c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" /><path d="M7 20h10" /></>),
  flower: (<><path d="M12 11c-3 0-4.5-2.5-4.5-6l2.2 1.5L12 3.5l2.3 3L16.5 5c0 3.5-1.5 6-4.5 6z" /><path d="M12 11v7" /><path d="M12 15.5c-1.5-2-3.5-2.3-5-1.5 1 2 3 2.5 5 1.5z" /><path d="M3 20h18" /></>),
  crane: (<><path d="M6 21V3" /><path d="M3 21h7" /><path d="M6 3h14" /><path d="M6 7l4-4" /><path d="M17 3v6" /><path d="M15 9h4v3h-4z" /></>),
};

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
