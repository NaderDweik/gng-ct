import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { FinancingCalculator } from "@/components/FinancingCalculator";

type Props = { params: Promise<{ locale: string }> };

export default async function FinancingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("financing");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc">
          <FinancingCalculator />
        </div>
      </section>
    </>
  );
}
