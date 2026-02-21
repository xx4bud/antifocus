import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, getTimeZone, setRequestLocale } from "next-intl/server";
import { I18nProvider } from "~/components/providers/i18n-provider";
import { routing } from "~/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const [messages, timeZone] = await Promise.all([
    getMessages(),
    getTimeZone(),
  ]);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <I18nProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </I18nProvider>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
