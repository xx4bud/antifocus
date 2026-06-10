import { getMessages, getTimeZone, getTranslations } from "next-intl/server";
import { AppProvider } from "@/components/providers/app-provider";
import { getLocaleParams } from "@/lib/i18n/request";
import { routing } from "@/lib/i18n/routing";
import { constructMetadata } from "@/lib/utils/seo";
import { cn } from "@/lib/utils/ui";
import { fontMono, fontSans, fontSerif } from "@/styles/fonts";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await getLocaleParams(params);

  const [messages, timeZone] = await Promise.all([
    getMessages(),
    getTimeZone(),
  ]);

  return (
    <html
      className={cn(
        "h-full bg-background font-sans antialiased",
        fontSans.variable,
        fontMono.variable,
        fontSerif.variable
      )}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <AppProvider locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await getLocaleParams(params);

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return constructMetadata({
    title: {
      default: t("title"),
      template: `%s | ${t("name")}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    authorName: t("authorName"),
    authorUrl: t("authorUrl"),
    siteName: t("name"),
    locale,
    path: "/",
  });
}
