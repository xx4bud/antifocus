import { TZDate } from "@date-fns/tz";
import {
  addBusinessDays as dfnsAddBusinessDays,
  format,
  formatDistanceToNow,
  isPast,
} from "date-fns";
import { getAppLocale, type Locale } from "../i18n/locales";

// ==============================
// Date Utilities
// ==============================

/**
 * Format a date using the specified app locale.
 */
export const formatDate = (
  date: Date | string | number,
  locale: Locale = "id"
): string => {
  const appLocale = getAppLocale(locale);
  return format(new Date(date), appLocale.defaultDateFormat, {
    locale: appLocale.dateFns,
  });
};

/**
 * Format a date with time using the specified app locale.
 */
export const formatDateTime = (
  date: Date | string | number,
  locale: Locale = "id"
): string => {
  const appLocale = getAppLocale(locale);
  const formatStr = `${appLocale.defaultDateFormat} ${appLocale.defaultTimeFormat}`;
  return format(new Date(date), formatStr, {
    locale: appLocale.dateFns,
  });
};

/**
 * Format a date as relative time using the specified app locale.
 */
export const formatRelative = (
  date: Date | string | number,
  locale: Locale = "id"
): string => {
  const appLocale = getAppLocale(locale);
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: appLocale.dateFns,
  });
};

/**
 * Check if a date is in the past (expired).
 */
export const isExpired = (date: Date | string | number): boolean =>
  isPast(new Date(date));

/**
 * Add business days (skip weekends).
 */
export const addBusinessDays = (date: Date, days: number): Date =>
  dfnsAddBusinessDays(date, days);

/**
 * Convert a UTC date to a specific timezone using TZDate based on locale.
 */
export const fromUTC = (
  date: Date | string | number,
  locale: Locale = "id"
): TZDate => {
  const appLocale = getAppLocale(locale);
  return new TZDate(new Date(date), appLocale.defaultTimeZone);
};
