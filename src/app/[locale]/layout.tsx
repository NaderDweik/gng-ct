import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo } from "next/font/google";
import { isLocale, routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ScrollMemory } from "@/components/layout/ScrollMemory";
import { RealEstateJsonLd } from "@/components/seo/RealEstateJsonLd";
import { themeCss } from "@/theme/tokens";
// Light/dark mode disabled: import { themeCss, themeInitScript } from "@/theme/tokens";
import "@/styles/globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    // Light/dark mode disabled. To restore: add suppressHydrationWarning to <html>
    // (data-theme is set by themeInitScript before hydration) and uncomment the script.
    <html lang={locale} dir={dir} className={cairo.variable}>
      <head>
        {/* <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} /> */}
        <style id="theme-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <RealEstateJsonLd />
          <ScrollMemory />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
