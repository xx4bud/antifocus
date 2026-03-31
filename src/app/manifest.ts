import type { MetadataRoute } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalePath } from "@/utils";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const t = await getTranslations({ namespace: "metadata", locale });
  const startUrl = getLocalePath("/", locale);

  const name = t("title");
  const shortName = t("short_name");
  const description = t("description");

  return {
    name,
    short_name: shortName,
    description,
    start_url: startUrl,
    id: "/",
    display: "standalone",
    display_override: ["window-controls-overlay"],
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
        purpose: "any",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/assets/og.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
        form_factor: "wide",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
