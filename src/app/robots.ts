import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { PROTECTED_ROUTES } from "@/lib/i18n/routing";
import { baseURL, getLocalePath } from "@/utils";

export default function robots(): MetadataRoute.Robots {
  const disallow = SUPPORTED_LOCALES.flatMap((locale) =>
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
