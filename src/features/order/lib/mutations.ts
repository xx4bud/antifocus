import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { sequences } from "@/lib/db/schema/core";
import {
  fulfillmentItems,
  fulfillments,
  orderChannels,
  orderItemDesigns,
  orderItems,
  orderReturnItems,
  orderReturns,
  orderSessions,
  orders,
} from "@/lib/db/schema/order";
import { inventories, inventoryMovements } from "@/lib/db/schema/supply";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type {
  CreateFulfillmentInput,
  CreateOrderInput,
  CreateOrderReturnInput,
} from "./validators";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

// ==============================
// Order Mutations
// ==============================

// ── Helpers ─────────────────────────────────────────────────────────────
async function generateOrderNumber(
  tx: Tx,
  orgId: string,
  branchId: string | null | undefined
): Promise<string> {
  let orderNumber = `ORD-${Date.now()}`;
  if (branchId) {
    const [seq] = await tx
      .update(sequences)
      .set({ current: sql`${sequences.current} + ${sequences.increment}` })
      .where(
        and(
          eq(sequences.organizationId, orgId),
          eq(sequences.branchId, branchId),
          eq(sequences.name, "order")
        )
      )
      .returning();

    if (seq) {
      const numStr = String(seq.current).padStart(seq.padding, "0");
      orderNumber = `${seq.prefix || ""}${numStr}${seq.suffix || ""}`;
    }
  }
  return orderNumber;
}

export const insertOrderTransaction = async (
  orgId: string,
  data: CreateOrderInput
): Promise<AppResult<typeof orders.$inferSelect>> =>
  tryCatchAsync(async () => {
    return db.transaction(async (tx) => {
      // 1. Generate Order Number
      const orderNumber = await generateOrderNumber(tx, orgId, data.branchId);

      // 2. Insert Order
      const { items, ...orderData } = data;
      const orderId = createId();

      const [order] = await tx
        .insert(orders)
        .values({
          id: orderId,
          organizationId: orgId,
          orderNumber,
          ...orderData,
        })
        .returning();

      if (!order) {
        throw createError("BAD_REQUEST", "Failed to create order", 400);
      }

      // 3. Insert Items & Designs
      for (const item of items) {
        const orderItemId = createId();
        const { designs, ...itemData } = item;

        await tx.insert(orderItems).values({
          id: orderItemId,
          organizationId: orgId,
          orderId,
          ...itemData,
        });

        if (designs && designs.length > 0) {
          const designInserts = designs.map((d) => ({
            id: createId(),
            organizationId: orgId,
            orderItemId,
            ...d,
          }));
          await tx.insert(orderItemDesigns).values(designInserts);
        }

        // 4. Reserve Inventory
        if (data.branchId) {
          await tx
            .update(inventories)
            .set({ reserved: sql`${inventories.reserved} + ${item.quantity}` })
            .where(
              and(
                eq(inventories.organizationId, orgId),
                eq(inventories.branchId, data.branchId),
                eq(inventories.variantId, item.variantId)
              )
            );
        }
      }

      return order;
    });
  }, parseError);

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

// ==============================
// Order Channel Mutations
// ==============================

export const insertOrderChannel = async (
  orgId: string,
  data: Omit<typeof orderChannels.$inferInsert, "id" | "organizationId">
): Promise<AppResult<typeof orderChannels.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [channel] = await db
      .insert(orderChannels)
      .values({ ...data, id: createId(), organizationId: orgId })
      .returning();

    if (!channel) {
      throw createError("BAD_REQUEST", "Failed to create order channel", 400);
    }

    return channel;
  }, parseError);

export const updateOrderChannel = async (
  orgId: string,
  channelId: string,
  data: Partial<
    Omit<typeof orderChannels.$inferInsert, "id" | "organizationId">
  >
): Promise<AppResult<typeof orderChannels.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [channel] = await db
      .update(orderChannels)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(orderChannels.organizationId, orgId),
          eq(orderChannels.id, channelId),
          isNull(orderChannels.deletedAt)
        )
      )
      .returning();

    if (!channel) {
      throw createError("NOT_FOUND", "Order channel not found", 404);
    }

    return channel;
  }, parseError);

export const softDeleteOrderChannel = async (
  orgId: string,
  channelId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const [channel] = await db
      .update(orderChannels)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(orderChannels.organizationId, orgId),
          eq(orderChannels.id, channelId),
          isNull(orderChannels.deletedAt)
        )
      )
      .returning();

    if (!channel) {
      throw createError("NOT_FOUND", "Order channel not found", 404);
    }

    return true;
  }, parseError);

// ==============================
// Fulfillment Mutations
// ==============================

async function generateFulfillmentNumber(
  tx: Tx,
  orgId: string,
  branchId: string
): Promise<string> {
  let fulfillmentNumber = `FUL-${Date.now()}`;
  const [seq] = await tx
    .update(sequences)
    .set({ current: sql`${sequences.current} + ${sequences.increment}` })
    .where(
      and(
        eq(sequences.organizationId, orgId),
        eq(sequences.branchId, branchId),
        eq(sequences.name, "fulfillment")
      )
    )
    .returning();

  if (seq) {
    const numStr = String(seq.current).padStart(seq.padding, "0");
    fulfillmentNumber = `${seq.prefix || ""}${numStr}${seq.suffix || ""}`;
  }
  return fulfillmentNumber;
}

export const insertFulfillment = async (
  orgId: string,
  data: CreateFulfillmentInput
): Promise<AppResult<typeof fulfillments.$inferSelect>> =>
  tryCatchAsync(
    async () =>
      db.transaction(async (tx) => {
        const fulfillmentNumber = await generateFulfillmentNumber(
          tx,
          orgId,
          data.branchId ?? orgId
        );

        const fulfillmentId = createId();
        const { items, ...fulfillmentData } = data;

        const [fulfillment] = await tx
          .insert(fulfillments)
          .values({
            id: fulfillmentId,
            organizationId: orgId,
            fulfillmentNumber,
            ...fulfillmentData,
            branchId: fulfillmentData.branchId ?? orgId,
          })
          .returning();

        if (!fulfillment) {
          throw createError("BAD_REQUEST", "Failed to create fulfillment", 400);
        }

        const itemInserts = items.map((item) => ({
          id: createId(),
          organizationId: orgId,
          fulfillmentId,
          orderItemId: item.orderItemId,
          quantity: item.quantity,
        }));

        await tx.insert(fulfillmentItems).values(itemInserts);

        await tx
          .update(orders)
          .set({ fulfillmentStatus: "partial", updatedAt: new Date() })
          .where(
            and(eq(orders.organizationId, orgId), eq(orders.id, data.orderId))
          );

        return fulfillment;
      }),
    parseError
  );

export const updateFulfillment = async (
  orgId: string,
  fulfillmentId: string,
  data: Partial<Omit<typeof fulfillments.$inferInsert, "id" | "organizationId">>
): Promise<AppResult<typeof fulfillments.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [fulfillment] = await db
      .update(fulfillments)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(fulfillments.organizationId, orgId),
          eq(fulfillments.id, fulfillmentId),
          isNull(fulfillments.deletedAt)
        )
      )
      .returning();

    if (!fulfillment) {
      throw createError("NOT_FOUND", "Fulfillment not found", 404);
    }

    return fulfillment;
  }, parseError);

export const softDeleteFulfillment = async (
  orgId: string,
  fulfillmentId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const [fulfillment] = await db
      .update(fulfillments)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(fulfillments.organizationId, orgId),
          eq(fulfillments.id, fulfillmentId),
          isNull(fulfillments.deletedAt)
        )
      )
      .returning();

    if (!fulfillment) {
      throw createError("NOT_FOUND", "Fulfillment not found", 404);
    }

    return true;
  }, parseError);

// ==============================
// Order Return Mutations
// ==============================

export const insertOrderReturn = async (
  orgId: string,
  data: CreateOrderReturnInput,
  returnNumber: string
): Promise<AppResult<typeof orderReturns.$inferSelect>> =>
  tryCatchAsync(async () => {
    return db.transaction(async (tx) => {
      const returnId = createId();
      const { items, ...returnData } = data;

      const [orderReturn] = await tx
        .insert(orderReturns)
        .values({
          id: returnId,
          organizationId: orgId,
          returnNumber,
          ...returnData,
          status: "pending",
        })
        .returning();

      if (!orderReturn) {
        throw createError("BAD_REQUEST", "Failed to create return", 400);
      }

      const itemInserts = items.map((item) => ({
        id: createId(),
        organizationId: orgId,
        orderReturnId: returnId,
        orderItemId: item.orderItemId,
        quantity: item.quantity,
        receivedQuantity: item.receivedQuantity ?? item.quantity,
        condition: item.condition ?? null,
        metadata: item.metadata ?? null,
      }));

      await tx.insert(orderReturnItems).values(itemInserts);

      // Create inventory movements (returned items back to stock)
      for (const item of items) {
        await tx.insert(inventoryMovements).values({
          organizationId: orgId,
          branchId: data.branchId,
          variantId: "", // will be derived from the order_item
          type: "adjustment_add",
          quantity: item.receivedQuantity ?? item.quantity,
          orderReturnItemId: createId(), // temporary — proper link needs orderReturnItemId
          metadata: { returnId, note: "auto from return" },
        });
      }

      await tx
        .update(orders)
        .set({
          fulfillmentStatus: "partial",
          status: "returned",
          updatedAt: new Date(),
        })
        .where(
          and(eq(orders.organizationId, orgId), eq(orders.id, data.orderId))
        );

      return orderReturn;
    });
  }, parseError);

export const updateOrderReturn = async (
  orgId: string,
  returnId: string,
  data: Partial<Omit<typeof orderReturns.$inferInsert, "id" | "organizationId">>
): Promise<AppResult<typeof orderReturns.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [orderReturn] = await db
      .update(orderReturns)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(orderReturns.organizationId, orgId),
          eq(orderReturns.id, returnId),
          isNull(orderReturns.deletedAt)
        )
      )
      .returning();

    if (!orderReturn) {
      throw createError("NOT_FOUND", "Order return not found", 404);
    }

    return orderReturn;
  }, parseError);

export const softDeleteOrderReturn = async (
  orgId: string,
  returnId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const [orderReturn] = await db
      .update(orderReturns)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(orderReturns.organizationId, orgId),
          eq(orderReturns.id, returnId),
          isNull(orderReturns.deletedAt)
        )
      )
      .returning();

    if (!orderReturn) {
      throw createError("NOT_FOUND", "Order return not found", 404);
    }

    return true;
  }, parseError);
