import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { compoundCopy } from "@/content/units";
import type { LocalePageProps } from "@/i18n/types";
import { CompoundPlan } from "@/features/units/CompoundPlan";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/compound");
}

/** Page header + the compound explorer (was /units), together exactly one screen (styles: compound-plan.css). */
export default async function CompoundPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const copy = compoundCopy[isAr ? "ar" : "en"];

  return (
    <div className="cx-page">
      <PageJsonLd locale={locale} path="/compound" listing />
      <SubpageHeader compactMobile eyebrow={copy.eyebrow} title={isAr ? "اختر الشاليه" : "Compound"} subtitle={copy.lede} />
      <CompoundPlan locale={locale} />
    </div>
  );
}
