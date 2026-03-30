import type { Locale, Messages } from "@/lib/i18n";
import "next-intl";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
