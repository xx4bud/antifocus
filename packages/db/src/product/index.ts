import { env } from "@antifocus/env";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as productDbSchema from "./schema";

export { productDbSchema };

export type ProductDbSchema = typeof productDbSchema;

let _productDb: NeonHttpDatabase<ProductDbSchema> | null = null;

export const getProductDb = () => {
  if (_productDb) {
    return _productDb;
  }

  const client = neon(env.DB_URL_PRODUCT);

  _productDb = drizzle({
    client,
    schema: productDbSchema,
    casing: "snake_case",
  });
  return _productDb;
};

export const productDb = new Proxy({} as NeonHttpDatabase<ProductDbSchema>, {
  get: (_, prop) =>
    getProductDb()[prop as keyof NeonHttpDatabase<ProductDbSchema>],
});

export type ProductDb = typeof productDb;
