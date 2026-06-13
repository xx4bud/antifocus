import { z } from "zod/v4";
import {
  createTRPCRouter,
  orgProcedure,
  publicProcedure,
} from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart";
import {
  getFulfillmentById,
  getOrderById,
  getOrderChannelById,
  getOrderReturnById,
  getOrderSessionById,
  listFulfillments,
  listOrderChannels,
  listOrderItems,
  listOrderReturns,
  listOrderSessions,
  listOrders,
} from "./queries";
import {
  closeOrderSessionService,
  createFulfillmentService,
  createOrderChannelService,
  createOrderReturnService,
  createOrderService,
  createOrderSessionService,
  deleteFulfillmentService,
  deleteOrderChannelService,
  deleteOrderReturnService,
  deleteOrderService,
  updateOrderChannelService,
  updateOrderReturnService,
  updateOrderStatusService,
} from "./services";
import {
  cartItemSchema,
  closeOrderSessionSchema,
  createFulfillmentSchema,
  createOrderChannelSchema,
  createOrderReturnSchema,
  createOrderSchema,
  createOrderSessionSchema,
  orderFiltersSchema,
  updateOrderChannelSchema,
  updateOrderReturnSchema,
  updateOrderStatusSchema,
} from "./validators";

export const orderRouter = createTRPCRouter({
  // ==============================
  // Orders
  // ==============================

  listOrders: orgProcedure
    .input(orderFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listOrders(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getOrderById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  listOrderItems: orgProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listOrderItems(ctx.orgId, input.orderId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createOrder: orgProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createOrderService(
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

  updateOrderStatus: orgProcedure
    .input(z.object({ id: z.string(), data: updateOrderStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateOrderStatusService(
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

  deleteOrder: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteOrderService(
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

  createOrderSession: orgProcedure
    .input(createOrderSessionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createOrderSessionService(
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

  closeOrderSession: orgProcedure
    .input(z.object({ id: z.string(), data: closeOrderSessionSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await closeOrderSessionService(
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

  // ==============================
  // Order Channels
  // ==============================

  listOrderChannels: orgProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      throw createError("UNAUTHORIZED", "Organization context missing", 401);
    }
    const result = await listOrderChannels(ctx.orgId);
    if (!result.ok) {
      throw result.error;
    }
    return result.value;
  }),

  getOrderChannel: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getOrderChannelById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createOrderChannel: orgProcedure
    .input(createOrderChannelSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createOrderChannelService(
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

  updateOrderChannel: orgProcedure
    .input(z.object({ id: z.string(), data: updateOrderChannelSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await updateOrderChannelService(
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

  deleteOrderChannel: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deleteOrderChannelService(
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
  // Order Sessions
  // ==============================

  listOrderSessions: orgProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      throw createError("UNAUTHORIZED", "Organization context missing", 401);
    }
    const result = await listOrderSessions(ctx.orgId);
    if (!result.ok) {
      throw result.error;
    }
    return result.value;
  }),

  // ==============================
  // Order Sessions (POS)
  // ==============================

  getOrderSession: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getOrderSessionById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Cart
  // ==============================

  getCart: publicProcedure
    .input(z.object({ cartId: z.string() }))
    .query(async ({ input }) => {
      const result = await getCart(input.cartId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  addToCart: publicProcedure
    .input(z.object({ cartId: z.string(), item: cartItemSchema }))
    .mutation(async ({ input }) => {
      const result = await addToCart(input.cartId, input.item);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateCartItem: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        itemId: z.string(),
        updates: cartItemSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await updateCartItem(
        input.cartId,
        input.itemId,
        input.updates
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  removeCartItem: publicProcedure
    .input(z.object({ cartId: z.string(), itemId: z.string() }))
    .mutation(async ({ input }) => {
      const result = await removeCartItem(input.cartId, input.itemId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  clearCart: publicProcedure
    .input(z.object({ cartId: z.string() }))
    .mutation(async ({ input }) => {
      const result = await clearCart(input.cartId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Fulfillments
  // ==============================

  createFulfillment: orgProcedure
    .input(createFulfillmentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createFulfillmentService(
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

  listFulfillments: orgProcedure
    .input(z.object({ orderId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listFulfillments(ctx.orgId, input.orderId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getFulfillment: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getFulfillmentById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteFulfillment: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deleteFulfillmentService(
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
  // Order Returns
  // ==============================

  createOrderReturn: orgProcedure
    .input(createOrderReturnSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await createOrderReturnService(
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

  listOrderReturns: orgProcedure
    .input(z.object({ orderId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listOrderReturns(ctx.orgId, input.orderId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getOrderReturn: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getOrderReturnById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateOrderReturn: orgProcedure
    .input(z.object({ id: z.string(), data: updateOrderReturnSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await updateOrderReturnService(
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

  deleteOrderReturn: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!(ctx.orgId && ctx.user)) {
        throw createError("UNAUTHORIZED", "Context missing", 401);
      }
      const result = await deleteOrderReturnService(
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
