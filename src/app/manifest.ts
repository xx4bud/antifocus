import type { MetadataRoute } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocaleURL } from "~/utils/locales";
import { baseURL } from "~/utils/urls";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const t = await getTranslations({ namespace: "metadata", locale });
  const startUrl = getLocaleURL(baseURL, locale, "/").canonical;

  const name = t("title");
  const shortName = t("shortName");
  const description = t("description");

  return {
    name,
    short_name: shortName,
    description,
    start_url: startUrl,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: locale,
    scope: startUrl,
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
