import { getTranslations, setRequestLocale } from "next-intl/server";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { PriceOffer } from "@/features/pricing/PriceOffer";
import { HomeFaq } from "@/features/faq/HomeFaq";
import { faqCategories } from "@/content/faq";
import { formatNumber } from "@/lib/format";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

const steps = [
  {
    titleAr: "زيارة واستشارة",
    titleEn: "Visit & consult",
    bodyAr: "زر الموقع أو تواصل مع فريق المبيعات لاختيار الوحدة المناسبة لك.",
    bodyEn: "Visit the site or talk to our sales team to pick the right unit.",
  },
  {
    titleAr: "اختر خطتك",
    titleEn: "Choose your plan",
    bodyAr: "بالتقسيط ١٪ شهريًا، أو كاش بخصم ٢٤٪.",
    bodyEn: "Installments of 1% a month, or cash at 24% off.",
  },
  {
    titleAr: "العقد",
    titleEn: "Contract",
    bodyAr: "وقّع العقد مباشرة مع الشركة، بدون بنك. الدفعة الأولى، إن وُجدت، حسب الشاليه.",
    bodyEn: "Sign directly with the developer. No bank. A down payment, if any, depends on the chalet.",
  },
  {
    titleAr: "سند ملكية وأقساط",
    titleEn: "Deed & installments",
    bodyAr: "سند ملكية مستقل باسمك، وأقساط شهرية مريحة بدون أي فوائد.",
    bodyEn: "An independent title deed in your name, with zero-interest monthly installments.",
  },
];

export default async function FinancingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("financing");
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  const financingFaq = faqCategories.find((c) => c.id === "purchase")?.items ?? [];

  return (
    <>
      <SubpageHeader tall eyebrow="Giving City" title={t("title")} subtitle={t("subtitle")} />

      <section id="plans" className="section scroll-mt-20 bg-surface-alt">
        <div className="container-gc">
          <div className="sec-head items-end">
            <div>
              <p className="section-eyebrow">{isAr ? "الأسعار" : "Prices"}</p>
              <h2 className="section-title mb-0">
                {isAr ? "سعر واحد، وطريقتان للدفع." : "One price, two ways to pay."}
              </h2>
            </div>
            <p className="section-sub max-w-md">
              {isAr
                ? "بالتقسيط الشهري، أو كاش بخصم، مباشرة مع الشركة."
                : "Monthly installments, or cash at a discount, directly with the developer."}
            </p>
          </div>
          <PriceOffer locale={locale} jd={tc("jd")} />
        </div>
      </section>

      <section className="section on-dark bg-secondary text-on-dark">
        <div className="container-gc">
          <p className="section-eyebrow">{isAr ? "كيف يعمل" : "How it works"}</p>
          <h2 className="section-title">
            {isAr ? "أربع خطوات نحو شاليهك." : "Four steps to your chalet."}
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden border border-line-on-dark bg-fill-on-dark md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.titleEn} className="step-card">
                <span className="font-display text-5xl font-bold leading-none text-accent/80 tabular-nums">
                  {formatNumber(i + 1, locale).padStart(isAr ? 0 : 2, "0")}
                </span>
                <h3 className="font-display mt-8 text-xl font-bold text-on-dark">
                  {isAr ? s.titleAr : s.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
                  {isAr ? s.bodyAr : s.bodyEn}
                </p>
              </li>
            ))}
          </ol>
        </div>
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
