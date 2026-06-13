"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  Fulfillment,
  fulfillments,
  Order,
  OrderChannel,
  OrderReturn,
  OrderSession,
} from "@/lib/db/schema/order";
import { inngest } from "@/lib/inngest";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertFulfillment,
  insertOrderChannel,
  insertOrderReturn,
  insertOrderSession,
  insertOrderTransaction,
  softDeleteFulfillment,
  softDeleteOrder,
  softDeleteOrderChannel,
  softDeleteOrderReturn,
  updateFulfillment,
  updateOrder,
  updateOrderChannel,
  updateOrderReturn,
  updateOrderSession,
} from "./mutations";
import { getOrderById, getOrderSessionById } from "./queries";
import type {
  CloseOrderSessionInput,
  CreateFulfillmentInput,
  CreateOrderChannelInput,
  CreateOrderInput,
  CreateOrderReturnInput,
  CreateOrderSessionInput,
  UpdateOrderChannelInput,
  UpdateOrderReturnInput,
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
    const orderRes = await insertOrderTransaction(orgId, data);
    if (!orderRes.ok) {
      throw orderRes.error;
    }
    const order = orderRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.created",
      targetName: "orders",
      targetId: order.id,
      metadata: { orderNumber: order.orderNumber },
    });

    if (order.status === "confirmed") {
      await inngest.send({
        name: "antifocus/order/confirmed",
        data: { orderId: order.id, organizationId: orgId },
      });
    }

    return order;
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
    const updatedOrder = orderRes.value;

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

    if (data.status === "confirmed") {
      await inngest.send({
        name: "antifocus/order/confirmed",
        data: { orderId, organizationId: orgId },
      });
    }
    if (data.paymentStatus === "paid") {
      await inngest.send({
        name: "antifocus/order/paid",
        data: { orderId, organizationId: orgId },
      });
    }
    if (data.fulfillmentStatus === "fulfilled") {
      await inngest.send({
        name: "antifocus/order/fulfilled",
        data: { orderId, organizationId: orgId },
      });
    }

    return updatedOrder;
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

// ==============================
// Order Channel Services
// ==============================

export const createOrderChannelService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateOrderChannelInput
): Promise<AppResult<OrderChannel>> =>
  tryCatchAsync(async () => {
    const res = await insertOrderChannel(orgId, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.channel_created",
      targetName: "orderChannels",
      targetId: res.value.id,
      metadata: { name: res.value.name, code: res.value.code },
    });

    return res.value;
  }, parseError);

export const updateOrderChannelService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdateOrderChannelInput
): Promise<AppResult<OrderChannel>> =>
  tryCatchAsync(async () => {
    const res = await updateOrderChannel(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.channel_updated",
      targetName: "orderChannels",
      targetId: id,
      metadata: { fields: Object.keys(input) },
    });

    return res.value;
  }, parseError);

export const deleteOrderChannelService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await softDeleteOrderChannel(orgId, id);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.channel_deleted",
      targetName: "orderChannels",
      targetId: id,
    });

    return true;
  }, parseError);

// ==============================
// Fulfillment Services
// ==============================

export const createFulfillmentService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateFulfillmentInput
): Promise<AppResult<Fulfillment>> =>
  tryCatchAsync(async () => {
    const res = await insertFulfillment(orgId, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.fulfillment_created",
      targetName: "fulfillments",
      targetId: res.value.id,
      metadata: { orderId: input.orderId },
    });

    await inngest.send({
      name: "antifocus/order/fulfilled",
      data: { orderId: input.orderId, organizationId: orgId },
    });

    return res.value;
  }, parseError);

export const updateFulfillmentService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  fulfillmentId: string,
  input: Partial<
    Omit<
      typeof fulfillments.$inferInsert,
      "id" | "organizationId" | "orderId" | "fulfillmentNumber"
    >
  >
): Promise<AppResult<Fulfillment>> =>
  tryCatchAsync(async () => {
    const res = await updateFulfillment(orgId, fulfillmentId, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.fulfillment_updated",
      targetName: "fulfillments",
      targetId: fulfillmentId,
      metadata: { fields: Object.keys(input) },
    });

    return res.value;
  }, parseError);

export const deleteFulfillmentService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  fulfillmentId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await softDeleteFulfillment(orgId, fulfillmentId);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.fulfillment_deleted",
      targetName: "fulfillments",
      targetId: fulfillmentId,
    });

    return true;
  }, parseError);

// ==============================
// Order Return Services
// ==============================

export const createOrderReturnService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateOrderReturnInput
): Promise<AppResult<OrderReturn>> =>
  tryCatchAsync(async () => {
    const returnNumber = `RET-${Date.now()}`;
    const res = await insertOrderReturn(orgId, input, returnNumber);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.return_created",
      targetName: "orderReturns",
      targetId: res.value.id,
      metadata: { orderId: input.orderId },
    });

    return res.value;
  }, parseError);

export const updateOrderReturnService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  returnId: string,
  input: UpdateOrderReturnInput
): Promise<AppResult<OrderReturn>> =>
  tryCatchAsync(async () => {
    const res = await updateOrderReturn(orgId, returnId, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.return_updated",
      targetName: "orderReturns",
      targetId: returnId,
      metadata: { fields: Object.keys(input) },
    });

    return res.value;
  }, parseError);

export const deleteOrderReturnService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  returnId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await softDeleteOrderReturn(orgId, returnId);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "order.return_deleted",
      targetName: "orderReturns",
      targetId: returnId,
    });

    return true;
  }, parseError);
