"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCProviderWrapper } from "@/lib/api/provider";
import type { Locale, Messages } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/provider";

export function Provider({
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
    <TRPCProviderWrapper>
      <I18nProvider locale={locale} messages={messages} timeZone={timeZone}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        <Toaster />
      </I18nProvider>
      <SpeedInsights />
      <Analytics />
    </TRPCProviderWrapper>
  );
}
