import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { LoopVideo } from "@/components/ui/LoopVideo";

/** `video` (a Remotion loop in public/motion) replaces the still `image` when given; `image` stays the fallback. */
type Props = { locale: string; image: string; video?: { src: string; poster: string } };

export async function RegisterCta({ locale, image, video }: Props) {
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  return (
    <section className="register-cta on-dark">
      <div className="register-cta-bg" aria-hidden>
        {video ? (
          <LoopVideo src={video.src} poster={video.poster} className="register-cta-video" lazyPoster />
        ) : (
          <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
        )}
      </div>
      <div className="container-gc">
        <div className="register-cta-inner">
          <p className="section-eyebrow">
            {tc("register")}
          </p>
          <h2 className="section-title">{isAr ? "سجّل اهتمامك." : "Register your interest."}</h2>
          <p className="section-sub">
            {tc("responseTime")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="register-cta-btn">
              {tc("register")}
              <span className="arrow" aria-hidden />
            </Link>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="register-cta-btn register-cta-btn--ghost"
            >
              {tc("whatsapp")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
