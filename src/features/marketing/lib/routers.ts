import { z } from "zod/v4";
import { createTRPCRouter, orgProcedure } from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  getBannerById,
  getPostById,
  getPromotionById,
  getReviewById,
  getTicketById,
  getVoucherById,
  listBanners,
  listPostCategories,
  listPosts,
  listPromotions,
  listReviews,
  listTicketMessages,
  listTickets,
  listVouchers,
} from "./queries";
import {
  createBannerService,
  createPostCategoryService,
  createPostService,
  createPromotionService,
  createReviewService,
  createTicketMessageService,
  createTicketService,
  createVoucherService,
  deleteBannerService,
  deletePostCategoryService,
  deletePostService,
  deletePromotionService,
  deleteVoucherService,
  replyReviewService,
  updateBannerService,
  updatePostService,
  updatePromotionService,
  updateReviewStatusService,
  updateTicketStatusService,
} from "./services";
import {
  createBannerSchema,
  createPostCategorySchema,
  createPostSchema,
  createPromotionSchema,
  createReviewSchema,
  createTicketMessageSchema,
  createTicketSchema,
  createVoucherSchema,
  marketingFiltersSchema,
  replyReviewSchema,
  updateBannerSchema,
  updatePostSchema,
  updatePromotionSchema,
  updateReviewStatusSchema,
  updateTicketStatusSchema,
} from "./validators";

export const marketingRouter = createTRPCRouter({
  // ==============================
  // Promotions
  // ==============================

  listPromotions: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listPromotions(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getPromotion: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getPromotionById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createPromotion: orgProcedure
    .input(createPromotionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createPromotionService(
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

  updatePromotion: orgProcedure
    .input(z.object({ id: z.string(), data: updatePromotionSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updatePromotionService(
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

  deletePromotion: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deletePromotionService(
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
  // Vouchers
  // ==============================

  listVouchers: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listVouchers(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getVoucher: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getVoucherById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createVoucher: orgProcedure
    .input(createVoucherSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createVoucherService(
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

  deleteVoucher: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteVoucherService(
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
  // Banners
  // ==============================

  listBanners: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listBanners(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getBanner: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getBannerById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createBanner: orgProcedure
    .input(createBannerSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createBannerService(
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

  updateBanner: orgProcedure
    .input(z.object({ id: z.string(), data: updateBannerSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateBannerService(
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

  deleteBanner: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deleteBannerService(
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
  // Reviews
  // ==============================

  listReviews: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listReviews(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getReview: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getReviewById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createReview: orgProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createReviewService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  replyReview: orgProcedure
    .input(z.object({ id: z.string(), data: replyReviewSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await replyReviewService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data.replyText
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateReviewStatus: orgProcedure
    .input(z.object({ id: z.string(), data: updateReviewStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateReviewStatusService(
        ctx.orgId,
        ctx.user.id,
        ctx.user.name,
        input.id,
        input.data.status
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // CMS (Posts & Categories)
  // ==============================

  listPostCategories: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listPostCategories(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createPostCategory: orgProcedure
    .input(createPostCategorySchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createPostCategoryService(
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

  deletePostCategory: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deletePostCategoryService(
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

  listPosts: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listPosts(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getPost: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getPostById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createPost: orgProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createPostService(
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

  updatePost: orgProcedure
    .input(z.object({ id: z.string(), data: updatePostSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updatePostService(
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

  deletePost: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await deletePostService(
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
  // Tickets & Messages
  // ==============================

  listTickets: orgProcedure
    .input(marketingFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listTickets(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getTicket: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getTicketById(ctx.orgId, input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createTicket: orgProcedure
    .input(createTicketSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createTicketService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateTicketStatus: orgProcedure
    .input(z.object({ id: z.string(), data: updateTicketStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await updateTicketStatusService(
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

  listTicketMessages: orgProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listTicketMessages(ctx.orgId, input.ticketId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createTicketMessage: orgProcedure
    .input(createTicketMessageSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      if (!ctx.user) {
        throw createError("UNAUTHORIZED", "User context missing", 401);
      }
      const result = await createTicketMessageService(
        ctx.orgId,
        ctx.user.id,
        "agent", // When called through admin orgProcedure router, sender type is 'agent'
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),
});
