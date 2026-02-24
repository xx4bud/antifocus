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
    "/callbackURL": "/callbackURL",
    "/[...slug]": "/[...slug]",
    "/search": "/search",

    // auth
    "/sign-in": "/sign-in",
    "/sign-in/phone": "/sign-in/phone",
    "/sign-up": "/sign-up",
    "/forgot-password": "/forgot-password",

    // user
    "/account": "/account",
    "/account/profile": "/account/profile",
    "/account/security": "/account/security",
    "/verify-email": "/verify-email",
    "/order": "/order",

    // admin
    "/admin": "/admin",
    "/admin/users": "/admin/users",
    "/admin/sessions": "/admin/sessions",
    "/admin/accounts": "/admin/accounts",
    "/admin/verifications": "/admin/verifications",
  },
});
