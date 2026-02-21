import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
  casing: "snake_case",
  verbose: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
  },
} satisfies Config;
