"use client";

import { I18nProvider } from "@/components/providers/i18n-provider";
import type { Locale, Messages } from "@/lib/i18n/locales";
import { TRPCReactProvider } from "./trpc-provider";

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
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </I18nProvider>
  );
}
