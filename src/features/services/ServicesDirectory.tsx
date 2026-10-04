import { availableServices, servicesCopy, upcomingServices } from "@/content/services";
import { formatNumber } from "@/lib/format";
import { ServiceIcon } from "@/features/services/ServiceIcon";

/*
 * /services (styles: styles/sections/services-directory.css): one calm view.
 * What runs today as icon tiles on the start side; what is coming as quiet
 * name tags on the end side. Stacks on phones.
 */

export function ServicesDirectory({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const copy = servicesCopy[isAr ? "ar" : "en"];
  const fmt = (n: number) => formatNumber(n, locale);

  return (
    <section className="svc">
      <div className="container-gc svc-grid">
        <div className="svc-panel">
          <header className="svc-head">
            <h2 className="svc-title">
              <span className="svc-live" aria-hidden />
              {copy.available}
              <span className="svc-count">{fmt(availableServices.length)}</span>
            </h2>
            <p className="svc-sub">{copy.availableSub}</p>
          </header>
          <ul className="svc-tiles">
            {availableServices.map((s) => (
              <li key={s.id} className="svc-tile">
                <span className="svc-tile-icon">
                  <ServiceIcon name={s.icon} />
                </span>
                <span className="svc-tile-title">{isAr ? s.titleAr : s.titleEn}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="svc-panel svc-panel--soon">
          <header className="svc-head">
            <h2 className="svc-title">
              {copy.upcoming}
              <span className="svc-count">{fmt(upcomingServices.length)}</span>
            </h2>
            <p className="svc-sub">{copy.upcomingSub}</p>
          </header>
          <ul className="svc-tags">
            {upcomingServices.map((s) => (
              <li key={s.id} className="svc-tag">
                {isAr ? s.titleAr : s.titleEn}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
