import { hasLocale } from "next-intl";
import {
  type GetRequestConfigParams,
  getRequestConfig,
} from "next-intl/server";
import { i18n } from "@/lib/i18n";
import { routing } from "@/lib/i18n/routing";

export default getRequestConfig(
  async ({ requestLocale }: GetRequestConfigParams) => {
    const requested = await requestLocale;

    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    return {
      locale,
      messages: i18n[locale].messages,
    };
  }
);
