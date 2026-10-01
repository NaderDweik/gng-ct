import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { UnitsPlans } from "@/features/units/UnitsPlans";
import { unitsCopy } from "@/content/units";
import { UnitPlanFeatures } from "@/features/units/UnitPlanFeatures";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function UnitsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = locale === "ar" ? unitsCopy.ar : unitsCopy.en;

  return (
    <>
      <SubpageHeader tall eyebrow="Giving City" title={copy.title} subtitle={copy.subtitle} />
      <UnitsPlans>
        {/* The unit plan with its rooms and spaces either side */}
        <UnitPlanFeatures locale={locale} />
      </UnitsPlans>
    </>
  );
}
