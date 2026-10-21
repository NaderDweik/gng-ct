import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { amenityFeatures } from "@/content/amenities";
import { amenitiesPageCopy, resortChapterIds } from "@/content/amenities-page";
import { ResortChapters } from "@/features/amenities/AmenitiesPage";
import { RegisterCta } from "@/features/register/RegisterCta";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/chalet/amenities");
}

/*
 * Chalet amenities: what's yours, inside the resort. Not in the navbar; opened from the
 * chalet page's room viewer. The shared places live on /compound/amenities. Pieces and
 * motion: features/amenities/AmenitiesPage.tsx; styles: styles/sections/amenities-page.css.
 */
export default async function ChaletAmenitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const c = amenitiesPageCopy[isAr ? "ar" : "en"];
  const chapters = resortChapterIds
    .map((id) => amenityFeatures.find((a) => a.id === id))
    .filter((a): a is (typeof amenityFeatures)[number] => Boolean(a));

  return (
    <>
      <PageJsonLd locale={locale} path="/chalet/amenities" />
      <SubpageHeader tall title={c.crumb} subtitle={c.heroTitle} />

      <section id="resort" className="ap-section bg-surface">
        <div className="container-gc">
          <header className="sec-head ap-svc-head">
            <div>
              <p className="section-eyebrow">{c.resortEyebrow}</p>
              <h2 className="section-title mb-0">{c.resortTitle}</h2>
            </div>
          </header>
        </div>
        {/* Edge to edge: rows and photos run to both sides of the screen. */}
        <ResortChapters items={chapters} isAr={isAr} />
      </section>

      <RegisterCta
        locale={locale}
        image="/gallery/resortsPics/foosball-kids-pool.jpg"
        video={{ src: "/motion/cta-loop.mp4", poster: "/motion/cta-loop.jpg" }}
      />
    </>
  );
}
