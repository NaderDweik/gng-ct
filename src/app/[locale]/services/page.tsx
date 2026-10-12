import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { ServicesDirectory } from "@/features/services/ServicesDirectory";
import { CountUp } from "@/components/ui/CountUp";
import { serviceStats } from "@/content/services";
import { site } from "@/content/site";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/services");
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const isAr = locale === "ar";
  const c = serviceStats[isAr ? "ar" : "en"];
  const stats = [
    { value: 24, suffix: isAr ? "/٧" : "/7", label: c.security },
    { value: 3, suffix: isAr ? " م" : " m", label: c.walls },
    { value: site.stats.unitAreaSqm, suffix: isAr ? " م²" : " m²", label: c.area },
    { value: site.stats.units, suffix: "+", label: c.units },
  ];

  return (
    <>
      <PageJsonLd locale={locale} path="/services" />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />
      <ServicesDirectory
        locale={locale}
        stats={
          <dl className="svc-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="svc-stat">
                <dt>{s.label}</dt>
                {/* "367+" and "24/7" must read left to right even in Arabic; unit figures
                    ("٥٠٠ م²") keep the page direction. */}
                <dd dir={s.suffix === "+" || s.suffix.includes("/") ? "ltr" : undefined}>
                  <CountUp value={s.value} locale={locale} suffix={s.suffix} delay={i * 120} />
                </dd>
              </div>
            ))}
          </dl>
        }
      />
    </>
  );
}
