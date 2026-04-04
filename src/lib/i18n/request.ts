import { hasLocale } from "next-intl";
import {
  type GetRequestConfigParams,
  getRequestConfig,
} from "next-intl/server";
import { getLocaleMessages } from "@/lib/i18n";
import { routing } from "@/lib/i18n/routing";

export default getRequestConfig(
  async ({ requestLocale }: GetRequestConfigParams) => {
    const requested = await requestLocale;

    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    return {
      locale,
      messages: getLocaleMessages(locale),
    };
  }
);
