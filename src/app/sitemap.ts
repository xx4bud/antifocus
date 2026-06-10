import type { MetadataRoute } from "next";
import { appLocales, defaultLocale } from "@/lib/i18n/locales";
import { getAbsoluteUrl } from "@/lib/utils/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [""];

  const routes = staticRoutes.map((route) => {
    const cleanRoute = route === "/" ? "" : route;

    // Mapping alternates languages untuk next-intl dengan "as-needed"
    const alternatesLanguages = Object.keys(appLocales).reduce(
      (acc, locale) => {
        const isDefault = locale === defaultLocale;
        const prefix = isDefault ? "" : `/${locale}`;
        acc[locale] = getAbsoluteUrl(`${prefix}${cleanRoute}`);
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      url: getAbsoluteUrl(cleanRoute), // URL Default (Canonical) tanpa prefix
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: alternatesLanguages,
      },
    };
  });

  return routes;
}
