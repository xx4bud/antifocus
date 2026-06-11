import { z } from "zod/v4";
import { nameSchema } from "@/lib/validations/name";
import { slugSchema } from "@/lib/validations/slug";

// ==============================
// Products
// ==============================

export const createProductSchema = z.object({
  unitId: z.string().optional().nullable(),
  taxRateId: z.string().optional().nullable(),
  name: nameSchema,
  slug: slugSchema,
  status: z
    .enum(["draft", "live", "discontinued", "archived"])
    .default("draft"),
  type: z
    .enum(["good", "service", "blank", "material", "digital"])
    .default("good"),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ==============================
// Variants
// ==============================

export const createVariantSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  baseVariantId: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  compareAtPrice: z.number().optional().nullable(),
  minOrder: z.number().min(1).default(1),
  maxOrder: z.number().min(0).default(0),
  minLeadTime: z.number().int().default(0),
  maxLeadTime: z.number().int().default(0),
  weight: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  enabled: z.boolean().default(true),
  position: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateVariantInput = z.infer<typeof createVariantSchema>;

export const updateVariantSchema = createVariantSchema.partial();
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;

// ==============================
// Filters
// ==============================

export const catalogFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["draft", "live", "discontinued", "archived"]).optional(),
  type: z.enum(["good", "service", "blank", "material", "digital"]).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CatalogFiltersInput = z.infer<typeof catalogFiltersSchema>;
