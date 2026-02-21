import type { Locale } from "next-intl";
import idID from "~/i18n/locales/id-ID";

export const LOCALES = {
  "id-ID": idID,
} as const;

export const DEFAULT_LOCALES: Locale = "id-ID";

export const SUPPORTED_LOCALES: Locale[] = Object.keys(LOCALES) as Locale[];

export const LOCALE_DIRECTIONS: Record<Locale, "ltr" | "rtl"> = {
  "id-ID": "ltr",
} as const;

export const LOCALE_NAMES: Record<Locale, string> = {
  "id-ID": "Bahasa Indonesia",
} as const;
