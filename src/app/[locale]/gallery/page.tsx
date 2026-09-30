import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { GalleryGrid } from "@/features/gallery/GalleryGrid";
import { galleryCopy } from "@/content/gallery";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { site } from "@/content/site";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const isAr = locale === "ar";
  const copy = isAr ? galleryCopy.ar : galleryCopy.en;

  return (
    <>
      <SubpageHeader eyebrow="Giving City" title={copy.title} subtitle={copy.lead} />

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
              <div className="gal-videos-frame">
                <iframe
                  src={site.videos.tour}
                  title={t("tour")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div>
              <p className="gal-videos-label">{t("isoVideo")}</p>
              <div className="gal-videos-frame">
                <iframe
                  src={site.videos.iso}
                  title={t("isoVideo")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
