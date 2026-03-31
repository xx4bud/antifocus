import type { Locale } from "@/lib/i18n/types";
import id from "@/messages/id-ID.json";

export const LOCALES = {
  "id-ID": {
    code: "id-ID",
    messages: id,
    name: "Indonesia",
    flag: "🇮🇩",
    direction: "ltr",
  },
  // for now i18n for root metadata only
  // "en-US": {},
} as const;

export const DEFAULT_LOCALE: Locale = "id-ID";

export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES) as Locale[];
