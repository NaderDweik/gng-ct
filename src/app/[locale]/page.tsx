import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { galleryImages } from "@/content/gallery";
import { cashPriceJd, basePriceJd } from "@/content/pricing";

type Props = { params: Promise<{ locale: string }> };

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
  const teaser = galleryImages.slice(0, 6);

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <Image
            src="/hero/hero.jpg"
            alt={isAr ? site.nameAr : site.nameEn}
            fill
            priority
            className="hero-media object-cover opacity-70"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/25" />
        </div>

        <div className="container-gc relative flex min-h-[92vh] flex-col justify-end pb-16 pt-28 md:pb-24">
          <p className="reveal mb-3 text-sm font-semibold tracking-[0.2em] text-gold uppercase">
            {isAr ? site.nameEn : site.nameAr}
          </p>
          <h1 className="reveal max-w-3xl text-4xl font-bold leading-tight text-cream md:text-6xl">
            {isAr ? site.nameAr : site.nameEn}
          </h1>
          <p
            className="reveal mt-4 max-w-xl text-lg text-sand md:text-xl"
            style={{ animationDelay: "100ms" }}
          >
            {t("headline")}
          </p>
          <p
            className="reveal mt-3 max-w-xl text-sand-deep"
            style={{ animationDelay: "160ms" }}
          >
            {t("sub")}
          </p>
          <div
            className="reveal mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "220ms" }}
          >
            <Link href="/register" className="btn btn-primary">
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/financing"
              className="btn border border-cream/40 bg-transparent text-cream hover:bg-cream hover:text-navy"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-b border-sand-deep bg-sand/40">
        <div className="container-gc grid gap-8 md:grid-cols-3">
          {[
            {
              value: `${site.stats.units}+`,
              label: t("statsUnits"),
            },
            {
              value: site.stats.areaSqm.toLocaleString(locale),
              label: t("statsArea"),
            },
            { value: site.iso, label: t("statsIso") },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-start">
              <p className="text-3xl font-bold text-terracotta md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-gc">
          <h2 className="section-title">{t("featuresTitle")}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              [t("featurePrivacy"), t("featurePrivacyDesc")],
              [t("featureSpace"), t("featureSpaceDesc")],
              [t("featureInvest"), t("featureInvestDesc")],
              [t("featureQuality"), t("featureQualityDesc")],
            ].map(([title, desc]) => (
              <div key={title} className="border-s-2 border-terracotta ps-4">
                <h3 className="text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand/30">
        <div className="container-gc">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="section-title mb-0">{t("galleryTitle")}</h2>
            <Link href="/gallery" className="btn btn-secondary">
              {tc("viewGallery")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {teaser.map((img, i) => (
              <div
                key={img.id}
                className={`relative overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2 min-h-64" : "min-h-40"}`}
              >
                <Image
                  src={img.src}
                  alt={isAr ? img.altAr : img.altEn}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-gc grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="section-title">{t("pricingTitle")}</h2>
            <p className="section-sub">{t("pricingSub")}</p>
            <p className="mt-6 text-4xl font-bold text-navy">
              {basePriceJd.toLocaleString(locale)}{" "}
              <span className="text-lg font-medium text-muted">{tc("jd")}</span>
            </p>
            <p className="mt-2 text-terracotta">
              {cashPriceJd.toLocaleString(locale)} {tc("jd")} — {site.stats.cashDiscountPct}%
            </p>
            <Link href="/financing" className="btn btn-primary mt-8">
              {tc("financing")}
            </Link>
          </div>
          <div className="bg-navy p-8 text-cream">
            <p className="text-gold text-sm font-semibold">{site.copyBank[isAr ? "ar" : "en"].zeroInterest}</p>
            <ul className="mt-6 space-y-3 text-sand">
              <li>{site.copyBank[isAr ? "ar" : "en"].deed}</li>
              <li>{site.copyBank[isAr ? "ar" : "en"].spanish}</li>
              <li>{site.copyBank[isAr ? "ar" : "en"].privacy}</li>
              <li>{site.copyBank[isAr ? "ar" : "en"].iso}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section border-t border-sand-deep bg-[linear-gradient(180deg,var(--cream),var(--sand))]">
        <div className="container-gc">
          <h2 className="section-title">{t("locationTitle")}</h2>
          <p className="section-sub">{t("locationSub")}</p>
          <div className="mt-8 overflow-hidden border border-sand-deep">
            <iframe
              title="Giving City map"
              src={`https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&z=13&output=embed`}
              className="h-72 w-full border-0 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Link href="/location" className="btn btn-secondary mt-6">
            {tc("learnMore")}
          </Link>
        </div>
      </section>
    </>
  );
}
