import { env } from "@antifocus/env";
import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle/analytics",
  schema: "./src/analytics/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DB_URL_ANALYTICS },
  casing: "snake_case",
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
} satisfies Config;
