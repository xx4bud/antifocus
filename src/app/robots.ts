import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "~/i18n/locales";
import { getLocalePath } from "~/utils/locales";
import { baseURL } from "~/utils/urls";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const disallowedPaths = ["/api", "/admin"];

  const disallow = SUPPORTED_LOCALES.flatMap((locale) =>
    disallowedPaths.map((path) => getLocalePath(baseURL, locale, path))
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow,
        crawlDelay: 1,
      },
    ],
    host: baseURL,
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
