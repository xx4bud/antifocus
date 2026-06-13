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
  description: z.string().optional().nullable(),
  basePrice: z.number().default(0),
  baseCost: z.number().default(0),
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

export const generateVariantMatrixSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  attributeIds: z
    .array(z.string())
    .min(1, "At least one attribute is required")
    .max(3, "Maximum 3 attributes allowed"),
});

export type GenerateVariantMatrixInput = z.infer<
  typeof generateVariantMatrixSchema
>;

// ==============================
// Design Areas
// ==============================

export const createDesignAreaSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional().nullable(),
  name: nameSchema,
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  x: z.number().optional().nullable(),
  y: z.number().optional().nullable(),
  z: z.number().int().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateDesignAreaInput = z.infer<typeof createDesignAreaSchema>;

export const updateDesignAreaSchema = createDesignAreaSchema
  .omit({ productId: true })
  .partial();

export type UpdateDesignAreaInput = z.infer<typeof updateDesignAreaSchema>;

// ==============================
// Product Designs
// ==============================

export const createProductDesignSchema = z.object({
  areaId: z.string(),
  fileId: z.string().optional().nullable(),
  name: nameSchema,
  placement: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  offsetX: z.number().optional().nullable(),
  offsetY: z.number().optional().nullable(),
  offsetZ: z.number().int().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateProductDesignInput = z.infer<
  typeof createProductDesignSchema
>;

export const updateProductDesignSchema = createProductDesignSchema
  .omit({ areaId: true })
  .partial();

export type UpdateProductDesignInput = z.infer<
  typeof updateProductDesignSchema
>;

// ==============================
// Pricelists
// ==============================

export const createPricelistSchema = z.object({
  orderChannelId: z.string().optional().nullable(),
  currencyCode: z.string().length(3).default("IDR"),
  taxInclusive: z.boolean().default(false),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreatePricelistInput = z.infer<typeof createPricelistSchema>;

export const updatePricelistSchema = createPricelistSchema.partial();

export type UpdatePricelistInput = z.infer<typeof updatePricelistSchema>;

export const createPricelistItemSchema = z.object({
  pricelistId: z.string(),
  variantId: z.string(),
  price: z.number(),
  compareAtPrice: z.number().default(0),
  minQuantity: z.number().default(1),
  maxQuantity: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreatePricelistItemInput = z.infer<
  typeof createPricelistItemSchema
>;

export const updatePricelistItemSchema = createPricelistItemSchema
  .omit({ pricelistId: true, variantId: true })
  .partial();

export type UpdatePricelistItemInput = z.infer<
  typeof updatePricelistItemSchema
>;

// ==============================
// Costlists
// ==============================

export const createCostlistSchema = z.object({
  supplierId: z.string().optional().nullable(),
  currencyCode: z.string().length(3).default("IDR"),
  taxInclusive: z.boolean().default(false),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateCostlistInput = z.infer<typeof createCostlistSchema>;

export const updateCostlistSchema = createCostlistSchema.partial();

export type UpdateCostlistInput = z.infer<typeof updateCostlistSchema>;

export const createCostlistItemSchema = z.object({
  costlistId: z.string(),
  variantId: z.string(),
  costPrice: z.number(),
  minQuantity: z.number().default(1),
  maxQuantity: z.number().default(0),
  leadTime: z.number().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateCostlistItemInput = z.infer<typeof createCostlistItemSchema>;

export const updateCostlistItemSchema = createCostlistItemSchema
  .omit({ costlistId: true, variantId: true })
  .partial();

export type UpdateCostlistItemInput = z.infer<typeof updateCostlistItemSchema>;

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
