import { env } from "@antifocus/env";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as authDbSchema from "./schema";

export { authDbSchema };

export type AuthDbSchema = typeof authDbSchema;

let _authDb: NeonHttpDatabase<AuthDbSchema> | null = null;

export const getAuthDb = () => {
  if (_authDb) {
    return _authDb;
  }

  const client = neon(env.DB_URL_AUTH);

  _authDb = drizzle({
    client,
    schema: authDbSchema,
    casing: "snake_case",
  });
  return _authDb;
};

export const authDb = new Proxy({} as NeonHttpDatabase<AuthDbSchema>, {
  get: (_, prop) => getAuthDb()[prop as keyof NeonHttpDatabase<AuthDbSchema>],
});

export type AuthDb = typeof authDb;
