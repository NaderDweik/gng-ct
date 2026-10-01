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
  CommunityGrid,
  ResortIndex,
  RingMark,
  ServiceSheet,
} from "@/features/amenities/AmenitiesPage";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

/*
 * Amenities zooms out in three rings: what's yours (inside your walls), what's
 * shared (inside the gates) and who keeps it running (behind the scenes). Pieces and motion:
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
    { value: site.stats.areaSqm, suffix: isAr ? " م²" : " m²", label: c.stats.grounds },
    { value: site.stats.units, suffix: "+", label: c.stats.units },
  ];

  const head = (ring: 0 | 1 | 2, eyebrow: string, title: string, lead: string) => (
    <header className="sec-head">
      <div>
        <p className="section-eyebrow ap-eyebrow">
          <RingMark ring={ring} />
          <span>
            {(ring + 1).toLocaleString(isAr ? "ar-JO" : "en-US").padStart(isAr ? 0 : 2, "0")} · {eyebrow}
          </span>
        </p>
        <h2 className="section-title mb-0">{title}</h2>
      </div>
      <p className="section-sub">{lead}</p>
    </header>
  );

  return (
    <>
      <SubpageHeader tall eyebrow="Giving City" title={c.crumb} subtitle={c.heroTitle} />

      {/* 1 · Inside your walls */}
      <section id="resort" className="ap-section bg-surface">
        <div className="container-gc">
          {head(0, c.resortEyebrow, c.resortTitle, c.resortLead)}
          <ResortIndex items={chapters} isAr={isAr} />
        </div>
      </section>

      {/* 2 · Inside the gates */}
      <section id="community" className="ap-section bg-surface-alt">
        <div className="container-gc">
          {head(1, c.communityEyebrow, c.communityTitle, c.communityLead)}
          <CommunityGrid places={communityPlaces} isAr={isAr} />
        </div>
      </section>

      {/* 3 · Behind the scenes */}
      <section id="services" className="ap-section bg-surface">
        <div className="container-gc">
          {head(2, c.servicesEyebrow, c.servicesTitle, c.servicesLead)}
          <ServiceSheet
            lines={serviceLines}
            isAr={isAr}
            figures={
              <dl className="sv-figures">
                {stats.map((s, i) => (
                  <div key={s.label} className="sv-figure">
                    <dt>{s.label}</dt>
                    <dd>
                      <CountUp value={s.value} locale={locale} suffix={s.suffix} delay={i * 120} />
                    </dd>
                  </div>
                ))}
              </dl>
            }
          />
        </div>
      </section>
    </>
  );
}
