import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { couriers, inventories, purchaseOrders } from "@/lib/db/schema";
import { PURCHASE_ORDER_STATUS } from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedSupply = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Supply...");

  await db.insert(couriers).values({
    id: ctx.supply.courierId,
    organizationId: ctx.org.orgId,
    code: "JNE",
    name: "JNE Express",
  });

  await db.insert(purchaseOrders).values({
    id: ctx.supply.purchaseOrderId,
    organizationId: ctx.org.orgId,
    supplierId: ctx.org.supplierId,
    branchId: ctx.org.branchId,
    purchaseNumber: "PO-00001",
    status: PURCHASE_ORDER_STATUS.COMPLETED,
    grandTotal: 2_000_000,
  });

  await db.insert(inventories).values({
    id: createId(),
    organizationId: ctx.org.orgId,
    branchId: ctx.org.branchId,
    variantId: ctx.catalog.variantId,
    available: 100,
    reserved: 0,
  });
};
