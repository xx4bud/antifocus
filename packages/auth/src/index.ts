import { authDb } from "@antifocus/db/auth";
import { isDevelopment } from "@antifocus/env";
import { expo } from "@better-auth/expo";
import { type BetterAuthPlugin, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy, openAPI } from "better-auth/plugins";
import { authConfig } from "./config";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  googleClientId: string;
  googleClientSecret: string;
  extraPlugins?: TExtraPlugins;
}) {
  return betterAuth({
    ...authConfig,
    appName: "Antifocus",
    baseURL: options?.baseUrl,
    secret: options?.secret,

    database: drizzleAdapter(authDb, {
      provider: "pg",
      usePlural: true,
    }) as ReturnType<typeof drizzleAdapter>,

    socialProviders: {
      google: {
        clientId: options?.googleClientId as string,
        clientSecret: options?.googleClientSecret as string,
        scope: ["openid", "email", "profile"],
        accessType: "offline",
      },
    },

    plugins: [
      ...authConfig.plugins,
      oAuthProxy(),
      openAPI(),
      expo(),
      ...((options?.extraPlugins ?? []) as BetterAuthPlugin[]),
    ],

    trustedOrigins: [
      options?.baseUrl as string,
      options?.productionUrl as string,
      "antifocus://",
      ...(isDevelopment ? ["*"] : []),
    ],
  }) as ReturnType<typeof betterAuth<typeof authConfig>>;
}

export type BetterAuth = ReturnType<typeof initAuth>;
export type Session = BetterAuth["$Infer"]["Session"];
export type User = BetterAuth["$Infer"]["Session"]["user"];
