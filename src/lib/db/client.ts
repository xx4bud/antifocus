import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "@/env";
import type { DbSchema } from "@/lib/db/types";
import * as schema from "./schema";

export { schema };

let _db: NeonHttpDatabase<DbSchema> | null = null;

export const getDb = (): NeonHttpDatabase<DbSchema> => {
  if (!_db) {
    const client = neon(env.DATABASE_URL);
    _db = drizzle({
      client,
      schema,
      casing: "snake_case",
    });
  }

  return _db;
};

export const db = new Proxy({} as NeonHttpDatabase<DbSchema>, {
  get: (_, prop) => getDb()[prop as keyof NeonHttpDatabase<DbSchema>],
});
