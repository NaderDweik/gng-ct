import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { UnitPlanFeatures } from "@/features/units/UnitPlanFeatures";
import { masterPlanCopy } from "@/content/master-plan";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/chalet");
}

/** The chalet plan (was /master-plan): a photo of each space beside the plan, stepped through with arrows. */
export default async function ChaletPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const copy = masterPlanCopy[isAr ? "ar" : "en"];

  return (
    <>
      <PageJsonLd locale={locale} path="/chalet" listing />
      <SubpageHeader
        tall
        compactMobile
        eyebrow={copy.eyebrow}
        title={copy.explorerTitle}
        titleMobile={isAr ? "مخطط احد الشاليهات" : undefined}
      />
      <UnitPlanFeatures locale={locale} />
    </>
  );
}
