import { type BetterAuthPlugin, betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { env } from "~/env";
import { isDevelopment } from "~/utils/env";
import { authConfigs } from "./configs";

interface AuthOptions {
  baseURL: string;
  googleClientId: string;
  googleClientSecret: string;
  plugins?: BetterAuthPlugin[];
  productionURL: string;
  secret: string;
}

export function initAuth(opts: AuthOptions) {
  return betterAuth({
    ...authConfigs,
    appName: "antifocus",
    baseURL: opts.baseURL,
    secret: opts.secret,

    socialProviders: {
      google: {
        clientId: opts.googleClientId,
        clientSecret: opts.googleClientSecret,
        scope: ["openid", "email", "profile"],
        accessType: "offline",
      },
    },

    trustedOrigins: [
      "antifocus://",
      opts.baseURL,
      opts.productionURL,
      ...(isDevelopment ? ["*"] : []),
    ],
  });
}

export const auth = initAuth({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  productionURL: env.NEXT_PUBLIC_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  plugins: [nextCookies()],
});
