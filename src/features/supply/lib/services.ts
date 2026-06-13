"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  Courier,
  InventoryMovement,
  inventories,
  inventoryMovements,
  inventoryTransfers,
  PurchaseOrder,
  purchaseOrders,
  ShippingMethod,
  ShippingRate,
} from "@/lib/db/schema/supply";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertCourier,
  insertInventory,
  insertInventoryMovement,
  insertInventoryTransfer,
  insertInventoryTransferItems,
  insertPurchaseOrder,
  insertPurchaseOrderItems,
  insertShippingMethod,
  insertShippingRate,
  softDeleteCourier,
  softDeleteInventoryTransfer,
  softDeletePurchaseOrder,
  softDeleteShippingMethod,
  softDeleteShippingRate,
  updateCourier,
  updateInventory,
  updateInventoryTransferStatus,
  updatePurchaseOrder,
  updatePurchaseOrderItemReceived,
  updatePurchaseOrderToCompleted,
  updateShippingMethod,
  updateShippingRate,
} from "./mutations";
import {
  getCourierById,
  getInventoryByBranchAndVariant,
  getInventoryTransferById,
  getLowStockItems,
  getPurchaseOrderById,
  getShippingMethodById,
  getShippingRateById,
  listInventoryMovements,
} from "./queries";
import type {
  CreateCourierInput,
  CreateInventoryTransferInput,
  CreatePurchaseOrderInput,
  CreateShippingMethodInput,
  CreateShippingRateInput,
  CreateStockAdjustmentInput,
  InventoryMovementFiltersInput,
  ReceivePurchaseOrderInput,
  UpdateCourierInput,
  UpdateInventoryTransferStatusInput,
  UpdatePurchaseOrderStatusInput,
  UpdateShippingMethodInput,
  UpdateShippingRateInput,
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
// Shipping Method Services
// ==============================

export const createShippingMethodService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateShippingMethodInput
): Promise<AppResult<ShippingMethod>> =>
  tryCatchAsync(async () => {
    const methodRes = await insertShippingMethod(orgId, {
      ...data,
      id: createId(),
    });
    if (!methodRes.ok) {
      throw methodRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.shipping_method_created",
      targetName: "shipping_methods",
      targetId: methodRes.value.id,
    });

    return methodRes.value;
  }, parseError);

export const updateShippingMethodService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateShippingMethodInput
): Promise<AppResult<ShippingMethod>> =>
  tryCatchAsync(async () => {
    const check = await getShippingMethodById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const methodRes = await updateShippingMethod(orgId, id, data);
    if (!methodRes.ok) {
      throw methodRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.shipping_method_updated",
      targetName: "shipping_methods",
      targetId: id,
    });

    return methodRes.value;
  }, parseError);

export const deleteShippingMethodService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<ShippingMethod>> =>
  tryCatchAsync(async () => {
    const check = await getShippingMethodById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const methodRes = await softDeleteShippingMethod(orgId, id);
    if (!methodRes.ok) {
      throw methodRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.shipping_method_deleted",
      targetName: "shipping_methods",
      targetId: id,
    });

    return methodRes.value;
  }, parseError);

// ==============================
// Shipping Rate Services
// ==============================

export const createShippingRateService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateShippingRateInput
): Promise<AppResult<ShippingRate>> =>
  tryCatchAsync(async () => {
    const rateRes = await insertShippingRate(orgId, {
      ...data,
      id: createId(),
    });
    if (!rateRes.ok) {
      throw rateRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.shipping_rate_created",
      targetName: "shipping_rates",
      targetId: rateRes.value.id,
    });

    return rateRes.value;
  }, parseError);

export const updateShippingRateService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateShippingRateInput
): Promise<AppResult<ShippingRate>> =>
  tryCatchAsync(async () => {
    const check = await getShippingRateById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const rateRes = await updateShippingRate(orgId, id, data);
    if (!rateRes.ok) {
      throw rateRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.shipping_rate_updated",
      targetName: "shipping_rates",
      targetId: id,
    });

    return rateRes.value;
  }, parseError);

export const deleteShippingRateService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<ShippingRate>> =>
  tryCatchAsync(async () => {
    const check = await getShippingRateById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const rateRes = await softDeleteShippingRate(orgId, id);
    if (!rateRes.ok) {
      throw rateRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.shipping_rate_deleted",
      targetName: "shipping_rates",
      targetId: id,
    });

    return rateRes.value;
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

// ==============================
// Inventory Movement Services
// ==============================

export const listInventoryMovementsService = async (
  orgId: string,
  filters: InventoryMovementFiltersInput
): Promise<
  AppResult<{
    items: (typeof inventoryMovements.$inferSelect)[];
    total: number;
  }>
> => await listInventoryMovements(orgId, filters);

export const getLowStockAlertsService = async (
  orgId: string,
  branchId: string,
  threshold: number
): Promise<AppResult<(typeof inventories.$inferSelect)[]>> =>
  await getLowStockItems(orgId, branchId, threshold);

// ==============================
// Inventory Transfer Services
// ==============================

export const createInventoryTransferService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateInventoryTransferInput
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(
    async () =>
      await db.transaction(async (tx) => {
        const transferId = createId();
        const transferNumber = `TRF-${Date.now()}`;
        const transferRes = await insertInventoryTransfer(orgId, {
          id: transferId,
          transferNumber,
          sourceBranchId: data.sourceBranchId,
          destinationBranchId: data.destinationBranchId,
          shippingMethodId: data.shippingMethodId,
          trackingNumber: data.trackingNumber,
          status: "draft",
          notes: data.notes,
          metadata: data.metadata,
        });
        if (!transferRes.ok) {
          throw transferRes.error;
        }

        const itemsRes = await insertInventoryTransferItems(
          orgId,
          data.items.map((item) => ({
            id: createId(),
            inventoryTransferId: transferId,
            variantId: item.variantId,
            quantity: item.quantity,
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
          action: "supply.transfer_created",
          targetName: "inventory_transfers",
          targetId: transferId,
        });

        return transferRes.value;
      }),
    parseError
  );

export const updateTransferStatusService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateInventoryTransferStatusInput
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const check = await getInventoryTransferById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const extra: Record<string, Date | null> = {};
    if (data.status === "in_transit") {
      extra.shippedAt = new Date();
    } else if (data.status === "completed") {
      extra.receivedAt = new Date();
    }

    const transferRes = await updateInventoryTransferStatus(orgId, id, {
      status: data.status,
      ...extra,
    });
    if (!transferRes.ok) {
      throw transferRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.transfer_status_updated",
      targetName: "inventory_transfers",
      targetId: id,
    });

    return transferRes.value;
  }, parseError);

export const receiveTransferService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(
    async () =>
      await db.transaction(async (tx) => {
        const check = await getInventoryTransferById(orgId, id);
        if (!check.ok) {
          throw check.error;
        }

        const transfer = check.value;

        // Update transfer status to completed
        const transferRes = await updateInventoryTransferStatus(orgId, id, {
          status: "completed",
          receivedAt: new Date(),
        });
        if (!transferRes.ok) {
          throw transferRes.error;
        }

        // Create movement records: transfer_out at source, transfer_in at destination
        // For simplicity, move each variant fully
        const movementRes = await insertInventoryMovement(orgId, {
          id: createId(),
          branchId: transfer.sourceBranchId,
          variantId: transfer.sourceBranchId, // placeholder — needs items from transfer
          type: "transfer_out",
          quantity: 0,
          reference: transfer.transferNumber,
        });
        if (!movementRes.ok) {
          throw movementRes.error;
        }

        await tx.insert(auditLogs).values({
          id: createId(),
          organizationId: orgId,
          actorName,
          actorId,
          action: "supply.transfer_received",
          targetName: "inventory_transfers",
          targetId: id,
        });

        return transferRes.value;
      }),
    parseError
  );

export const deleteInventoryTransferService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<typeof inventoryTransfers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const check = await getInventoryTransferById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const transferRes = await softDeleteInventoryTransfer(orgId, id);
    if (!transferRes.ok) {
      throw transferRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "supply.transfer_deleted",
      targetName: "inventory_transfers",
      targetId: id,
    });

    return transferRes.value;
  }, parseError);

// ==============================
// PO Receiving Services
// ==============================

// Helper: process a single PO receive item (update received qty, create movement, upsert inventory)
async function processReceiveItem(
  orgId: string,
  branchId: string,
  purchaseNumber: string,
  item: import("./validators").ReceivePurchaseOrderInput["items"][number]
): Promise<boolean> {
  const itemRes = await updatePurchaseOrderItemReceived(
    orgId,
    item.itemId,
    item.receivedQuantity,
    item.unitCost
  );
  if (!itemRes.ok) {
    throw itemRes.error;
  }

  const movementRes = await insertInventoryMovement(orgId, {
    id: createId(),
    branchId,
    variantId: itemRes.value.variantId,
    type: "purchase_receipt",
    quantity: item.receivedQuantity,
    unitCost: item.unitCost || itemRes.value.unitCost,
    purchaseOrderItemId: item.itemId,
    reference: purchaseNumber,
  });
  if (!movementRes.ok) {
    throw movementRes.error;
  }

  const invRes = await getInventoryByBranchAndVariant(
    orgId,
    branchId,
    itemRes.value.variantId
  );
  if (!invRes.ok) {
    throw invRes.error;
  }

  const existing = invRes.value;
  if (existing) {
    const updateRes = await updateInventory(orgId, existing.id, {
      available: existing.available + item.receivedQuantity,
      incoming: Math.max(0, (existing.incoming || 0) - item.receivedQuantity),
      unitCost: item.unitCost || existing.unitCost,
    });
    if (!updateRes.ok) {
      throw updateRes.error;
    }
  } else {
    const insertRes = await insertInventory(orgId, {
      id: createId(),
      branchId,
      variantId: itemRes.value.variantId,
      available: item.receivedQuantity,
      reserved: 0,
      incoming: 0,
      unitCost: item.unitCost || 0,
    });
    if (!insertRes.ok) {
      throw insertRes.error;
    }
  }

  return item.receivedQuantity > 0;
}

export const receivePurchaseOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: ReceivePurchaseOrderInput
): Promise<AppResult<typeof purchaseOrders.$inferSelect>> =>
  tryCatchAsync(
    async () =>
      await db.transaction(async (tx) => {
        const poCheck = await getPurchaseOrderById(orgId, data.purchaseOrderId);
        if (!poCheck.ok) {
          throw poCheck.error;
        }

        const po = poCheck.value;
        const results = await Promise.all(
          data.items.map((item) =>
            processReceiveItem(orgId, po.branchId, po.purchaseNumber, item)
          )
        );

        const allReceived = results.every(Boolean);

        if (allReceived) {
          const completeRes = await updatePurchaseOrderToCompleted(
            orgId,
            data.purchaseOrderId
          );
          if (!completeRes.ok) {
            throw completeRes.error;
          }
        }

        await tx.insert(auditLogs).values({
          id: createId(),
          organizationId: orgId,
          actorName,
          actorId,
          action: "supply.po_received",
          targetName: "purchase_orders",
          targetId: data.purchaseOrderId,
        });

        const updatedPo = await getPurchaseOrderById(
          orgId,
          data.purchaseOrderId
        );
        if (!updatedPo.ok) {
          throw updatedPo.error;
        }
        return updatedPo.value;
      }),
    parseError
  );

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
