import "~/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import {
  getLocale,
  getMessages,
  getTimeZone,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { AppProvider } from "~/components/providers/app-provider";
import { routing } from "~/i18n/routing";
import { fontMono, fontSans } from "~/styles/fonts";
import { getLocaleURL } from "~/utils/locales";
import { createMetadata } from "~/utils/seo";
import { cn } from "~/utils/styles";
import { baseURL } from "~/utils/urls";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages, timeZone] = await Promise.all([
    getLocale(),
    getMessages(),
    getTimeZone(),
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
        suppressHydrationWarning
      >
        <AppProvider locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ namespace: "metadata", locale });
  const alternates = getLocaleURL(baseURL, locale, "/");

  const title = t("title");
  const tagline = t("tagline");
  const description = t("description");
  const keywords = t("keywords");
  const authorName = t("author.name");
  const authorUrl = t("author.url");

  return createMetadata({
    metadataBase: baseURL,
    alternates,
    locale,
    applicationName: title,
    title: {
      default: `${title} | ${tagline}`,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    authors: [
      {
        name: authorName,
        url: authorUrl,
      },
    ],
    creator: authorName,
    publisher: title,
    image: [
      {
        url: `${baseURL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    openGraph: {
      alternateLocale: alternates.canonical,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      title,
      statusBarStyle: "black-translucent",
      capable: true,
    },
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: `${baseURL}/manifest.webmanifest`,
    other: {
      "google-site-verification": "googlea6921075ce51c237.html",
    },
  });
}
