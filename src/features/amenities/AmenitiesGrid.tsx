import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { resortChapterIds } from "@/content/amenities-page";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import type { AmenityFeature } from "@/content/amenities";
import { HoverAccent } from "@/components/ui/HoverAccent";

/*
 * Home amenities — everything visible, nothing to hover (styles:
 * styles/sections/amenities-grid.css, .amg-*). A title and one short line per
 * amenity (`short*`); the full descriptions live on /amenities. Cards on larger
 * screens; compact photo-and-text rows on phones.
 * Each card links to its chapter on /amenities (or the page top if it has none);
 * hover: gentle photo ease-in, the hairline draws across, title + arrow in primary.
 */

type Props = { items: AmenityFeature[]; isAr: boolean };

const chapterHref = (id: string) =>
  (resortChapterIds as readonly string[]).includes(id) ? `/amenities#amenity-${id}` : "/amenities";

export function AmenitiesGrid({ items, isAr }: Props) {
  return (
    <ul className="amg">
      {items.map((it) => (
        <li key={it.id}>
          <Link href={chapterHref(it.id)} className="amg-item hv">
          <div className="amg-photo">
            <Image
              src={it.image}
              alt=""
              fill
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 25vw"
              className="amg-img"
            />
            <HoverAccent />
          </div>
          <div className="amg-text">
            <h3 className="amg-title">
              {isAr ? it.titleAr : it.titleEn}
              <ArrowIcon className="amg-arrow" />
            </h3>
            <p className="amg-desc">{isAr ? it.shortAr : it.shortEn}</p>
          </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
