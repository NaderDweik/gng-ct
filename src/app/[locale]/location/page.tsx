import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { LocationShowcase } from "@/features/location/LocationShowcase";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");

  return (
    <>
      <SubpageHeader eyebrow="Giving City" title={t("title")} subtitle={t("subtitle")} />
      <section className="section bg-surface-tint">
        <div className="container-gc">
          <LocationShowcase />
        </div>
      </section>
    </>
  );
}
