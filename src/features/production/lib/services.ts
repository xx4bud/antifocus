"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  BillOfMaterial,
  bomItems,
  ProductionOrder,
  productionOrders,
  productionTasks,
} from "@/lib/db/schema/production";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  deleteBomItem,
  deleteProductionTask,
  insertBom,
  insertBomItem,
  insertBomItems,
  insertProductionOrder,
  insertProductionOrderItems,
  insertProductionTask,
  insertProductionTasks,
  softDeleteBom,
  softDeleteProductionOrder,
  updateBom,
  updateBomItem,
  updateProductionOrder,
  updateProductionTask,
} from "./mutations";
import {
  getBomById,
  getProductionOrderById,
  getProductionTaskById,
  listProductionTasks,
} from "./queries";
import type {
  CreateBomInput,
  CreateBomItemInput,
  CreateProductionOrderInput,
  CreateProductionTaskInput,
  UpdateBomInput,
  UpdateBomItemInput,
  UpdateProductionOrderStatusInput,
  UpdateProductionTaskInput,
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
// BOM Item Services
// ==============================

export const addBomItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  bomId: string,
  data: CreateBomItemInput
): Promise<AppResult<typeof bomItems.$inferSelect>> =>
  tryCatchAsync(async () => {
    const check = await getBomById(orgId, bomId);
    if (!check.ok) {
      throw createError("BOM_NOT_FOUND", "BOM not found", 404);
    }

    const itemRes = await insertBomItem(orgId, {
      id: createId(),
      bomId,
      ...data,
    });
    if (!itemRes.ok) {
      throw itemRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.bom_item_added",
      targetName: "bom_items",
      targetId: itemRes.value.id,
    });

    return itemRes.value;
  }, parseError);

export const updateBomItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateBomItemInput
): Promise<AppResult<typeof bomItems.$inferSelect>> =>
  tryCatchAsync(async () => {
    const itemRes = await updateBomItem(orgId, id, data);
    if (!itemRes.ok) {
      throw itemRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.bom_item_updated",
      targetName: "bom_items",
      targetId: id,
    });

    return itemRes.value;
  }, parseError);

export const removeBomItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<typeof bomItems.$inferSelect>> =>
  tryCatchAsync(async () => {
    const itemRes = await deleteBomItem(orgId, id);
    if (!itemRes.ok) {
      throw itemRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.bom_item_removed",
      targetName: "bom_items",
      targetId: id,
    });

    return itemRes.value;
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
  actorId: string,
  actorName: string,
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

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.task_status_updated",
      targetName: "production_tasks",
      targetId: taskId,
    });

    // Check if PO is completed (all tasks done)
    if (data.status === "completed") {
      const task = taskRes.value;
      const allTasksRes = await listProductionTasks(
        orgId,
        task.productionOrderId
      );
      if (allTasksRes.ok) {
        const allCompleted = allTasksRes.value.every(
          (t) => t.status === "completed"
        );
        if (allCompleted) {
          await updateProductionOrderStatusService(
            orgId,
            actorId,
            actorName,
            task.productionOrderId,
            { status: "completed" }
          );
        }
      }
    }

    return taskRes.value;
  }, parseError);

export const createProductionTaskService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateProductionTaskInput
): Promise<AppResult<typeof productionTasks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const check = await getProductionOrderById(orgId, data.productionOrderId);
    if (!check.ok) {
      throw check.error;
    }

    const taskRes = await insertProductionTask(orgId, {
      id: createId(),
      status: "pending",
      ...data,
    });
    if (!taskRes.ok) {
      throw taskRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.task_created",
      targetName: "production_tasks",
      targetId: taskRes.value.id,
    });

    return taskRes.value;
  }, parseError);

export const updateProductionTaskService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  taskId: string,
  data: UpdateProductionTaskInput
): Promise<AppResult<typeof productionTasks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const check = await getProductionTaskById(orgId, taskId);
    if (!check.ok) {
      throw check.error;
    }

    const taskRes = await updateProductionTask(orgId, taskId, data);
    if (!taskRes.ok) {
      throw taskRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.task_updated",
      targetName: "production_tasks",
      targetId: taskId,
    });

    return taskRes.value;
  }, parseError);

export const deleteProductionTaskService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  taskId: string
): Promise<AppResult<typeof productionTasks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const check = await getProductionTaskById(orgId, taskId);
    if (!check.ok) {
      throw check.error;
    }

    const taskRes = await deleteProductionTask(orgId, taskId);
    if (!taskRes.ok) {
      throw taskRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "production.task_deleted",
      targetName: "production_tasks",
      targetId: taskId,
    });

    return taskRes.value;
  }, parseError);
