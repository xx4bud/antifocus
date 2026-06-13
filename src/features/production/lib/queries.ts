import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
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
import type { ProductionFiltersInput } from "./validators";

// ==============================
// BOM Queries
// ==============================

export const getBomById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof billOfMaterials.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [bom] = await db
      .select()
      .from(billOfMaterials)
      .where(
        and(
          eq(billOfMaterials.organizationId, orgId),
          eq(billOfMaterials.id, id),
          isNull(billOfMaterials.deletedAt)
        )
      )
      .limit(1);

    if (!bom) {
      throw createError("BOM_NOT_FOUND", "Bill of Materials not found", 404);
    }

    return bom;
  }, parseError);

export const listBoms = async (
  orgId: string,
  filters: ProductionFiltersInput
): Promise<
  AppResult<{ items: (typeof billOfMaterials.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(billOfMaterials.organizationId, orgId),
      isNull(billOfMaterials.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(billOfMaterials.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(billOfMaterials)
        .where(and(...conditions))
        .orderBy(desc(billOfMaterials.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(billOfMaterials)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// BOM Item Queries
// ==============================

export const listBomItems = async (
  orgId: string,
  bomId: string
): Promise<AppResult<(typeof bomItems.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(bomItems)
        .where(
          and(eq(bomItems.organizationId, orgId), eq(bomItems.bomId, bomId))
        ),
    parseError
  );

// ==============================
// Production Order Queries
// ==============================

export const getProductionOrderById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof productionOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .select()
      .from(productionOrders)
      .where(
        and(
          eq(productionOrders.organizationId, orgId),
          eq(productionOrders.id, id),
          isNull(productionOrders.deletedAt)
        )
      )
      .limit(1);

    if (!order) {
      throw createError(
        "PRODUCTION_ORDER_NOT_FOUND",
        "Production order not found",
        404
      );
    }

    return order;
  }, parseError);

export const listProductionOrders = async (
  orgId: string,
  filters: ProductionFiltersInput
): Promise<
  AppResult<{ items: (typeof productionOrders.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(productionOrders.organizationId, orgId),
      isNull(productionOrders.deletedAt),
    ];

    if (filters.search) {
      conditions.push(
        ilike(productionOrders.productionNumber, `%${filters.search}%`)
      );
    }
    if (filters.status) {
      conditions.push(eq(productionOrders.status, filters.status));
    }
    if (filters.priority) {
      conditions.push(eq(productionOrders.priority, filters.priority));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(productionOrders)
        .where(and(...conditions))
        .orderBy(desc(productionOrders.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(productionOrders)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

export const listProductionOrderItems = async (
  orgId: string,
  productionOrderId: string
): Promise<AppResult<(typeof productionOrderItems.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(productionOrderItems)
        .where(
          and(
            eq(productionOrderItems.organizationId, orgId),
            eq(productionOrderItems.productionOrderId, productionOrderId)
          )
        ),
    parseError
  );

// ==============================
// Task Queries
// ==============================

export const listProductionTasks = async (
  orgId: string,
  productionOrderId: string
): Promise<AppResult<(typeof productionTasks.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(productionTasks)
        .where(
          and(
            eq(productionTasks.organizationId, orgId),
            eq(productionTasks.productionOrderId, productionOrderId)
          )
        )
        .orderBy(productionTasks.sequence),
    parseError
  );

export const getProductionTaskById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof productionTasks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [task] = await db
      .select()
      .from(productionTasks)
      .where(
        and(
          eq(productionTasks.organizationId, orgId),
          eq(productionTasks.id, id)
        )
      )
      .limit(1);

    if (!task) {
      throw createError(
        "PRODUCTION_TASK_NOT_FOUND",
        "Production task not found",
        404
      );
    }

    return task;
  }, parseError);

export const listProductionTasksByAssignee = async (
  orgId: string,
  assigneeId: string
): Promise<AppResult<(typeof productionTasks.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(productionTasks)
        .where(
          and(
            eq(productionTasks.organizationId, orgId),
            eq(productionTasks.assigneeId, assigneeId)
          )
        )
        .orderBy(productionTasks.sequence),
    parseError
  );
