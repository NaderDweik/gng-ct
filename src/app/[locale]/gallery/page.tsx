import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { GalleryGrid } from "@/components/GalleryGrid";
import { site } from "@/content/site";

type Props = { params: Promise<{ locale: string }> };

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="section">
        <div className="container-gc">
          <GalleryGrid />

          <h2 className="section-title mt-16">{t("videos")}</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 font-medium text-navy">{t("tour")}</p>
              <div className="aspect-video overflow-hidden bg-navy">
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
              <p className="mb-3 font-medium text-navy">{t("isoVideo")}</p>
              <div className="aspect-video overflow-hidden bg-navy">
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
