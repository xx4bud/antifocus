import { betterAuth } from "better-auth";
import { env } from "~/env";
import { authPlugins } from "~/lib/auth/plugins";
import { isDevelopment, isProduction } from "~/utils/env";
import { authConfigs } from "./configs";

interface AuthOptions {
  baseURL: string;
  googleClientId: string;
  googleClientSecret: string;
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

    plugins: [...authPlugins],

    cookies: {
      sessionToken: {
        options: {
          httpOnly: true,
          secure: isProduction,
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
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
});
