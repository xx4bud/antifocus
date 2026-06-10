import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/lib/db/schema/*.ts"],
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
});
