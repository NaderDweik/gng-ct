import Image from "next/image";
import type { AmenityFeature } from "@/content/amenities";

/*
 * Home amenities — everything visible, nothing to hover (styles:
 * styles/sections/amenities-grid.css, .amg-*). Cards on larger screens;
 * compact photo-and-text rows on phones.
 */

type Props = { items: AmenityFeature[]; isAr: boolean };

export function AmenitiesGrid({ items, isAr }: Props) {
  return (
    <ul className="amg">
      {items.map((it) => (
        <li key={it.id} className="amg-item">
          <div className="amg-photo">
            <Image
              src={it.image}
              alt=""
              fill
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 25vw"
              className="amg-img"
            />
          </div>
          <div className="amg-text">
            <h3 className="amg-title">{isAr ? it.titleAr : it.titleEn}</h3>
            <p className="amg-desc">{isAr ? it.descAr : it.descEn}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
