import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/PageHero";
import { articles } from "@/content/news";

type Props = { params: Promise<{ locale: string }> };

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const isAr = locale === "ar";

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc grid gap-8 md:grid-cols-2">
          {articles.map((a) => (
            <article key={a.slug} className="border border-sand-deep bg-surface p-6">
              <time className="text-xs text-muted">{a.date}</time>
              <h2 className="mt-2 text-xl font-semibold text-navy">
                {isAr ? a.titleAr : a.titleEn}
              </h2>
              <p className="mt-3 text-muted">{isAr ? a.excerptAr : a.excerptEn}</p>
              <Link
                href={`/news/${a.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-terracotta hover:underline"
              >
                {t("readMore")}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
