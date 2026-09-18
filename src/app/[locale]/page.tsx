import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { galleryImages } from "@/content/gallery";
import { cashPriceJd, basePriceJd } from "@/content/pricing";
import { HeroCarousel } from "@/components/HeroCarousel";
import { heroSlides } from "@/content/heroSlides";
import { faqCategories } from "@/content/faq";

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
  const teaser = galleryImages.slice(0, 5);
  const faqPreview = faqCategories[0]?.items.slice(0, 3) ?? [];

  const destinations = [
    {
      href: "/units",
      title: isAr ? "المنتجعات الخاصة" : "Private Resorts",
      desc: isAr
        ? "٥٠٠ م² بسند ملكية مستقل — غرف، مسابح، وخصوصية كاملة."
        : "500 m² with an independent deed — rooms, pools, and full privacy.",
      img: galleryImages[0]?.src ?? "/hero/hero.jpg",
      cta: isAr ? "استكشف الوحدات" : "Explore units",
    },
    {
      href: "/amenities",
      title: isAr ? "مرافق المجتمع" : "Community amenities",
      desc: isAr
        ? "أمن على مدار الساعة، بنية تحتية، ومساحات خضراء مخدومة."
        : "24/7 security, infrastructure, and serviced green spaces.",
      img: galleryImages[20]?.src ?? "/hero/hero.jpg",
      cta: isAr ? "اكتشف المرافق" : "Discover amenities",
    },
    {
      href: "/financing",
      title: isAr ? "التمويل المرن" : "Flexible financing",
      desc: isAr
        ? "بدون فوائد ومباشرة مع الشركة — خطط استلام ٢٠٢٥–٢٠٢٧."
        : "Zero interest, direct with the company — 2025–2027 move-in plans.",
      img: galleryImages[40]?.src ?? "/hero/hero.jpg",
      cta: isAr ? "خطط الدفع" : "Payment plans",
    },
  ];

  return (
    <>
      <HeroCarousel slides={heroSlides} />

      {/* About teaser */}
      <section className="section">
        <div className="container-gc grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow">
              {isAr ? "عن Giving City" : "About Giving City"}
            </p>
            <h2 className="section-title">
              {isAr ? "عنوان واحد. حياة متكاملة." : "One address. A complete life."}
            </h2>
            <p className="section-sub">
              {isAr
                ? "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة — مجتمع مسوّر يمتلك فيه كل مشترٍ منتجه الخاص بسند مستقل."
                : "The first and largest fully-serviced chalet city in the region — a gated community where every buyer owns their resort with an independent deed."}
            </p>
            <Link href="/about" className="btn btn-primary mt-8">
              {isAr ? "استكشف المشروع" : "Explore the project"}
            </Link>
          </div>
          <div className="relative min-h-80 overflow-hidden bg-brand-secondary lg:min-h-[28rem]">
            <Image
              src={galleryImages[12]?.src ?? "/hero/hero.jpg"}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Destinations / projects overview */}
      <section className="section bg-brand-secondary">
        <div className="container-gc">
          <p className="section-eyebrow">
            {isAr ? "نظرة عامة" : "Projects overview"}
          </p>
          <h2 className="section-title max-w-3xl">
            {isAr
              ? "منتجع خاص، مجتمع مخدوم، وتمويل مرن."
              : "Private resort, serviced community, flexible financing."}
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {destinations.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="group flex flex-col overflow-hidden bg-white transition shadow-[0_18px_44px_rgba(66,85,99,0.08)] hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={d.img}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:1024px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted leading-relaxed">
                    {d.desc}
                  </p>
                  <span className="mt-5 text-sm font-semibold tracking-wide text-brand">
                    {d.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container-gc">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">{isAr ? "مساحات وأسلوب حياة" : "Spaces & lifestyle"}</p>
              <h2 className="section-title mb-0">{t("galleryTitle")}</h2>
            </div>
            <Link href="/gallery" className="btn btn-ghost-dark">
              {tc("viewGallery")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
            {teaser.map((img, i) => (
              <div
                key={img.id}
                className={`relative overflow-hidden ${
                  i === 0 ? "col-span-2 row-span-2 min-h-72 md:min-h-full" : "min-h-40 md:min-h-52"
                }`}
              >
                <Image
                  src={img.src}
                  alt={isAr ? img.nameAr : img.nameEn}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 40vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-brand text-white">
        <div className="container-gc grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: `${site.stats.units}+`, l: t("statsUnits") },
            {
              v: site.stats.areaSqm.toLocaleString(locale),
              l: t("statsArea"),
            },
            { v: `${site.stats.unitAreaSqm}`, l: isAr ? "م² لكل وحدة" : "m² per unit" },
            { v: site.iso.split(" ")[1] ?? "ISO", l: t("statsIso") },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {s.v}
              </p>
              <p className="mt-2 text-sm text-white/70">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section">
        <div className="container-gc grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow">{tc("financing")}</p>
            <h2 className="section-title">{t("pricingTitle")}</h2>
            <p className="section-sub">{t("pricingSub")}</p>
            <p className="mt-8 font-display text-5xl font-bold text-brand">
              {basePriceJd.toLocaleString(locale)}{" "}
              <span className="text-lg font-medium text-muted">{tc("jd")}</span>
            </p>
            <p className="mt-2 text-accent-hover font-semibold">
              {cashPriceJd.toLocaleString(locale)} {tc("jd")} — {site.stats.cashDiscountPct}% cash
            </p>
            <Link href="/financing" className="btn btn-primary mt-8">
              {tc("financing")}
            </Link>
          </div>
          <div className="bg-dark p-8 text-white md:p-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
              {site.copyBank[isAr ? "ar" : "en"].zeroInterest}
            </p>
            <ul className="mt-8 space-y-4 text-neutral-300">
              <li>{site.copyBank[isAr ? "ar" : "en"].deed}</li>
              <li>{site.copyBank[isAr ? "ar" : "en"].spanish}</li>
              <li>{site.copyBank[isAr ? "ar" : "en"].privacy}</li>
              <li>{site.copyBank[isAr ? "ar" : "en"].iso}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="section bg-brand-secondary">
        <div className="container-gc max-w-3xl">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="section-title">
            {isAr ? "أسئلة شائعة." : "Good to know."}
          </h2>
          <div className="mt-8 divide-y divide-line border border-line bg-white">
            {faqPreview.map((item, i) => (
              <details key={i} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none flex justify-between gap-4">
                  <span>{isAr ? item.qAr : item.qEn}</span>
                  <span className="text-brand group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-muted leading-relaxed">
                  {isAr ? item.aAr : item.aEn}
                </p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="btn btn-ghost-dark mt-8">
            {isAr ? "كل الأسئلة" : "Read all FAQs"}
          </Link>
        </div>
      </section>

      {/* Register CTA */}
      <section className="section bg-dark text-white">
        <div className="container-gc text-center">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
            {tc("register")}
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold md:text-5xl">
            {isAr ? "سجّل اهتمامك." : "Register your interest."}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            {tc("responseTime")}
          </p>
          <Link href="/register" className="btn btn-accent mt-8">
            {tc("register")}
          </Link>
        </div>
      </section>

      {/* Location */}
      <section className="section">
        <div className="container-gc">
          <p className="section-eyebrow">{t("locationTitle")}</p>
          <h2 className="section-title">{t("locationSub")}</h2>
          <div className="mt-8 overflow-hidden border border-line">
            <iframe
              title="Giving City map"
              src={`https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&z=13&output=embed`}
              className="h-72 w-full border-0 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Link href="/location" className="btn btn-ghost-dark mt-6">
            {tc("learnMore")}
          </Link>
        </div>
      </section>
    </>
  );
}
