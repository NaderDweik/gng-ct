import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { amenityFeatures } from "@/content/amenities";
import { amenitiesPageCopy, communityPlaces, resortChapterIds } from "@/content/amenities-page";
import { CommunityMosaic, ResortChapters } from "@/features/amenities/AmenitiesPage";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/amenities");
}

/*
 * Amenities: what's yours (inside the resort) and what's shared (across the
 * community); the services that keep it running live on /services. Pieces and motion:
 * features/amenities/AmenitiesPage.tsx; styles: styles/sections/amenities-page.css.
 */
export default async function AmenitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const c = amenitiesPageCopy[isAr ? "ar" : "en"];
  const chapters = resortChapterIds
    .map((id) => amenityFeatures.find((a) => a.id === id))
    .filter((a): a is (typeof amenityFeatures)[number] => Boolean(a));

  return (
    <>
      <PageJsonLd locale={locale} path="/amenities" />
      <SubpageHeader tall title={c.crumb} subtitle={c.heroTitle} />

      {/* 1 · Inside your resort */}
      <section id="resort" className="ap-section bg-surface">
        <div className="container-gc">
          <header className="sec-head ap-svc-head">
            <div>
              <p className="section-eyebrow">{c.resortEyebrow}</p>
              <h2 className="section-title mb-0">{c.resortTitle}</h2>
            </div>
            <p className="section-sub">{c.resortLead}</p>
          </header>
        </div>
        {/* Edge to edge: rows and photos run to both sides of the screen. */}
        <ResortChapters items={chapters} isAr={isAr} />
      </section>

      {/* 2 · Across the community */}
      <section id="community" className="ap-section bg-surface-alt">
        <div className="container-gc">
          <header className="sec-head ap-svc-head">
            <div>
              <p className="section-eyebrow">{c.communityEyebrow}</p>
              <h2 className="section-title mb-0">{c.communityTitle}</h2>
            </div>
            <p className="section-sub">{c.communityLead}</p>
          </header>
          <CommunityMosaic places={communityPlaces} isAr={isAr} />
        </div>
      </section>

    </>
  );
}
