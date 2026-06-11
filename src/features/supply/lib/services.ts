"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  Courier,
  InventoryMovement,
  PurchaseOrder,
} from "@/lib/db/schema/supply";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertCourier,
  insertInventory,
  insertInventoryMovement,
  insertPurchaseOrder,
  insertPurchaseOrderItems,
  softDeleteCourier,
  softDeletePurchaseOrder,
  updateCourier,
  updateInventory,
  updatePurchaseOrder,
} from "./mutations";
import {
  getCourierById,
  getInventoryByBranchAndVariant,
  getPurchaseOrderById,
} from "./queries";
import type {
  CreateCourierInput,
  CreatePurchaseOrderInput,
  CreateStockAdjustmentInput,
  UpdateCourierInput,
  UpdatePurchaseOrderStatusInput,
} from "./validators";

// ==============================
// Courier Services
// ==============================

export const createCourierService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateCourierInput
): Promise<AppResult<Courier>> =>
  tryCatchAsync(async () => {
    const courierRes = await insertCourier(orgId, { ...data, id: createId() });
    if (!courierRes.ok) {
      throw courierRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.courier_created",
      targetName: "couriers",
      targetId: courierRes.value.id,
    });

    return courierRes.value;
  }, parseError);

export const updateCourierService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateCourierInput
): Promise<AppResult<Courier>> =>
  tryCatchAsync(async () => {
    const check = await getCourierById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const courierRes = await updateCourier(orgId, id, data);
    if (!courierRes.ok) {
      throw courierRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.courier_updated",
      targetName: "couriers",
      targetId: id,
    });

    return courierRes.value;
  }, parseError);

export const deleteCourierService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<Courier>> =>
  tryCatchAsync(async () => {
    const check = await getCourierById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const courierRes = await softDeleteCourier(orgId, id);
    if (!courierRes.ok) {
      throw courierRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.courier_deleted",
      targetName: "couriers",
      targetId: id,
    });

    return courierRes.value;
  }, parseError);

// ==============================
// Purchase Order Services
// ==============================

export const createPurchaseOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreatePurchaseOrderInput
): Promise<AppResult<PurchaseOrder>> =>
  tryCatchAsync(async () => {
    const purchaseNumber = `PO-VEND-${Date.now()}`;

    return await db.transaction(async (tx) => {
      const poId = createId();
      const poRes = await insertPurchaseOrder(orgId, {
        id: poId,
        supplierId: data.supplierId,
        branchId: data.branchId,
        purchaseNumber,
        status: data.status,
        paymentStatus: data.paymentStatus,
        subtotal: data.subtotal,
        taxTotal: data.taxTotal,
        shippingTotal: data.shippingTotal,
        grandTotal: data.grandTotal,
        orderDate: data.orderDate || new Date(),
        expectedDeliveryDate: data.expectedDeliveryDate,
        notes: data.notes,
        metadata: data.metadata,
      });
      if (!poRes.ok) {
        throw poRes.error;
      }

      const itemsRes = await insertPurchaseOrderItems(
        orgId,
        data.items.map((item) => ({
          id: createId(),
          purchaseOrderId: poId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: (item.unitCost || 0) * item.quantity,
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
        action: "supply.purchase_order_created",
        targetName: "purchase_orders",
        targetId: poId,
      });

      return poRes.value;
    });
  }, parseError);

export const updatePurchaseOrderStatusService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdatePurchaseOrderStatusInput
): Promise<AppResult<PurchaseOrder>> =>
  tryCatchAsync(async () => {
    const check = await getPurchaseOrderById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const poRes = await updatePurchaseOrder(orgId, id, data);
    if (!poRes.ok) {
      throw poRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.purchase_order_status_updated",
      targetName: "purchase_orders",
      targetId: id,
    });

    return poRes.value;
  }, parseError);

export const deletePurchaseOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<PurchaseOrder>> =>
  tryCatchAsync(async () => {
    const check = await getPurchaseOrderById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const poRes = await softDeletePurchaseOrder(orgId, id);
    if (!poRes.ok) {
      throw poRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.purchase_order_deleted",
      targetName: "purchase_orders",
      targetId: id,
    });

    return poRes.value;
  }, parseError);

// ==============================
// Stock Adjustment Services
// ==============================

// Helper function to resolve/adjust inventory
async function findAndAdjustInventory(
  orgId: string,
  branchId: string,
  variantId: string,
  qtyChange: number,
  unitCost: number | null | undefined
) {
  const invRes = await getInventoryByBranchAndVariant(
    orgId,
    branchId,
    variantId
  );
  if (!invRes.ok) {
    throw invRes.error;
  }
  const inventory = invRes.value;

  if (inventory) {
    const newAvailable = Math.max(0, inventory.available + qtyChange);
    const updateInvRes = await updateInventory(orgId, inventory.id, {
      available: newAvailable,
      unitCost: unitCost || inventory.unitCost,
    });
    if (!updateInvRes.ok) {
      throw updateInvRes.error;
    }
    return updateInvRes.value;
  }

  const newInvRes = await insertInventory(orgId, {
    id: createId(),
    branchId,
    variantId,
    available: Math.max(0, qtyChange),
    reserved: 0,
    incoming: 0,
    unitCost: unitCost || 0,
  });
  if (!newInvRes.ok) {
    throw newInvRes.error;
  }
  return newInvRes.value;
}

export const adjustStockService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateStockAdjustmentInput
): Promise<AppResult<InventoryMovement>> =>
  tryCatchAsync(
    async () =>
      await db.transaction(async (tx) => {
        const qtyChange =
          data.type === "adjustment_add" ? data.quantity : -data.quantity;

        const inventory = await findAndAdjustInventory(
          orgId,
          data.branchId,
          data.variantId,
          qtyChange,
          data.unitCost
        );

        const movementRes = await insertInventoryMovement(orgId, {
          id: createId(),
          branchId: data.branchId,
          variantId: data.variantId,
          type: data.type,
          quantity: qtyChange,
          unitCost: data.unitCost || inventory.unitCost,
          reference: data.reference,
          metadata: data.metadata,
        });
        if (!movementRes.ok) {
          throw movementRes.error;
        }

        await tx.insert(auditLogs).values({
          id: createId(),
          organizationId: orgId,
          actorName,
          actorId,
          action: "supply.inventory_adjusted",
          targetName: "inventory_movements",
          targetId: movementRes.value.id,
        });

        return movementRes.value;
      }),
    parseError
  );
