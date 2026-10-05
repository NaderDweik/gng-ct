import { setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { unitsCopy } from "@/content/units";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/units");
}

export default async function UnitsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const copy = isAr ? unitsCopy.ar : unitsCopy.en;

  return (
    <>
      <PageJsonLd locale={locale} path="/units" listing />
      <SubpageHeader tall eyebrow="Giving Compound" title={copy.title} subtitle={copy.subtitle} />
      {/* Placeholder until the full compound plan (every chalet) arrives; the chalet plan lives on /master-plan. */}
      <section className="section bg-surface">
        <div className="container-gc">
          <p className="mx-auto max-w-2xl border border-dashed border-line-strong px-6 py-12 text-center text-lg text-muted">
            {isAr ? "بانتظار مخطط الكمبوند من د. طارق" : "Waiting on the compound plan from Dr. Tarek"}
          </p>
        </div>
      </section>
    </>
  );
}
