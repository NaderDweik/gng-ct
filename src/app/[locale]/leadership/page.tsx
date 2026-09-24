import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";
import type { LocalePageProps } from "@/i18n/types";
type Props = LocalePageProps;

/** Drop the founder portrait here (portrait orientation, ~1200×1500). */
const FOUNDER_PHOTO = "/leadership/tarek-qazan.jpg";

const onTheGround = [
  { src: "/gallery/compoundPics/engineers-site-office.png", en: "Engineering on site", ar: "الهندسة في الموقع" },
  { src: "/gallery/compoundPics/security-guards-patrol-compound-o.png", en: "Security around the clock", ar: "أمن على مدار الساعة" },
  { src: "/gallery/compoundPics/housekeeping-team.png", en: "Our service team", ar: "فريق الخدمات" },
];

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

  const facts = [
    { value: `${n(site.stats.units)}+`, label: isAr ? "منتجع خاص" : "Private resorts" },
    { value: n(site.stats.areaSqm), label: isAr ? "م² مساحة المشروع" : "m² master plan" },
    { value: "ISO", label: "9001:2015" },
  ];

  return (
    <>
      <section className="leader-hero">
        <div className="container-gc grid items-center gap-10 pb-16 pt-28 md:pt-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-20">
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
            <p className="section-eyebrow reveal">{t("title")}</p>
            <h1 className="leader-title reveal" style={{ animationDelay: "80ms" }}>
              {name}
            </h1>
            <p className="reveal mt-3 text-lg font-medium text-primary-ink" style={{ animationDelay: "120ms" }}>
              {isAr ? site.companyAr : site.companyEn}
            </p>

            <blockquote className="leader-quote reveal" style={{ animationDelay: "180ms" }}>
              {isAr
                ? "رؤيتنا بسيطة: أن يمتلك كل مشترٍ منتجعه الخاص بسند مستقل، داخل مجتمع مخدوم بالكامل، وبتمويل مباشر بدون فوائد."
                : "Our vision is simple: every buyer owns a private resort with an independent deed, inside a fully serviced community, with direct zero-interest financing."}
            </blockquote>

            <dl className="reveal mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8" style={{ animationDelay: "240ms" }}>
              {facts.map((f) => (
                <div key={f.label}>
                  <dd className="font-display text-2xl font-bold text-ink tabular-nums md:text-3xl">{f.value}</dd>
                  <dt className="mt-1 text-xs text-muted">{f.label}</dt>
                </div>
              ))}
            </dl>

            <div className="reveal mt-10 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
              <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {tc("whatsapp")}
              </a>
              <a href={site.social.instagramCorp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-gc">
          <p className="section-eyebrow">{isAr ? "مبادئ الإدارة" : "How we lead"}</p>
          <h2 className="section-title max-w-2xl">
            {isAr ? "مبادئي الثلاثة." : "My three principles."}
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {principles.map((p, i) => (
              <li key={p.titleEn} className="principle-card">
                <span className="font-display text-4xl font-bold leading-none text-accent tabular-nums">
                  {n(i + 1).padStart(isAr ? 0 : 2, "0")}
                </span>
                <h3 className="font-display mt-6 text-xl font-bold text-ink">{isAr ? p.titleAr : p.titleEn}</h3>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {onTheGround.map((p) => (
              <figure key={p.src} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
                  <Image
                    src={p.src}
                    alt={isAr ? p.ar : p.en}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-muted">{isAr ? p.ar : p.en}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
