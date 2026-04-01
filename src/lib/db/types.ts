import type { db, schema } from "@/lib/db/client";

export type DbSchema = typeof schema;
export type DbClient = typeof db;
