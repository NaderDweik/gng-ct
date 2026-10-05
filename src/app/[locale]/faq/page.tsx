import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { FaqExplorer } from "@/features/faq/FaqExplorer";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/faq");
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <>
      <PageJsonLd locale={locale} path="/faq" />
      <JsonLd data={faqJsonLd(locale === "en" ? "en" : "ar")} />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />

      <section className="section bg-surface">
        <div className="container-gc">
          <FaqExplorer />
        </div>
      </section>
    </>
  );
}
