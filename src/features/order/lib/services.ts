"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type { Order, OrderSession } from "@/lib/db/schema/order";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertOrder,
  insertOrderItems,
  insertOrderSession,
  softDeleteOrder,
  updateOrder,
  updateOrderSession,
} from "./mutations";
import { getOrderById, getOrderSessionById } from "./queries";
import type {
  CloseOrderSessionInput,
  CreateOrderInput,
  CreateOrderSessionInput,
  UpdateOrderStatusInput,
} from "./validators";

// ==============================
// Order Session Services
// ==============================

export const createOrderSessionService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateOrderSessionInput
): Promise<AppResult<OrderSession>> =>
  tryCatchAsync(async () => {
    const sessionRes = await insertOrderSession(orgId, {
      ...data,
      id: createId(),
      status: "opening",
      openedAt: new Date(),
    });
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.session_created",
      targetName: "order_sessions",
      targetId: sessionRes.value.id,
    });

    return sessionRes.value;
  }, parseError);

export const closeOrderSessionService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  sessionId: string,
  data: CloseOrderSessionInput
): Promise<AppResult<OrderSession>> =>
  tryCatchAsync(async () => {
    const checkSession = await getOrderSessionById(orgId, sessionId);
    if (!checkSession.ok) {
      throw checkSession.error;
    }

    const sessionRes = await updateOrderSession(orgId, sessionId, {
      ...data,
      status: "closed",
      closedAt: new Date(),
    });
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.session_closed",
      targetName: "order_sessions",
      targetId: sessionId,
    });

    return sessionRes.value;
  }, parseError);

// ==============================
// Order Services
// ==============================

export const createOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateOrderInput
): Promise<AppResult<Order>> =>
  tryCatchAsync(async () => {
    const uniqueNum = `ORD-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    return await db.transaction(async (tx) => {
      const orderRes = await insertOrder(orgId, {
        id: createId(),
        branchId: data.branchId,
        customerId: data.customerId,
        orderChannelId: data.orderChannelId,
        paymentMethodId: data.paymentMethodId,
        shippingMethodId: data.shippingMethodId,
        promotionId: data.promotionId,
        voucherId: data.voucherId,
        sessionId: data.sessionId,
        orderNumber: uniqueNum,
        subtotal: data.subtotal,
        discountTotal: data.discountTotal,
        taxTotal: data.taxTotal,
        shippingCost: data.shippingCost,
        shippingTotal: data.shippingTotal,
        grandTotal: data.grandTotal,
        status: data.status,
        paymentStatus: data.paymentStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        shippingRate: data.shippingRate,
        metadata: data.metadata,
      });

      if (!orderRes.ok) {
        throw orderRes.error;
      }
      const order = orderRes.value;

      const itemsRes = await insertOrderItems(
        orgId,
        data.items.map((item) => ({
          id: createId(),
          orderId: order.id,
          variantId: item.variantId,
          promotionId: item.promotionId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          unitCost: item.unitCost,
          discountAmount: item.discountAmount,
          taxAmount: item.taxAmount,
          totalPrice: item.totalPrice,
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
        action: "order.created",
        targetName: "orders",
        targetId: order.id,
        metadata: { orderNumber: order.orderNumber },
      });

      return order;
    });
  }, parseError);

export const updateOrderStatusService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  orderId: string,
  data: UpdateOrderStatusInput
): Promise<AppResult<Order>> =>
  tryCatchAsync(async () => {
    const checkOrder = await getOrderById(orgId, orderId);
    if (!checkOrder.ok) {
      throw checkOrder.error;
    }

    const orderRes = await updateOrder(orgId, orderId, data);
    if (!orderRes.ok) {
      throw orderRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.status_updated",
      targetName: "orders",
      targetId: orderId,
      metadata: { status: data.status },
    });

    return orderRes.value;
  }, parseError);

export const deleteOrderService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  orderId: string
): Promise<AppResult<Order>> =>
  tryCatchAsync(async () => {
    const checkOrder = await getOrderById(orgId, orderId);
    if (!checkOrder.ok) {
      throw checkOrder.error;
    }

    const orderRes = await softDeleteOrder(orgId, orderId);
    if (!orderRes.ok) {
      throw orderRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.deleted",
      targetName: "orders",
      targetId: orderId,
    });

    return orderRes.value;
  }, parseError);
