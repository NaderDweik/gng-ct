/*
 * Standard header for inner pages — the Jordan Gate pattern
 * (styles: styles/sections/subpage-header.css): a solid slate band under the
 * site header, a small eyebrow, the page name large and centred, and an
 * optional one-line tagline. No image. The eyebrow fades in and the title
 * rises once on load (CSS only).
 */

type Props = {
  /** Small line above the title, e.g. "Giving Compound". */
  eyebrow: string;
  /** The page name — this is the page's h1. */
  title: string;
  /** Optional one-line tagline under the title. */
  subtitle?: string;
  /** A slightly taller band (main destination pages: units, amenities, financing, gallery). */
  tall?: boolean;
};

import { LoopVideo } from "@/components/ui/LoopVideo";

export function SubpageHeader({ eyebrow, title, subtitle, tall }: Props) {
  return (
    <section className={`sh${tall ? " sh--tall" : ""}`}>
      {/* Faint V-line loop behind the title (Remotion render; source: motion/src/BannerLines.tsx). */}
      <LoopVideo src="/motion/banner-lines-full.mp4" poster="/motion/banner-lines-full.jpg" className="sh-video" />
      <div className="sh-inner">
        <span className="sh-eyebrow">{eyebrow}</span>
        <h1 className="sh-title">
          <span>{title}</span>
        </h1>
        {subtitle && <p className="sh-sub">{subtitle}</p>}
      </div>
    </section>
  );
}
