import { z } from "zod/v4";
import { createTRPCRouter, orgProcedure } from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  getCourierById,
  getPurchaseOrderById,
  getShippingMethodById,
  getShippingRateById,
  listCouriers,
  listInventories,
  listPurchaseOrderItems,
  listPurchaseOrders,
  listShippingMethods,
  listShippingRates,
} from "./queries";
import {
  adjustStockService,
  createCourierService,
  createPurchaseOrderService,
  createShippingMethodService,
  createShippingRateService,
  deleteCourierService,
  deletePurchaseOrderService,
  deleteShippingMethodService,
  deleteShippingRateService,
  updateCourierService,
  updatePurchaseOrderStatusService,
  updateShippingMethodService,
  updateShippingRateService,
} from "./services";
import {
  createCourierSchema,
  createPurchaseOrderSchema,
  createShippingMethodSchema,
  createShippingRateSchema,
  createStockAdjustmentSchema,
  supplyFiltersSchema,
  updateCourierSchema,
  updatePurchaseOrderStatusSchema,
  updateShippingMethodSchema,
  updateShippingRateSchema,
} from "./validators";

export const supplyRouter = createTRPCRouter({
  // ==============================
  // Couriers
  // ==============================

  listCouriers: orgProcedure
    .input(supplyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listCouriers(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getCourier: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getCourierById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createCourier: orgProcedure
    .input(createCourierSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createCourierService(
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

  updateCourier: orgProcedure
    .input(z.object({ id: z.string(), data: updateCourierSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateCourierService(
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

  deleteCourier: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteCourierService(
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
  // Shipping Methods
  // ==============================

  listShippingMethods: orgProcedure
    .input(z.object({ courierId: z.string(), filters: supplyFiltersSchema }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listShippingMethods(
        ctx.orgId,
        input.courierId,
        input.filters
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getShippingMethod: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getShippingMethodById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createShippingMethod: orgProcedure
    .input(createShippingMethodSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createShippingMethodService(
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

  updateShippingMethod: orgProcedure
    .input(z.object({ id: z.string(), data: updateShippingMethodSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateShippingMethodService(
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

  deleteShippingMethod: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteShippingMethodService(
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
  // Shipping Rates
  // ==============================

  listShippingRates: orgProcedure
    .input(z.object({ methodId: z.string(), filters: supplyFiltersSchema }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listShippingRates(
        ctx.orgId,
        input.methodId,
        input.filters
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getShippingRate: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getShippingRateById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createShippingRate: orgProcedure
    .input(createShippingRateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createShippingRateService(
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

  updateShippingRate: orgProcedure
    .input(z.object({ id: z.string(), data: updateShippingRateSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateShippingRateService(
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

  deleteShippingRate: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteShippingRateService(
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
  // Purchase Orders
  // ==============================

  listPurchaseOrders: orgProcedure
    .input(supplyFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listPurchaseOrders(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getPurchaseOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getPurchaseOrderById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createPurchaseOrder: orgProcedure
    .input(createPurchaseOrderSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createPurchaseOrderService(
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

  updatePurchaseOrderStatus: orgProcedure
    .input(z.object({ id: z.string(), data: updatePurchaseOrderStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updatePurchaseOrderStatusService(
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

  deletePurchaseOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deletePurchaseOrderService(
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

  listPurchaseOrderItems: orgProcedure
    .input(z.object({ purchaseOrderId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listPurchaseOrderItems(
        ctx.orgId,
        input.purchaseOrderId
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Inventory
  // ==============================

  listInventories: orgProcedure
    .input(z.object({ branchId: z.string(), filters: supplyFiltersSchema }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listInventories(
        ctx.orgId,
        input.branchId,
        input.filters
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  adjustStock: orgProcedure
    .input(createStockAdjustmentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await adjustStockService(
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
});
