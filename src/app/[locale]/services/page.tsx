import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { ServicesDirectory } from "@/features/services/ServicesDirectory";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />
      <ServicesDirectory locale={locale} />
    </>
  );
}
