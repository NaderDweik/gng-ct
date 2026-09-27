import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { FaqExplorer } from "@/features/faq/FaqExplorer";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <>
      <SubpageHeader eyebrow="Giving City" title={t("title")} subtitle={t("subtitle")} />

      <section className="section bg-surface">
        <div className="container-gc">
          <FaqExplorer />
        </div>
      </section>
    </>
  );
}
