import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import type { InventoryTransferStatus } from "@/lib/db/schema/enums";
import {
  couriers,
  inventories,
  inventoryMovements,
  inventoryTransferItems,
  inventoryTransfers,
  purchaseOrderItems,
  purchaseOrders,
  shippingMethods,
  shippingRates,
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
// Shipping Methods Mutations
// ==============================

export const insertShippingMethod = async (
  orgId: string,
  data: Omit<typeof shippingMethods.$inferInsert, "organizationId">
): Promise<AppResult<typeof shippingMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .insert(shippingMethods)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!method) {
      throw createError("BAD_REQUEST", "Failed to create shipping method", 400);
    }

    return method;
  }, parseError);

export const updateShippingMethod = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof shippingMethods.$inferInsert, "organizationId">>
): Promise<AppResult<typeof shippingMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .update(shippingMethods)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(shippingMethods.organizationId, orgId),
          eq(shippingMethods.id, id),
          isNull(shippingMethods.deletedAt)
        )
      )
      .returning();

    if (!method) {
      throw createError(
        "SHIPPING_METHOD_NOT_FOUND",
        "Shipping method not found to update",
        404
      );
    }

    return method;
  }, parseError);

export const softDeleteShippingMethod = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof shippingMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .update(shippingMethods)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(shippingMethods.organizationId, orgId),
          eq(shippingMethods.id, id),
          isNull(shippingMethods.deletedAt)
        )
      )
      .returning();

    if (!method) {
      throw createError(
        "SHIPPING_METHOD_NOT_FOUND",
        "Shipping method not found to delete",
        404
      );
    }

    return method;
  }, parseError);

// ==============================
// Shipping Rates Mutations
// ==============================

export const insertShippingRate = async (
  orgId: string,
  data: Omit<typeof shippingRates.$inferInsert, "organizationId">
): Promise<AppResult<typeof shippingRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .insert(shippingRates)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!rate) {
      throw createError("BAD_REQUEST", "Failed to create shipping rate", 400);
    }

    return rate;
  }, parseError);

export const updateShippingRate = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof shippingRates.$inferInsert, "organizationId">>
): Promise<AppResult<typeof shippingRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .update(shippingRates)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(shippingRates.organizationId, orgId),
          eq(shippingRates.id, id),
          isNull(shippingRates.deletedAt)
        )
      )
      .returning();

    if (!rate) {
      throw createError(
        "SHIPPING_RATE_NOT_FOUND",
        "Shipping rate not found to update",
        404
      );
    }

    return rate;
  }, parseError);

export const softDeleteShippingRate = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof shippingRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .update(shippingRates)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(shippingRates.organizationId, orgId),
          eq(shippingRates.id, id),
          isNull(shippingRates.deletedAt)
        )
      )
      .returning();

    if (!rate) {
      throw createError(
        "SHIPPING_RATE_NOT_FOUND",
        "Shipping rate not found to delete",
        404
      );
    }

    return rate;
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
// PO Receiving Mutations
// ==============================

export const updatePurchaseOrderItemReceived = async (
  orgId: string,
  id: string,
  receivedQuantity: number,
  unitCost?: number | null
): Promise<AppResult<typeof purchaseOrderItems.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [item] = await db
      .update(purchaseOrderItems)
      .set({
        receivedQuantity,
        unitCost: unitCost ?? undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(purchaseOrderItems.organizationId, orgId),
          eq(purchaseOrderItems.id, id)
        )
      )
      .returning();

    if (!item) {
      throw createError(
        "PURCHASE_ORDER_ITEM_NOT_FOUND",
        "Purchase order item not found",
        404
      );
    }

    return item;
  }, parseError);

export const updatePurchaseOrderToCompleted = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof purchaseOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(purchaseOrders)
      .set({
        status: "completed",
        paymentStatus: "paid",
        updatedAt: new Date(),
      })
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
        "Purchase order not found to complete",
        404
      );
    }

    return order;
  }, parseError);

// ==============================
// Inventory Transfer Mutations
// ==============================

export const insertInventoryTransfer = async (
  orgId: string,
  data: Omit<typeof inventoryTransfers.$inferInsert, "organizationId">
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [transfer] = await db
      .insert(inventoryTransfers)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!transfer) {
      throw createError(
        "BAD_REQUEST",
        "Failed to create inventory transfer",
        400
      );
    }

    return transfer;
  }, parseError);

export const insertInventoryTransferItems = async (
  orgId: string,
  items: Omit<typeof inventoryTransferItems.$inferInsert, "organizationId">[]
): Promise<AppResult<(typeof inventoryTransferItems.$inferSelect)[]>> =>
  tryCatchAsync(async () => {
    const rows = await db
      .insert(inventoryTransferItems)
      .values(items.map((item) => ({ ...item, organizationId: orgId })))
      .returning();
    return rows;
  }, parseError);

export const updateInventoryTransferStatus = async (
  orgId: string,
  id: string,
  data: {
    status: InventoryTransferStatus;
    shippedAt?: Date | null;
    receivedAt?: Date | null;
  }
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [transfer] = await db
      .update(inventoryTransfers)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(inventoryTransfers.organizationId, orgId),
          eq(inventoryTransfers.id, id),
          isNull(inventoryTransfers.deletedAt)
        )
      )
      .returning();

    if (!transfer) {
      throw createError(
        "TRANSFER_NOT_FOUND",
        "Inventory transfer not found to update",
        404
      );
    }

    return transfer;
  }, parseError);

export const softDeleteInventoryTransfer = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [transfer] = await db
      .update(inventoryTransfers)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(inventoryTransfers.organizationId, orgId),
          eq(inventoryTransfers.id, id),
          isNull(inventoryTransfers.deletedAt)
        )
      )
      .returning();

    if (!transfer) {
      throw createError(
        "TRANSFER_NOT_FOUND",
        "Inventory transfer not found to delete",
        404
      );
    }

    return transfer;
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
