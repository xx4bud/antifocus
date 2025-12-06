import { env } from "@antifocus/env";
import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle/storage",
  schema: "./src/storage/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DB_URL_STORAGE },
  casing: "snake_case",
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
} satisfies Config;
