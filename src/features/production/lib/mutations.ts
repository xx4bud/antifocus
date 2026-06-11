import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  billOfMaterials,
  bomItems,
  productionOrderItems,
  productionOrders,
  productionTasks,
} from "@/lib/db/schema/production";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// BOM Mutations
// ==============================

export const insertBom = async (
  orgId: string,
  data: Omit<typeof billOfMaterials.$inferInsert, "organizationId">
): Promise<AppResult<typeof billOfMaterials.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [bom] = await db
      .insert(billOfMaterials)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!bom) {
      throw createError("BAD_REQUEST", "Failed to create BOM", 400);
    }

    return bom;
  }, parseError);

export const updateBom = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof billOfMaterials.$inferInsert, "organizationId">>
): Promise<AppResult<typeof billOfMaterials.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [bom] = await db
      .update(billOfMaterials)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(billOfMaterials.organizationId, orgId),
          eq(billOfMaterials.id, id),
          isNull(billOfMaterials.deletedAt)
        )
      )
      .returning();

    if (!bom) {
      throw createError("BOM_NOT_FOUND", "BOM not found to update", 404);
    }

    return bom;
  }, parseError);

export const softDeleteBom = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof billOfMaterials.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [bom] = await db
      .update(billOfMaterials)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(billOfMaterials.organizationId, orgId),
          eq(billOfMaterials.id, id),
          isNull(billOfMaterials.deletedAt)
        )
      )
      .returning();

    if (!bom) {
      throw createError("BOM_NOT_FOUND", "BOM not found to delete", 404);
    }

    return bom;
  }, parseError);

export const insertBomItems = async (
  orgId: string,
  items: Omit<typeof bomItems.$inferInsert, "organizationId">[]
): Promise<AppResult<(typeof bomItems.$inferSelect)[]>> =>
  tryCatchAsync(async () => {
    const rows = await db
      .insert(bomItems)
      .values(items.map((item) => ({ ...item, organizationId: orgId })))
      .returning();
    return rows;
  }, parseError);

export const deleteBomItems = async (
  orgId: string,
  bomId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    await db
      .delete(bomItems)
      .where(
        and(eq(bomItems.organizationId, orgId), eq(bomItems.bomId, bomId))
      );
    return true;
  }, parseError);

// ==============================
// Production Order Mutations
// ==============================

export const insertProductionOrder = async (
  orgId: string,
  data: Omit<typeof productionOrders.$inferInsert, "organizationId">
): Promise<AppResult<typeof productionOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .insert(productionOrders)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!order) {
      throw createError(
        "BAD_REQUEST",
        "Failed to create production order",
        400
      );
    }

    return order;
  }, parseError);

export const updateProductionOrder = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof productionOrders.$inferInsert, "organizationId">>
): Promise<AppResult<typeof productionOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(productionOrders)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(productionOrders.organizationId, orgId),
          eq(productionOrders.id, id),
          isNull(productionOrders.deletedAt)
        )
      )
      .returning();

    if (!order) {
      throw createError(
        "PRODUCTION_ORDER_NOT_FOUND",
        "Production order not found to update",
        404
      );
    }

    return order;
  }, parseError);

export const softDeleteProductionOrder = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof productionOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .update(productionOrders)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(productionOrders.organizationId, orgId),
          eq(productionOrders.id, id),
          isNull(productionOrders.deletedAt)
        )
      )
      .returning();

    if (!order) {
      throw createError(
        "PRODUCTION_ORDER_NOT_FOUND",
        "Production order not found to delete",
        404
      );
    }

    return order;
  }, parseError);

export const insertProductionOrderItems = async (
  orgId: string,
  items: Omit<typeof productionOrderItems.$inferInsert, "organizationId">[]
): Promise<AppResult<(typeof productionOrderItems.$inferSelect)[]>> =>
  tryCatchAsync(async () => {
    const rows = await db
      .insert(productionOrderItems)
      .values(items.map((item) => ({ ...item, organizationId: orgId })))
      .returning();
    return rows;
  }, parseError);

// ==============================
// Task Mutations
// ==============================

export const insertProductionTasks = async (
  orgId: string,
  tasks: Omit<typeof productionTasks.$inferInsert, "organizationId">[]
): Promise<AppResult<(typeof productionTasks.$inferSelect)[]>> =>
  tryCatchAsync(async () => {
    const rows = await db
      .insert(productionTasks)
      .values(tasks.map((task) => ({ ...task, organizationId: orgId })))
      .returning();
    return rows;
  }, parseError);

export const updateProductionTask = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof productionTasks.$inferInsert, "organizationId">>
): Promise<AppResult<typeof productionTasks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [task] = await db
      .update(productionTasks)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(productionTasks.organizationId, orgId),
          eq(productionTasks.id, id)
        )
      )
      .returning();

    if (!task) {
      throw createError(
        "PRODUCTION_TASK_NOT_FOUND",
        "Production task not found to update",
        404
      );
    }

    return task;
  }, parseError);
