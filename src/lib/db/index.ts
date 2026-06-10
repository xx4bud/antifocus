/** biome-ignore-all lint/performance/noNamespaceImport: false */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { env } from "../../env";
import * as schema from "./schema";

export { schema };

export type Schema = typeof schema;

let _db: NeonHttpDatabase<Schema> | null = null;

export const getDb = (): NeonHttpDatabase<Schema> => {
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

export const db = new Proxy({} as NeonHttpDatabase<Schema>, {
  get: (_, prop) => getDb()[prop as keyof NeonHttpDatabase<Schema>],
});

export type DB = typeof db;
