import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";
import { env } from "@/env";
import { db, schema } from "@/lib/db";
import { baseURL, isDevelopment, isProduction } from "@/lib/utils";
import { generateId } from "@/lib/utils/ids";
import { authOptions } from "./options";
import { authPlugins } from "./plugins";

interface InitAuthProps {
  baseURL: string;
  googleClientId: string;
  googleClientSecret: string;
  productionURL: string;
  secret: string;
}

export function initAuth(opts: InitAuthProps) {
  return betterAuth({
    ...authOptions,
    appName: "antifocus",
    baseURL: opts.baseURL,
    secret: opts.secret,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
      usePlural: true,
    }),

    socialProviders: {
      google: {
        clientId: opts.googleClientId,
        clientSecret: opts.googleClientSecret,
        scope: ["openid", "email", "profile"],
        accessType: "offline",
      },
    },

    experimental: {
      joins: true,
    },

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

    advanced: {
      database: {
        generateId: () => generateId(),
      },
      ipAddress: {
        ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
        disableIpTracking: false,
      },
      cookiePrefix: "afc",
      crossSubDomainCookies: {
        enabled: false,
      },
      useSecureCookies: isProduction,
      disableCSRFCheck: false,
    },

    trustedOrigins: [
      "antifocus://",
      opts.baseURL,
      opts.productionURL,
      ...(isDevelopment ? ["*"] : []),
    ],

    plugins: [
      ...authPlugins,
      oAuthProxy({
        productionURL: opts.productionURL,
      }),
    ],

    logger: {
      disabled: isProduction,
      level: "debug",
    },
  });
}

export const auth = initAuth({
  baseURL,
  productionURL: baseURL,
  secret: env.BETTER_AUTH_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
});
