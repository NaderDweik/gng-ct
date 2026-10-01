import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { CountUp } from "@/components/ui/CountUp";
import { amenityFeatures } from "@/content/amenities";
import {
  amenitiesPageCopy,
  communityPlaces,
  resortChapterIds,
  serviceLines,
} from "@/content/amenities-page";
import { site } from "@/content/site";
import {
  CommunityMosaic,
  ResortChapters,
  ServiceList,
} from "@/features/amenities/AmenitiesPage";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

/*
 * Amenities: what's yours (inside the resort), what's shared (across the
 * community) and who keeps it running (serviced daily). Pieces and motion:
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

  const stats = [
    { value: 24, suffix: isAr ? "/٧" : "/7", label: c.stats.security },
    { value: 3, suffix: isAr ? " م" : " m", label: c.stats.walls },
    { value: site.stats.unitAreaSqm, suffix: isAr ? " م²" : " m²", label: c.stats.area },
    { value: site.stats.units, suffix: "+", label: c.stats.units },
  ];

  return (
    <>
      <SubpageHeader tall eyebrow="Giving City" title={c.crumb} subtitle={c.heroTitle} />

      {/* 1 · Inside your resort */}
      <section id="resort" className="ap-section bg-surface">
        <div className="container-gc">
          <header className="sec-head">
            <div>
              <p className="section-eyebrow">{c.resortEyebrow}</p>
              <h2 className="section-title mb-0">{c.resortTitle}</h2>
            </div>
            <p className="section-sub">{c.resortLead}</p>
          </header>
          <ResortChapters items={chapters} isAr={isAr} />
        </div>
      </section>

      {/* 2 · Across the community */}
      <section id="community" className="ap-section bg-surface-alt">
        <div className="container-gc">
          <header className="sec-head">
            <div>
              <p className="section-eyebrow">{c.communityEyebrow}</p>
              <h2 className="section-title mb-0">{c.communityTitle}</h2>
            </div>
            <p className="section-sub">{c.communityLead}</p>
          </header>
          <CommunityMosaic places={communityPlaces} isAr={isAr} />
        </div>
      </section>

      {/* 3 · Serviced daily */}
      <section id="services" className="ap-section bg-surface">
        <div className="container-gc">
          <header className="sec-head">
            <div>
              <p className="section-eyebrow">{c.servicesEyebrow}</p>
              <h2 className="section-title mb-0">{c.servicesTitle}</h2>
            </div>
            <p className="section-sub">{c.servicesLead}</p>
          </header>

          <dl className="ap-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="ap-stat">
                <dt>{s.label}</dt>
                <dd>
                  <CountUp value={s.value} locale={locale} suffix={s.suffix} delay={i * 120} />
                </dd>
              </div>
            ))}
          </dl>

          <ServiceList lines={serviceLines} isAr={isAr} />
        </div>
      </section>

    </>
  );
}
