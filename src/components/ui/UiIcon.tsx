import type { ReactNode } from "react";

/*
 * Line icons for buttons and section eyebrows (home page CTAs and headings): 24×24,
 * currentColor strokes in the ServiceIcon style, sized by `.ui-icon` (base/primitives.css).
 */

export type UiIconName =
  | "calendar"
  | "pool"
  | "key"
  | "plan"
  | "image"
  | "camera"
  | "bell"
  | "newspaper"
  | "book"
  | "question"
  | "compass"
  | "home"
  | "trees"
  | "coins"
  | "pin";

const paths: Record<UiIconName, ReactNode> = {
  calendar: (<><rect x="3.5" y="5" width="17" height="15.5" rx="1.5" /><path d="M3.5 10h17" /><path d="M8 3v4M16 3v4" /><path d="M9 14.5l2 2 4-4" /></>),
  pool: (<><path d="M8 15V5.5a2 2 0 0 1 4 0" /><path d="M14 15V5.5a2 2 0 0 1 4 0" /><path d="M8 9h6M8 12.5h6" /><path d="M3 18c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" /></>),
  key: (<><circle cx="8" cy="15" r="4" /><path d="M10.8 12.2L20 3" /><path d="M16.5 6.5l2.5 2.5M14 9l2 2" /></>),
  plan: (<><path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z" /><path d="M9 4v13.5M15 6.5V20" /></>),
  image: (<><rect x="3" y="4.5" width="18" height="15" rx="1.5" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 15.5l-5-5-9 9" /></>),
  camera: (<><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3L9 4.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" /><circle cx="12" cy="13" r="3.5" /></>),
  bell: (<><path d="M4 18h16" /><path d="M6 18a6 6 0 0 1 12 0" /><path d="M12 12V10" /><path d="M10 10h4" /><path d="M3 21h18" /></>),
  newspaper: (<><path d="M4 5h13v13.5a1.5 1.5 0 0 0 1.5 1.5H5.5A1.5 1.5 0 0 1 4 18.5z" /><path d="M17 9h3v9.5a1.5 1.5 0 0 1-3 0" /><path d="M7 8.5h7M7 12h7M7 15.5h4" /></>),
  book: (<><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z" /><path d="M12 6.5v13" /></>),
  question: (<><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v10a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V17h-.5A1.5 1.5 0 0 1 4 15.5z" /><path d="M10 8.5a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.3" /><path d="M12 14h.01" /></>),
  compass: (<><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>),
  home: (<><path d="M3.5 11L12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5.5h4V20" /></>),
  trees: (<><path d="M8 11l-4 7h8z" /><path d="M8 18v3" /><path d="M16 5l-4.5 9h9z" /><path d="M16 14v7" /><path d="M3 21h18" /></>),
  coins: (<><ellipse cx="9" cy="7" rx="5.5" ry="2.5" /><path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V7" /><path d="M9.5 15.5v1.5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4c0-1.3-2.1-2.3-4.8-2.5" /><path d="M9.5 13v.5" /></>),
  pin: (<><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>),
};

export function UiIcon({ name, className = "" }: { name: UiIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ui-icon ${className}`.trim()}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
