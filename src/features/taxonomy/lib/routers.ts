import { z } from "zod/v4";
import { createTRPCRouter, orgProcedure } from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  getAttributeById,
  getAttributeOptionById,
  getCategoryById,
  getCollectionById,
  getTagById,
  getUnitById,
  listAttributeOptions,
  listAttributes,
  listCategories,
  listCollections,
  listTags,
  listUnits,
} from "./queries";
import {
  createAttributeOptionService,
  createAttributeService,
  createCategoryService,
  createCollectionService,
  createTagService,
  createUnitService,
  linkCategoryAttributeService,
  softDeleteAttributeOptionService,
  softDeleteAttributeService,
  softDeleteCategoryService,
  softDeleteCollectionService,
  softDeleteTagService,
  softDeleteUnitService,
  unlinkCategoryAttributeService,
  updateAttributeOptionService,
  updateAttributeService,
  updateCategoryService,
  updateCollectionService,
  updateTagService,
  updateUnitService,
} from "./services";
import {
  createAttributeOptionSchema,
  createAttributeSchema,
  createCategorySchema,
  createCollectionSchema,
  createTagSchema,
  createUnitSchema,
  linkCategoryAttributeSchema,
  taxonomyFiltersSchema,
} from "./validators";

export const taxonomyRouter = createTRPCRouter({
  // ==============================
  // Tags Endpoints
  // ==============================

  listTags: orgProcedure
    .input(taxonomyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listTags(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getTagById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getTagById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createTag: orgProcedure
    .input(createTagSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createTagService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateTag: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateTagService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteTag: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteTagService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Attributes Endpoints
  // ==============================

  listAttributes: orgProcedure
    .input(taxonomyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listAttributes(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getAttributeById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getAttributeById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createAttribute: orgProcedure
    .input(createAttributeSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createAttributeService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateAttribute: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
        type: z
          .enum(["select", "text", "number", "boolean", "datetime"])
          .optional(),
        filterable: z.boolean().optional(),
        position: z.number().int().optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateAttributeService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteAttribute: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteAttributeService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Attribute Options Endpoints
  // ==============================

  listAttributeOptions: orgProcedure
    .input(
      taxonomyFiltersSchema.extend({
        attributeId: z.string().min(1, "Attribute ID is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listAttributeOptions(
        ctx.orgId,
        input.attributeId,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getAttributeOptionById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getAttributeOptionById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createAttributeOption: orgProcedure
    .input(createAttributeOptionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createAttributeOptionService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateAttributeOption: orgProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string().optional(),
        value: z.record(z.string(), z.unknown()).optional().nullable(),
        price: z.number().optional().nullable(),
        cost: z.number().optional().nullable(),
        position: z.number().int().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateAttributeOptionService(
        input.id,
        ctx.orgId,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteAttributeOption: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteAttributeOptionService(
        input.id,
        ctx.orgId
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Categories Endpoints
  // ==============================

  listCategories: orgProcedure
    .input(taxonomyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listCategories(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getCategoryById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getCategoryById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createCategory: orgProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createCategoryService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateCategory: orgProcedure
    .input(
      z.object({
        id: z.string(),
        parentId: z.string().optional().nullable(),
        name: z.string().optional(),
        slug: z.string().optional(),
        position: z.number().int().optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateCategoryService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteCategory: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteCategoryService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  linkCategoryAttribute: orgProcedure
    .input(linkCategoryAttributeSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await linkCategoryAttributeService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  unlinkCategoryAttribute: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await unlinkCategoryAttributeService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Collections Endpoints
  // ==============================

  listCollections: orgProcedure
    .input(taxonomyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listCollections(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getCollectionById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getCollectionById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createCollection: orgProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createCollectionService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateCollection: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
        rules: z.record(z.string(), z.unknown()).optional().nullable(),
        position: z.number().int().optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateCollectionService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteCollection: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteCollectionService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Units of Measure Endpoints
  // ==============================

  listUnits: orgProcedure
    .input(taxonomyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listUnits(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getUnitById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getUnitById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createUnit: orgProcedure
    .input(createUnitSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createUnitService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateUnit: orgProcedure
    .input(
      z.object({
        id: z.string(),
        baseUnitId: z.string().optional().nullable(),
        name: z.string().optional(),
        code: z.string().optional(),
        rate: z.number().positive().optional(),
        position: z.number().int().optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateUnitService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteUnit: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteUnitService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),
});
