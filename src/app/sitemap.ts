import type { MetadataRoute } from "next";
import { DEFAULT_LOCALES, SUPPORTED_LOCALES } from "~/i18n/locales";
import { getLocaleURL } from "~/utils/locales";
import { baseURL } from "~/utils/urls";

const pages = [{ path: "/", priority: 1, changeFrequency: "always" as const }];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of SUPPORTED_LOCALES) {
      const url =
        locale === DEFAULT_LOCALES
          ? `${baseURL}${page.path}`
          : `${baseURL}/${locale}${page.path}`;

      const alternates = getLocaleURL(baseURL, locale);

      entries.push({
        url,
        lastModified: new Date().toISOString(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates,
      });
    }
  }

  return entries;
}
