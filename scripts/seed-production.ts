import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import {
  billOfMaterials,
  productionOrders,
  productionTasks,
} from "@/lib/db/schema";
import {
  PRODUCTION_ORDER_STATUS,
  PRODUCTION_PRIORITY,
  PRODUCTION_TASK_STATUS,
} from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedProduction = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Production...");

  await db.insert(billOfMaterials).values({
    id: ctx.production.bomId,
    organizationId: ctx.org.orgId,
    variantId: ctx.catalog.variantId,
    code: "BOM-001",
    name: "Hoodie BOM",
  });

  await db.insert(productionOrders).values({
    id: ctx.production.productionOrderId,
    organizationId: ctx.org.orgId,
    orderId: ctx.order.orderId,
    status: PRODUCTION_ORDER_STATUS.IN_PROGRESS,
    priority: PRODUCTION_PRIORITY.NORMAL,
  });

  await db.insert(productionTasks).values({
    id: createId(),
    organizationId: ctx.org.orgId,
    productionOrderId: ctx.production.productionOrderId,
    assigneeId: ctx.org.memberRecordId,
    name: "Printing",
    status: PRODUCTION_TASK_STATUS.PENDING,
    sequence: 1,
  });
};
