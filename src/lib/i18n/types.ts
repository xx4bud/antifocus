import "next-intl";
import type { Locale, Messages } from "@/lib/i18n";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
