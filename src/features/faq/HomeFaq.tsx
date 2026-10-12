import { Link } from "@/i18n/navigation";
import type { FaqItem } from "@/content/faq";
import { FaqAccordion } from "@/features/faq/FaqAccordion";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/*
 * Home FAQ — deliberately plain (styles: styles/sections/home-faq.css).
 * The questions are an accordion (FaqAccordion): one answer open at a time,
 * sliding smoothly, inside a reserved height so the page below never shifts.
 * Beside it, the intro and a link to the full FAQ (under the questions on phones / tablets).
 */

type Props = { items: FaqItem[]; locale: string };

export function HomeFaq({ items, locale }: Props) {
  const isAr = locale === "ar";
  // Desktop: in the intro beside the questions. Phones / tablets: after the questions.
  const seeAll = (where: string) => (
    <Link href="/faq" className={`gallery-outline-btn hfaq-all ${where}`}>
      {isAr ? "كل الأسئلة" : "See all questions"}
      <ArrowIcon className="arrow" />
    </Link>
  );

  return (
    <div className="hfaq">
      <div className="hfaq-intro">
        <p className="section-eyebrow">{isAr ? "أسئلة شائعة" : "Questions"}</p>
        <h2 className="section-title mb-0">{isAr ? "قبل أن تقرر." : "Before you decide."}</h2>
        <p className="section-sub hfaq-lead">
          {isAr
            ? "أكثر ما يسألنا عنه المشترون، بإجابات مختصرة وواضحة."
            : "What buyers ask us most, answered simply."}
        </p>
        {seeAll("hfaq-all--intro")}
      </div>

      <FaqAccordion items={items} locale={locale} />
      {/* Phones / tablets: the link closes the section, under the questions. */}
      {seeAll("hfaq-all--end")}
    </div>
  );
}
