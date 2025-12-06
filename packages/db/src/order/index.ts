import { env } from "@antifocus/env";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as orderDbSchema from "./schema";

export { orderDbSchema };

export type OrderDbSchema = typeof orderDbSchema;

let _orderDb: NeonHttpDatabase<OrderDbSchema> | null = null;

export const getOrderDb = () => {
  if (_orderDb) {
    return _orderDb;
  }

  const client = neon(env.DB_URL_ORDER);

  _orderDb = drizzle({
    client,
    schema: orderDbSchema,
    casing: "snake_case",
  });
  return _orderDb;
};

export const orderDb = new Proxy({} as NeonHttpDatabase<OrderDbSchema>, {
  get: (_, prop) => getOrderDb()[prop as keyof NeonHttpDatabase<OrderDbSchema>],
});

export type OrderDb = typeof orderDb;
