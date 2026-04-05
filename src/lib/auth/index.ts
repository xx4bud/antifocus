import { createId } from "@paralleldrive/cuid2";
import { betterAuth, isProduction } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";
import { db } from "../db";
import { schema } from "../db/schema";
import { isDevelopment } from "../utils/env";
import { baseURL } from "../utils/urls";
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

    advanced: {
      database: {
        generateId: () => createId(),
      },
    },

    trustedOrigins: [
      "antifocus://",
      opts.baseURL,
      opts.productionURL,
      ...(isDevelopment ? ["*"] : []),
    ],

    plugins: [...authPlugins],

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

export type Auth = typeof auth;
export type AuthError = typeof auth.$ERROR_CODES;

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession["user"];
