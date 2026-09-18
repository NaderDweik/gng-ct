import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";

type Props = { params: Promise<{ locale: string }> };

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-brand">{t("directions")}</h2>
            <p className="mt-3 text-muted leading-relaxed">
              {isAr ? site.locationAr : site.locationEn}
            </p>
            <ul className="mt-6 space-y-2 text-muted">
              <li>{t("parking")}</li>
              <li>{t("highway")}</li>
            </ul>
            <h2 className="mt-10 text-xl font-semibold text-brand">{t("hours")}</h2>
            <ul className="mt-3 space-y-2 text-muted">
              <li>{isAr ? site.hoursAr.weekdays : site.hoursEn.weekdays}</li>
              <li>{isAr ? site.hoursAr.saturday : site.hoursEn.saturday}</li>
            </ul>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-8"
            >
              Google Maps
            </a>
          </div>
          <div className="overflow-hidden border border-line">
            <iframe
              title="Giving City map"
              src={`https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&z=13&output=embed`}
              className="h-[28rem] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
