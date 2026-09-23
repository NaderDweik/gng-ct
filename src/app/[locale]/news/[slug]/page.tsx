import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articles, getArticle } from "@/content/news";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps<{ slug: string }>;

export function generateStaticParams() {
  return articles.flatMap((a) => [
    { locale: "ar", slug: a.slug },
    { locale: "en", slug: a.slug },
  ]);
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();
  const isAr = locale === "ar";
  const body = isAr ? article.bodyAr : article.bodyEn;

  return (
    <article className="section">
      <div className="container-gc max-w-3xl">
        <Link href="/news" className="text-sm text-primary-ink hover:underline">
          ← {isAr ? "الأخبار" : "News"}
        </Link>
        <time className="mt-6 block text-sm text-muted">{article.date}</time>
        <h1 className="mt-2 text-3xl font-bold leading-snug text-primary-ink md:text-4xl">
          {isAr ? article.titleAr : article.titleEn}
        </h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
