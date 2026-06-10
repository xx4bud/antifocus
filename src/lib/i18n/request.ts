import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getRequestConfig, setRequestLocale } from "next-intl/server";
import { getAppLocale, type Locale } from "./locales";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const config = getAppLocale(locale);

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
    timeZone: config.defaultTimeZone,
  };
});

export const getLocaleParams = async (params: Promise<{ locale?: string }>) => {
  const { locale } = await params;

  if (!(locale && hasLocale(routing.locales, locale))) {
    return notFound();
  }

  setRequestLocale(locale as Locale);

  return { locale: locale as Locale };
};
