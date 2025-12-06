import {
  orderStatus,
  paymentStatus,
  paymentMethod,
  fulfillmentStatus,
  shippingMethod,
  refundReason,
  refundStatus,
  orders,
  orderItems,
  payments,
  fulfillments,
  fulfillmentItems,
  shipments,
  refunds,
  refundItems,
  invoices,
} from "@antifocus/db/order/schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4-mini";

// ============================================================================
// SELECT SCHEMAS
// ============================================================================

export const orderStatusSchema = createSelectSchema(orderStatus);

export type OrderStatusData = z.infer<typeof orderStatusSchema>;

export const paymentStatusSchema = createSelectSchema(paymentStatus);

export type PaymentStatusData = z.infer<typeof paymentStatusSchema>;

export const paymentMethodSchema = createSelectSchema(paymentMethod);

export type PaymentMethodData = z.infer<typeof paymentMethodSchema>;

export const fulfillmentStatusSchema = createSelectSchema(fulfillmentStatus);

export type FulfillmentStatusData = z.infer<typeof fulfillmentStatusSchema>;

export const shippingMethodSchema = createSelectSchema(shippingMethod);

export type ShippingMethodData = z.infer<typeof shippingMethodSchema>;

export const refundReasonSchema = createSelectSchema(refundReason);

export type RefundReasonData = z.infer<typeof refundReasonSchema>;

export const refundStatusSchema = createSelectSchema(refundStatus);

export type RefundStatusData = z.infer<typeof refundStatusSchema>;

export const ordersSchema = createSelectSchema(orders);

export type OrdersData = z.infer<typeof ordersSchema>;

export const orderItemsSchema = createSelectSchema(orderItems);

export type OrderItemsData = z.infer<typeof orderItemsSchema>;

export const paymentsSchema = createSelectSchema(payments);

export type PaymentsData = z.infer<typeof paymentsSchema>;

export const fulfillmentsSchema = createSelectSchema(fulfillments);

export type FulfillmentsData = z.infer<typeof fulfillmentsSchema>;

export const fulfillmentItemsSchema = createSelectSchema(fulfillmentItems);

export type FulfillmentItemsData = z.infer<typeof fulfillmentItemsSchema>;

export const shipmentsSchema = createSelectSchema(shipments);

export type ShipmentsData = z.infer<typeof shipmentsSchema>;

export const refundsSchema = createSelectSchema(refunds);

export type RefundsData = z.infer<typeof refundsSchema>;

export const refundItemsSchema = createSelectSchema(refundItems);

export type RefundItemsData = z.infer<typeof refundItemsSchema>;

export const invoicesSchema = createSelectSchema(invoices);

export type InvoicesData = z.infer<typeof invoicesSchema>;

// ============================================================================
// INSERT SCHEMAS
// ============================================================================

export const insertOrdersSchema = createInsertSchema(orders);

export type InsertOrders = z.infer<typeof insertOrdersSchema>;

export const insertOrderItemsSchema = createInsertSchema(orderItems);

export type InsertOrderItems = z.infer<typeof insertOrderItemsSchema>;

export const insertPaymentsSchema = createInsertSchema(payments);

export type InsertPayments = z.infer<typeof insertPaymentsSchema>;

export const insertFulfillmentsSchema = createInsertSchema(fulfillments);

export type InsertFulfillments = z.infer<typeof insertFulfillmentsSchema>;

export const insertFulfillmentItemsSchema = createInsertSchema(fulfillmentItems);

export type InsertFulfillmentItems = z.infer<typeof insertFulfillmentItemsSchema>;

export const insertShipmentsSchema = createInsertSchema(shipments);

export type InsertShipments = z.infer<typeof insertShipmentsSchema>;

export const insertRefundsSchema = createInsertSchema(refunds);

export type InsertRefunds = z.infer<typeof insertRefundsSchema>;

export const insertRefundItemsSchema = createInsertSchema(refundItems);

export type InsertRefundItems = z.infer<typeof insertRefundItemsSchema>;

export const insertInvoicesSchema = createInsertSchema(invoices);

export type InsertInvoices = z.infer<typeof insertInvoicesSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

export const updateOrdersSchema = insertOrdersSchema.partial();

export type UpdateOrders = z.infer<typeof updateOrdersSchema>;

export const updateOrderItemsSchema = insertOrderItemsSchema.partial();

export type UpdateOrderItems = z.infer<typeof updateOrderItemsSchema>;

export const updatePaymentsSchema = insertPaymentsSchema.partial();

export type UpdatePayments = z.infer<typeof updatePaymentsSchema>;

export const updateFulfillmentsSchema = insertFulfillmentsSchema.partial();

export type UpdateFulfillments = z.infer<typeof updateFulfillmentsSchema>;

export const updateFulfillmentItemsSchema = insertFulfillmentItemsSchema.partial();

export type UpdateFulfillmentItems = z.infer<typeof updateFulfillmentItemsSchema>;

export const updateShipmentsSchema = insertShipmentsSchema.partial();

export type UpdateShipments = z.infer<typeof updateShipmentsSchema>;

export const updateRefundsSchema = insertRefundsSchema.partial();

export type UpdateRefunds = z.infer<typeof updateRefundsSchema>;

export const updateRefundItemsSchema = insertRefundItemsSchema.partial();

export type UpdateRefundItems = z.infer<typeof updateRefundItemsSchema>;

export const updateInvoicesSchema = insertInvoicesSchema.partial();

export type UpdateInvoices = z.infer<typeof updateInvoicesSchema>;
