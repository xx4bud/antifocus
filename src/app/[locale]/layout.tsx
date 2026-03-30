import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import {
  getMessages,
  getTimeZone,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Provider } from "@/app/provider";
import type { Locale } from "@/lib/i18n";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { createMetadata } from "@/lib/utils/metadata";
import { baseURL, getMetadataURL } from "@/lib/utils/urls";
import { geistMono, geistSans, robotoSerif } from "@/styles/fonts";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, timeZone] = await Promise.all([
    getMessages(),
    getTimeZone(),
  ]);

  return (
    <html
      className={cn(
        "h-full bg-background font-sans antialiased",
        geistSans.variable,
        geistMono.variable,
        robotoSerif.variable
      )}
      lang="id"
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col" suppressHydrationWarning>
        <Provider locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Provider>
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ namespace: "metadata", locale });
  const alternates = getMetadataURL("/", locale);

  const title = t("title");
  const tagline = t("tagline");
  const description = t("description");
  const keywords = t("keywords");
  const authorName = t("author_name");
  const authorUrl = t("author_url");

  return createMetadata({
    metadataBase: new URL(baseURL),
    alternates,
    locale,
    applicationName: title,
    title: {
      default: `${title} | ${tagline}`,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    authors: [{ name: authorName, url: authorUrl }],
    creator: authorName,
    publisher: title,
    image: [
      {
        url: `${baseURL}/assets/og.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
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
