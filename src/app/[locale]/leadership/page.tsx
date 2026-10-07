import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/content/site";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { formatNumber } from "@/lib/format";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";
type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/leadership");
}

/** Drop the founder portrait here (portrait orientation, ~1200×1500). */
const FOUNDER_PHOTO = site.founderPhoto;


/** The founder's own three principles, in his words. */
const principles = [
  { titleAr: "لا أعد إلا بما أستطيع الوفاء به.", titleEn: "I only promise what I can deliver." },
  { titleAr: "أبني لكم كما أبني لنفسي.", titleEn: "I build for you as I build for myself." },
  { titleAr: "مسؤوليتي لا تنتهي عند البيع.", titleEn: "My responsibility doesn’t end at the sale." },
];

export default async function LeadershipPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leadership");
  const tc = await getTranslations("common");
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);

  const hasPhoto = existsSync(
    path.join(process.cwd(), "public", FOUNDER_PHOTO.replace(/^\//, "")),
  );
  const name = isAr ? site.contact : site.contactEn;

  return (
    <>
      <PageJsonLd locale={locale} path="/leadership" />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />

      <section className="leader-hero">
        <div className="container-gc grid items-center gap-10 pt-12 md:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="leader-portrait reveal">
            {hasPhoto ? (
              <Image
                src={FOUNDER_PHOTO}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="leader-portrait-fallback" aria-label={name} role="img">
                <span>{isAr ? "ط.ق" : "TQ"}</span>
              </div>
            )}
            <div className="leader-portrait-tag">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                {t("founderRole")}
              </span>
              <span className="font-display mt-1 text-lg font-bold text-on-dark">{name}</span>
            </div>
          </div>

          <div>
            <h2 className="leader-title reveal" style={{ animationDelay: "80ms" }}>
              {name}
            </h2>
            <p className="reveal mt-3 text-lg font-medium text-primary-ink" style={{ animationDelay: "120ms" }}>
              {isAr ? site.companyAr : site.companyEn}
            </p>

            <blockquote className="leader-quote reveal" style={{ animationDelay: "180ms" }}>
              {isAr
                ? "رؤيتنا بسيطة: أن يمتلك كل مشترٍ شاليهه الخاص بسند مستقل، داخل مجتمع مخدوم بالكامل، وبتمويل مباشر بدون فوائد."
                : "Our vision is simple: every buyer owns a private resort with an independent deed, inside a fully serviced community, with direct zero-interest financing."}
            </blockquote>

            <div className="reveal mt-10 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
              <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {tc("whatsapp")}
              </a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating principles band: pulled up so it overlaps the bottom of the founder section. */}
      <section className="leader-principles">
        <div className="container-gc">
          <div className="leader-principles-box reveal">
            <div className="leader-principles-head">
              <p className="section-eyebrow">{isAr ? "مبادئ الإدارة" : "How we lead"}</p>
              <h2 className="section-title">
                {isAr ? "مبادئي الثلاثة." : "My three principles."}
              </h2>
            </div>
            <ol className="leader-principles-list">
              {principles.map((p, i) => (
                <li key={p.titleEn} className="leader-principle">
                  <span className="leader-principle-num font-display text-3xl font-bold leading-none tabular-nums md:text-4xl">
                    <span className="leader-principle-num-ink">{n(i + 1).padStart(isAr ? 0 : 2, "0")}</span>
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold leading-snug text-on-dark md:mt-5 md:text-xl">
                    <span className="leader-principle-text">
                      <span className="leader-principle-ink">{isAr ? p.titleAr : p.titleEn}</span>
                    </span>
                  </h3>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
