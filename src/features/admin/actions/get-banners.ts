"use server";

import { count, desc } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getBanners(opts: { limit?: number; offset?: number }) {
  const { limit = 20, offset = 0 } = opts;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.banners)
      .orderBy(desc(schema.banners.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.banners),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}
