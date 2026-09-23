import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { companyServices } from "@/content/services";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc grid gap-6 md:grid-cols-2">
          {companyServices.map((s) => (
            <article key={s.id} className="border-b border-line pb-6">
              <h2 className="text-xl font-semibold text-primary-ink">
                {isAr ? s.titleAr : s.titleEn}
              </h2>
              <p className="mt-2 text-muted">{isAr ? s.descAr : s.descEn}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
