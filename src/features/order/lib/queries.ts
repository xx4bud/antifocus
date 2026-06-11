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
