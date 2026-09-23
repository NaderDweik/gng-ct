import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { galleryImages, homeGalleryPicks } from "@/content/gallery";
import { formatNumber } from "@/lib/format";

type Props = {
  locale: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
};

export function GalleryMosaic({ locale, eyebrow, title, ctaLabel }: Props) {
  const isAr = locale === "ar";

  return (
    <div>
      <div className="sec-head items-end">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="section-title mb-0">{title}</h2>
        </div>
        <Link href="/gallery" className="gallery-outline-btn hidden md:inline-flex">
          {ctaLabel}
          <span className="text-[11px] tracking-normal opacity-60">
            ({formatNumber(galleryImages.length, locale)})
          </span>
          <span className="arrow" aria-hidden />
        </Link>
      </div>

      <div className="gm">
        {homeGalleryPicks.map((pick, i) => {
          const label = isAr ? pick.captionAr : pick.captionEn;
          return (
            <Link
              key={pick.src}
              href={`/gallery?tab=${pick.categoryId}`}
              className={`gm-tile gm-${String.fromCharCode(97 + i)}`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Image
                src={pick.src}
                alt={label}
                fill
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                className="gm-img"
                priority={i === 0}
              />
              <span className="gm-label">{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link href="/gallery" className="gallery-outline-btn">
          {ctaLabel}
          <span className="arrow" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
