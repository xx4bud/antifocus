"use client";

import { NextIntlClientProvider } from "next-intl";
import type { Locale, Messages } from "~/utils/types";

export function I18nProvider({
  children,
  locale,
  messages,
  timeZone,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
  messages?: Messages;
  timeZone?: string;
}>) {
  return (
    <NextIntlClientProvider
      getMessageFallback={({ namespace, key }) => `${namespace}.${key}`}
      locale={locale}
      messages={messages}
      onError={(error) => new Error(error.message)}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
