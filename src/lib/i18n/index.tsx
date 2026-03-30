import en from "@/messages/en.json";
import id from "@/messages/id.json";

export const i18n = {
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

export type Locale = keyof typeof i18n;
export type Messages = (typeof i18n)[Locale]["messages"];

export const defaultLocale: Locale = i18n.id.code;
export const locales: Locale[] = Object.keys(i18n) as Locale[];

export function getLocaleName(locale: Locale): string {
  return i18n[locale].name;
}

export function getLocaleFlag(locale: Locale): string {
  return i18n[locale].flag;
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return i18n[locale].direction;
}
