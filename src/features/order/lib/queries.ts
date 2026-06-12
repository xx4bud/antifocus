import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orderSessions, orders } from "@/lib/db/schema/order";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { OrderFiltersInput } from "./validators";

// ==============================
// Order Queries
// ==============================

export const getOrderById = async (
  orgId: string,
  orderId: string
): Promise<AppResult<typeof orders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.organizationId, orgId),
          eq(orders.id, orderId),
          isNull(orders.deletedAt)
        )
      )
      .limit(1);

    if (!order) {
      throw createError("ORDER_NOT_FOUND", "Order not found", 404);
    }

    return order;
  }, parseError);

export const listOrders = async (
  orgId: string,
  filters: OrderFiltersInput
): Promise<
  AppResult<{ items: (typeof orders.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(orders.organizationId, orgId),
      isNull(orders.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(orders.orderNumber, `%${filters.search}%`));
    }
    if (filters.status) {
      conditions.push(eq(orders.status, filters.status));
    }
    if (filters.paymentStatus) {
      conditions.push(eq(orders.paymentStatus, filters.paymentStatus));
    }
    if (filters.fulfillmentStatus) {
      conditions.push(eq(orders.fulfillmentStatus, filters.fulfillmentStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(orders)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

export const listOrderItems = async (
  orgId: string,
  orderId: string
): Promise<AppResult<(typeof orderItems.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.organizationId, orgId),
            eq(orderItems.orderId, orderId)
          )
        ),
    parseError
  );

// ==============================
// Order Session Queries
// ==============================

export const getOrderSessionById = async (
  orgId: string,
  sessionId: string
): Promise<AppResult<typeof orderSessions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [session] = await db
      .select()
      .from(orderSessions)
      .where(
        and(
          eq(orderSessions.organizationId, orgId),
          eq(orderSessions.id, sessionId)
        )
      )
      .limit(1);

    if (!session) {
      throw createError("SESSION_NOT_FOUND", "Order session not found", 404);
    }

    return session;
  }, parseError);

// ==============================
// Dashboard Queries
// ==============================

export const getOrderRevenueQuery = async (orgId: string): Promise<number> => {
  const { sum } = await import("drizzle-orm");
  const [actualRevenue] = await db
    .select({ total: sum(orders.grandTotal) })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        eq(orders.status, "delivered"),
        isNull(orders.deletedAt)
      )
    );
  return Number(actualRevenue?.total || 0);
};

export const getActiveOrdersCountQuery = async (
  orgId: string
): Promise<number> => {
  const { inArray } = await import("drizzle-orm");
  const [result] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        inArray(orders.status, ["processing", "pending", "confirmed"]),
        isNull(orders.deletedAt)
      )
    );
  return result?.count || 0;
};

export const getOrderGrowthRateQuery = async (
  orgId: string,
  thirtyDaysAgo: Date,
  sixtyDaysAgo: Date
): Promise<number> => {
  const { sum, gte, lt } = await import("drizzle-orm");
  const [current30Days] = await db
    .select({ total: sum(orders.grandTotal) })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        eq(orders.status, "delivered"),
        gte(orders.createdAt, thirtyDaysAgo),
        isNull(orders.deletedAt)
      )
    );

  const [previous30Days] = await db
    .select({ total: sum(orders.grandTotal) })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        eq(orders.status, "delivered"),
        gte(orders.createdAt, sixtyDaysAgo),
        lt(orders.createdAt, thirtyDaysAgo),
        isNull(orders.deletedAt)
      )
    );

  const current = Number(current30Days?.total || 0);
  const previous = Number(previous30Days?.total || 0);
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
};

export const getProfitMarginQuery = async (
  orgId: string,
  totalRevenue: number
): Promise<number> => {
  const { sum } = await import("drizzle-orm");
  const [costResult] = await db
    .select({ total: sum(orderItems.unitCost) })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.organizationId, orgId),
        eq(orders.status, "delivered"),
        isNull(orders.deletedAt)
      )
    );
  const totalCost = Number(costResult?.total || 0);
  const profit = totalRevenue - totalCost;
  return totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
};

export const getPendingProductionQuery = async (
  orgId: string
): Promise<number> => {
  const { inArray } = await import("drizzle-orm");
  const [pendingProdResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        inArray(orders.status, ["processing", "pending"]),
        isNull(orders.deletedAt)
      )
    );
  return pendingProdResult?.count || 0;
};

export const getFulfillmentRateQuery = async (
  orgId: string
): Promise<number> => {
  const { inArray } = await import("drizzle-orm");
  const [totalOrdersResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(and(eq(orders.organizationId, orgId), isNull(orders.deletedAt)));

  const [fulfilledOrdersResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        inArray(orders.status, ["delivered", "shipped"]),
        isNull(orders.deletedAt)
      )
    );

  const totalOrders = totalOrdersResult?.count || 0;
  const fulfilledOrders = fulfilledOrdersResult?.count || 0;
  return totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
};

export const getChartOrdersQuery = async (
  orgId: string,
  ninetyDaysAgo: Date
) => {
  const { gte } = await import("drizzle-orm");
  return await db
    .select({
      grandTotal: orders.grandTotal,
      createdAt: orders.createdAt,
      orderChannelId: orders.orderChannelId,
    })
    .from(orders)
    .where(
      and(
        eq(orders.organizationId, orgId),
        gte(orders.createdAt, ninetyDaysAgo),
        isNull(orders.deletedAt)
      )
    );
};
