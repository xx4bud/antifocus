import { env } from "@antifocus/env";
import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle/order",
  schema: "./src/order/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DB_URL_ORDER },
  casing: "snake_case",
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
} satisfies Config;
