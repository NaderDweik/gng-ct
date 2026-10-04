import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articles, getArticle } from "@/content/news";
import { site } from "@/content/site";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps<{ slug: string }>;

export function generateStaticParams() {
  return articles.flatMap((a) => [
    { locale: "ar", slug: a.slug },
    { locale: "en", slug: a.slug },
  ]);
}

/* Small line icons for the meta row (styles: styles/sections/article.css). */
function MetaIcon({ name }: { name: "date" | "author" | "time" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {name === "date" && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="1" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </>
      )}
      {name === "author" && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </>
      )}
      {name === "time" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
    </svg>
  );
}

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg className="article-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={back ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticle(slug);
  if (!article) notFound();
  const tc = await getTranslations("common");
  const isAr = locale === "ar";
  const title = isAr ? article.titleAr : article.titleEn;
  const body = isAr ? article.bodyAr : article.bodyEn;

  const dateFmt = new Intl.DateTimeFormat(isAr ? "ar-JO" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  const words = body.join(" ").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const readTime = isAr
    ? `${new Intl.NumberFormat("ar-JO").format(minutes)} دقيقة قراءة`
    : `${minutes} min read`;

  const recent = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <article>
      <header className="article-head">
        <div className="container-gc">
          <Link href="/news" className="article-back">
            <Chevron back={!isAr} />
            {isAr ? "العودة إلى الأخبار" : "Back to news"}
          </Link>
          <h1 className="article-title">{title}</h1>
          <ul className="article-meta">
            <li>
              <MetaIcon name="date" />
              <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
            </li>
            <li>
              <MetaIcon name="author" />
              {isAr ? site.companyAr : site.companyEn}
            </li>
            <li>
              <MetaIcon name="time" />
              {readTime}
            </li>
          </ul>
        </div>
      </header>

      <div className="container-gc pb-20 pt-10 md:pt-12">
        <div className="article-cover">
          <Image src={article.image} alt={title} fill priority sizes="(max-width: 1400px) 100vw, 1400px" className="object-cover" />
        </div>

        <div className="article-layout">
          <div>
            <div className="article-body">
              {body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <footer className="article-foot">
              <div>
                <p className="article-foot-brand">Giving Compound</p>
                <p className="article-foot-line">
                  {isAr
                    ? "مدينة شاليهات خاصة مخدومة بالكامل، بتمويل مباشر بدون فوائد."
                    : "A fully serviced city of private resorts, with direct zero-interest financing."}
                </p>
              </div>
              <Link href="/register" className="btn btn-primary">
                {tc("register")}
              </Link>
            </footer>
          </div>

          <aside className="article-aside" aria-labelledby="recent-heading">
            <p id="recent-heading" className="article-aside-title">
              {isAr ? "أحدث المقالات" : "Recent articles"}
            </p>
            <ul>
              {recent.map((a) => (
                <li key={a.slug}>
                  <Link href={`/news/${a.slug}`} className="article-recent">
                    <span className="article-recent-img">
                      <Image src={a.image} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <time className="article-recent-date" dateTime={a.date}>
                        {dateFmt.format(new Date(a.date))}
                      </time>
                      <span className="article-recent-title">{isAr ? a.titleAr : a.titleEn}</span>
                      <span className="article-recent-more">
                        {isAr ? "اقرأ المقال" : "Read story"}
                        <Chevron back={isAr} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}
