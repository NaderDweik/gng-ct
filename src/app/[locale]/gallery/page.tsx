import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { GalleryGrid } from "@/features/gallery/GalleryGrid";
import { galleryCopy } from "@/content/gallery";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { site } from "@/content/site";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/gallery");
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const isAr = locale === "ar";
  const copy = isAr ? galleryCopy.ar : galleryCopy.en;

  return (
    <>
      <PageJsonLd locale={locale} path="/gallery" />
      <SubpageHeader tall eyebrow="Giving Compound" title={copy.title} subtitle={copy.lead} />

      <Suspense fallback={null}>
        <GalleryGrid />
      </Suspense>

      <section className="gal-videos">
        <div className="container-gc">
          <p className="section-eyebrow">{copy.videosEyebrow}</p>
          <h2 className="section-title gal-videos-title">{copy.videosTitle}</h2>

          <div className="gal-videos-grid">
            <div>
              <p className="gal-videos-label">{t("tour")}</p>
              <VideoPlayer {...site.videos.tour} title={t("tour")} locale={locale} />
            </div>
            <div>
              <p className="gal-videos-label">{t("isoVideo")}</p>
              <VideoPlayer {...site.videos.iso} title={t("isoVideo")} locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
