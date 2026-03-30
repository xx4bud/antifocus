import en from "@/messages/en.json";
import id from "@/messages/id.json";

export const LOCALES = {
  id: {
    code: "id",
    messages: id,
    name: "Indonesia",
    flag: "🇮🇩",
    direction: "ltr",
  },
  en: {
    code: "en",
    messages: en,
    name: "English",
    flag: "🇺🇸",
    direction: "ltr",
  },
} as const;

export type Locale = keyof typeof LOCALES;
export type Messages = (typeof LOCALES)[Locale]["messages"];

export const DEFAULT_LOCALE: Locale = LOCALES.id.code;
export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES) as Locale[];

export function getLocaleName(locale: Locale): string {
  return LOCALES[locale].name;
}

export function getLocaleFlag(locale: Locale): string {
  return LOCALES[locale].flag;
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return LOCALES[locale].direction;
}
