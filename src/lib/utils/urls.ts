import { env } from "@/env";
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from "@/lib/i18n";
import { isClient } from "@/lib/utils";

export function getBaseURL() {
  if (isClient) {
    return window.location.origin;
  }

  if (env.VERCEL_ENV === "production") {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const baseURL = getBaseURL();

export function getAbsoluteURL(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath === "/" ? baseURL : `${baseURL}${cleanPath}`;
}

export function getLocalePath(path: string, locale: Locale): string {
  const cleanPath =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${prefix}${cleanPath}` || "/";
}

export function getLocaleURL(path: string, locale: Locale): string {
  return getAbsoluteURL(getLocalePath(path, locale));
}

export function getMetadataURL(
  path: string,
  currentLocale: Locale = DEFAULT_LOCALE
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = getLocaleURL(path, locale);
  }

  languages["x-default"] = getLocaleURL(path, DEFAULT_LOCALE);

  return {
    canonical: getLocaleURL(path, currentLocale),
    languages,
  };
}
