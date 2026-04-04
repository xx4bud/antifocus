import { hasLocale } from "next-intl";
import {
  type GetRequestConfigParams,
  getRequestConfig,
} from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { LOCALES } from "@/lib/i18n/types";

export default getRequestConfig(
  async ({ requestLocale }: GetRequestConfigParams) => {
    const requested = await requestLocale;

    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    return {
      locale,
      messages: LOCALES[locale].messages,
    };
  }
);
