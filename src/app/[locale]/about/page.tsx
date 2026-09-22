import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-muted">{t("story")}</p>
            <p className="mt-6 text-brand font-medium">{t("founder")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.social.instagram} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={site.social.facebook} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href={site.whatsappUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                {tc("whatsapp")}
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [`${site.stats.units}+`, isAr ? "منتجع خاص" : "private resorts"],
              [formatNumber(site.stats.areaSqm, locale), isAr ? "م²" : "m²"],
              [`${site.stats.unitAreaSqm}`, isAr ? "م² لكل وحدة" : "m² per unit"],
              [site.iso, tc("iso")],
            ].map(([v, l]) => (
              <div key={String(l)} className="bg-brand-secondary p-6">
                <p className="text-2xl font-bold text-brand">{v}</p>
                <p className="mt-1 text-sm text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
