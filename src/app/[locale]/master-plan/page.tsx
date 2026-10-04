import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { UnitsPlans } from "@/features/units/UnitsPlans";
import { UnitPlanFeatures } from "@/features/units/UnitPlanFeatures";
import { masterPlanCopy } from "@/content/master-plan";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

/** Same body as /units (intro + the plan with its room tiles), under the master-plan header. */
export default async function MasterPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = masterPlanCopy[locale === "ar" ? "ar" : "en"];

  return (
    <>
      <SubpageHeader tall eyebrow="Giving Compound" title={copy.eyebrow} subtitle={copy.title} />
      <UnitsPlans>
        <UnitPlanFeatures locale={locale} />
      </UnitsPlans>
    </>
  );
}
