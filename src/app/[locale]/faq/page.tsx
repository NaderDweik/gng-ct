import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqExplorer } from "@/components/FaqExplorer";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const isAr = locale === "ar";

  return (
    <>
      <section className="faq-hero">
        <div className="container-gc relative pb-12 pt-28 md:pb-16 md:pt-36">
          <p className="section-eyebrow reveal">{t("title")}</p>
          <h1 className="faq-hero-title reveal" style={{ animationDelay: "80ms" }}>
            {isAr ? "كل ما تود معرفته، في مكان واحد." : "Everything you want to know, in one place."}
          </h1>
          <p className="section-sub reveal mt-4" style={{ animationDelay: "160ms" }}>
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-gc">
          <FaqExplorer />
        </div>
      </section>
    </>
  );
}
