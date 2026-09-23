import { setRequestLocale } from "next-intl/server";
import { masterPlanCopy } from "@/content/master-plan";
import { PlanExplorer } from "@/features/master-plan/PlanExplorer";
import { RegisterCta } from "@/features/register/RegisterCta";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function MasterPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = masterPlanCopy[locale === "ar" ? "ar" : "en"];

  return (
    <>
      {/* The plan is the page: a compact heading, then the explorer. */}
      <section className="mp-page bg-surface">
        <div className="container-gc">
          <header className="mp-page-head">
            <p className="section-eyebrow mb-2">{copy.eyebrow}</p>
            <h1 className="mp-page-title">{copy.explorerTitle}</h1>
          </header>
          <PlanExplorer locale={locale} />
        </div>
      </section>

      <RegisterCta locale={locale} image="/gallery/img_62.jpg" />
    </>
  );
}
