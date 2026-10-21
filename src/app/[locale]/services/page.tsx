import { setRequestLocale } from "next-intl/server";
import { ServicesPageBody } from "@/features/services/ServicesPageBody";
import type { LocalePageProps } from "@/i18n/types";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/services");
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageBody locale={locale} path="/services" />;
}
