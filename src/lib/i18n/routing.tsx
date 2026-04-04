import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/types";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  localeCookie: {
    name: "AFC_LOCALE",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
});
