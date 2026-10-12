import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { availableServices, servicePhotos } from "@/content/services";
import { HomeServicesViewer } from "@/features/home/HomeServicesViewer";

/*
 * Home: what the compound runs around the chalets, leading to /services
 * (styles: styles/sections/home-links.css). Same head as the amenities section above
 * it, then a single-photo viewer of running services with a dark info card beside it.
 */

/** The services shown here, in order, each with a line about it. */
const SHOWN: { id: string; en: string; ar: string }[] = [
  {
    id: "security",
    en: "Guards on patrol and cameras across the compound, around the clock.",
    ar: "حراس في جولات دائمة وكاميرات في أنحاء الكمباوند، على مدار الساعة.",
  },
  {
    id: "housekeeping",
    en: "A dedicated cleaning team that keeps your chalet ready for every stay.",
    ar: "فريق نظافة مخصص يُبقي شاليهك جاهزًا لكل إقامة.",
  },
  {
    id: "supermarket",
    en: "Daily essentials inside the compound, a short walk from your chalet.",
    ar: "احتياجاتك اليومية داخل الكمباوند، على بعد خطوات من شاليهك.",
  },
  {
    id: "golf",
    en: "A mini golf green on the compound grounds, for residents and their guests.",
    ar: "ملعب جولف مصغّر داخل الكمباوند، للمقيمين وضيوفهم.",
  },
  {
    id: "prayer",
    en: "A prayer hall within the compound, close to every chalet.",
    ar: "مصلى داخل الكمباوند، قريب من كل شاليه.",
  },
];

export function HomeServicesStrip({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const shots = SHOWN.flatMap(({ id, en, ar }) => {
    const s = availableServices.find((x) => x.id === id);
    const src = servicePhotos[id];
    if (!s || !src) return [];
    return [{ id, src, icon: s.icon, title: isAr ? s.titleAr : s.titleEn, body: isAr ? ar : en }];
  });

  // Desktop: in the heading row. Tablets: after the photos. Phones: in the controls row.
  const servicesLink = (where: string) => (
    <Link href="/services" className={`gallery-outline-btn ${where}`.trim()}>
      {isAr ? "استكشف خدمات الكمباوند" : "Explore compound services"}
      <ArrowIcon className="arrow" />
    </Link>
  );

  return (
    <section className="section hsc-band on-dark bg-secondary text-on-dark">
      <div className="container-gc">
        <div className="sec-head hsc-head">
          <div>
            <p className="section-eyebrow">{isAr ? "خدمات الكمباوند" : "Compound services"}</p>
            <h2 className="section-title">{isAr ? "كمباوند يعمل من أجلك." : "A compound that works for you."}</h2>
          </div>
          <div className="hsc-head-cta flex flex-col items-start gap-6 lg:items-end">{servicesLink("")}</div>
        </div>
        {/* Phones: the link leads the controls row under the photos (arrows, then count). */}
        <HomeServicesViewer shots={shots} isAr={isAr} locale={locale} cta={servicesLink("hsc-all--row")} />
        {/* Tablets: the link closes the section, under the photos. */}
        {servicesLink("hsc-all--end")}
      </div>
    </section>
  );
}
