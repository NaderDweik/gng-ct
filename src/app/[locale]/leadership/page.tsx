import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

type Props = { params: Promise<{ locale: string }> };

export default async function LeadershipPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leadership");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc max-w-2xl">
          <div className="border border-sand-deep bg-sand/30 p-8">
            <p className="text-sm font-semibold text-gold">{t("founderRole")}</p>
            <h2 className="mt-2 text-2xl font-bold text-navy">
              {isAr ? site.contact : site.contactEn}
            </h2>
            <p className="mt-4 text-muted">
              {isAr ? site.companyAr : site.companyEn}
            </p>
            <p className="mt-6 text-sm text-muted">{t("moreSoon")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
