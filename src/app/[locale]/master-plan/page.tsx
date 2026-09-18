import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

type Props = { params: Promise<{ locale: string }> };

export default async function MasterPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("masterPlan");
  const tc = await getTranslations("common");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc">
          <div className="flex min-h-72 items-center justify-center border border-dashed border-line bg-brand-secondary p-10 text-center">
            <div>
              <p className="text-muted max-w-lg">{t("pending")}</p>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6"
              >
                {tc("whatsapp")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
