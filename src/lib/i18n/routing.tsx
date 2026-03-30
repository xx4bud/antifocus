import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/lib/i18n";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: "AFC_LOCALE",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  pathnames: {
    // define pathnames
  },
});
