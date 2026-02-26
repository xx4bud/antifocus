"use server";

import { count, desc, ilike, or } from "drizzle-orm";
import { db, schema } from "~/lib/db";

interface GetUsersParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export async function getUsers({
  limit = 20,
  offset = 0,
  search,
}: GetUsersParams = {}) {
  const whereClause = search
    ? or(
        ilike(schema.users.name, `%${search}%`),
        ilike(schema.users.email, `%${search}%`),
        ilike(schema.users.username, `%${search}%`)
      )
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.users)
      .where(whereClause)
      .orderBy(desc(schema.users.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.users).where(whereClause),
  ]);

  return {
    data,
    total: totalResult[0]?.count ?? 0,
  };
}
