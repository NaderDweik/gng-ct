import { LoopVideo } from "@/components/ui/LoopVideo";
import { SubpageHeader } from "@/components/ui/SubpageHeader";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site, whatsappChatUrl } from "@/content/site";
import { RegisterForm } from "@/features/register/RegisterForm";
import { RegisterHeading } from "@/features/register/RegisterHeading";
import type { LocalePageProps } from "@/i18n/types";
import { InViewOnce } from "@/components/ui/InViewOnce";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/register");
}

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("962") && d.length === 12
    ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`
    : phone;
}

/* Line icons for the contact card (24px grid, drawn in currentColor). */
const CONTACT_ICONS = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
};

/** One contact row: icon tile, small caps label, value. */
function ContactRow({
  icon,
  label,
  children,
}: {
  icon: keyof typeof CONTACT_ICONS;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="register-contact-row">
      <span className="register-contact-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {CONTACT_ICONS[icon]}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="register-contact-label">{label}</p>
        <div className="register-contact-value">{children}</div>
      </div>
    </div>
  );
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("register");
  const tc = await getTranslations("common");
  const isAr = locale === "ar";

  return (
    <>
      <PageJsonLd locale={locale} path="/register" />
      <SubpageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="register-body bg-surface-alt">
        <div className="container-gc grid items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="register-panel">
            <div className="register-panel-head">
              <RegisterHeading isAr={isAr} />
            </div>
            <RegisterForm />
          </div>

          <aside className="flex flex-col gap-4">

            <div className="register-side register-visit">
              <LoopVideo src="/motion/cta-loop.mp4" poster="/motion/cta-loop.jpg" className="register-visit-video" />
              <div className="register-visit-body">
                <p className="font-display text-xl font-bold text-on-dark md:text-2xl">
                  {isAr ? "نلقاك في مكتب المبيعات" : "See you at the sales office"}
                </p>
                <p className="mt-2 text-base leading-relaxed text-on-dark-muted">
                  {isAr
                    ? "من السبت إلى الخميس، من 10 صباحًا حتى 6 مساءً."
                    : "Saturday to Thursday, 10 am to 6 pm."}
                </p>
              </div>
            </div>

            <div className="register-side register-contact">
              <ContactRow icon="phone" label={isAr ? "اتصل بنا" : "Call us"}>
                <a href={`tel:${site.phoneAction}`} dir="ltr" className="register-contact-link">
                  {formatPhone(site.phone)}
                </a>
              </ContactRow>
              <ContactRow icon="chat" label={isAr ? "واتساب" : "WhatsApp"}>
                <a href={whatsappChatUrl(locale)} target="_blank" rel="noopener noreferrer" className="register-contact-link">
                  {tc("whatsapp")}
                </a>
              </ContactRow>
            </div>
          </aside>
        </div>
        {/* Phones: panels and contact tiles reveal as they scroll in (register.css). */}
        <InViewOnce selector=".register-panel, .register-visit, .register-contact-row" rootMargin="0px 0px -10% 0px" />
      </section>
    </>
  );
}
