import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";

type Props = { locale: string; image: string };

export async function RegisterCta({ locale, image }: Props) {
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  return (
    <section className="register-cta">
      <div className="register-cta-bg" aria-hidden style={{ backgroundImage: `url(${image})` }} />
      <div className="container-gc">
        <div className="register-cta-inner">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-on-dark-muted">
            {tc("register")}
          </p>
          <h2>{isAr ? "سجّل اهتمامك." : "Register your interest."}</h2>
          <p className="-mt-2 mb-8 max-w-md text-sm text-on-dark-muted md:text-base">
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
