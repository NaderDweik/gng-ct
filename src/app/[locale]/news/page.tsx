import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { articles } from "@/content/news";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

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
            <article key={a.slug} className="border border-line bg-surface p-6">
              <time className="text-xs text-muted">{a.date}</time>
              <h2 className="mt-2 text-xl font-semibold text-primary-ink">
                {isAr ? a.titleAr : a.titleEn}
              </h2>
              <p className="mt-3 text-muted">{isAr ? a.excerptAr : a.excerptEn}</p>
              <Link
                href={`/news/${a.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-primary-ink hover:underline"
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
