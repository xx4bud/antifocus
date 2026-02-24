"use client";

import { I18nProvider } from "~/components/providers/i18n-provider";
import { TRPCReactProvider } from "~/components/providers/trpc-provider";
import type { Locale, Messages } from "~/utils/types";
import { Toaster } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export function AppProvider({
  children,
  locale,
  messages,
  timeZone,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
  timeZone: string;
}>) {
  return (
    <I18nProvider locale={locale} messages={messages} timeZone={timeZone}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableSystem
      >
        <TRPCReactProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          <Toaster />
        </TRPCReactProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
