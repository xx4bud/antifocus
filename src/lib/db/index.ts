import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "@/env";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export const getDb = (): NeonHttpDatabase<typeof schema> => {
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

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get: (_, prop) => getDb()[prop as keyof NeonHttpDatabase<typeof schema>],
});
