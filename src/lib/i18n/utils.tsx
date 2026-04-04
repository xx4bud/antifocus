import { LOCALES, type Locale } from "@/lib/i18n/types";

export function getLocaleName(locale: Locale): string {
  return LOCALES[locale].name;
}

export function getLocaleFlag(locale: Locale): string {
  return LOCALES[locale].flag;
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return LOCALES[locale].direction;
}
