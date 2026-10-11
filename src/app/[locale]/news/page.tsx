import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { articles, newsCategories } from "@/content/news";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";
import { HoverAccent } from "@/components/ui/HoverAccent";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { YearRail } from "@/features/news/YearRail";
import { ScrollFocus } from "@/components/ui/ScrollFocus";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/news");
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const isAr = locale === "ar";
  const tag = isAr ? "ar-JO" : "en-GB";
  const dateFmt = new Intl.DateTimeFormat(tag, { day: "numeric", month: "long", year: "numeric" });
  const yearFmt = new Intl.NumberFormat(isAr ? "ar-JO" : "en-US", { useGrouping: false });
  // Newest first (content/news.ts), one block per year.
  const years = [...new Set(articles.map((a) => a.date.slice(0, 4)))];
  const inYear = (year: string) => articles.filter((a) => a.date.startsWith(year));

  return (
    <>
      <PageJsonLd locale={locale} path="/news" />
      <SubpageHeader eyebrow="Giving Compound" title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        {/* A timeline: the year rides in a sticky column beside its stories. */}
        {years.map((year) => (
          <div key={year} id={`y${year}`} className="container-gc news-year">
            {/* Desktop rail: fills, and its dot travels, as the year's stories scroll by. */}
            <span className="news-rail" aria-hidden>
              <span className="news-rail-fill" />
              <span className="news-rail-dot" />
            </span>
            <header className="news-year-head">
              <span className="news-year-dot" aria-hidden />
              <h2 className="news-year-title">{yearFmt.format(Number(year))}</h2>
            </header>
            <div className="news-year-grid">
              {inYear(year).map((a) => (
                <article key={a.slug} className="news-card hv">
                  <div className="news-card-media">
                    <Image
                      src={a.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="news-card-img"
                    />
                    <HoverAccent />
                  </div>
                  <div className="news-card-body">
                    {/* One meta line, the same on every card: topic at the start, date at the end. */}
                    <p className="news-card-meta">
                      <span className="news-card-cat">{newsCategories[a.category][isAr ? "ar" : "en"]}</span>
                      <time className="news-card-date" dateTime={a.date}>
                        {dateFmt.format(new Date(a.date))}
                      </time>
                    </p>
                    <h3 className="news-card-title">
                      {/* Stretched over the whole card: one link, one tab stop. */}
                      <Link href={`/news/${a.slug}`} className="news-card-link">
                        {isAr ? a.titleAr : a.titleEn}
                      </Link>
                    </h3>
                    <p className="news-card-excerpt">{isAr ? a.excerptAr : a.excerptEn}</p>
                    <span className="news-card-more" aria-hidden>
                      {t("readMore")}
                      <ArrowIcon />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
      <YearRail />
      {/* Phones / touch: the story at mid-screen gets the hover look (.is-active). */}
      <ScrollFocus selector=".news-card" />
    </>
  );
}
