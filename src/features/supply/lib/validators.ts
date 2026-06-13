import { z } from "zod/v4";
import { codeSchema } from "@/lib/validations/code";
import { nameSchema } from "@/lib/validations/name";

// ==============================
// Couriers & Shipping
// ==============================

export const createCourierSchema = z.object({
  integrationId: z.string().optional().nullable(),
  name: nameSchema,
  code: codeSchema.optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateCourierInput = z.infer<typeof createCourierSchema>;

export const updateCourierSchema = createCourierSchema.partial();
export type UpdateCourierInput = z.infer<typeof updateCourierSchema>;

export const createShippingMethodSchema = z.object({
  courierId: z.string().min(1, "Courier ID is required"),
  name: nameSchema,
  code: codeSchema,
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateShippingMethodInput = z.infer<
  typeof createShippingMethodSchema
>;

export const updateShippingMethodSchema = createShippingMethodSchema.partial();
export type UpdateShippingMethodInput = z.infer<
  typeof updateShippingMethodSchema
>;

// ==============================
// Shipping Rates
// ==============================

export const createShippingRateSchema = z.object({
  shippingMethodId: z.string().min(1, "Shipping method ID is required"),
  name: z.string().optional().nullable(),
  originCode: z.string().optional().nullable(),
  destinationCode: z.string().optional().nullable(),
  minWeight: z.number().min(0).default(0),
  maxWeight: z.number().min(0).default(0),
  cost: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  estimatedDays: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateShippingRateInput = z.infer<typeof createShippingRateSchema>;

export const updateShippingRateSchema = createShippingRateSchema.partial();
export type UpdateShippingRateInput = z.infer<typeof updateShippingRateSchema>;

// ==============================
// Purchase Orders & Items
// ==============================

export const createPurchaseOrderItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().positive(),
  unitCost: z.number().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier ID is required"),
  branchId: z.string().min(1, "Branch ID is required"),
  status: z
    .enum([
      "draft",
      "pending_approval",
      "approved",
      "ordered",
      "receiving",
      "partially_received",
      "completed",
      "cancelled",
    ])
    .default("draft"),
  paymentStatus: z.enum(["unpaid", "partial", "paid"]).default("unpaid"),
  subtotal: z.number().min(0).default(0),
  taxTotal: z.number().min(0).default(0),
  shippingTotal: z.number().min(0).default(0),
  grandTotal: z.number().min(0),
  orderDate: z.date().optional().nullable(),
  expectedDeliveryDate: z.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z
    .array(createPurchaseOrderItemSchema)
    .min(1, "PO must have at least 1 item"),
});

export type CreatePurchaseOrderInput = z.infer<
  typeof createPurchaseOrderSchema
>;

export const updatePurchaseOrderStatusSchema = z.object({
  status: z.enum([
    "draft",
    "pending_approval",
    "approved",
    "ordered",
    "receiving",
    "partially_received",
    "completed",
    "cancelled",
  ]),
  paymentStatus: z.enum(["unpaid", "partial", "paid"]).optional(),
});

export type UpdatePurchaseOrderStatusInput = z.infer<
  typeof updatePurchaseOrderStatusSchema
>;

// ==============================
// PO Receiving
// ==============================

export const receivePurchaseOrderItemSchema = z.object({
  itemId: z.string().min(1, "Purchase order item ID is required"),
  receivedQuantity: z.number().min(0),
  unitCost: z.number().optional().nullable(),
});

export const receivePurchaseOrderSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase order ID is required"),
  items: z
    .array(receivePurchaseOrderItemSchema)
    .min(1, "Must receive at least 1 item"),
});

export type ReceivePurchaseOrderInput = z.infer<
  typeof receivePurchaseOrderSchema
>;

// ==============================
// Inventory & Stock Adjustments
// ==============================

export const createStockAdjustmentSchema = z.object({
  branchId: z.string().min(1, "Branch ID is required"),
  variantId: z.string().min(1, "Variant ID is required"),
  type: z.enum(["adjustment_add", "adjustment_deduct"]),
  quantity: z.number().positive(),
  unitCost: z.number().optional().nullable(),
  reference: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateStockAdjustmentInput = z.infer<
  typeof createStockAdjustmentSchema
>;

// ==============================
// Inventory Transfers
// ==============================

const transferStatusEnum = z.enum([
  "draft",
  "requested",
  "in_transit",
  "completed",
  "cancelled",
]);

export const createInventoryTransferItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().positive(),
});

export const createInventoryTransferSchema = z.object({
  sourceBranchId: z.string().min(1, "Source branch ID is required"),
  destinationBranchId: z.string().min(1, "Destination branch ID is required"),
  shippingMethodId: z.string().optional().nullable(),
  trackingNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z
    .array(createInventoryTransferItemSchema)
    .min(1, "Transfer must have at least 1 item"),
});

export type CreateInventoryTransferInput = z.infer<
  typeof createInventoryTransferSchema
>;

export const updateInventoryTransferStatusSchema = z.object({
  status: transferStatusEnum,
});

export type UpdateInventoryTransferStatusInput = z.infer<
  typeof updateInventoryTransferStatusSchema
>;

// ==============================
// Inventory Movement Filters
// ==============================

export const inventoryMovementFiltersSchema = z.object({
  branchId: z.string().optional(),
  variantId: z.string().optional(),
  type: z
    .enum([
      "purchase_receipt",
      "sales_delivery",
      "production_consume",
      "production_receipt",
      "transfer_in",
      "transfer_out",
      "adjustment_add",
      "adjustment_deduct",
    ])
    .optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type InventoryMovementFiltersInput = z.infer<
  typeof inventoryMovementFiltersSchema
>;

export const lowStockThresholdSchema = z.object({
  branchId: z.string().min(1, "Branch ID is required"),
  threshold: z.number().min(0).default(5),
});

export type LowStockThresholdInput = z.infer<typeof lowStockThresholdSchema>;

// ==============================
// Filters
// ==============================

export const supplyFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type SupplyFiltersInput = z.infer<typeof supplyFiltersSchema>;
