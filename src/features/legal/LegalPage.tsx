import type React from "react";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { Link } from "@/i18n/navigation";
import { legalUpdated, type LegalDoc } from "@/content/legal";

/* Privacy policy / terms (styles: styles/sections/legal.css): the page header, the date,
   then numbered sections in one readable column, and a link to the other document. */
export function LegalPage({
  doc,
  locale,
  other,
  children,
}: {
  doc: LegalDoc;
  locale: string;
  other: { href: "/privacy" | "/terms" | "/cookies"; label: string };
  /** Extra content after the sections (e.g. the cookie page's "change your choice" button). */
  children?: React.ReactNode;
}) {
  const isAr = locale === "ar";
  const date = new Intl.DateTimeFormat(isAr ? "ar-JO-u-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(legalUpdated),
  );

  return (
    <>
      <SubpageHeader compactMobile title={doc.title} subtitle={doc.lead} />
      <section className="section">
        <div className="container-gc legal">
          <p className="legal-updated">
            {isAr ? "آخر تحديث: " : "Last updated: "}
            <time dateTime={legalUpdated}>{date}</time>
          </p>
          <ol className="legal-sections">
            {doc.sections.map((s) => (
              <li key={s.heading} className="legal-section">
                <h2 className="legal-heading">{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </li>
            ))}
          </ol>
          {children}
          <p className="legal-other">
            <Link href={other.href}>{other.label}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
