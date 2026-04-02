import "next-intl";

import type { LOCALES } from "./constant";

export type Locale = keyof typeof LOCALES;
export type Messages = (typeof LOCALES)[Locale]["messages"];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
