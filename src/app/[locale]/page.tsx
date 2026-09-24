import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { site } from "@/content/site";
import { HeroLayered } from "@/features/home/HeroLayered";
import { homeFaqPreview } from "@/content/faq";
import { amenityFeatures, amenitiesIntro } from "@/content/amenities";
import { formatNumber } from "@/lib/format";
import { AmenitiesHoverGrid } from "@/features/amenities/AmenitiesHoverGrid";
import { HomeFaqPreview } from "@/features/faq/HomeFaqPreview";
import { LocationShowcase } from "@/features/location/LocationShowcase";
import { PricingShowcase } from "@/features/pricing/PricingShowcase";
import { masterPlanCopy } from "@/content/master-plan";
import { PlanExplorer } from "@/features/master-plan/PlanExplorer";
import { GalleryDay } from "@/features/gallery/GalleryDay";
import { RegisterCta } from "@/features/register/RegisterCta";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("siteName"),
    description: t("description"),
    openGraph: {
      title: t("siteName"),
      description: t("description"),
      locale: locale === "ar" ? "ar_JO" : "en_US",
      type: "website",
      url: site.siteUrl,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const isAr = locale === "ar";
  const mpCopy = masterPlanCopy[isAr ? "ar" : "en"];

  const destinations = [
    {
      href: "/units",
      title: isAr ? "المنتجعات الخاصة" : "Private Resorts",
      headline: isAr ? "قمة الخصوصية المعاصرة" : "Contemporary privacy, elevated",
      desc: isAr
        ? "٥٠٠ م² بسند ملكية مستقل — غرف، مسابح، وخصوصية كاملة داخل مجتمع مسوّر."
        : "500 m² with an independent deed — rooms, pools, and full privacy inside a gated community.",
      img: "/gallery/resortsPics/pool-and-tent-pavilion.png",
      cta: isAr ? "استكشف الوحدات" : "Explore units",
    },
    {
      href: "/amenities",
      title: isAr ? "مرافق المجتمع" : "Community amenities",
      headline: isAr ? "مركز كل شيء" : "Everything within reach",
      desc: isAr
        ? "أمن على مدار الساعة، بنية تحتية، ومساحات خضراء مخدومة لأسلوب حياة متكامل."
        : "24/7 security, infrastructure, and serviced green spaces for a complete lifestyle.",
      img: "/gallery/compoundPics/kids-cycling-community-street.png",
      cta: isAr ? "اكتشف المرافق" : "Discover amenities",
    },
    {
      href: "/financing",
      title: isAr ? "التمويل المرن" : "Flexible financing",
      headline: isAr ? "بدون فوائد، مباشرة مع الشركة" : "Zero interest, direct with us",
      desc: isAr
        ? "خطط دفع مرنة وخطط استلام ٢٠٢٥–٢٠٢٧ — تمويل مباشر بدون فوائد بنكية."
        : "Flexible payment plans and 2025–2027 move-in windows — direct financing with zero bank interest.",
      img: "/gallery/resortsPics/family-entering-resort-front-door.png",
      cta: isAr ? "خطط الدفع" : "Payment plans",
    },
  ];

  return (
    <>
      <HeroLayered />

      {/* Master plan — same explorer as /master-plan */}
      <section className="mp-page mp-page--home bg-surface">
        <div className="container-gc">
          <header className="mp-page-head">
            <p className="section-eyebrow mb-2">{mpCopy.eyebrow}</p>
            <h2 className="mp-page-title">{mpCopy.explorerTitle}</h2>
          </header>
          <PlanExplorer locale={locale} />
        </div>
      </section>

      {/* Destinations / projects overview — expanding cards */}
      <section className="section overflow-hidden border-b border-line bg-surface-tint">
        <div className="container-gc">
          <div className="sec-head">
            <div>
              <p className="section-eyebrow">
                {isAr ? "المشاريع الرئيسية" : "Flagship destinations"}
              </p>
              <h2 className="section-title mb-0">
                {isAr
                  ? "منتجع خاص، مجتمع مخدوم، وتمويل مرن."
                  : "Private resort, serviced community, flexible financing."}
              </h2>
            </div>
            <p className="sub">
              {isAr
                ? "مخطط واحد، ثلاث وجهات — الخصوصية، أسلوب الحياة، والتمويل المرن تلتقي في مجتمع Giving City."
                : "One master plan, three destinations — privacy, lifestyle, and flexible financing meet in Giving City."}
            </p>
          </div>

          <div className="brands">
            {destinations.map((d) => (
              <Link key={d.href} href={d.href} className="brand-card group">
                <Image
                  src={d.img}
                  alt={d.title}
                  fill
                  className="select-none"
                  sizes="(max-width:1024px) 100vw, 40vw"
                />
                <div className="body text-start">
                  <div className="kicker">{d.title}</div>
                  <h3>{d.headline}</h3>
                  <p>{d.desc}</p>
                  <span className="btn-ghost-light">
                    {d.cta}
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — a day at Giving City */}
      <GalleryDay locale={locale} ctaHref="/gallery" />

      {/* Amenities hover grid */}
      <section className="section overflow-hidden border-b border-line bg-surface">
        <div className="container-gc space-y-12">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="space-y-5 text-start">
              <p className="section-eyebrow mb-0">
                {isAr ? amenitiesIntro.eyebrowAr : amenitiesIntro.eyebrowEn}
              </p>
              <h2 className="section-title mb-0 max-w-3xl">
                {isAr ? amenitiesIntro.titleAr : amenitiesIntro.titleEn}
              </h2>
            </div>
            <p className="text-start text-base font-light leading-relaxed text-muted md:text-lg lg:max-w-2xl lg:justify-self-end">
              {isAr ? amenitiesIntro.subAr : amenitiesIntro.subEn}
            </p>
          </div>
          <AmenitiesHoverGrid items={amenityFeatures} isAr={isAr} />
          <div>
            <Link href="/amenities" className="gallery-outline-btn">
              {isAr ? "استكشف كل المرافق" : "Explore all amenities"}
              <ArrowIcon className="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-primary text-on-dark">
        <div className="container-gc grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: `${site.stats.units}+`, l: t("statsUnits") },
            {
              v: formatNumber(site.stats.areaSqm, "en"), // Latin digits on the home page, both languages
              l: t("statsArea"),
            },
            { v: `${site.stats.unitAreaSqm}`, l: isAr ? "م² لكل وحدة" : "m² per unit" },
            { v: site.iso.split(" ")[1] ?? "ISO", l: t("statsIso") },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {s.v}
              </p>
              <p className="mt-2 text-sm text-on-dark-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing showcase */}
      <section className="section bg-surface-alt">
        <div className="container-gc">
          <PricingShowcase />
        </div>
      </section>

      {/* FAQ preview — JG two-column numbered accordion */}
      <section className="section border-b border-line bg-surface-alt">
        <div className="container-gc">
          <HomeFaqPreview items={homeFaqPreview} />
        </div>
      </section>

      {/* Location showcase */}
      <section className="section bg-surface-tint">
        <div className="container-gc">
          <LocationShowcase />
        </div>
      </section>

      {/* Register CTA */}
      <RegisterCta locale={locale} image="/gallery/resortsPics/foosball-kids-pool.png" />
    </>
  );
}
