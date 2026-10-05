import { JsonLd } from "@/components/seo/JsonLd";
import { mainNav } from "@/content/nav";
import { breadcrumbJsonLd, listingJsonLd } from "@/lib/seo";

type Props = {
  locale: string;
  path: string;
  /** Adds the chalet RealEstateListing (offer pages only). */
  listing?: boolean;
};

/** Per-page structured data: Home → page breadcrumb, plus the listing where it applies. */
export function PageJsonLd({ locale: raw, path, listing }: Props) {
  const locale = raw === "en" ? "en" : "ar";
  const nav = mainNav.find((n) => n.href === path);
  const name = nav ? (locale === "ar" ? nav.labelAr : nav.labelEn) : path;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name, path }])} />
      {listing && <JsonLd data={listingJsonLd(locale, path)} />}
    </>
  );
}
