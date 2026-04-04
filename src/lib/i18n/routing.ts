import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/lib/i18n";

export const PUBLIC_ROUTES = [
  "/",
  "/[slug]",
  "/blog",
  "/blog/[slug]",
  "/search",
  "/categories",
  "/collections",
  "/products",
] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

export const AUTH_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
] as const;

export type AuthRoute = (typeof AUTH_ROUTES)[number];

export const USER_ROUTES = [
  "/verify",
  "/account",
  "/settings",
  "/carts",
  "/orders",
] as const;

export type UserRoute = (typeof USER_ROUTES)[number];

export const ADMIN_ROUTES = [
  "/admin",
  "/admin/settings",
  "/admin/users",
  "/admin/organizations",
] as const;

export type AdminRoute = (typeof ADMIN_ROUTES)[number];

export const ORGANIZATION_ROUTES = [
  "/dashboard",
  "/dashboard/settings",
  "/dashboard/members",
] as const;

export type OrganizationRoute = (typeof ORGANIZATION_ROUTES)[number];

export const PROTECTED_ROUTES = [
  ...AUTH_ROUTES,
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  ...ORGANIZATION_ROUTES,
] as const;

export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];

export const pathnames = Object.fromEntries(
  [
    ...PUBLIC_ROUTES,
    ...AUTH_ROUTES,
    ...USER_ROUTES,
    ...ADMIN_ROUTES,
    ...ORGANIZATION_ROUTES,
  ].map((path) => [path, path])
) as Record<
  PublicRoute | AuthRoute | UserRoute | AdminRoute | OrganizationRoute,
  string
>;

export type Pathname = keyof typeof pathnames;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: "AFC_LOCALE",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  pathnames,
});
