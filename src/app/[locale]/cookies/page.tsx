import { setRequestLocale } from "next-intl/server";
import { cookiePolicy } from "@/content/legal";
import { LegalPage } from "@/features/legal/LegalPage";
import { CookieSettings } from "@/components/layout/CookieNotice";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/cookies");
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  return (
    <>
      <PageJsonLd locale={locale} path="/cookies" />
      <LegalPage
        doc={cookiePolicy[isAr ? "ar" : "en"]}
        locale={locale}
        other={{ href: "/privacy", label: isAr ? "سياسة الخصوصية" : "Privacy Policy" }}
      >
        <CookieSettings />
      </LegalPage>
    </>
  );
}
