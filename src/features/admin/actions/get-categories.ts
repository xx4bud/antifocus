"use server";

import { count, desc, ilike, or } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getCategories(opts: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { limit = 50, offset = 0, search } = opts;
  const whereClause = search
    ? or(
        ilike(schema.categories.name, `%${search}%`),
        ilike(schema.categories.slug, `%${search}%`)
      )
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.categories)
      .where(whereClause)
      .orderBy(desc(schema.categories.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.categories).where(whereClause),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}
