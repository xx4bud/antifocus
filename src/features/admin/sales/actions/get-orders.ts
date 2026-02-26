"use server";

import { count, desc, eq } from "drizzle-orm";
import { db, schema } from "~/lib/db";
import type { OrderStatus } from "~/lib/db/schemas/constants";

export async function getOrders(opts: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  const { limit = 20, offset = 0, status } = opts;
  const whereClause = status
    ? eq(schema.orders.status, status as OrderStatus)
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: schema.orders.id,
        orderNumber: schema.orders.orderNumber,
        channel: schema.orders.channel,
        status: schema.orders.status,
        total: schema.orders.total,
        currency: schema.orders.currency,
        customerId: schema.orders.customerId,
        organizationId: schema.orders.organizationId,
        createdAt: schema.orders.createdAt,
        updatedAt: schema.orders.updatedAt,
      })
      .from(schema.orders)
      .where(whereClause)
      .orderBy(desc(schema.orders.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.orders).where(whereClause),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}
