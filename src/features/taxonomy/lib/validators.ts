import { z } from "zod/v4";
import { codeSchema } from "@/lib/validations/code";
import { nameSchema } from "@/lib/validations/name";
import { slugSchema } from "@/lib/validations/slug";

// ==============================
// Tags
// ==============================

export const createTagSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();
export type UpdateTagInput = z.infer<typeof updateTagSchema>;

// ==============================
// Attributes
// ==============================

export const createAttributeSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  type: z
    .enum(["select", "text", "number", "boolean", "datetime"])
    .default("select"),
  filterable: z.boolean().default(true),
  position: z.number().int().default(0),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateAttributeInput = z.infer<typeof createAttributeSchema>;

export const updateAttributeSchema = createAttributeSchema.partial();
export type UpdateAttributeInput = z.infer<typeof updateAttributeSchema>;

// ==============================
// Attribute Options
// ==============================

export const createAttributeOptionSchema = z.object({
  attributeId: z.string().min(1, "Attribute ID is required"),
  label: z.string().min(1, "Label is required"),
  value: z.record(z.string(), z.unknown()).optional().nullable(),
  price: z.number().optional().nullable(),
  cost: z.number().optional().nullable(),
  position: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateAttributeOptionInput = z.infer<
  typeof createAttributeOptionSchema
>;

export const updateAttributeOptionSchema =
  createAttributeOptionSchema.partial();
export type UpdateAttributeOptionInput = z.infer<
  typeof updateAttributeOptionSchema
>;

// ==============================
// Categories
// ==============================

export const createCategorySchema = z.object({
  parentId: z.string().optional().nullable(),
  name: nameSchema,
  slug: slugSchema,
  position: z.number().int().default(0),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const linkCategoryAttributeSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
  attributeId: z.string().min(1, "Attribute ID is required"),
  required: z.boolean().default(false),
  position: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type LinkCategoryAttributeInput = z.infer<
  typeof linkCategoryAttributeSchema
>;

// ==============================
// Collections
// ==============================

export const createCollectionSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  rules: z.record(z.string(), z.unknown()).optional().nullable(),
  position: z.number().int().default(0),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = createCollectionSchema.partial();
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;

// ==============================
// Units
// ==============================

export const createUnitSchema = z.object({
  baseUnitId: z.string().optional().nullable(),
  name: nameSchema,
  code: codeSchema,
  rate: z.number().positive(),
  position: z.number().int().default(0),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;

export const updateUnitSchema = createUnitSchema.partial();
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;

// ==============================
// Filters
// ==============================

export const taxonomyFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type TaxonomyFiltersInput = z.infer<typeof taxonomyFiltersSchema>;
