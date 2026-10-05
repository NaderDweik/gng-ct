import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { ServicesDirectory } from "@/features/services/ServicesDirectory";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/services");
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <PageJsonLd locale={locale} path="/services" />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />
      <ServicesDirectory locale={locale} />
    </>
  );
}
