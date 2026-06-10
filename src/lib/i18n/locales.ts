import type { Locale as DateFnsLocale } from "date-fns";
import { enUS, id } from "date-fns/locale";
import type { NestedKeyOf } from "next-intl";
import type idMessage from "../../../messages/id.json";

export type Messages = typeof idMessage;
export type MessageKey = NestedKeyOf<Messages>;

export interface AppLocale {
  dateFns: DateFnsLocale;
  defaultCurrency: string;
  defaultDateFormat: string;
  defaultTimeFormat: string;
  defaultTimeZone: string;
  direction: "ltr" | "rtl";
  flag: string;
  iso: string;
  lang: string;
  name: string;
}

export const appLocales = {
  id: {
    lang: "id",
    iso: "id-ID",
    name: "Bahasa Indonesia",
    flag: "🇮🇩",
    dateFns: id,
    defaultCurrency: "IDR",
    defaultTimeZone: "Asia/Jakarta",
    defaultDateFormat: "dd/MM/yyyy",
    defaultTimeFormat: "HH:mm",
    direction: "ltr",
  },
  en: {
    lang: "en",
    iso: "en-US",
    name: "English (US)",
    flag: "🇺🇸",
    dateFns: enUS,
    defaultCurrency: "USD",
    defaultTimeZone: "America/New_York",
    defaultDateFormat: "MM/dd/yyyy",
    defaultTimeFormat: "hh:mm a",
    direction: "ltr",
  },
} as const satisfies Record<string, AppLocale>;

export type Locale = keyof typeof appLocales;

export const defaultLocale: Locale = "id";
export const locales = Object.keys(appLocales) as Locale[];

export const getAppLocale = (locale: Locale): AppLocale => {
  const config = appLocales[locale];
  if (!config) {
    return appLocales[defaultLocale];
  }
  return config;
};
