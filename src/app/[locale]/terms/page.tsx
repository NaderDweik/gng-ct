import { setRequestLocale } from "next-intl/server";
import { termsOfUse } from "@/content/legal";
import { LegalPage } from "@/features/legal/LegalPage";
import type { LocalePageProps } from "@/i18n/types";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/terms");
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  return (
    <>
      <PageJsonLd locale={locale} path="/terms" />
      <LegalPage doc={termsOfUse[isAr ? "ar" : "en"]} locale={locale} other={{ href: "/privacy", label: isAr ? "سياسة الخصوصية" : "Privacy Policy" }} />
    </>
  );
}
