import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import type { LocalePageProps } from "@/i18n/types";

/*
 * The site's "page not found", built as /404 (Arabic) and /en/404. scripts/cloudflare-pages.mjs
 * puts the Arabic one at out/404.html in place of Next's plain page. Cloudflare Pages answers a
 * missing path with the nearest 404.html above it, with status 404: /en/... gets the English
 * page, everything else the Arabic one. Kept out of search results and out of the sitemap.
 */

type Props = LocalePageProps;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Page not found" : "الصفحة غير موجودة",
    robots: { index: false, follow: true },
  };
}

const places = [
  { href: "/compound", labelAr: "الكمباوند", labelEn: "Compound", hintAr: "خريطة الشاليهات", hintEn: "The chalet map" },
  { href: "/chalet", labelAr: "الشاليه", labelEn: "Chalet", hintAr: "المخطط والمساحات", hintEn: "The layout, room by room" },
  { href: "/gallery", labelAr: "الصور", labelEn: "Gallery", hintAr: "صور وفيديو", hintEn: "Photos and video" },
  { href: "/financing", labelAr: "التمويل", labelEn: "Financing", hintAr: "تقسيط بدون فوائد", hintEn: "Zero-interest plans" },
  { href: "/amenities", labelAr: "المرافق", labelEn: "Amenities", hintAr: "أمن، مسابح وحدائق", hintEn: "Security, pools and gardens" },
  { href: "/location", labelAr: "الموقع", labelEn: "Location", hintAr: "سحاب، قرب عمّان", hintEn: "Sahab, near Amman" },
] as const;

export default async function NotFoundPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  return (
    <>
      <SubpageHeader
        tall
        eyebrow={isAr ? "خطأ 404" : "Error 404"}
        title={isAr ? "الصفحة غير موجودة" : "Page not found"}
        subtitle={
          isAr
            ? "ربما تغيّر الرابط أو كُتب العنوان بشكل غير صحيح. عُد إلى الرئيسية أو اختر وجهتك من الأسفل."
            : "The link may have changed, or the address was mistyped. Head home, or pick a page below."
        }
      >
        <div className="nf-actions">
          <Link href="/" className="register-cta-btn">
            {isAr ? "الصفحة الرئيسية" : "Home page"}
            <span className="arrow" aria-hidden />
          </Link>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track-placement="not_found"
            className="register-cta-btn register-cta-btn--ghost"
          >
            {tc("whatsapp")}
          </a>
        </div>
      </SubpageHeader>

      <section className="section bg-surface">
        <div className="container-gc">
          <div className="sec-head">
            <div>
              <p className="section-eyebrow">{isAr ? "صفحات مقترحة" : "Popular pages"}</p>
              <h2 className="section-title mb-0">{isAr ? "إلى أين تودّ الذهاب؟" : "Where to next?"}</h2>
            </div>
          </div>
          <ul className="nf-links">
            {places.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="nf-link">
                  <span>
                    <span className="nf-link-label">{isAr ? p.labelAr : p.labelEn}</span>
                    <span className="nf-link-hint">{isAr ? p.hintAr : p.hintEn}</span>
                  </span>
                  <svg
                    className="nf-link-arrow"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
