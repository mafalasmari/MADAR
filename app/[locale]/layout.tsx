import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { plexArabic, plexLatin } from "@/lib/fonts";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://gomadar.sa"),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("defaultDescription"),
    alternates: {
      languages: { ar: "/ar", en: "/en" },
    },
    openGraph: {
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      siteName: t("siteName"),
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${plexArabic.variable} ${plexLatin.variable}`}
    >
      <body className="antialiased">
        <NextIntlClientProvider>
          <SmoothScrollProvider>
            <div className="flex min-h-svh flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
