import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { projectAmenities } from "@/content/services";

type Props = { params: Promise<{ locale: string }> };

export default async function AmenitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("amenities");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectAmenities.map((a) => (
            <article key={a.id} className="bg-brand-secondary p-6">
              <h2 className="text-lg font-semibold text-brand">
                {isAr ? a.titleAr : a.titleEn}
              </h2>
              <p className="mt-2 text-sm text-muted">{isAr ? a.descAr : a.descEn}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
