"use client";

import type { Locale, Messages } from "@/lib/i18n/locales";
import { I18nProvider } from "@/lib/i18n/provider";

interface AppProviderProps {
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
  timeZone?: string;
}

export function AppProvider({
  children,
  locale,
  messages,
  timeZone,
}: AppProviderProps) {
  return (
    <I18nProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </I18nProvider>
  );
}
