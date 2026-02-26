"use server";

import { count, desc, ilike, or } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getOrganizations(opts: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { limit = 20, offset = 0, search } = opts;
  const whereClause = search
    ? or(
        ilike(schema.organizations.name, `%${search}%`),
        ilike(schema.organizations.slug, `%${search}%`)
      )
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.organizations)
      .where(whereClause)
      .orderBy(desc(schema.organizations.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.organizations).where(whereClause),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}
