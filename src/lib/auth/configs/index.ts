import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailVerification } from "~/lib/auth/configs/email-verification";
import { rateLimit } from "~/lib/auth/configs/rate-limit";
import { verification } from "~/lib/auth/configs/verification";
import { db, schema } from "~/lib/db";
import { isProduction } from "~/utils/env";
import { uuid } from "~/utils/ids";
import { account } from "./account";
import { emailAndPassword } from "./email-password";
import { session } from "./session";
import { user } from "./user";

export const authConfigs = {
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),

  experimental: {
    joins: true,
  },

  advanced: {
    database: {
      generateId: () => uuid(),
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

  account,
  emailAndPassword,
  session,
  user,
  verification,
  emailVerification,
  rateLimit,

  logger: {
    disabled: isProduction,
    level: "debug",
  },
} satisfies BetterAuthOptions;
