import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { env, isProduction } from "../../env";
import { db, schema } from "../db";
import { redis } from "../redis";
import { APP_NAME } from "../utils/constants";
import { generateId } from "../utils/ids";
import { getBaseUrl } from "../utils/urls";
import { authOptions } from "./options";
import { authPlugins } from "./plugins";

export const auth = betterAuth({
  ...authOptions,
  appName: APP_NAME.toLowerCase(),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: getBaseUrl(),

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [...authPlugins, nextCookies()],

  secondaryStorage: {
    get: async (key) => redis.get(key),
    set: async (key, value, ttl) => {
      if (ttl) {
        await redis.set(key, value, { ex: ttl });
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },

  rateLimit: {
    storage: "secondary-storage",
    enabled: true,
  },

  advanced: {
    database: {
      generateId: () => generateId(),
    },
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false,
    },
    cookiePrefix: APP_NAME.toLowerCase(),
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: isProduction,
    disableCSRFCheck: false,
  },

  logger: {
    level: "debug",
    disabled: isProduction,
  },
});

export type Auth = typeof auth;

export type AuthSession = Auth["$Infer"]["Session"];
export type AuthUser = AuthSession["user"];

export type AuthOrg = Auth["$Infer"]["Organization"];
export type AuthMember = Auth["$Infer"]["Member"];
export type AuthInvitation = Auth["$Infer"]["Invitation"];
export type AuthActiveOrg = Auth["$Infer"]["ActiveOrganization"];
