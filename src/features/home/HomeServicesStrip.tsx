import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { availableServices, servicePhotos, upcomingServices } from "@/content/services";
import { ServiceIcon } from "@/features/services/ServiceIcon";
import { formatNumber } from "@/lib/format";

/*
 * Home: what the compound runs around the chalets, leading to /services
 * (styles: styles/sections/home-links.css). Same head as the amenities section above
 * it, then a photo bento of running services (one big, four small), each a real photo
 * with its name on a white corner card, the same caption look as the /services viewer.
 */

const SHOWN = ["security", "housekeeping", "supermarket", "golf", "prayer"];

export function HomeServicesStrip({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);
  const shown = SHOWN.map((id) => availableServices.find((s) => s.id === id)).filter((s) => s !== undefined);

  return (
    <section className="section border-b border-line bg-surface-alt">
      <div className="container-gc space-y-12">
        <div className="sec-head">
          <div>
            <p className="section-eyebrow">{isAr ? "خدمات الكمبوند" : "Compound services"}</p>
            <h2 className="section-title">{isAr ? "كمبوند يعمل من أجلك." : "A compound that works for you."}</h2>
          </div>
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <p className="section-sub">
              {isAr
                ? `${n(availableServices.length)} خدمة تعمل اليوم حول شاليهك، و${n(upcomingServices.length)} أخرى قادمة.`
                : `${availableServices.length} services run around your chalet today, with ${upcomingServices.length} more on the way.`}
            </p>
            <Link href="/services" className="gallery-outline-btn">
              {isAr ? "استكشف خدمات الكمبوند" : "Explore compound services"}
              <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
        <ul className="hsv-grid">
          {shown.map((s, i) => (
            <li key={s.id} className={`hsv-card${i === 0 ? " is-big" : ""}`}>
              <Link href="/services" className="hsv-link">
                <Image
                  src={servicePhotos[s.id] ?? ""}
                  alt={isAr ? s.titleAr : s.titleEn}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  className="hsv-img"
                />
                <span className="hsv-cap">
                  <span className="hsv-icon">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <span className="hsv-title">{isAr ? s.titleAr : s.titleEn}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
