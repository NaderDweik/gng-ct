import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { site } from "@/content/site";
import { basePriceJd } from "@/content/pricing";

type Props = { params: Promise<{ locale: string }> };

const sampleUnits = [
  { id: "A-12", status: "available" as const, phase: 1 },
  { id: "B-04", status: "reserved" as const, phase: 1 },
  { id: "C-21", status: "available" as const, phase: 2 },
  { id: "D-08", status: "sold" as const, phase: 2 },
  { id: "E-15", status: "available" as const, phase: 3 },
  { id: "F-03", status: "reserved" as const, phase: 3 },
];

export default async function UnitsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("units");
  const tc = await getTranslations("common");

  const statusLabel = {
    available: t("statusAvailable"),
    reserved: t("statusReserved"),
    sold: t("statusSold"),
  };

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc">
          <p className="mb-8 max-w-2xl text-muted">{t("note")}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleUnits.map((u) => (
              <article key={u.id} className="border border-sand-deep bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy">{u.id}</h2>
                  <span
                    className={`text-xs font-semibold ${
                      u.status === "available"
                        ? "text-olive"
                        : u.status === "reserved"
                          ? "text-gold"
                          : "text-muted"
                    }`}
                  >
                    {statusLabel[u.status]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {site.stats.unitAreaSqm} m² · {basePriceJd.toLocaleString(locale)}{" "}
                  {tc("jd")}
                </p>
                <p className="mt-1 text-xs text-muted">Phase {u.phase}</p>
                {u.status === "available" && (
                  <a
                    href={`${site.whatsappUrl}?text=${encodeURIComponent(`استفسار عن الوحدة ${u.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-4 !py-2 text-sm"
                  >
                    {t("cta")}
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
