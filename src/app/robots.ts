import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { PROTECTED_ROUTES } from "@/lib/i18n/routing";
import { baseURL, getLocalePath } from "@/lib/utils/urls";

export default function robots(): MetadataRoute.Robots {
  const disallow = locales.flatMap((locale) =>
    PROTECTED_ROUTES.map((path) => getLocalePath(path, locale))
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow,
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
