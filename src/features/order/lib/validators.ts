import { z } from "zod/v4";

// ==============================
// Order Sessions (POS)
// ==============================

export const createOrderSessionSchema = z.object({
  branchId: z.string().min(1, "Branch ID is required"),
  memberId: z.string().min(1, "Member ID is required"),
  name: z.string().min(1, "Session Name is required"),
  openingBalance: z.number().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateOrderSessionInput = z.infer<typeof createOrderSessionSchema>;

export const closeOrderSessionSchema = z.object({
  closingBalance: z.number().min(0),
  actualBalance: z.number().min(0),
});

export type CloseOrderSessionInput = z.infer<typeof closeOrderSessionSchema>;

// ==============================
// Orders & Items
// ==============================

export const createOrderItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  promotionId: z.string().optional().nullable(),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  unitCost: z.number().min(0),
  discountAmount: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  totalPrice: z.number().min(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const createOrderSchema = z.object({
  branchId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  orderChannelId: z.string().optional().nullable(),
  paymentMethodId: z.string().optional().nullable(),
  shippingMethodId: z.string().optional().nullable(),
  promotionId: z.string().optional().nullable(),
  voucherId: z.string().optional().nullable(),
  sessionId: z.string().optional().nullable(),
  subtotal: z.number().min(0),
  discountTotal: z.number().min(0).default(0),
  taxTotal: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
  shippingTotal: z.number().min(0).default(0),
  grandTotal: z.number().min(0),
  status: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "ready_for_pickup",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ])
    .default("pending"),
  paymentStatus: z
    .enum(["unpaid", "partial", "paid", "refunded"])
    .default("unpaid"),
  fulfillmentStatus: z
    .enum(["unfulfilled", "partial", "fulfilled"])
    .default("unfulfilled"),
  shippingAddress: z.record(z.string(), z.unknown()).optional().nullable(),
  billingAddress: z.record(z.string(), z.unknown()).optional().nullable(),
  shippingRate: z.record(z.string(), z.unknown()).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z
    .array(createOrderItemSchema)
    .min(1, "Order must have at least 1 item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "ready_for_pickup",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ]),
  paymentStatus: z.enum(["unpaid", "partial", "paid", "refunded"]).optional(),
  fulfillmentStatus: z.enum(["unfulfilled", "partial", "fulfilled"]).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ==============================
// Filters
// ==============================

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "ready_for_pickup",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ])
    .optional(),
  paymentStatus: z.enum(["unpaid", "partial", "paid", "refunded"]).optional(),
  fulfillmentStatus: z.enum(["unfulfilled", "partial", "fulfilled"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type OrderFiltersInput = z.infer<typeof orderFiltersSchema>;
