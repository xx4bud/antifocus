import { z } from "zod/v4";
import { codeSchema } from "@/lib/validations/code";
import { nameSchema } from "@/lib/validations/name";

// ==============================
// BOM & Items
// ==============================

export const createBomItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().positive(),
  unitId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateBomItemInput = z.infer<typeof createBomItemSchema>;

export const updateBomItemSchema = z.object({
  quantity: z.number().positive().optional(),
  unitId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type UpdateBomItemInput = z.infer<typeof updateBomItemSchema>;

export const createBomSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  name: nameSchema,
  code: codeSchema.optional().nullable(),
  instructions: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z.array(createBomItemSchema).min(1, "BOM must have at least 1 item"),
});

export type CreateBomInput = z.infer<typeof createBomSchema>;

export const updateBomSchema = z.object({
  name: nameSchema.optional(),
  code: codeSchema.optional().nullable(),
  instructions: z.string().optional().nullable(),
  enabled: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type UpdateBomInput = z.infer<typeof updateBomSchema>;

// ==============================
// Production Orders & Items & Tasks
// ==============================

export const createProductionOrderItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  orderItemId: z.string().optional().nullable(),
  quantity: z.number().positive(),
  unitCost: z.number().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const createProductionOrderSchema = z.object({
  branchId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  bomSnapshot: z.record(z.string(), z.unknown()).optional().nullable(),
  status: z
    .enum(["pending", "in_progress", "completed", "cancelled"])
    .default("pending"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  startDate: z.date().optional().nullable(),
  targetDate: z.date().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  items: z
    .array(createProductionOrderItemSchema)
    .min(1, "Production order must have at least 1 item"),
});

export type CreateProductionOrderInput = z.infer<
  typeof createProductionOrderSchema
>;

export const updateProductionOrderStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
});

export type UpdateProductionOrderStatusInput = z.infer<
  typeof updateProductionOrderStatusSchema
>;

export const updateProductionTaskStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "qc_failed"]),
  assigneeId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type UpdateProductionTaskStatusInput = z.infer<
  typeof updateProductionTaskStatusSchema
>;

// ==============================
// Production Tasks
// ==============================

export const createProductionTaskSchema = z.object({
  productionOrderId: z.string().min(1, "Production order ID is required"),
  productionOrderItemId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  name: z.string().min(1, "Task name is required"),
  sequence: z.number().int().positive(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateProductionTaskInput = z.infer<
  typeof createProductionTaskSchema
>;

export const updateProductionTaskSchema = z.object({
  name: z.string().optional(),
  assigneeId: z.string().optional().nullable(),
  sequence: z.number().int().positive().optional(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type UpdateProductionTaskInput = z.infer<
  typeof updateProductionTaskSchema
>;

// ==============================
// Filters
// ==============================

export const productionFiltersSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "cancelled"])
    .optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type ProductionFiltersInput = z.infer<typeof productionFiltersSchema>;
