import { Link } from "@/i18n/navigation";
import type { FaqItem } from "@/content/faq";
import { site } from "@/content/site";
import { displayPhone } from "@/lib/format";
import { FaqAccordion } from "@/features/faq/FaqAccordion";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/*
 * Home FAQ — deliberately plain (styles: styles/sections/home-faq.css).
 * The questions are an accordion (FaqAccordion): one answer open at a time,
 * sliding smoothly, inside a reserved height so the page below never shifts.
 * Beside it, a person to call — the way many buyers prefer to ask.
 */

type Props = { items: FaqItem[]; locale: string };

export function HomeFaq({ items, locale }: Props) {
  const isAr = locale === "ar";
  const hours = isAr ? site.hoursAr : site.hoursEn;
  const tel = `tel:${site.phoneAction || site.phone}`;

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
        <Link href="/faq" className="gallery-outline-btn hfaq-all">
          {isAr ? "كل الأسئلة" : "See all questions"}
          <ArrowIcon className="arrow" />
        </Link>

        <div className="hfaq-person">
          <p className="hfaq-person-title">{isAr ? "تفضّل التحدث مع شخص؟" : "Prefer to ask a person?"}</p>
          <a href={tel} className="hfaq-phone" dir="ltr">
            {displayPhone(site.phone)}
          </a>
          <p className="hfaq-hours">
            {hours.weekdays}
            <br />
            {hours.saturday}
          </p>
          <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hfaq-whatsapp">
            {isAr ? "راسلنا على واتساب" : "Message us on WhatsApp"}
          </a>
        </div>
      </div>

      <FaqAccordion items={items} locale={locale} />
    </div>
  );
}
