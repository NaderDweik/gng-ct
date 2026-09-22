import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { LocationShowcase } from "@/components/LocationShowcase";

type Props = { params: Promise<{ locale: string }> };

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section bg-[#f2f4f3]">
        <div className="container-gc">
          <LocationShowcase />
        </div>
      </section>
    </>
  );
}
