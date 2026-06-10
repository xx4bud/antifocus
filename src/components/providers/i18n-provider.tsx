import { NextIntlClientProvider } from "next-intl";
import type { Locale, Messages } from "../../lib/i18n/locales";

export function I18nProvider({
  children,
  locale,
  messages,
  timeZone,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
  timeZone?: string;
}>) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
