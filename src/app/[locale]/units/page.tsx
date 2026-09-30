import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { UnitsPlans } from "@/features/units/UnitsPlans";
import { unitsCopy } from "@/content/units";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function UnitsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = locale === "ar" ? unitsCopy.ar : unitsCopy.en;

  return (
    <>
      <SubpageHeader eyebrow="Giving City" title={copy.title} subtitle={copy.subtitle} />
      <UnitsPlans />
    </>
  );
}
