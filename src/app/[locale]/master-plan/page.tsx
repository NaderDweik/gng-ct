import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { masterPlanCopy } from "@/content/master-plan";
import { PlanExplorer } from "@/features/master-plan/PlanExplorer";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function MasterPlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = masterPlanCopy[locale === "ar" ? "ar" : "en"];

  return (
    <>
      <SubpageHeader eyebrow="Giving City" title={copy.eyebrow} subtitle={copy.title} />
      <section className="mp-page bg-surface">
        <div className="container-gc">
          <header className="sec-head">
            <div>
              <p className="section-eyebrow">{copy.eyebrow}</p>
              <h2 className="section-title">{copy.explorerTitle}</h2>
            </div>
          </header>
          <PlanExplorer locale={locale} />
        </div>
      </section>

    </>
  );
}
