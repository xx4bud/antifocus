import { env } from "@antifocus/env";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as storageDbSchema from "./schema";

export { storageDbSchema };

export type StorageDbSchema = typeof storageDbSchema;

let _storageDb: NeonHttpDatabase<StorageDbSchema> | null = null;

export const getStorageDb = () => {
  if (_storageDb) {
    return _storageDb;
  }

  const client = neon(env.DB_URL_STORAGE);

  _storageDb = drizzle({
    client,
    schema: storageDbSchema,
    casing: "snake_case",
  });
  return _storageDb;
};

export const storageDb = new Proxy({} as NeonHttpDatabase<StorageDbSchema>, {
  get: (_, prop) =>
    getStorageDb()[prop as keyof NeonHttpDatabase<StorageDbSchema>],
});

export type StorageDb = typeof storageDb;
