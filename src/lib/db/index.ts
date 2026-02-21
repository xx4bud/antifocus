import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "~/env";
import type { Schema } from "~/utils/types";
import * as schema from "./schemas";

export { schema };

export const getDb = (): NeonHttpDatabase<Schema> => {
  const client = neon(env.DATABASE_URL);

  return drizzle({
    client,
    schema,
    casing: "snake_case",
  });
};

export const db = new Proxy({} as NeonHttpDatabase<Schema>, {
  get: (_, prop) => getDb()[prop as keyof NeonHttpDatabase<Schema>],
});
