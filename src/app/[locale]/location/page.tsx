import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { LocationShowcase } from "@/features/location/LocationShowcase";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section bg-surface-tint">
        <div className="container-gc">
          <LocationShowcase />
        </div>
      </section>
    </>
  );
}
