import { hasLocale } from "next-intl";
import {
  type GetRequestConfigParams,
  getRequestConfig,
} from "next-intl/server";
import { LOCALES } from "./locales";
import { routing } from "./routing";

export default getRequestConfig(
  async ({ requestLocale }: GetRequestConfigParams) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    return {
      locale,
      messages: LOCALES[locale],
    };
  }
);
