import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orderSessions, orders } from "@/lib/db/schema/order";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// Order Mutations
// ==============================

export const insertOrder = async (
  orgId: string,
  data: Omit<typeof orders.$inferInsert, "organizationId">
): Promise<AppResult<typeof orders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .insert(orders)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!order) {
      throw createError("BAD_REQUEST", "Failed to create order", 400);
    }

    return order;
  }, parseError);

export const updateOrder = async (
  orgId: string,
  orderId: string,
  data: Partial<Omit<typeof orders.$inferInsert, "organizationId">>
): Promise<AppResult<typeof orders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(orders)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(orders.organizationId, orgId),
          eq(orders.id, orderId),
          isNull(orders.deletedAt)
        )
      )
      .returning();

    if (!order) {
      throw createError("ORDER_NOT_FOUND", "Order not found to update", 404);
    }

    return order;
  }, parseError);

export const softDeleteOrder = async (
  orgId: string,
  orderId: string
): Promise<AppResult<typeof orders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(orders)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(orders.organizationId, orgId),
          eq(orders.id, orderId),
          isNull(orders.deletedAt)
        )
      )
      .returning();

    if (!order) {
      throw createError("ORDER_NOT_FOUND", "Order not found to delete", 404);
    }

    return order;
  }, parseError);

export const insertOrderItems = async (
  orgId: string,
  items: Omit<typeof orderItems.$inferInsert, "organizationId">[]
): Promise<AppResult<(typeof orderItems.$inferSelect)[]>> =>
  tryCatchAsync(async () => {
    const rows = await db
      .insert(orderItems)
      .values(items.map((item) => ({ ...item, organizationId: orgId })))
      .returning();
    return rows;
  }, parseError);

// ==============================
// Order Session Mutations
// ==============================

export const insertOrderSession = async (
  orgId: string,
  data: Omit<typeof orderSessions.$inferInsert, "organizationId">
): Promise<AppResult<typeof orderSessions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [session] = await db
      .insert(orderSessions)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!session) {
      throw createError("BAD_REQUEST", "Failed to create order session", 400);
    }

    return session;
  }, parseError);

export const updateOrderSession = async (
  orgId: string,
  sessionId: string,
  data: Partial<Omit<typeof orderSessions.$inferInsert, "organizationId">>
): Promise<AppResult<typeof orderSessions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [session] = await db
      .update(orderSessions)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(orderSessions.organizationId, orgId),
          eq(orderSessions.id, sessionId)
        )
      )
      .returning();

    if (!session) {
      throw createError(
        "SESSION_NOT_FOUND",
        "Session not found to update",
        404
      );
    }

    return session;
  }, parseError);
