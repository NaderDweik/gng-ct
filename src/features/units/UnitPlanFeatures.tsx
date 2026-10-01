import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import {
  masterPlanCopy,
  planItem,
  unitPlanImage,
  unitPlanPanel,
  unitPlanRows,
  type PlanItem,
} from "@/content/master-plan";
import { formatNumber } from "@/lib/format";

/*
 * /units: the unit plan in a large panel on the start side, its rooms and spaces as
 * numbered tiles on the end side (interiors and outdoors in two columns), and a facts
 * bar with the CTA underneath (styles: styles/sections/unit-plan.css). Stacks on phones.
 */

export function UnitPlanFeatures({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const copy = masterPlanCopy[isAr ? "ar" : "en"];
  const panel = unitPlanPanel[isAr ? "ar" : "en"];
  const pick = (ids: readonly string[]) => ids.map(planItem).filter((it): it is PlanItem => Boolean(it));
  const inside = pick(unitPlanRows.start);
  const outside = pick(unitPlanRows.end);
  const num = (n: number) => formatNumber(n, locale).padStart(2, isAr ? "٠" : "0");

  const Group = ({ label, items, from }: { label: string; items: PlanItem[]; from: number }) => (
    <div className="up-group">
      <p className="up-group-label">{label}</p>
      <ul className="up-tiles">
        {items.map((it, i) => (
          <li key={it.id} className="up-tile">
            <span className="up-num">{num(from + i)}</span>
            <h3 className="up-title">{isAr ? it.titleAr : it.titleEn}</h3>
            <p className="up-body">{isAr ? it.bodyAr : it.bodyEn}</p>
          </li>
        ))}
      </ul>
    </div>
  );

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

        <div className="up-grid">
          <figure className="up-plan">
            <Image
              src={unitPlanImage.src}
              alt={copy.mapAlt}
              width={unitPlanImage.width}
              height={unitPlanImage.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </figure>
          <div className="up-groups">
            <Group label={panel.inside} items={inside} from={1} />
            <Group label={panel.outside} items={outside} from={inside.length + 1} />
          </div>
        </div>

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
