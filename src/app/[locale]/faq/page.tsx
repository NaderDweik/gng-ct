import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqExplorer } from "@/features/faq/FaqExplorer";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const isAr = locale === "ar";

  return (
    <>
      <section className="faq-hero gal-hero on-dark">
        <Image
          src="/gallery/compoundPics/golf-cart-shuttle-street.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="gal-hero-img"
        />
        <div className="gal-hero-shade" aria-hidden />
        <div className="container-gc relative z-[1] flex min-h-[min(56svh,500px)] flex-col justify-end pb-12 pt-28 md:pb-16 md:pt-36">
          <p className="section-eyebrow reveal">{t("title")}</p>
          <h1 className="faq-hero-title reveal" style={{ animationDelay: "80ms" }}>
            {isAr ? "كل ما تود معرفته، في مكان واحد." : "Everything you want to know, in one place."}
          </h1>
          <p className="gal-hero-lead reveal mt-4 max-w-2xl" style={{ animationDelay: "160ms" }}>
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
