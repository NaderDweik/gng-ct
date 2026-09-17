import type { ReactNode } from "react";

/** Required by Next.js; html/body live in `[locale]/layout`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
