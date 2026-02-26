"use server";

import { count, desc, ilike, or } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getCustomers(opts: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { limit = 20, offset = 0, search } = opts;
  const whereClause = search
    ? or(
        ilike(schema.customers.name, `%${search}%`),
        ilike(schema.customers.email, `%${search}%`)
      )
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.customers)
      .where(whereClause)
      .orderBy(desc(schema.customers.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.customers).where(whereClause),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}
