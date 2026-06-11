import { z } from "zod/v4";
import { createTRPCRouter, orgProcedure } from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  getBomById,
  getProductionOrderById,
  listBoms,
  listProductionOrderItems,
  listProductionOrders,
  listProductionTasks,
} from "./queries";
import {
  createBomService,
  createProductionOrderService,
  deleteBomService,
  deleteProductionOrderService,
  updateBomService,
  updateProductionOrderStatusService,
  updateProductionTaskStatusService,
} from "./services";
import {
  createBomSchema,
  createProductionOrderSchema,
  productionFiltersSchema,
  updateBomSchema,
  updateProductionOrderStatusSchema,
  updateProductionTaskStatusSchema,
} from "./validators";

export const productionRouter = createTRPCRouter({
  // ==============================
  // Bill of Materials (BOM)
  // ==============================

  listBoms: orgProcedure
    .input(productionFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listBoms(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getBom: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getBomById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createBom: orgProcedure
    .input(createBomSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createBomService(
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

  updateBom: orgProcedure
    .input(z.object({ id: z.string(), data: updateBomSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateBomService(
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

  deleteBom: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteBomService(
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
  // Production Orders
  // ==============================

  listProductionOrders: orgProcedure
    .input(productionFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listProductionOrders(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getProductionOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getProductionOrderById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createProductionOrder: orgProcedure
    .input(createProductionOrderSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createProductionOrderService(
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

  updateProductionOrderStatus: orgProcedure
    .input(
      z.object({ id: z.string(), data: updateProductionOrderStatusSchema })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateProductionOrderStatusService(
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

  deleteProductionOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteProductionOrderService(
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
  // Items & Tasks
  // ==============================

  listProductionOrderItems: orgProcedure
    .input(z.object({ productionOrderId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listProductionOrderItems(
        ctx.orgId,
        input.productionOrderId
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  listProductionTasks: orgProcedure
    .input(z.object({ productionOrderId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listProductionTasks(
        ctx.orgId,
        input.productionOrderId
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateProductionTaskStatus: orgProcedure
    .input(z.object({ id: z.string(), data: updateProductionTaskStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateProductionTaskStatusService(
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
});
