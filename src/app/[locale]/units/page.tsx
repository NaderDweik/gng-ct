import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { compoundCopy } from "@/content/units";
import type { LocalePageProps } from "@/i18n/types";
import { CompoundPlan } from "@/features/units/CompoundPlan";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/units");
}

/** Page header + the compound explorer, together exactly one screen (styles: compound-plan.css). */
export default async function UnitsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = compoundCopy[locale === "ar" ? "ar" : "en"];

  return (
    <div className="cx-page">
      <PageJsonLd locale={locale} path="/units" listing />
      <SubpageHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.lede} />
      <CompoundPlan locale={locale} />
    </div>
  );
}
