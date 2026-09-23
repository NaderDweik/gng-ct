import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { homeGalleryPicks } from "@/content/gallery";
import { MosaicGrid } from "@/features/gallery/MosaicGrid";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
};

export function GalleryMosaic({ locale, eyebrow, title, ctaLabel }: Props) {
  return (
    <div>
      <div className="sec-head items-end">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title mb-0">{title}</h2>
        </div>
        <Link href="/gallery" className="gallery-outline-btn hidden md:inline-flex">
          {ctaLabel}
          <ArrowIcon className="arrow" />
        </Link>
      </div>

      <MosaicGrid picks={homeGalleryPicks} locale={locale} />

      <div className="mt-8 flex justify-center md:hidden">
        <Link href="/gallery" className="gallery-outline-btn">
          {ctaLabel}
          <ArrowIcon className="arrow" />
        </Link>
      </div>
    </div>
  );
}
