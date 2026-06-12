import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { orderChannels, orderItems, orders } from "@/lib/db/schema";
import {
  ORDER_FULFILLMENT_STATUS,
  ORDER_PAYMENT_STATUS,
  ORDER_STATUS,
} from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedOrder = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Order...");

  await db.insert(orderChannels).values({
    id: ctx.order.orderChannelId,
    organizationId: ctx.org.orgId,
    code: "WEB",
    name: "Web Storefront",
  });

  await db.insert(orders).values({
    id: ctx.order.orderId,
    organizationId: ctx.org.orgId,
    orderChannelId: ctx.order.orderChannelId,
    customerId: ctx.org.customerId,
    orderNumber: "ORD-00001",
    status: ORDER_STATUS.CONFIRMED,
    paymentStatus: ORDER_PAYMENT_STATUS.PAID,
    fulfillmentStatus: ORDER_FULFILLMENT_STATUS.UNFULFILLED,
    subtotal: 450_000,
    taxTotal: 54_000,
    grandTotal: 504_000,
  });

  await db.insert(orderItems).values({
    id: createId(),
    organizationId: ctx.org.orgId,
    orderId: ctx.order.orderId,
    variantId: ctx.catalog.variantId,
    quantity: 1,
    unitPrice: 450_000,
    totalPrice: 450_000,
  });
};
