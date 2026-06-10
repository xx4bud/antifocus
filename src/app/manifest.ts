import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/lib/i18n/locales";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: defaultLocale,
    namespace: "Metadata",
  });

  return {
    name: t("name"),
    short_name: t("shortName"),
    description: t("description"),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000", // Bisa disesuaikan dengan tema Tailwind nanti
    icons: [
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
