import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { UnitPlanFeatures } from "@/features/units/UnitPlanFeatures";
import { masterPlanCopy } from "@/content/master-plan";
import { site } from "@/content/site";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/master-plan");
}

/** The chalet plan with its room tiles, then the full chalet tour video. */
export default async function MasterPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const copy = masterPlanCopy[isAr ? "ar" : "en"];
  const t = await getTranslations("gallery");

  return (
    <>
      <PageJsonLd locale={locale} path="/master-plan" />
      <SubpageHeader tall eyebrow="Giving Compound" title={copy.eyebrow} subtitle={copy.title} />
      <UnitPlanFeatures locale={locale} />

      {/* The chalet tour: walk the plan above, room by room. */}
      <section className="section bg-surface-alt">
        <div className="container-gc">
          <header className="mx-auto mb-10 max-w-2xl text-center">
            <p className="section-eyebrow">{isAr ? "شاهد الشاليه" : "See the chalet"}</p>
            <h2 className="section-title mx-auto">{t("tour")}</h2>
            <p className="section-sub mx-auto">
              {isAr
                ? "تجوّل في الشاليه من المدخل إلى المسبح، كما في المخطط أعلاه."
                : "Walk through the chalet from the entrance to the pool, just as in the plan above."}
            </p>
          </header>
          <div className="mx-auto max-w-5xl">
            <VideoPlayer {...site.videos.tour} title={t("tour")} locale={locale} className="shadow-card-lg" />
          </div>
        </div>
      </section>
    </>
  );
}
