"use server";

import { count, desc, ilike, or } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getProducts(opts: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { limit = 20, offset = 0, search } = opts;
  const whereClause = search
    ? or(
        ilike(schema.products.name, `%${search}%`),
        ilike(schema.products.slug, `%${search}%`)
      )
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: schema.products.id,
        name: schema.products.name,
        slug: schema.products.slug,
        basePrice: schema.products.basePrice,
        currency: schema.products.currency,
        status: schema.products.status,
        enabled: schema.products.enabled,
        organizationId: schema.products.organizationId,
        createdAt: schema.products.createdAt,
        updatedAt: schema.products.updatedAt,
      })
      .from(schema.products)
      .where(whereClause)
      .orderBy(desc(schema.products.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.products).where(whereClause),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}
