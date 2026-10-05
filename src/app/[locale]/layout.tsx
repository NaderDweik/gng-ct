import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Cairo, DM_Sans } from "next/font/google";
import { isLocale, routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ScrollMemory } from "@/components/layout/ScrollMemory";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { brandAr, brandEn } from "@/content/seo";
import { siteGraph } from "@/lib/seo";
import { palette, themeCss } from "@/theme/tokens";
// Light/dark mode disabled: import { themeCss, themeInitScript } from "@/theme/tokens";
import "@/styles/globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

// English copy font; pairs with the Kumbh Sans headlines (base/fonts.css).
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  themeColor: palette.secondary,
  colorScheme: "light",
};

/** Site-wide defaults; each page adds its own title, description, canonical + hreflang (lib/seo.ts). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const brand = locale === "en" ? brandEn : brandAr;
  return {
    metadataBase: new URL(site.siteUrl),
    title: { default: brand, template: `%s | ${brand}` },
    applicationName: brand,
    creator: site.companyEn,
    publisher: site.companyEn,
    category: "real estate",
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // Search Console / Bing Webmaster ownership — set in Vercel env when the sites are added.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
  };
}

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
    <html lang={locale} dir={dir} className={`${cairo.variable} ${dmSans.variable}`}>
      <head>
        {/* <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} /> */}
        <style id="theme-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <JsonLd data={siteGraph(locale)} />
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
