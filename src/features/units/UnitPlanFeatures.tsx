import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { masterPlanCopy, unitPlanPanel } from "@/content/master-plan";
import { PlanExplorer } from "@/features/master-plan/PlanExplorer";

/*
 * /units: the animated colour plan (the master-plan explorer) on the start side, its
 * rooms and spaces as numbered tiles on the end side (interiors and outdoors in two
 * columns) that light their space up on the plan, and a facts bar with the CTA
 * underneath (styles: styles/sections/unit-plan.css). Stacks on phones.
 */

export function UnitPlanFeatures({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const copy = masterPlanCopy[isAr ? "ar" : "en"];
  const panel = unitPlanPanel[isAr ? "ar" : "en"];

  return (
    <section className="section bg-surface">
      <div className="container-gc">
        <header className="sec-head">
          <div>
            <p className="section-eyebrow">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.explorerTitle}</h2>
          </div>
          <p className="section-sub">{copy.caption}</p>
        </header>

        <PlanExplorer locale={locale} variant="tiles" defaultId="pool" />

        <div className="up-bar">
          <dl className="up-facts">
            {panel.facts.map((f) => (
              <div key={f.label} className="up-fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={unitPlanPanel.href} className="btn btn-primary up-cta">
            {panel.cta}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
