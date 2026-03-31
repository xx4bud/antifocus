import type { Locale } from "@/lib/i18n/types";
import en from "@/messages/en-US.json";
import id from "@/messages/id-ID.json";

export const LOCALES = {
  "id-ID": {
    code: "id-ID",
    messages: id,
    name: "Indonesia",
    flag: "🇮🇩",
    direction: "ltr",
  },
  "en-US": {
    code: "en-US",
    messages: en,
    name: "English",
    flag: "🇺🇸",
    direction: "ltr",
  },
} as const;

export const DEFAULT_LOCALE: Locale = "id-ID";
export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES) as Locale[];
