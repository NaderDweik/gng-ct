import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";
import { RegisterCta } from "@/features/register/RegisterCta";
import { CountUp } from "@/components/ui/CountUp";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

type PillarIcon = "deed" | "privacy" | "design" | "finance";

const pillars: { icon: PillarIcon; titleAr: string; titleEn: string; bodyAr: string; bodyEn: string }[] = [
  {
    icon: "deed",
    titleAr: "سند ملكية مستقل",
    titleEn: "Independent deed",
    bodyAr: "كل مشترٍ يمتلك منتجعه الخاص بسند مستقل باسمه — ملكية حقيقية لا حصة في فندق.",
    bodyEn: "Every buyer owns their private resort with an independent deed — real ownership, not a hotel share.",
  },
  {
    icon: "privacy",
    titleAr: "خصوصية تامة",
    titleEn: "Complete privacy",
    bodyAr: "جدران بارتفاع ٣ أمتار حول كل منتجع، داخل مجتمع مسوّر ومحروس على مدار الساعة.",
    bodyEn: "3-meter walls around every resort, inside a gated community guarded around the clock.",
  },
  {
    icon: "design",
    titleAr: "تصميم إسباني فاخر",
    titleEn: "Luxury Spanish design",
    bodyAr: "واجهات عصرية وتشطيبات راقية ومسبح خاص في كل وحدة بمساحة ٥٠٠ م².",
    bodyEn: "Modern facades, refined finishes and a private pool in every 500 m² unit.",
  },
  {
    icon: "finance",
    titleAr: "تمويل بدون فوائد",
    titleEn: "Zero-interest financing",
    bodyAr: "خطط دفع مباشرة مع الشركة بدون بنك وبدون فوائد، أو خصم ١٥٪ عند الدفع نقدًا.",
    bodyEn: "Payment plans directly with the developer — no bank, no interest — or 15% off for cash.",
  },
];

function Icon({ name }: { name: PillarIcon }) {
  const p = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "deed")
    return (
      <svg {...p}>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </svg>
    );
  if (name === "privacy")
    return (
      <svg {...p}>
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  if (name === "design")
    return (
      <svg {...p}>
        <path d="M3 21h18M5 21V10l7-6 7 6v11" />
        <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5v11" />
    </svg>
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);

  const pctSign = isAr ? "٪" : "%";
  const stats = [
    { value: site.stats.units, suffix: "+", label: isAr ? "منتجع خاص" : "Private resorts" },
    { value: site.stats.areaSqm, unit: isAr ? "م²" : "m²", label: isAr ? "مساحة المشروع" : "Master-plan area" },
    { value: site.stats.unitAreaSqm, unit: isAr ? "م²" : "m²", label: isAr ? "لكل وحدة" : "Per unit" },
    { value: 0, from: 100, suffix: pctSign, label: isAr ? "فوائد على التقسيط" : "Interest on installments" },
  ];

  const socials = [
    { href: site.social.instagram, label: "Instagram", handle: "@giving.city" },
    { href: site.social.instagramCorp, label: "Instagram", handle: "@alataa_development" },
    { href: site.social.facebook, label: "Facebook", handle: "alataa.giving" },
    { href: site.whatsappUrl, label: "WhatsApp", handle: tc("whatsapp") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <Image src="/gallery/img_68.jpg" alt="" fill priority sizes="100vw" className="about-hero-img" />
        <div className="about-hero-shade" aria-hidden />
        <div className="container-gc relative z-10 flex min-h-[inherit] flex-col justify-end pb-10 pt-32 md:pb-14">
          <p className="reveal text-xs font-bold uppercase tracking-[0.24em] text-accent">{t("title")}</p>
          <h1 className="about-hero-title reveal" style={{ animationDelay: "80ms" }}>
            {isAr ? "ليس فندقًا، بل استثمار وحياة." : "Not a hotel — an investment, and a way of life."}
          </h1>
          <p className="reveal mt-5 max-w-xl text-base text-on-dark-muted md:text-lg" style={{ animationDelay: "160ms" }}>
            {t("subtitle")}
          </p>

          <dl className="about-hero-stats reveal" style={{ animationDelay: "240ms" }}>
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs text-on-dark-muted">{s.label}</dt>
                <dd className="font-display text-3xl font-bold leading-none text-on-dark tabular-nums md:text-4xl">
                  <CountUp value={s.value} from={s.from} suffix={s.suffix} locale={locale} delay={500 + i * 150} />
                  {s.unit && <span className="ms-1 text-sm font-medium text-on-dark-muted">{s.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-surface">
        <div className="container-gc grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="section-eyebrow">{isAr ? "قصتنا" : "Our story"}</p>
            <h2 className="section-title">
              {isAr ? site.taglineAr + "." : site.taglineEn + "."}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{t("story")}</p>
            <div className="mt-10 flex items-center gap-4 border-t border-line pt-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-dark">
                {isAr ? "ط.ق" : "TQ"}
              </span>
              <div>
                <p className="font-bold text-ink">{isAr ? site.contact : site.contactEn}</p>
                <p className="text-sm text-muted">{isAr ? site.companyAr : site.companyEn}</p>
              </div>
            </div>
          </div>

          <div className="about-collage">
            <div className="about-collage-main">
              <Image src="/gallery/img_15.jpg" alt={isAr ? "جناح بمسبح داخلي" : "Suite with an indoor pool"} fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover" />
            </div>
            <div className="about-collage-side">
              <Image src="/gallery/img_3.jpg" alt={isAr ? "واجهة منتجع" : "Resort facade"} fill sizes="(max-width: 1024px) 45vw, 20vw" className="object-cover" />
            </div>
            <div className="about-collage-badge">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                {isAr ? "معتمد" : "Certified"}
              </span>
              <span className="font-display mt-1 text-lg font-bold leading-tight text-on-dark">{site.iso}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section border-y border-line bg-surface-alt">
        <div className="container-gc">
          <div className="sec-head items-end">
            <div>
              <p className="section-eyebrow">{isAr ? "لماذا Giving City" : "Why Giving City"}</p>
              <h2 className="section-title mb-0">
                {isAr ? "أربعة وعود نلتزم بها." : "Four promises we keep."}
              </h2>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <article key={p.icon} className="pillar-card group">
                <div className="flex items-start justify-between">
                  <span className="pillar-icon">
                    <Icon name={p.icon} />
                  </span>
                  <span className="font-display text-sm font-bold text-muted/60 tabular-nums">
                    {n(i + 1).padStart(2, isAr ? "٠" : "0")}
                  </span>
                </div>
                <h3 className="font-display mt-10 text-xl font-bold text-ink transition-colors duration-300 group-hover:text-on-dark">
                  {isAr ? p.titleAr : p.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-on-dark-muted">
                  {isAr ? p.bodyAr : p.bodyEn}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership + ISO */}
      <section className="section on-dark bg-secondary text-on-dark">
        <div className="container-gc grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="section-eyebrow">{isAr ? "القيادة والجودة" : "Leadership & quality"}</p>
            <h2 className="section-title">
              {isAr ? "رؤية واضحة، ومعايير عالمية." : "A clear vision, global standards."}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-on-dark-muted">{t("founder")}</p>
            <ul className="mt-8 space-y-3 text-sm text-on-dark-muted">
              {[
                isAr ? "إدارة ومتابعة مباشرة من الشركة المطوّرة" : "Managed directly by the developer",
                isAr ? "عمليات موثّقة وفق نظام إدارة الجودة ISO 9001:2015" : "Processes documented under ISO 9001:2015 quality management",
                isAr ? "تعامل مباشر مع المشتري — بدون وسطاء أو بنوك" : "Direct with buyers — no brokers, no banks",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-px w-5 shrink-0 bg-accent" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/leadership" className="register-cta-btn">
                {isAr ? "تعرّف على الإدارة" : "Meet the leadership"}
                <span className="arrow" aria-hidden />
              </Link>
            </div>
          </div>
          <div>
            <div className="relative aspect-video overflow-hidden border border-line-on-dark bg-overlay shadow-card-lg">
              <iframe
                src={site.videos.iso}
                title={isAr ? "تقديم شهادة ISO 9001:2015" : "ISO 9001:2015 certification"}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-xs text-on-dark-subtle">
              {isAr ? "تقديم شهادة ISO 9001:2015 لشركة العطاء" : "Al-Ataa receiving the ISO 9001:2015 certification"}
            </p>
          </div>
        </div>
      </section>

      {/* Follow */}
      <section className="section bg-surface">
        <div className="container-gc">
          <div className="sec-head items-end">
            <div>
              <p className="section-eyebrow">{isAr ? "تابعنا" : "Follow along"}</p>
              <h2 className="section-title mb-0">
                {isAr ? "شاهد المشروع يكبر يومًا بعد يوم." : "Watch the project grow, day by day."}
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socials.map((s) => (
              <a key={s.handle} href={s.href} target="_blank" rel="noopener noreferrer" className="social-card group">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{s.label}</span>
                <span className="mt-6 block truncate font-display text-xl font-bold text-ink" dir="auto">
                  {s.handle}
                </span>
                <span className="social-card-arrow" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <RegisterCta locale={locale} image="/gallery/img_2.jpg" />
    </>
  );
}
