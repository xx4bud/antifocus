import {
  DEFAULT_LOCALES,
  LOCALE_DIRECTIONS,
  SUPPORTED_LOCALES,
} from "~/i18n/locales";
import type { Locale } from "~/utils/types";

export function getLocaleDirection(locale: Locale) {
  return LOCALE_DIRECTIONS[locale];
}

export function getLocalePath(url: string, locale: Locale, path = ""): string {
  return locale === DEFAULT_LOCALES ? path : `${url}/${locale}${path}`;
}

export function getLocaleURL(url: string, locale: Locale, path = "") {
  const canonical = getLocalePath(url, locale, path);

  const languages = {
    "x-default": getLocalePath(url, DEFAULT_LOCALES, path),
    ...Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        getLocalePath(url, locale, path),
      ])
    ),
  };

  return {
    canonical,
    languages,
  };
}
