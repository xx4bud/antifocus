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
// Filters
// ==============================

export const supplyFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type SupplyFiltersInput = z.infer<typeof supplyFiltersSchema>;
