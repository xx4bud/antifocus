"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  BillOfMaterial,
  ProductionOrder,
  productionOrders,
  productionTasks,
} from "@/lib/db/schema/production";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertBom,
  insertBomItems,
  insertProductionOrder,
  insertProductionOrderItems,
  insertProductionTasks,
  softDeleteBom,
  softDeleteProductionOrder,
  updateBom,
  updateProductionOrder,
  updateProductionTask,
} from "./mutations";
import { getBomById, getProductionOrderById } from "./queries";
import type {
  CreateBomInput,
  CreateProductionOrderInput,
  UpdateBomInput,
  UpdateProductionOrderStatusInput,
  UpdateProductionTaskStatusInput,
} from "./validators";

// ==============================
// BOM Services
// ==============================

export const createBomService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateBomInput
): Promise<AppResult<BillOfMaterial>> =>
  tryCatchAsync(
    async () =>
      await db.transaction(async (tx) => {
        const bomId = createId();
        const bomRes = await insertBom(orgId, {
          id: bomId,
          variantId: data.variantId,
          name: data.name,
          code: data.code,
          instructions: data.instructions,
          enabled: data.enabled,
          metadata: data.metadata,
        });
        if (!bomRes.ok) {
          throw bomRes.error;
        }

        const itemsRes = await insertBomItems(
          orgId,
          data.items.map((item) => ({
            id: createId(),
            bomId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitId: item.unitId,
            metadata: item.metadata,
          }))
        );
        if (!itemsRes.ok) {
          throw itemsRes.error;
        }

        await tx.insert(auditLogs).values({
          id: createId(),
          organizationId: orgId,
          actorName,
          actorId,
          action: "production.bom_created",
          targetName: "bill_of_materials",
          targetId: bomId,
        });

        return bomRes.value;
      }),
    parseError
  );

export const updateBomService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateBomInput
): Promise<AppResult<BillOfMaterial>> =>
  tryCatchAsync(async () => {
    const check = await getBomById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const bomRes = await updateBom(orgId, id, data);
    if (!bomRes.ok) {
      throw bomRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.bom_updated",
      targetName: "bill_of_materials",
      targetId: id,
    });

    return bomRes.value;
  }, parseError);

export const deleteBomService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<BillOfMaterial>> =>
  tryCatchAsync(async () => {
    const check = await getBomById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const bomRes = await softDeleteBom(orgId, id);
    if (!bomRes.ok) {
      throw bomRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.bom_deleted",
      targetName: "bill_of_materials",
      targetId: id,
    });

    return bomRes.value;
  }, parseError);

// ==============================
// Production Order & Workflow Services
// ==============================

export const createProductionOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateProductionOrderInput
): Promise<AppResult<ProductionOrder>> =>
  tryCatchAsync(async () => {
    const productionNumber = `PO-${Date.now()}`;

    return await db.transaction(async (tx) => {
      const orderId = createId();
      const orderRes = await insertProductionOrder(orgId, {
        id: orderId,
        branchId: data.branchId,
        orderId: data.orderId,
        supplierId: data.supplierId,
        productionNumber,
        bomSnapshot: data.bomSnapshot,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate || new Date(),
        targetDate: data.targetDate,
        metadata: data.metadata,
      });
      if (!orderRes.ok) {
        throw orderRes.error;
      }

      const itemsRes = await insertProductionOrderItems(
        orgId,
        data.items.map((item) => ({
          id: createId(),
          productionOrderId: orderId,
          variantId: item.variantId,
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          metadata: item.metadata,
        }))
      );
      if (!itemsRes.ok) {
        throw itemsRes.error;
      }

      const taskNames = ["Printing", "Cutting", "Sewing", "QC & Packaging"];
      const tasksRes = await insertProductionTasks(
        orgId,
        taskNames.map((name, i) => ({
          id: createId(),
          productionOrderId: orderId,
          name,
          sequence: i + 1,
          status: "pending",
        }))
      );
      if (!tasksRes.ok) {
        throw tasksRes.error;
      }

      await tx.insert(auditLogs).values({
        id: createId(),
        organizationId: orgId,
        actorName,
        actorId,
        action: "production.order_created",
        targetName: "production_orders",
        targetId: orderId,
      });

      return orderRes.value;
    });
  }, parseError);

export const updateProductionOrderStatusService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateProductionOrderStatusInput
): Promise<AppResult<ProductionOrder>> =>
  tryCatchAsync(async () => {
    const check = await getProductionOrderById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const extra: Partial<
      Omit<typeof productionOrders.$inferInsert, "organizationId">
    > = {};
    if (data.status === "completed") {
      extra.completedDate = new Date();
    }

    const orderRes = await updateProductionOrder(orgId, id, {
      ...data,
      ...extra,
    });
    if (!orderRes.ok) {
      throw orderRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.order_status_updated",
      targetName: "production_orders",
      targetId: id,
    });

    return orderRes.value;
  }, parseError);

export const deleteProductionOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<ProductionOrder>> =>
  tryCatchAsync(async () => {
    const check = await getProductionOrderById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const orderRes = await softDeleteProductionOrder(orgId, id);
    if (!orderRes.ok) {
      throw orderRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.order_deleted",
      targetName: "production_orders",
      targetId: id,
    });

    return orderRes.value;
  }, parseError);

export const updateProductionTaskStatusService = async (
  orgId: string,
  _actorId: string,
  _actorName: string,
  taskId: string,
  data: UpdateProductionTaskStatusInput
): Promise<AppResult<typeof productionTasks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const extra: Partial<
      Omit<typeof productionTasks.$inferInsert, "organizationId">
    > = {};
    if (data.status === "in_progress") {
      extra.startedAt = new Date();
    } else if (data.status === "completed") {
      extra.completedAt = new Date();
    }

    const taskRes = await updateProductionTask(orgId, taskId, {
      ...data,
      ...extra,
    });
    if (!taskRes.ok) {
      throw taskRes.error;
    }

    return taskRes.value;
  }, parseError);
