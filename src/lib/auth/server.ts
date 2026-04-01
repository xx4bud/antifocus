import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber, username } from "better-auth/plugins";
import { env } from "@/env";
import { db, schema } from "@/lib/db";
import { baseURL, isProduction } from "@/lib/utils";
import { generateId } from "@/lib/utils/ids";

interface InitAuthProps {
  baseURL: string;
  googleClientId?: string;
  googleClientSecret?: string;
  productionURL: string;
  secret: string;
}

export function initAuth(opts: InitAuthProps) {
  return betterAuth({
    appName: "antifocus",
    baseURL: opts.baseURL,
    secret: opts.secret,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
      usePlural: true,
    }),

    plugins: [username(), phoneNumber()],

    experimental: {
      joins: true,
    },

    advanced: {
      database: {
        generateId: () => generateId(),
      },
    },

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
});
