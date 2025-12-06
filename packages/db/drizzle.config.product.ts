import { env } from "@antifocus/env";
import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle/product",
  schema: "./src/product/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DB_URL_PRODUCT },
  casing: "snake_case",
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
} satisfies Config;
