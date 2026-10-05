import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { articles } from "@/content/news";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";
import { HoverAccent } from "@/components/ui/HoverAccent";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/news");
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const isAr = locale === "ar";

  return (
    <>
      <PageJsonLd locale={locale} path="/news" />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {articles.map((a) => (
            <article key={a.slug} className="group hv border border-line bg-surface">
              <Link href={`/news/${a.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-surface-alt" tabIndex={-1} aria-hidden>
                <Image
                  src={a.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <HoverAccent />
              </Link>
              <div className="p-6">
                <time className="text-xs text-muted">{a.date}</time>
                <h2 className="mt-2 text-xl font-semibold text-primary-ink">
                  <Link href={`/news/${a.slug}`} className="hover:underline">
                    {isAr ? a.titleAr : a.titleEn}
                  </Link>
                </h2>
                <p className="mt-3 text-muted">{isAr ? a.excerptAr : a.excerptEn}</p>
                <Link
                  href={`/news/${a.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-primary-ink hover:underline"
                >
                  {t("readMore")}
                  <span className="sr-only">: {isAr ? a.titleAr : a.titleEn}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
