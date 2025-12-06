import type { BetterAuthPlugin } from "better-auth";
import {
  adminClient,
  inferAdditionalFields,
  multiSessionClient,
  phoneNumberClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { BetterAuth } from ".";

export function initAuthClient<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options?: {
  baseUrl: string;
  productionUrl: string;
  extraPlugins?: TExtraPlugins;
}) {
  return createAuthClient({
    baseURL: options?.baseUrl,
    plugins: [
      inferAdditionalFields<BetterAuth>(),
      multiSessionClient(),
      twoFactorClient(),
      phoneNumberClient(),
      usernameClient(),
      adminClient(),
      ...((options?.extraPlugins ?? []) as BetterAuthPlugin[]),
    ],
  }) as ReturnType<typeof createAuthClient>;
}
