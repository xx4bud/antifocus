import type { BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { authPlugins } from "~/lib/auth/plugins";
import { db, schema } from "~/lib/db";
import { isProduction } from "~/utils/env";
import { uuid } from "~/utils/ids";

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
  },

  plugins: [...authPlugins],

  logger: {
    disabled: isProduction,
    level: "debug",
  },
} satisfies BetterAuthOptions;
