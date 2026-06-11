import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  couriers,
  inventories,
  inventoryMovements,
  purchaseOrderItems,
  purchaseOrders,
} from "@/lib/db/schema/supply";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// Courier Mutations
// ==============================

export const insertCourier = async (
  orgId: string,
  data: Omit<typeof couriers.$inferInsert, "organizationId">
): Promise<AppResult<typeof couriers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [courier] = await db
      .insert(couriers)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!courier) {
      throw createError("BAD_REQUEST", "Failed to create courier", 400);
    }

    return courier;
  }, parseError);

export const updateCourier = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof couriers.$inferInsert, "organizationId">>
): Promise<AppResult<typeof couriers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [courier] = await db
      .update(couriers)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(couriers.organizationId, orgId),
          eq(couriers.id, id),
          isNull(couriers.deletedAt)
        )
      )
      .returning();

    if (!courier) {
      throw createError(
        "COURIER_NOT_FOUND",
        "Courier not found to update",
        404
      );
    }

    return courier;
  }, parseError);

export const softDeleteCourier = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof couriers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [courier] = await db
      .update(couriers)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(couriers.organizationId, orgId),
          eq(couriers.id, id),
          isNull(couriers.deletedAt)
        )
      )
      .returning();

    if (!courier) {
      throw createError(
        "COURIER_NOT_FOUND",
        "Courier not found to delete",
        404
      );
    }

    return courier;
  }, parseError);

// ==============================
// Purchase Order Mutations
// ==============================

export const insertPurchaseOrder = async (
  orgId: string,
  data: Omit<typeof purchaseOrders.$inferInsert, "organizationId">
): Promise<AppResult<typeof purchaseOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .insert(purchaseOrders)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!order) {
      throw createError("BAD_REQUEST", "Failed to create purchase order", 400);
    }

    return order;
  }, parseError);

export const updatePurchaseOrder = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof purchaseOrders.$inferInsert, "organizationId">>
): Promise<AppResult<typeof purchaseOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(purchaseOrders)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(purchaseOrders.organizationId, orgId),
          eq(purchaseOrders.id, id),
          isNull(purchaseOrders.deletedAt)
        )
      )
      .returning();

    if (!order) {
      throw createError(
        "PURCHASE_ORDER_NOT_FOUND",
        "Purchase order not found to update",
        404
      );
    }

    return order;
  }, parseError);

export const softDeletePurchaseOrder = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof purchaseOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(purchaseOrders)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(purchaseOrders.organizationId, orgId),
          eq(purchaseOrders.id, id),
          isNull(purchaseOrders.deletedAt)
        )
      )
      .returning();

    if (!order) {
      throw createError(
        "PURCHASE_ORDER_NOT_FOUND",
        "Purchase order not found to delete",
        404
      );
    }

    return order;
  }, parseError);

export const insertPurchaseOrderItems = async (
  orgId: string,
  items: Omit<typeof purchaseOrderItems.$inferInsert, "organizationId">[]
): Promise<AppResult<(typeof purchaseOrderItems.$inferSelect)[]>> =>
  tryCatchAsync(async () => {
    const rows = await db
      .insert(purchaseOrderItems)
      .values(items.map((item) => ({ ...item, organizationId: orgId })))
      .returning();
    return rows;
  }, parseError);

// ==============================
// Inventory Mutations
// ==============================

export const insertInventory = async (
  orgId: string,
  data: Omit<typeof inventories.$inferInsert, "organizationId">
): Promise<AppResult<typeof inventories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [inv] = await db
      .insert(inventories)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!inv) {
      throw createError("BAD_REQUEST", "Failed to create inventory entry", 400);
    }

    return inv;
  }, parseError);

export const updateInventory = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof inventories.$inferInsert, "organizationId">>
): Promise<AppResult<typeof inventories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [inv] = await db
      .update(inventories)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(inventories.organizationId, orgId), eq(inventories.id, id)))
      .returning();

    if (!inv) {
      throw createError(
        "INVENTORY_NOT_FOUND",
        "Inventory item not found to update",
        404
      );
    }

    return inv;
  }, parseError);

export const insertInventoryMovement = async (
  orgId: string,
  data: Omit<typeof inventoryMovements.$inferInsert, "organizationId">
): Promise<AppResult<typeof inventoryMovements.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [movement] = await db
      .insert(inventoryMovements)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!movement) {
      throw createError(
        "BAD_REQUEST",
        "Failed to create inventory movement ledger entry",
        400
      );
    }

    return movement;
  }, parseError);
