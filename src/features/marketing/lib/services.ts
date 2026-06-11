"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  Banner,
  Post,
  PostCategory,
  Promotion,
  Review,
  Ticket,
  TicketMessage,
  Voucher,
} from "@/lib/db/schema/marketing";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertBanner,
  insertPost,
  insertPostCategory,
  insertPromotion,
  insertReview,
  insertReviewImage,
  insertTicket,
  insertTicketMessage,
  insertVoucher,
  softDeleteBanner,
  softDeletePost,
  softDeletePostCategory,
  softDeletePromotion,
  softDeleteVoucher,
  updateBanner,
  updatePost,
  updatePromotion,
  updateReview,
  updateTicket,
} from "./mutations";
import {
  getBannerById,
  getPostById,
  getPostCategoryById,
  getPromotionById,
  getReviewById,
  getTicketById,
  getVoucherById,
} from "./queries";
import type {
  CreateBannerInput,
  CreatePostCategoryInput,
  CreatePostInput,
  CreatePromotionInput,
  CreateReviewInput,
  CreateTicketInput,
  CreateTicketMessageInput,
  CreateVoucherInput,
  UpdateBannerInput,
  UpdatePostInput,
  UpdatePromotionInput,
  UpdateTicketStatusInput,
} from "./validators";

// ==============================
// Promotion Services
// ==============================

export const createPromotionService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreatePromotionInput
): Promise<AppResult<Promotion>> =>
  tryCatchAsync(async () => {
    const promoRes = await insertPromotion(orgId, {
      ...data,
      id: createId(),
    });
    if (!promoRes.ok) {
      throw promoRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.promotion_created",
      targetName: "promotions",
      targetId: promoRes.value.id,
    });

    return promoRes.value;
  }, parseError);

export const updatePromotionService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdatePromotionInput
): Promise<AppResult<Promotion>> =>
  tryCatchAsync(async () => {
    const check = await getPromotionById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const promoRes = await updatePromotion(orgId, id, data);
    if (!promoRes.ok) {
      throw promoRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.promotion_updated",
      targetName: "promotions",
      targetId: id,
    });

    return promoRes.value;
  }, parseError);

export const deletePromotionService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<Promotion>> =>
  tryCatchAsync(async () => {
    const check = await getPromotionById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const promoRes = await softDeletePromotion(orgId, id);
    if (!promoRes.ok) {
      throw promoRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.promotion_deleted",
      targetName: "promotions",
      targetId: id,
    });

    return promoRes.value;
  }, parseError);

// ==============================
// Voucher Services
// ==============================

export const createVoucherService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateVoucherInput
): Promise<AppResult<Voucher>> =>
  tryCatchAsync(async () => {
    const checkPromo = await getPromotionById(orgId, data.promotionId);
    if (!checkPromo.ok) {
      throw checkPromo.error;
    }

    const voucherRes = await insertVoucher(orgId, {
      ...data,
      id: createId(),
    });
    if (!voucherRes.ok) {
      throw voucherRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.voucher_created",
      targetName: "vouchers",
      targetId: voucherRes.value.id,
    });

    return voucherRes.value;
  }, parseError);

export const deleteVoucherService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<Voucher>> =>
  tryCatchAsync(async () => {
    const check = await getVoucherById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const voucherRes = await softDeleteVoucher(orgId, id);
    if (!voucherRes.ok) {
      throw voucherRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.voucher_deleted",
      targetName: "vouchers",
      targetId: id,
    });

    return voucherRes.value;
  }, parseError);

// ==============================
// Banner Services
// ==============================

export const createBannerService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateBannerInput
): Promise<AppResult<Banner>> =>
  tryCatchAsync(async () => {
    const bannerRes = await insertBanner(orgId, {
      ...data,
      id: createId(),
    });
    if (!bannerRes.ok) {
      throw bannerRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.banner_created",
      targetName: "banners",
      targetId: bannerRes.value.id,
    });

    return bannerRes.value;
  }, parseError);

export const updateBannerService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateBannerInput
): Promise<AppResult<Banner>> =>
  tryCatchAsync(async () => {
    const check = await getBannerById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const bannerRes = await updateBanner(orgId, id, data);
    if (!bannerRes.ok) {
      throw bannerRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.banner_updated",
      targetName: "banners",
      targetId: id,
    });

    return bannerRes.value;
  }, parseError);

export const deleteBannerService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<Banner>> =>
  tryCatchAsync(async () => {
    const check = await getBannerById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const bannerRes = await softDeleteBanner(orgId, id);
    if (!bannerRes.ok) {
      throw bannerRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.banner_deleted",
      targetName: "banners",
      targetId: id,
    });

    return bannerRes.value;
  }, parseError);

// ==============================
// Review Services
// ==============================

export const createReviewService = async (
  orgId: string,
  data: CreateReviewInput
): Promise<AppResult<Review>> =>
  tryCatchAsync(async () => {
    const { imageFileIds, ...insertData } = data;
    const reviewRes = await insertReview(orgId, {
      ...insertData,
      id: createId(),
      rating: data.rating,
      status: "pending",
    });
    if (!reviewRes.ok) {
      throw reviewRes.error;
    }

    const review = reviewRes.value;

    if (data.imageFileIds && data.imageFileIds.length > 0) {
      for (const fileId of data.imageFileIds) {
        const imgRes = await insertReviewImage(orgId, {
          id: createId(),
          reviewId: review.id,
          fileId,
        });
        if (!imgRes.ok) {
          throw imgRes.error;
        }
      }
    }

    return review;
  }, parseError);

export const replyReviewService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  replyText: string
): Promise<AppResult<Review>> =>
  tryCatchAsync(async () => {
    const check = await getReviewById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const reviewRes = await updateReview(orgId, id, {
      replyText,
      repliedAt: new Date(),
    });
    if (!reviewRes.ok) {
      throw reviewRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.review_replied",
      targetName: "reviews",
      targetId: id,
    });

    return reviewRes.value;
  }, parseError);

export const updateReviewStatusService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<AppResult<Review>> =>
  tryCatchAsync(async () => {
    const check = await getReviewById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const reviewRes = await updateReview(orgId, id, { status });
    if (!reviewRes.ok) {
      throw reviewRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.review_status_updated",
      targetName: "reviews",
      targetId: id,
    });

    return reviewRes.value;
  }, parseError);

// ==============================
// CMS Services
// ==============================

export const createPostCategoryService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreatePostCategoryInput
): Promise<AppResult<PostCategory>> =>
  tryCatchAsync(async () => {
    const catRes = await insertPostCategory(orgId, {
      ...data,
      id: createId(),
    });
    if (!catRes.ok) {
      throw catRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.post_category_created",
      targetName: "post_categories",
      targetId: catRes.value.id,
    });

    return catRes.value;
  }, parseError);

export const deletePostCategoryService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<PostCategory>> =>
  tryCatchAsync(async () => {
    const check = await getPostCategoryById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const catRes = await softDeletePostCategory(orgId, id);
    if (!catRes.ok) {
      throw catRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.post_category_deleted",
      targetName: "post_categories",
      targetId: id,
    });

    return catRes.value;
  }, parseError);

export const createPostService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreatePostInput
): Promise<AppResult<Post>> =>
  tryCatchAsync(async () => {
    if (data.categoryId) {
      const checkCategory = await getPostCategoryById(orgId, data.categoryId);
      if (!checkCategory.ok) {
        throw checkCategory.error;
      }
    }

    const postRes = await insertPost(orgId, {
      ...data,
      id: createId(),
    });
    if (!postRes.ok) {
      throw postRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.post_created",
      targetName: "posts",
      targetId: postRes.value.id,
    });

    return postRes.value;
  }, parseError);

export const updatePostService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdatePostInput
): Promise<AppResult<Post>> =>
  tryCatchAsync(async () => {
    const check = await getPostById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    if (data.categoryId) {
      const checkCategory = await getPostCategoryById(orgId, data.categoryId);
      if (!checkCategory.ok) {
        throw checkCategory.error;
      }
    }

    const postRes = await updatePost(orgId, id, data);
    if (!postRes.ok) {
      throw postRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.post_updated",
      targetName: "posts",
      targetId: id,
    });

    return postRes.value;
  }, parseError);

export const deletePostService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<Post>> =>
  tryCatchAsync(async () => {
    const check = await getPostById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const postRes = await softDeletePost(orgId, id);
    if (!postRes.ok) {
      throw postRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.post_deleted",
      targetName: "posts",
      targetId: id,
    });

    return postRes.value;
  }, parseError);

// ==============================
// Ticket Services
// ==============================

export const createTicketService = async (
  orgId: string,
  data: CreateTicketInput
): Promise<AppResult<Ticket>> =>
  tryCatchAsync(async () => {
    const ticketNumber = `TCK-${Date.now()}`;
    const ticketRes = await insertTicket(orgId, {
      ...data,
      id: createId(),
      ticketNumber,
      status: "open",
    });
    if (!ticketRes.ok) {
      throw ticketRes.error;
    }

    const ticket = ticketRes.value;

    if (data.content) {
      const msgRes = await insertTicketMessage(orgId, {
        id: createId(),
        ticketId: ticket.id,
        senderType: "customer",
        content: data.content,
        internal: false,
      });
      if (!msgRes.ok) {
        throw msgRes.error;
      }
    }

    return ticket;
  }, parseError);

export const updateTicketStatusService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateTicketStatusInput
): Promise<AppResult<Ticket>> =>
  tryCatchAsync(async () => {
    const check = await getTicketById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const updateData: Parameters<typeof updateTicket>[2] = {
      status: data.status,
    };
    if (data.assigneeId !== undefined) {
      updateData.assigneeId = data.assigneeId;
    }
    if (data.status === "resolved") {
      updateData.resolvedAt = new Date();
    }

    const ticketRes = await updateTicket(orgId, id, updateData);
    if (!ticketRes.ok) {
      throw ticketRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "marketing.ticket_status_updated",
      targetName: "tickets",
      targetId: id,
    });

    return ticketRes.value;
  }, parseError);

export const createTicketMessageService = async (
  orgId: string,
  actorId: string,
  senderType: "customer" | "agent" | "system",
  data: CreateTicketMessageInput
): Promise<AppResult<TicketMessage>> =>
  tryCatchAsync(async () => {
    const checkTicket = await getTicketById(orgId, data.ticketId);
    if (!checkTicket.ok) {
      throw checkTicket.error;
    }

    const msgRes = await insertTicketMessage(orgId, {
      ...data,
      id: createId(),
      senderType,
      senderId: actorId,
    });
    if (!msgRes.ok) {
      throw msgRes.error;
    }

    // Auto-update ticket status based on message sender
    const nextStatus = senderType === "agent" ? "waiting_for_customer" : "open";
    await updateTicket(orgId, data.ticketId, { status: nextStatus });

    return msgRes.value;
  }, parseError);
