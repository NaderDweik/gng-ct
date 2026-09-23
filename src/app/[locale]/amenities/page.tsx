import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { AmenitiesHoverGrid } from "@/features/amenities/AmenitiesHoverGrid";
import { amenityFeatures, amenitiesIntro } from "@/content/amenities";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function AmenitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("amenities");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section overflow-hidden border-b border-line bg-surface">
        <div className="container-gc space-y-12">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="space-y-5 text-start">
              <p className="section-eyebrow mb-0">
                {isAr ? amenitiesIntro.eyebrowAr : amenitiesIntro.eyebrowEn}
              </p>
              <h2 className="section-title mb-0 max-w-3xl">
                {isAr ? amenitiesIntro.titleAr : amenitiesIntro.titleEn}
              </h2>
            </div>
            <p className="text-start text-base font-light leading-relaxed text-muted md:text-lg lg:max-w-2xl lg:justify-self-end">
              {isAr ? amenitiesIntro.subAr : amenitiesIntro.subEn}
            </p>
          </div>
          <AmenitiesHoverGrid items={amenityFeatures} isAr={isAr} />
        </div>
      </section>
    </>
  );
}
