import { z } from "zod/v4";
import { createTRPCRouter, orgProcedure } from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  getCostlistById,
  getPricelistById,
  getProductById,
  getVariantById,
  listCostlistItems,
  listCostlists,
  listDesignAreas,
  listPricelistItems,
  listPricelists,
  listProductDesigns,
  listProducts,
  listProductVariants,
} from "./queries";
import {
  createCostlistItemService,
  createCostlistService,
  createDesignAreaService,
  createPricelistItemService,
  createPricelistService,
  createProductDesignService,
  createProductService,
  createVariantService,
  deleteCostlistItemService,
  deleteCostlistService,
  deleteDesignAreaService,
  deletePricelistItemService,
  deletePricelistService,
  deleteProductDesignService,
  deleteProductService,
  deleteVariantService,
  generateVariantMatrixService,
  updateCostlistItemService,
  updateCostlistService,
  updateDesignAreaService,
  updatePricelistItemService,
  updatePricelistService,
  updateProductDesignService,
  updateProductService,
  updateVariantService,
} from "./services";
import {
  catalogFiltersSchema,
  createCostlistItemSchema,
  createCostlistSchema,
  createDesignAreaSchema,
  createPricelistItemSchema,
  createPricelistSchema,
  createProductDesignSchema,
  createProductSchema,
  createVariantSchema,
  generateVariantMatrixSchema,
  updateCostlistItemSchema,
  updateCostlistSchema,
  updateDesignAreaSchema,
  updatePricelistItemSchema,
  updatePricelistSchema,
  updateProductDesignSchema,
  updateProductSchema,
  updateVariantSchema,
} from "./validators";

export const catalogRouter = createTRPCRouter({
  // ==============================
  // Products
  // ==============================

  listProducts: orgProcedure
    .input(catalogFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listProducts(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getProduct: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getProductById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createProduct: orgProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createProductService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateProduct: orgProcedure
    .input(z.object({ id: z.string(), data: updateProductSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateProductService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteProduct: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteProductService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Variants
  // ==============================

  listProductVariants: orgProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listProductVariants(ctx.orgId, input.productId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getVariant: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getVariantById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createVariant: orgProcedure
    .input(createVariantSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createVariantService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateVariant: orgProcedure
    .input(z.object({ id: z.string(), data: updateVariantSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateVariantService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteVariant: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteVariantService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  generateVariantMatrix: orgProcedure
    .input(generateVariantMatrixSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await generateVariantMatrixService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Design Areas
  // ==============================

  listDesignAreas: orgProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listDesignAreas(ctx.orgId, input.productId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createDesignArea: orgProcedure
    .input(createDesignAreaSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createDesignAreaService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateDesignArea: orgProcedure
    .input(z.object({ id: z.string(), data: updateDesignAreaSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateDesignAreaService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteDesignArea: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteDesignAreaService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Product Designs
  // ==============================

  listProductDesigns: orgProcedure
    .input(z.object({ areaId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listProductDesigns(ctx.orgId, input.areaId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createProductDesign: orgProcedure
    .input(createProductDesignSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createProductDesignService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateProductDesign: orgProcedure
    .input(z.object({ id: z.string(), data: updateProductDesignSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateProductDesignService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteProductDesign: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteProductDesignService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Pricelists
  // ==============================

  listPricelists: orgProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      throw createError("UNAUTHORIZED", "Organization context missing", 401);
    }
    const result = await listPricelists(ctx.orgId);
    if (!result.ok) {
      throw result.error;
    }
    return result.value;
  }),

  getPricelist: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getPricelistById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createPricelist: orgProcedure
    .input(createPricelistSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createPricelistService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updatePricelist: orgProcedure
    .input(z.object({ id: z.string(), data: updatePricelistSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await updatePricelistService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deletePricelist: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deletePricelistService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  listPricelistItems: orgProcedure
    .input(z.object({ pricelistId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listPricelistItems(ctx.orgId, input.pricelistId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createPricelistItem: orgProcedure
    .input(createPricelistItemSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createPricelistItemService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updatePricelistItem: orgProcedure
    .input(z.object({ id: z.string(), data: updatePricelistItemSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await updatePricelistItemService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deletePricelistItem: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deletePricelistItemService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Costlists
  // ==============================

  listCostlists: orgProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      throw createError("UNAUTHORIZED", "Organization context missing", 401);
    }
    const result = await listCostlists(ctx.orgId);
    if (!result.ok) {
      throw result.error;
    }
    return result.value;
  }),

  getCostlist: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getCostlistById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createCostlist: orgProcedure
    .input(createCostlistSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createCostlistService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateCostlist: orgProcedure
    .input(z.object({ id: z.string(), data: updateCostlistSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await updateCostlistService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteCostlist: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deleteCostlistService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  listCostlistItems: orgProcedure
    .input(z.object({ costlistId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listCostlistItems(ctx.orgId, input.costlistId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createCostlistItem: orgProcedure
    .input(createCostlistItemSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createCostlistItemService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateCostlistItem: orgProcedure
    .input(z.object({ id: z.string(), data: updateCostlistItemSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await updateCostlistItemService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteCostlistItem: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deleteCostlistItemService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),
});
