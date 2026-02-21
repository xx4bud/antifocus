import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALES, SUPPORTED_LOCALES } from "./locales";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALES,
  localePrefix: "as-needed",
  localeCookie: {
    name: "afc_locale",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  pathnames: {
    // public
    "/": "/",
    "/callback": "/callback",
    "/[...slug]": "/[...slug]",

    // auth
    "/sign-in": "/sign-in",
    "/sign-in/phone": "/sign-in/phone",
    "/sign-up": "/sign-up",

    // user
    "/account": "/account",
  },
});
