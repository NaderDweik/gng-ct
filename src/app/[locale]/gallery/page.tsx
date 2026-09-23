import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryCopy, galleryHeroSrc } from "@/content/gallery";
import { site } from "@/content/site";

type Props = { params: Promise<{ locale: string }> };

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const isAr = locale === "ar";
  const copy = isAr ? galleryCopy.ar : galleryCopy.en;

  return (
    <>
      <section className="gal-hero on-dark">
        <Image
          src={galleryHeroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="gal-hero-img"
        />
        <div className="gal-hero-shade" aria-hidden />
        <div className="container-gc relative z-[1] flex min-h-[min(62svh,560px)] flex-col justify-end pb-12 pt-28 md:pb-16 md:pt-32">
          <p className="section-eyebrow reveal">{copy.eyebrow}</p>
          <h1 className="gal-hero-title reveal" style={{ animationDelay: "80ms" }}>
            {copy.title}
          </h1>
          <p className="gal-hero-lead reveal" style={{ animationDelay: "160ms" }}>
            {copy.lead}
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <GalleryGrid />
      </Suspense>

      <section className="gal-videos">
        <div className="container-gc">
          <p className="section-eyebrow">{copy.videosEyebrow}</p>
          <h2 className="gal-videos-title">{copy.videosTitle}</h2>

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
