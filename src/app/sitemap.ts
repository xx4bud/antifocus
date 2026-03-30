import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { ROUTES } from "@/lib/i18n/routing";
import { getMetadataURL } from "@/lib/utils/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const CATEGORIES = [
    { slug: "tech" },
    { slug: "lifestyle" },
    { slug: "health" },
  ];

  const addEntries = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    lastModified = new Date()
  ) => {
    for (const locale of SUPPORTED_LOCALES) {
      const { canonical: url, languages } = getMetadataURL(path, locale);

      entries.push({
        url,
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  };

  // static
  for (const [path] of Object.entries(ROUTES)) {
    addEntries(path, 0.8, "weekly");
  }

  // dynamic
  for (const cat of CATEGORIES) {
    addEntries(`/${cat.slug}`, 0.8, "weekly");
  }

  return entries;
}
