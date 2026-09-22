import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryCopy } from "@/content/gallery";
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
      {/* JG-style page intro */}
      <section className="border-b border-neutral-200 bg-neutral-50 pt-24 md:pt-28">
        <div className="container-gc py-14 text-center md:py-16">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#465461] uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
        </div>
      </section>

      <Suspense fallback={null}>
        <GalleryGrid />
      </Suspense>

      {/* Videos — keep below, JG gallery itself is photos-only */}
      <section className="border-t border-neutral-200 bg-white py-16 md:py-20">
        <div className="container-gc">
          <p className="mb-2 text-center text-xs font-bold tracking-[0.22em] text-[#465461] uppercase">
            {t("videos")}
          </p>
          <h2 className="font-display mb-10 text-center text-3xl font-bold text-neutral-900">
            {isAr ? "جولات مرئية" : "Video tours"}
          </h2>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-wide text-[#465461]">
                {t("tour")}
              </p>
              <div className="aspect-video overflow-hidden border border-neutral-200 bg-neutral-950">
                <iframe
                  className="h-full w-full"
                  src={site.videos.tour}
                  title={t("tour")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold tracking-wide text-[#465461]">
                {t("isoVideo")}
              </p>
              <div className="aspect-video overflow-hidden border border-neutral-200 bg-neutral-950">
                <iframe
                  className="h-full w-full"
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
