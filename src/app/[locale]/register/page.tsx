import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/content/site";
import { basePriceJd, cashPriceJd, cashDiscountPct } from "@/content/pricing";
import { formatNumber } from "@/lib/format";
import { RegisterForm } from "@/features/register/RegisterForm";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("962") && d.length === 12
    ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`
    : phone;
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("register");
  const tc = await getTranslations("common");
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);

  const promises = [
    site.copyBank[isAr ? "ar" : "en"].deed,
    site.copyBank[isAr ? "ar" : "en"].zeroInterest,
    site.copyBank[isAr ? "ar" : "en"].iso,
  ];

  return (
    <>
      <section className="register-hero">
        <Image
          src="/gallery/img_2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="register-hero-img"
        />
        <div className="register-hero-shade" aria-hidden />
        <div className="container-gc relative z-10 flex min-h-[inherit] flex-col justify-end pb-8 pt-28 md:pb-10">
          <p className="reveal text-xs font-bold uppercase tracking-[0.24em] text-accent">
            {t("title")}
          </p>
          <h1
            className="register-hero-title reveal"
            style={{ animationDelay: "80ms" }}
          >
            {isAr ? "خطوة واحدة تفصلك عن شاليهك." : "One step away from your chalet."}
          </h1>
          <p
            className="reveal mt-3 max-w-xl text-sm text-white/75 md:text-base"
            style={{ animationDelay: "160ms" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="register-body bg-surface-alt">
        <div className="container-gc grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="register-panel">
            <div className="mb-5 border-b border-line pb-4">
              <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
                {isAr ? "أخبرنا كيف نتواصل معك." : "Tell us how to reach you."}
              </h2>
            </div>
            <RegisterForm />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="register-side register-side--dark">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                {isAr ? "الأسعار تبدأ من" : "Prices from"}
              </p>
              <p className="font-display mt-2 text-4xl font-bold leading-none text-white tabular-nums">
                {n(basePriceJd)}
                <span className="ms-2 text-sm font-medium text-white/55">{tc("jd")}</span>
              </p>
              <p className="mt-2 text-sm text-white/65">
                {isAr
                  ? `أو ${n(cashPriceJd)} د.أ نقدًا — خصم ${n(cashDiscountPct)}٪`
                  : `or ${n(cashPriceJd)} JD cash — ${cashDiscountPct}% off`}
              </p>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                {promises.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-2 h-px w-4 shrink-0 bg-accent" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="register-side">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                {isAr ? "مكتب المبيعات" : "Sales office"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {isAr ? site.locationAr : site.locationEn}
              </p>
              <div className="mt-3 space-y-1 text-sm text-muted">
                <p>{isAr ? site.hoursAr.weekdays : site.hoursEn.weekdays}</p>
                <p>{isAr ? site.hoursAr.saturday : site.hoursEn.saturday}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
                <a
                  href={`tel:${site.phoneAction}`}
                  dir="ltr"
                  className="font-bold text-primary transition hover:opacity-80"
                >
                  {formatPhone(site.phone)}
                </a>
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-ink transition hover:text-primary"
                >
                  {tc("whatsapp")}
                </a>
              </div>
            </div>

            <div className="register-side flex items-center gap-4">
              <div className="relative h-14 w-16 shrink-0 overflow-hidden">
                <Image
                  src="/gallery/img_3.jpg"
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">
                  {isAr ? "هل تفضّل زيارة مباشرة؟" : "Prefer a site visit?"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {isAr
                    ? "اختر «زيارة الموقع» في النموذج وسنرتّب الموعد."
                    : "Pick “Site visit” in the form and we’ll arrange a time."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
