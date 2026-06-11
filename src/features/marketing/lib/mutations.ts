import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  banners,
  postCategories,
  posts,
  promotions,
  reviewImages,
  reviews,
  ticketMessages,
  tickets,
  vouchers,
} from "@/lib/db/schema/marketing";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// Promotion Mutations
// ==============================

export const insertPromotion = async (
  orgId: string,
  data: Omit<typeof promotions.$inferInsert, "organizationId">
): Promise<AppResult<typeof promotions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [promotion] = await db
      .insert(promotions)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!promotion) {
      throw createError("BAD_REQUEST", "Failed to create promotion", 400);
    }

    return promotion;
  }, parseError);

export const updatePromotion = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof promotions.$inferInsert, "organizationId">>
): Promise<AppResult<typeof promotions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [promotion] = await db
      .update(promotions)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(promotions.organizationId, orgId),
          eq(promotions.id, id),
          isNull(promotions.deletedAt)
        )
      )
      .returning();

    if (!promotion) {
      throw createError("BAD_REQUEST", "Failed to update promotion", 400);
    }

    return promotion;
  }, parseError);

export const softDeletePromotion = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof promotions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [promotion] = await db
      .update(promotions)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(promotions.organizationId, orgId),
          eq(promotions.id, id),
          isNull(promotions.deletedAt)
        )
      )
      .returning();

    if (!promotion) {
      throw createError("BAD_REQUEST", "Failed to delete promotion", 400);
    }

    return promotion;
  }, parseError);

// ==============================
// Voucher Mutations
// ==============================

export const insertVoucher = async (
  orgId: string,
  data: Omit<typeof vouchers.$inferInsert, "organizationId">
): Promise<AppResult<typeof vouchers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [voucher] = await db
      .insert(vouchers)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!voucher) {
      throw createError("BAD_REQUEST", "Failed to create voucher", 400);
    }

    return voucher;
  }, parseError);

export const updateVoucher = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof vouchers.$inferInsert, "organizationId">>
): Promise<AppResult<typeof vouchers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [voucher] = await db
      .update(vouchers)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(vouchers.organizationId, orgId),
          eq(vouchers.id, id),
          isNull(vouchers.deletedAt)
        )
      )
      .returning();

    if (!voucher) {
      throw createError("BAD_REQUEST", "Failed to update voucher", 400);
    }

    return voucher;
  }, parseError);

export const softDeleteVoucher = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof vouchers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [voucher] = await db
      .update(vouchers)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(vouchers.organizationId, orgId),
          eq(vouchers.id, id),
          isNull(vouchers.deletedAt)
        )
      )
      .returning();

    if (!voucher) {
      throw createError("BAD_REQUEST", "Failed to delete voucher", 400);
    }

    return voucher;
  }, parseError);

// ==============================
// Banner Mutations
// ==============================

export const insertBanner = async (
  orgId: string,
  data: Omit<typeof banners.$inferInsert, "organizationId">
): Promise<AppResult<typeof banners.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [banner] = await db
      .insert(banners)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!banner) {
      throw createError("BAD_REQUEST", "Failed to create banner", 400);
    }

    return banner;
  }, parseError);

export const updateBanner = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof banners.$inferInsert, "organizationId">>
): Promise<AppResult<typeof banners.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [banner] = await db
      .update(banners)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(banners.organizationId, orgId),
          eq(banners.id, id),
          isNull(banners.deletedAt)
        )
      )
      .returning();

    if (!banner) {
      throw createError("BAD_REQUEST", "Failed to update banner", 400);
    }

    return banner;
  }, parseError);

export const softDeleteBanner = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof banners.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [banner] = await db
      .update(banners)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(banners.organizationId, orgId),
          eq(banners.id, id),
          isNull(banners.deletedAt)
        )
      )
      .returning();

    if (!banner) {
      throw createError("BAD_REQUEST", "Failed to delete banner", 400);
    }

    return banner;
  }, parseError);

// ==============================
// Review Mutations
// ==============================

export const insertReview = async (
  orgId: string,
  data: Omit<typeof reviews.$inferInsert, "organizationId">
): Promise<AppResult<typeof reviews.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [review] = await db
      .insert(reviews)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!review) {
      throw createError("BAD_REQUEST", "Failed to create review", 400);
    }

    return review;
  }, parseError);

export const updateReview = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof reviews.$inferInsert, "organizationId">>
): Promise<AppResult<typeof reviews.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [review] = await db
      .update(reviews)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(reviews.organizationId, orgId),
          eq(reviews.id, id),
          isNull(reviews.deletedAt)
        )
      )
      .returning();

    if (!review) {
      throw createError("BAD_REQUEST", "Failed to update review", 400);
    }

    return review;
  }, parseError);

export const softDeleteReview = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof reviews.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [review] = await db
      .update(reviews)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(reviews.organizationId, orgId),
          eq(reviews.id, id),
          isNull(reviews.deletedAt)
        )
      )
      .returning();

    if (!review) {
      throw createError("BAD_REQUEST", "Failed to delete review", 400);
    }

    return review;
  }, parseError);

export const insertReviewImage = async (
  orgId: string,
  data: Omit<typeof reviewImages.$inferInsert, "organizationId">
): Promise<AppResult<typeof reviewImages.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [image] = await db
      .insert(reviewImages)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!image) {
      throw createError("BAD_REQUEST", "Failed to add review image", 400);
    }

    return image;
  }, parseError);

// ==============================
// CMS Mutations
// ==============================

export const insertPostCategory = async (
  orgId: string,
  data: Omit<typeof postCategories.$inferInsert, "organizationId">
): Promise<AppResult<typeof postCategories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [category] = await db
      .insert(postCategories)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!category) {
      throw createError("BAD_REQUEST", "Failed to create category", 400);
    }

    return category;
  }, parseError);

export const updatePostCategory = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof postCategories.$inferInsert, "organizationId">>
): Promise<AppResult<typeof postCategories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [category] = await db
      .update(postCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(postCategories.organizationId, orgId),
          eq(postCategories.id, id),
          isNull(postCategories.deletedAt)
        )
      )
      .returning();

    if (!category) {
      throw createError("BAD_REQUEST", "Failed to update category", 400);
    }

    return category;
  }, parseError);

export const softDeletePostCategory = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof postCategories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [category] = await db
      .update(postCategories)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(postCategories.organizationId, orgId),
          eq(postCategories.id, id),
          isNull(postCategories.deletedAt)
        )
      )
      .returning();

    if (!category) {
      throw createError("BAD_REQUEST", "Failed to delete category", 400);
    }

    return category;
  }, parseError);

export const insertPost = async (
  orgId: string,
  data: Omit<typeof posts.$inferInsert, "organizationId">
): Promise<AppResult<typeof posts.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [post] = await db
      .insert(posts)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!post) {
      throw createError("BAD_REQUEST", "Failed to create post", 400);
    }

    return post;
  }, parseError);

export const updatePost = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof posts.$inferInsert, "organizationId">>
): Promise<AppResult<typeof posts.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [post] = await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(posts.organizationId, orgId),
          eq(posts.id, id),
          isNull(posts.deletedAt)
        )
      )
      .returning();

    if (!post) {
      throw createError("BAD_REQUEST", "Failed to update post", 400);
    }

    return post;
  }, parseError);

export const softDeletePost = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof posts.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [post] = await db
      .update(posts)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(posts.organizationId, orgId),
          eq(posts.id, id),
          isNull(posts.deletedAt)
        )
      )
      .returning();

    if (!post) {
      throw createError("BAD_REQUEST", "Failed to delete post", 400);
    }

    return post;
  }, parseError);

// ==============================
// Ticket Mutations
// ==============================

export const insertTicket = async (
  orgId: string,
  data: Omit<typeof tickets.$inferInsert, "organizationId">
): Promise<AppResult<typeof tickets.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [ticket] = await db
      .insert(tickets)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!ticket) {
      throw createError("BAD_REQUEST", "Failed to create ticket", 400);
    }

    return ticket;
  }, parseError);

export const updateTicket = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof tickets.$inferInsert, "organizationId">>
): Promise<AppResult<typeof tickets.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [ticket] = await db
      .update(tickets)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(tickets.organizationId, orgId),
          eq(tickets.id, id),
          isNull(tickets.deletedAt)
        )
      )
      .returning();

    if (!ticket) {
      throw createError("BAD_REQUEST", "Failed to update ticket", 400);
    }

    return ticket;
  }, parseError);

export const softDeleteTicket = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof tickets.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [ticket] = await db
      .update(tickets)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(tickets.organizationId, orgId),
          eq(tickets.id, id),
          isNull(tickets.deletedAt)
        )
      )
      .returning();

    if (!ticket) {
      throw createError("BAD_REQUEST", "Failed to delete ticket", 400);
    }

    return ticket;
  }, parseError);

export const insertTicketMessage = async (
  orgId: string,
  data: Omit<typeof ticketMessages.$inferInsert, "organizationId">
): Promise<AppResult<typeof ticketMessages.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [message] = await db
      .insert(ticketMessages)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!message) {
      throw createError("BAD_REQUEST", "Failed to create ticket message", 400);
    }

    return message;
  }, parseError);
