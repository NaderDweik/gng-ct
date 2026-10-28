import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { UiIcon, type UiIconName } from "@/components/ui/UiIcon";
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
import { locationCopy } from "@/content/location";
import { HomeIntro } from "@/features/home/HomeIntro";
import { GalleryDay } from "@/features/gallery/GalleryDay";
import { RegisterCta } from "@/features/register/RegisterCta";
import { NewsPreview } from "@/features/news/NewsPreview";
import type { LocalePageProps } from "@/i18n/types";
import { JsonLd } from "@/components/seo/JsonLd";
import { listingJsonLd, routeMetadata } from "@/lib/seo";
import { HoverAccent } from "@/components/ui/HoverAccent";
import { ScrollFocus } from "@/components/ui/ScrollFocus";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { DeferredSectionsRefresh } from "@/components/ui/DeferredSectionsRefresh";
import { NearImage } from "@/components/ui/NearImage";
import { HomeServicesStrip } from "@/features/home/HomeServicesStrip";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const isAr = locale === "ar";

  const destinations = [
    {
      href: "/compound",
      title: isAr ? "الشاليهات الخاصة" : "Private Resorts",
      headline: isAr ? "قمة الخصوصية المعاصرة" : "Contemporary privacy, elevated",
      desc: isAr
        ? "500 م²: غرف، مسابح، وخصوصية كاملة داخل كمباوند مسوّر."
        : "500 m²: rooms, pools, and full privacy inside a gated community.",
      img: "/gallery/resortsPics/quad-bike-royal-clubhouse.jpg",
      icon: "key" as UiIconName,
      kickerIcon: "home" as UiIconName,
      cta: isAr ? "استكشف الشاليهات" : "Explore units",
    },
    {
      href: "/compound/amenities",
      title: isAr ? "مرافق الكمباوند" : "Community amenities",
      headline: isAr ? "ما بتحتاج إشي من برّا" : "Everything within reach",
      desc: isAr
        ? "أمن على مدار الساعة، بنية تحتية، ومساحات خضراء مخدومة لأسلوب حياة متكامل."
        : "24/7 security, infrastructure, and serviced green spaces for a complete lifestyle.",
      img: "/gallery/compoundPics/kids-cycling-community-street.jpg",
      icon: "pool" as UiIconName,
      kickerIcon: "trees" as UiIconName,
      cta: isAr ? "اكتشف المرافق" : "Discover amenities",
    },
    {
      href: "/register",
      title: isAr ? "التمويل المرن" : "Flexible financing",
      headline: isAr ? "بدون فوائد، مباشرة مع الشركة" : "Zero interest, direct with us",
      // Arabic: no description, the headline stands alone.
      desc: isAr
        ? ""
        : "A down payment you choose, then installments set by the down payment and duration, or 24% off in cash. Direct financing with zero bank interest.",
      img: "/home/financing-installments.jpg",
      // Portrait poster with its title at the top: keep the title in when cropped.
      pos: "50% 15%",
      icon: "calendar" as UiIconName,
      kickerIcon: "coins" as UiIconName,
      cta: isAr ? "احجز زيارتك" : "Register interest",
    },
  ];

  return (
    <>
      <JsonLd data={listingJsonLd(locale === "en" ? "en" : "ar", "")} />
      <HeroLayered />
      <ScrollReveal />

      {/* About Giving Compound — annotated photo + intro */}
      <HomeIntro locale={locale} />
      <DeferredSectionsRefresh />

      {/* Destinations / projects overview — expanding cards */}
      <section className="section cv-defer cv-defer--destinations overflow-hidden border-b border-line bg-surface-tint">
        <div className="container-gc">
          <div className="sec-head sec-head-wide">
            <div>
              <p className="section-eyebrow section-eyebrow--icon">
                <UiIcon name="compass" />
                {isAr ? "الوجهات الرئيسية" : "Flagship destinations"}
              </p>
              <h2 className="section-title mb-0">
                {isAr
                  ? "شاليهك المستقل، بقسط 1% في كمباوند Giving."
                  : "Private resort, serviced community, flexible financing."}
              </h2>
            </div>
            {/* Arabic: the heading stands alone. */}
            {!isAr && (
              <p className="section-sub">
                One community, three destinations. Privacy, lifestyle, and flexible financing meet in Giving Compound.
              </p>
            )}
          </div>

          <div className="brands">
            {destinations.map((d) => (
              <Link key={d.href} href={d.href} className="brand-card group hv">
                <NearImage
                  src={d.img}
                  alt={d.title}
                  fill
                  className="select-none"
                  sizes="(max-width:1024px) 100vw, 40vw"
                  style={d.pos ? { objectPosition: d.pos } : undefined}
                />
                <HoverAccent />
                <div className="body text-start">
                  <div className="kicker flex items-center gap-2">
                    <UiIcon name={d.kickerIcon} />
                    {d.title}
                  </div>
                  <h3>{d.headline}</h3>
                  {d.desc && <p>{d.desc}</p>}
                  <span className="btn-ghost-light">
                    <UiIcon name={d.icon} />
                    {d.cta}
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
            {/* Phones / touch: the card at mid-screen plays the hover effect. */}
            <ScrollFocus selector=".brand-card" />
          </div>
        </div>
      </section>

      {/* Gallery — a day at Giving Compound */}
      <GalleryDay locale={locale} ctaHref="/gallery" />

      {/* Amenities — all visible, no hover */}
      <section className="section cv-defer cv-defer--amenities overflow-hidden border-b border-line bg-surface">
        <div className="container-gc space-y-12">
          <div className="sec-head">
            <div>
              <p className="section-eyebrow section-eyebrow--icon">
                <UiIcon name="pool" />
                {isAr ? amenitiesIntro.eyebrowAr : amenitiesIntro.eyebrowEn}
              </p>
              <h2 className="section-title">
                {isAr ? amenitiesIntro.titleAr : amenitiesIntro.titleEn}
              </h2>
            </div>
            {/* Desktop: the way in, in the heading row (phones / tablets: under the cards). */}
            <div className="am-all-head flex flex-col items-start gap-6 lg:items-end">
              <Link href="/chalet/amenities" className="gallery-outline-btn">
                <UiIcon name="pool" />
                {isAr ? "استكشف كل المرافق" : "Explore all amenities"}
                <ArrowIcon className="arrow" />
              </Link>
            </div>
          </div>
          <AmenitiesGrid items={amenityFeatures} isAr={isAr} />
          {/* Phones / tablets: the link closes the section, under the cards. */}
          <Link href="/chalet/amenities" className="gallery-outline-btn am-all--end">
            <UiIcon name="pool" />
            {isAr ? "استكشف كل المرافق" : "Explore all amenities"}
            <ArrowIcon className="arrow" />
          </Link>
        </div>
      </section>

      {/* Beyond the chalet: the compound's running services → /services */}
      <HomeServicesStrip locale={locale} />

      {/* Location showcase */}
      <section className="section cv-defer cv-defer--location bg-surface-tint">
        <div className="container-gc">
          <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <p className="section-eyebrow section-eyebrow--icon">
              <UiIcon name="pin" />
              {isAr ? "الطريق إلينا" : "Getting here"}
            </p>
            {/* Inline margins: .section-title's own margin shorthand outranks mx-auto. */}
            <h2 className="section-title" style={{ marginInline: "auto", marginBottom: 0 }}>
              {isAr ? locationCopy.titleAr : locationCopy.titleEn}
            </h2>
          </header>
          <LocationShowcase />
        </div>
      </section>

      {/* Stats: teal figures and white labels on the charcoal band (AA), each figure centred
          over its label, with the banner's V-line motif in teal at both sides, fading out
          toward the middle */}
      <section className="stats-band cv-defer cv-defer--stats relative overflow-hidden border-y border-line text-on-dark">
        <VLines />
        <div className="stats-band-grid container-gc relative z-[1] grid grid-cols-2 gap-x-6 gap-y-10 py-12 text-center md:gap-10 md:py-16 lg:grid-cols-4">
          {[
            { v: `${formatNumber(site.stats.units, locale)}+`, l: t("statsUnits") },
            { v: formatNumber(site.stats.areaSqm, locale), l: t("statsArea") },
            { v: formatNumber(site.stats.unitAreaSqm, locale), l: isAr ? "م² لكل وحدة" : "m² per unit" },
            // Zero-interest plans direct from the developer: the figure buyers actually weigh.
            { v: isAr ? `${formatNumber(0, locale)}%` : "0%", l: isAr ? "فوائد على خطط الدفع" : "interest on payment plans" },
          ].map((s) => (
            <div key={s.l} className="stats-band-cell">
              {/* dir="ltr": keeps "367+" and "0%" in figure order inside Arabic text. */}
              <p dir="ltr" className="stats-band-figure font-display text-(length:--fs-stat) font-bold tracking-tight">
                {s.v}
              </p>
              <p className="stats-band-label mt-3 text-sm font-medium md:text-base">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News & articles */}
      <NewsPreview locale={locale} />

      {/* FAQ — plain questions */}
      <section className="section cv-defer cv-defer--faq border-y border-line bg-surface">
        <div className="container-gc">
          <HomeFaq items={homeFaqPreview} locale={locale} />
        </div>
      </section>

      {/* Register CTA */}
      <RegisterCta
        locale={locale}
        image="/gallery/resortsPics/foosball-kids-pool.jpg"
        video={{ src: "/motion/cta-loop.mp4", poster: "/motion/cta-loop.jpg" }}
      />
    </>
  );
}
