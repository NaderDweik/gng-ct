import { setRequestLocale } from "next-intl/server";
import { privacyPolicy } from "@/content/legal";
import { LegalPage } from "@/features/legal/LegalPage";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/privacy");
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  return (
    <>
      <PageJsonLd locale={locale} path="/privacy" />
      <LegalPage doc={privacyPolicy[isAr ? "ar" : "en"]} locale={locale} other={{ href: "/terms", label: isAr ? "شروط الاستخدام" : "Terms of Use" }} />
    </>
  );
}
