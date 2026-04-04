import "next-intl";

import idID from "@/messages/id-ID.json";

export const LOCALES = {
  "id-ID": {
    code: "id-ID",
    messages: idID,
    name: "Indonesia",
    flag: "🇮🇩",
    direction: "ltr",
  },
  // i18n for root metadata only
  // "en-US": {},
} as const;

export const DEFAULT_LOCALE: Locale = "id-ID";

export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES) as Locale[];

export type Locale = keyof typeof LOCALES;

export type Messages = (typeof LOCALES)[Locale]["messages"];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
