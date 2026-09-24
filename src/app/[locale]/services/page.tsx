import Image from "next/image";
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
      <PageHero title={t("title")} subtitle={t("subtitle")} image="/gallery/compoundPics/reception-building.png" />
      <section className="section">
        <div className="container-gc grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {companyServices.map((s) => (
            <article key={s.id} className="group">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-alt">
                <Image
                  src={s.image}
                  alt={isAr ? s.titleAr : s.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-primary-ink">
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
