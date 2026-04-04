import idID from "./messages/id-ID.json";

export const LOCALES = {
  "id-ID": {
    code: "id-ID",
    messages: idID,
    name: "Indonesia",
    flag: "🇮🇩",
    direction: "ltr",
  },
  // for now i18n for root metadata only
  // "en-US": {},
} as const;

export type Locale = keyof typeof LOCALES;

export type Messages = (typeof LOCALES)[Locale]["messages"];

export const defaultLocale: Locale = "id-ID";

export const locales: Locale[] = Object.keys(LOCALES) as Locale[];

export function getLocaleCode(locale: Locale): string {
  return LOCALES[locale].code;
}

export function getLocaleMessages(locale: Locale): Messages {
  return LOCALES[locale].messages;
}

export function getLocaleName(locale: Locale): string {
  return LOCALES[locale].name;
}

export function getLocaleFlag(locale: Locale): string {
  return LOCALES[locale].flag;
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return LOCALES[locale].direction;
}
