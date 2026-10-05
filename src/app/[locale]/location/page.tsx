import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { LocationShowcase } from "@/features/location/LocationShowcase";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/location");
}

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");

  return (
    <>
      <PageJsonLd locale={locale} path="/location" />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />
      <section className="section bg-surface-tint">
        <div className="container-gc">
          <LocationShowcase />
        </div>
      </section>
    </>
  );
}
