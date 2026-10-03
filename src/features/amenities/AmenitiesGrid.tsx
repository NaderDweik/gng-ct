import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { resortChapterIds } from "@/content/amenities-page";
import type { AmenityFeature } from "@/content/amenities";
import { AmenityIcon } from "@/features/amenities/AmenitiesHoverGrid";

/*
 * Home amenities as horizontal cards (styles: styles/sections/amenities-grid.css, .amg-*):
 * photo flush on the start side, icon + title + one short line (`short*`) beside it; the
 * full descriptions live on /amenities. Hover / focus: the border turns primary, the photo's
 * window opens across the card (the image glides into place, never rescales) under a dark
 * tint, and the text turns light and slides back to the card's start edge, all on one easing.
 * Each card links to its chapter on /amenities (or the page top if it has none).
 */

type Props = { items: AmenityFeature[]; isAr: boolean };

const chapterHref = (id: string) =>
  (resortChapterIds as readonly string[]).includes(id) ? `/amenities#amenity-${id}` : "/amenities";

export function AmenitiesGrid({ items, isAr }: Props) {
  return (
    <ul className="amg">
      {items.map((it) => (
        <li key={it.id}>
          <Link href={chapterHref(it.id)} className="amg-card">
            <span className="amg-photo" aria-hidden>
              <span className="amg-frame">
                <Image src={it.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="amg-img" />
              </span>
            </span>
            <span className="amg-text">
              <span className="amg-icon">
                <AmenityIcon name={it.icon} />
              </span>
              <span className="amg-title">{isAr ? it.titleAr : it.titleEn}</span>
              <span className="amg-desc">{isAr ? it.shortAr : it.shortEn}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
