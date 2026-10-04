import type { Metadata } from "next";
import Image from "next/image";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { HeroLayered } from "@/features/home/HeroLayered";
import { homeFaqPreview } from "@/content/faq";
import { amenityFeatures, amenitiesIntro } from "@/content/amenities";
import { formatNumber } from "@/lib/format";
import { AmenitiesGrid } from "@/features/amenities/AmenitiesGrid";
import { VLines } from "@/components/ui/VLines";
import { HomeFaq } from "@/features/faq/HomeFaq";
import { LocationShowcase } from "@/features/location/LocationShowcase";
import { HomeIntro } from "@/features/home/HomeIntro";
import { GalleryDay } from "@/features/gallery/GalleryDay";
import { RegisterCta } from "@/features/register/RegisterCta";
import { NewsPreview } from "@/features/news/NewsPreview";
import type { LocalePageProps } from "@/i18n/types";
import { HoverAccent } from "@/components/ui/HoverAccent";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  const destinations = [
    {
      href: "/units",
      title: isAr ? "الشاليهات الخاصة" : "Private Resorts",
      headline: isAr ? "قمة الخصوصية المعاصرة" : "Contemporary privacy, elevated",
      desc: isAr
        ? "٥٠٠ م² بسند ملكية مستقل: غرف، مسابح، وخصوصية كاملة داخل مجتمع مسوّر."
        : "500 m² with an independent deed: rooms, pools, and full privacy inside a gated community.",
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
        ? "دفعة أولى تختارها ثم أقساط ١٪ من السعر شهريًا، أو خصم ٢٤٪ نقدًا. تمويل مباشر بدون فوائد بنكية."
        : "A down payment you choose, then 1% of the price a month, or 24% off in cash. Direct financing with zero bank interest.",
      img: "/gallery/resortsPics/family-entering-resort-front-door.png",
      cta: isAr ? "خطط الدفع" : "Payment plans",
    },
  ];

  return (
    <>
      <HeroLayered />
      <ScrollReveal />

      {/* About Giving Compound — annotated photo + intro */}
      <HomeIntro locale={locale} />

      {/* Destinations / projects overview — expanding cards */}
      <section className="section overflow-hidden border-b border-line bg-surface-tint">
        <div className="container-gc">
          <div className="sec-head sec-head-wide">
            <div>
              <p className="section-eyebrow">
                {isAr ? "المشاريع الرئيسية" : "Flagship destinations"}
              </p>
              <h2 className="section-title mb-0">
                {isAr
                  ? "شاليه خاص، مجتمع مخدوم، وتمويل مرن."
                  : "Private resort, serviced community, flexible financing."}
              </h2>
            </div>
            <p className="section-sub">
              {isAr
                ? "مخطط واحد، ثلاث وجهات. الخصوصية، أسلوب الحياة، والتمويل المرن تلتقي في مجتمع Giving Compound."
                : "One master plan, three destinations. Privacy, lifestyle, and flexible financing meet in Giving Compound."}
            </p>
          </div>

          <div className="brands">
            {destinations.map((d) => (
              <Link key={d.href} href={d.href} className="brand-card group hv">
                <Image
                  src={d.img}
                  alt={d.title}
                  fill
                  className="select-none"
                  sizes="(max-width:1024px) 100vw, 40vw"
                />
                <HoverAccent />
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

      {/* Gallery — a day at Giving Compound */}
      <GalleryDay locale={locale} ctaHref="/gallery" />

      {/* Amenities — all visible, no hover */}
      <section className="section overflow-hidden border-b border-line bg-surface">
        <div className="container-gc space-y-12">
          <div className="sec-head">
            <div>
              <p className="section-eyebrow">
                {isAr ? amenitiesIntro.eyebrowAr : amenitiesIntro.eyebrowEn}
              </p>
              <h2 className="section-title">
                {isAr ? amenitiesIntro.titleAr : amenitiesIntro.titleEn}
              </h2>
            </div>
            {/* Intro + the way in, together — visible as soon as the section is. */}
            <div className="flex flex-col items-start gap-6 lg:items-end">
              <p className="section-sub">
                {isAr ? amenitiesIntro.subAr : amenitiesIntro.subEn}
              </p>
              <Link href="/amenities" className="gallery-outline-btn">
                {isAr ? "استكشف كل المرافق" : "Explore all amenities"}
                <ArrowIcon className="arrow" />
              </Link>
            </div>
          </div>
          <AmenitiesGrid items={amenityFeatures} isAr={isAr} />
        </div>
      </section>

      {/* Location showcase */}
      <section className="section bg-surface-tint">
        <div className="container-gc">
          <LocationShowcase />
        </div>
      </section>

      {/* Stats — white on the primary teal (by choice; contrast is ~2.4:1), with the banner's
          V-line motif in the darkest green at both sides, fading out toward the middle */}
      <section className="relative overflow-hidden border-y border-line bg-primary text-on-dark">
        <VLines />
        <div className="container-gc relative z-[1] grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: `${site.stats.units}+`, l: t("statsUnits") },
            {
              v: formatNumber(site.stats.areaSqm, "en"), // Latin digits on the home page, both languages
              l: t("statsArea"),
            },
            { v: `${site.stats.unitAreaSqm}`, l: isAr ? "م² لكل وحدة" : "m² per unit" },
            // Zero-interest plans direct from the developer: the figure buyers actually weigh.
            { v: "0%", l: isAr ? "فوائد على خطط الدفع" : "interest on payment plans" },
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

      {/* News & articles */}
      <NewsPreview locale={locale} />

      {/* FAQ — plain questions */}
      <section className="section border-y border-line bg-surface">
        <div className="container-gc">
          <HomeFaq items={homeFaqPreview} locale={locale} />
        </div>
      </section>

      {/* Register CTA */}
      <RegisterCta
        locale={locale}
        image="/gallery/resortsPics/foosball-kids-pool.png"
        video={{ src: "/motion/cta-loop.mp4", poster: "/motion/cta-loop.jpg" }}
      />
    </>
  );
}
