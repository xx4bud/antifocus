import type { Metadata } from "next";
import { appLocales, defaultLocale, type Locale } from "@/lib/i18n/locales";
import { APP_DOMAIN, APP_NAME } from "./constants";
import { getAbsoluteUrl } from "./urls";

interface ConstructMetadataProps {
  authorName?: string;
  authorUrl?: string;
  description: string;
  image?: string;
  keywords?: string;
  locale: Locale;
  path?: string;
  siteName?: string;
  title: string | { default: string; template: string };
}

/**
 * Constructs Next.js Metadata configuration with multi-language SEO alternates.
 */
export function constructMetadata({
  title,
  description,
  locale,
  path = "/",
  image = "/og.jpg",
  keywords,
  authorName = APP_NAME,
  authorUrl = `https://${APP_DOMAIN}`,
  siteName = APP_NAME,
}: ConstructMetadataProps): Metadata {
  const cleanPath = path === "/" ? "" : path;
  const isDefaultLocale = locale === defaultLocale;
  const currentPrefix = isDefaultLocale ? "" : `/${locale}`;
  const absoluteUrl = getAbsoluteUrl(`${currentPrefix}${cleanPath}`);

  const languageAlternates = Object.keys(appLocales).reduce(
    (acc, lang) => {
      const isLangDefault = lang === defaultLocale;
      const prefix = isLangDefault ? "" : `/${lang}`;
      acc[lang] = getAbsoluteUrl(`${prefix}${cleanPath}`);
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    title,
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
    authors: [{ name: authorName, url: authorUrl }],
    metadataBase: new URL(getAbsoluteUrl("/")),
    alternates: {
      canonical: absoluteUrl,
      languages: {
        ...languageAlternates,
        "x-default": getAbsoluteUrl(`${cleanPath}`),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName,
      locale: appLocales[locale].iso.replace("-", "_"),
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: typeof title === "string" ? title : title.default,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@antifocus",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: getAbsoluteUrl("/manifest.webmanifest"),
  };
}
