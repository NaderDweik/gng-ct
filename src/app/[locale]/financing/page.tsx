import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { PricingShowcase } from "@/components/PricingShowcase";
import { PlanCompare } from "@/components/PlanCompare";
import { HomeFaqPreview } from "@/components/HomeFaqPreview";
import { RegisterCta } from "@/components/RegisterCta";
import { faqCategories } from "@/content/faq";
import { formatNumber } from "@/lib/format";

type Props = { params: Promise<{ locale: string }> };

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
    bodyAr: "استلام فوري أو متوسط الأجل أو مستقبلي — أو الدفع النقدي بخصم.",
    bodyEn: "Immediate, mid-term or future move-in — or pay cash at a discount.",
  },
  {
    titleAr: "الدفعة الأولى والعقد",
    titleEn: "Down payment & contract",
    bodyAr: "ادفع الدفعة الأولى ووقّع العقد مباشرة مع الشركة — بدون بنك.",
    bodyEn: "Pay the down payment and sign directly with the developer — no bank.",
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
      <PageHero title={t("title")} subtitle={t("subtitle")} />

      <section className="section bg-surface-alt">
        <div className="container-gc">
          <PricingShowcase />
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-gc">
          <div className="sec-head items-end">
            <div>
              <p className="section-eyebrow">{isAr ? "قارن الخطط" : "Compare plans"}</p>
              <h2 className="section-title mb-0">
                {isAr ? "خطة لكل موعد استلام." : "A plan for every move-in date."}
              </h2>
            </div>
            <p className="section-sub max-w-md">
              {isAr
                ? "جميع الخطط مباشرة مع الشركة، بدون بنك وبدون فوائد — والفرق فقط في الدفعة الأولى وموعد الاستلام."
                : "Every plan is direct with the developer, no bank and no interest — only the down payment and move-in date differ."}
            </p>
          </div>
          <PlanCompare locale={locale} jd={tc("jd")} />
        </div>
      </section>

      <section className="section on-dark bg-secondary text-white">
        <div className="container-gc">
          <p className="section-eyebrow">{isAr ? "كيف يعمل" : "How it works"}</p>
          <h2 className="section-title max-w-2xl">
            {isAr ? "أربع خطوات نحو شاليهك." : "Four steps to your chalet."}
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.titleEn} className="step-card">
                <span className="font-display text-5xl font-bold leading-none text-accent/80 tabular-nums">
                  {formatNumber(i + 1, locale).padStart(2, isAr ? "٠" : "0")}
                </span>
                <h3 className="font-display mt-8 text-xl font-bold text-white">
                  {isAr ? s.titleAr : s.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {isAr ? s.bodyAr : s.bodyEn}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {financingFaq.length > 0 && (
        <section className="section border-b border-line bg-surface-alt">
          <div className="container-gc">
            <HomeFaqPreview items={financingFaq} />
          </div>
        </section>
      )}

      <RegisterCta locale={locale} image="/gallery/img_2.jpg" />
    </>
  );
}
