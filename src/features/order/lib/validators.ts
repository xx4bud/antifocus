import { z } from "zod/v4";

// ==============================
// Order Channels
// ==============================

export const createOrderChannelSchema = z.object({
  integrationId: z.string().optional().nullable(),
  name: z.string().min(1, "Channel Name is required"),
  code: z.string().min(1, "Channel Code is required"),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateOrderChannelInput = z.infer<typeof createOrderChannelSchema>;

export const updateOrderChannelSchema = createOrderChannelSchema.partial();
export type UpdateOrderChannelInput = z.infer<typeof updateOrderChannelSchema>;

// ==============================
// Cart & Checkout
// ==============================

export const cartItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"), // unique id for cart item (could be variantId + options hash)
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  id: z.string(), // userId or sessionId
  items: z.array(cartItemSchema),
  updatedAt: z.number(),
});

export type CartInput = z.infer<typeof cartSchema>;

export const checkoutSchema = z.object({
  cartId: z.string().min(1, "Cart ID is required"),
  shippingAddress: z.record(z.string(), z.unknown()).optional().nullable(),
  billingAddress: z.record(z.string(), z.unknown()).optional().nullable(),
  paymentMethodId: z.string().optional().nullable(),
  shippingMethodId: z.string().optional().nullable(),
  orderChannelId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  promotionId: z.string().optional().nullable(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

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

export const createFulfillmentItemSchema = z.object({
  orderItemId: z.string().min(1, "Order Item ID is required"),
  quantity: z.number().positive(),
});

export const createFulfillmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  branchId: z.string().optional().nullable(),
  shippingMethodId: z.string().optional().nullable(),
  trackingNumber: z.string().optional().nullable(),
  trackingUrl: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z
    .array(createFulfillmentItemSchema)
    .min(1, "At least 1 item is required"),
});

export type CreateFulfillmentInput = z.infer<typeof createFulfillmentSchema>;

export const createOrderItemDesignSchema = z.object({
  designAreaId: z.string().min(1, "Design Area ID is required"),
  fileId: z.string().optional().nullable(),
  placementX: z.number().optional().nullable(),
  placementY: z.number().optional().nullable(),
  scale: z.number().default(1),
  rotation: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

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
  designs: z.array(createOrderItemDesignSchema).optional(),
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

// ==============================
// Order Returns
// ==============================

export const createOrderReturnItemSchema = z.object({
  orderItemId: z.string().min(1, "Order Item ID is required"),
  quantity: z.number().positive(),
  receivedQuantity: z.number().min(0).default(0),
  condition: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const createOrderReturnSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  branchId: z.string().min(1, "Branch ID is required"),
  reason: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z
    .array(createOrderReturnItemSchema)
    .min(1, "At least 1 item is required"),
});

export type CreateOrderReturnInput = z.infer<typeof createOrderReturnSchema>;

export const updateOrderReturnSchema = z.object({
  reason: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type UpdateOrderReturnInput = z.infer<typeof updateOrderReturnSchema>;
