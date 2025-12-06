import { env } from "@antifocus/env";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as analyticsDbSchema from "./schema";

export { analyticsDbSchema };

export type AnalyticsDbSchema = typeof analyticsDbSchema;

let _analyticsDb: NeonHttpDatabase<AnalyticsDbSchema> | null = null;

export const getAnalyticsDb = () => {
  if (_analyticsDb) {
    return _analyticsDb;
  }

  const client = neon(env.DB_URL_ANALYTICS);

  _analyticsDb = drizzle({
    client,
    schema: analyticsDbSchema,
    casing: "snake_case",
  });
  return _analyticsDb;
};

export const analyticsDb = new Proxy(
  {} as NeonHttpDatabase<AnalyticsDbSchema>,
  {
    get: (_, prop) =>
      getAnalyticsDb()[prop as keyof NeonHttpDatabase<AnalyticsDbSchema>],
  }
);

export type AnalyticsDb = typeof analyticsDb;
