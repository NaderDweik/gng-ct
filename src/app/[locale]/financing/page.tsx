import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { PricingShowcase } from "@/features/pricing/PricingShowcase";
import { HomeFaq } from "@/features/faq/HomeFaq";
import { faqCategories } from "@/content/faq";
import { formatNumber } from "@/lib/format";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";
import { InViewOnce } from "@/components/ui/InViewOnce";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/financing");
}

const steps = [
  {
    titleAr: "زيارة واختيار الشاليه",
    titleEn: "Visit & pick your chalet",
    bodyAr: "زر مكتب المبيعات لتختار شاليهك من الشاليهات المتاحة.",
    bodyEn: "Visit our sales office to choose from the available chalets.",
  },
  {
    titleAr: "اختر خطتك",
    titleEn: "Choose your plan",
    bodyAr: "نقدًا بخصم ٢٤٪، أو بالتقسيط: دفعة أولى نتفق عليها معك، وكلما زادت استلمت أسرع.",
    bodyEn: "Cash at 24% off, or installments: a down payment we agree with you, and the bigger it is, the sooner you move in.",
  },
  {
    titleAr: "العقد",
    titleEn: "Contract",
    bodyAr: "وقّع العقد مباشرة مع الشركة، بدون بنك، وادفع دفعتك الأولى أو المبلغ النقدي.",
    bodyEn: "Sign directly with the developer, no bank, and pay your down payment or the cash price.",
  },
  {
    titleAr: "سند ملكية وأقساط",
    titleEn: "Deed & installments",
    bodyAr: "سند ملكية مستقل باسمك، وأقساط شهرية ثابتة بقيمة ١٪ من السعر.",
    bodyEn: "An independent title deed in your name, with fixed monthly installments of 1% of the price.",
  },
];

export default async function FinancingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("financing");
  const isAr = locale === "ar";

  const financingFaq = faqCategories.find((c) => c.id === "pricing")?.items ?? [];

  return (
    <>
      <PageJsonLd locale={locale} path="/financing" listing />
      <SubpageHeader tall title={t("title")} subtitle={t("subtitle")} />

      <section id="plans" className="section scroll-mt-20 on-dark bg-secondary text-on-dark">
        <div className="container-gc">
          <PricingShowcase />
        </div>
      </section>

      <section className="section on-dark bg-secondary text-on-dark">
        <div className="container-gc steps-head">
          <p className="section-eyebrow">{isAr ? "كيف يعمل" : "How it works"}</p>
          <h2 className="section-title">
            {isAr ? "أربع خطوات نحو شاليهك." : "Four steps to your chalet."}
          </h2>
          <div className="steps-wrap mt-12">
          {/* A chalet photo in its own box behind step 04, offset so it peeks out past it. */}
          <div className="steps-photo" aria-hidden>
            <Image
              src="/gallery/resortsPics/pool-and-tent-pavilion-hd.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 28vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* A smaller photo floating over the big one's top-start corner. */}
          <div className="steps-float" aria-hidden>
            <Image
              src="/gallery/resortsPics/family-lounge-under-pergola.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 15vw, 1px"
              className="object-cover"
            />
          </div>
          <ol className="steps-grid grid gap-px overflow-hidden border border-line-on-dark bg-fill-on-dark md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.titleEn} className="step-card">
                <span className="step-num font-display text-(length:--fs-stat) font-bold leading-none text-accent/80 tabular-nums">
                  {formatNumber(i + 1, locale).padStart(isAr ? 0 : 2, "0")}
                </span>
                <h3 className="step-title font-display mt-5 text-xl font-bold text-on-dark">
                  {isAr ? s.titleAr : s.titleEn}
                </h3>
                <p className="step-body mt-3 text-sm leading-relaxed text-on-dark-muted">
                  {isAr ? s.bodyAr : s.bodyEn}
                </p>
              </li>
            ))}
          </ol>
          </div>
        </div>
        {/* Phones: blocks reveal as they scroll in (financing.css, .is-in). */}
        <InViewOnce selector=".fin-head, .fin-plan, .fin-price, .steps-head > .section-title, .step-card" rootMargin="0px 0px -12% 0px" />
      </section>

      {financingFaq.length > 0 && (
        <section className="section border-y border-line bg-surface">
          <div className="container-gc">
            <HomeFaq items={financingFaq} locale={locale} />
          </div>
        </section>
      )}

    </>
  );
}
