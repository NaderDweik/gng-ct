import { SmoothImage } from "@/components/ui/SmoothImage";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { getArticle, homeNewsSlugs, newsCategories } from "@/content/news";
import { NewsRail } from "@/features/news/NewsRail";
import { HoverAccent } from "@/components/ui/HoverAccent";

/* Home "News & articles": three cards linking into /news (styles: styles/sections/news-preview.css). */

export async function NewsPreview({ locale }: { locale: string }) {
  const t = await getTranslations("news");
  const isAr = locale === "ar";
  // Desktop: in the heading row. Phones / tablets: after the cards.
  const allArticles = (where: string) => (
    <Link href="/news" className={`gallery-outline-btn np-all ${where}`}>
      {isAr ? "كل المقالات" : "All articles"}
      <ArrowIcon className="arrow" />
    </Link>
  );
  const dateFmt = new Intl.DateTimeFormat(isAr ? "ar-JO" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const items = homeNewsSlugs
    .map(getArticle)
    .filter((a) => a !== undefined)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="section cv-defer cv-defer--news bg-surface-alt">
      <div className="container-gc">
        <div className="sec-head np-head">
          <div>
            <p className="section-eyebrow">{t("title")}</p>
            <h2 className="section-title">{isAr ? "آخر أخبار Giving Compound." : "Latest from Giving Compound."}</h2>
          </div>
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <p className="section-sub">{t("subtitle")}</p>
            {allArticles("np-all--head")}
          </div>
        </div>

        <NewsRail
          labels={items.map((a) => (isAr ? a.titleAr : a.titleEn))}
          prevLabel={isAr ? "المقال السابق" : "Previous article"}
          nextLabel={isAr ? "المقال التالي" : "Next article"}
        >
          <ul className="np-grid">
            {items.map((a) => (
              <li key={a.slug}>
                <Link href={`/news/${a.slug}`} className="np-card hv">
                  <span className="np-media">
                    <SmoothImage src={a.image} alt="" fill sizes="(min-width: 900px) 33vw, 100vw" className="np-img" />
                    <HoverAccent />
                  </span>
                  <span className="np-body">
                    <span className="np-meta">
                      <span className="np-cat">{newsCategories[a.category][isAr ? "ar" : "en"]}</span>
                      <time className="np-date" dateTime={a.date}>
                        {dateFmt.format(new Date(a.date))}
                      </time>
                    </span>
                    <span className="np-title">{isAr ? a.titleAr : a.titleEn}</span>
                    <span className="np-excerpt">{isAr ? a.excerptAr : a.excerptEn}</span>
                    <span className="np-more">
                      {t("readMore")}
                      <ArrowIcon />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </NewsRail>
        {/* Phones / tablets: the link closes the section, under the cards. */}
        {allArticles("np-all--end")}
      </div>
    </section>
  );
}
