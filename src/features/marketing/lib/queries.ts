import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import type {
  PostStatus,
  ReviewStatus,
  TicketStatus,
} from "@/lib/db/schema/enums";
import {
  banners,
  postCategories,
  posts,
  promotions,
  reviews,
  ticketMessages,
  tickets,
  vouchers,
} from "@/lib/db/schema/marketing";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { MarketingFiltersInput } from "./validators";

// ==============================
// Promotion Queries
// ==============================

export const getPromotionById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof promotions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [promotion] = await db
      .select()
      .from(promotions)
      .where(
        and(
          eq(promotions.organizationId, orgId),
          eq(promotions.id, id),
          isNull(promotions.deletedAt)
        )
      )
      .limit(1);

    if (!promotion) {
      throw createError("PROMOTION_NOT_FOUND", "Promotion not found", 404);
    }

    return promotion;
  }, parseError);

export const listPromotions = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof promotions.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(promotions.organizationId, orgId),
      isNull(promotions.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(promotions.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(promotions)
        .where(and(...conditions))
        .orderBy(desc(promotions.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(promotions)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Voucher Queries
// ==============================

export const getVoucherById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof vouchers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [voucher] = await db
      .select()
      .from(vouchers)
      .where(
        and(
          eq(vouchers.organizationId, orgId),
          eq(vouchers.id, id),
          isNull(vouchers.deletedAt)
        )
      )
      .limit(1);

    if (!voucher) {
      throw createError("VOUCHER_NOT_FOUND", "Voucher not found", 404);
    }

    return voucher;
  }, parseError);

export const getVoucherByCode = async (
  orgId: string,
  code: string
): Promise<AppResult<typeof vouchers.$inferSelect | null>> =>
  tryCatchAsync(async () => {
    const [voucher] = await db
      .select()
      .from(vouchers)
      .where(
        and(
          eq(vouchers.organizationId, orgId),
          eq(vouchers.code, code),
          isNull(vouchers.deletedAt)
        )
      )
      .limit(1);

    return voucher || null;
  }, parseError);

export const listVouchers = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof vouchers.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(vouchers.organizationId, orgId),
      isNull(vouchers.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(vouchers.code, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(vouchers)
        .where(and(...conditions))
        .orderBy(desc(vouchers.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(vouchers)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Banner Queries
// ==============================

export const getBannerById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof banners.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [banner] = await db
      .select()
      .from(banners)
      .where(
        and(
          eq(banners.organizationId, orgId),
          eq(banners.id, id),
          isNull(banners.deletedAt)
        )
      )
      .limit(1);

    if (!banner) {
      throw createError("BANNER_NOT_FOUND", "Banner not found", 404);
    }

    return banner;
  }, parseError);

export const listBanners = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof banners.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(banners.organizationId, orgId),
      isNull(banners.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(banners.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(banners)
        .where(and(...conditions))
        .orderBy(desc(banners.priority))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(banners)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Review Queries
// ==============================

export const getReviewById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof reviews.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [review] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.organizationId, orgId),
          eq(reviews.id, id),
          isNull(reviews.deletedAt)
        )
      )
      .limit(1);

    if (!review) {
      throw createError("REVIEW_NOT_FOUND", "Review not found", 404);
    }

    return review;
  }, parseError);

export const listReviews = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof reviews.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(reviews.organizationId, orgId),
      isNull(reviews.deletedAt),
    ];

    if (filters.status) {
      conditions.push(eq(reviews.status, filters.status as ReviewStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(reviews)
        .where(and(...conditions))
        .orderBy(desc(reviews.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(reviews)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// CMS Queries
// ==============================

export const getPostCategoryById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof postCategories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [category] = await db
      .select()
      .from(postCategories)
      .where(
        and(
          eq(postCategories.organizationId, orgId),
          eq(postCategories.id, id),
          isNull(postCategories.deletedAt)
        )
      )
      .limit(1);

    if (!category) {
      throw createError("CATEGORY_NOT_FOUND", "Category not found", 404);
    }

    return category;
  }, parseError);

export const listPostCategories = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof postCategories.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(postCategories.organizationId, orgId),
      isNull(postCategories.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(postCategories.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(postCategories)
        .where(and(...conditions))
        .orderBy(desc(postCategories.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(postCategories)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

export const getPostById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof posts.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [post] = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.organizationId, orgId),
          eq(posts.id, id),
          isNull(posts.deletedAt)
        )
      )
      .limit(1);

    if (!post) {
      throw createError("POST_NOT_FOUND", "Post not found", 404);
    }

    return post;
  }, parseError);

export const listPosts = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof posts.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(posts.organizationId, orgId),
      isNull(posts.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(posts.title, `%${filters.search}%`));
    }

    if (filters.status) {
      conditions.push(eq(posts.status, filters.status as PostStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(posts)
        .where(and(...conditions))
        .orderBy(desc(posts.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(posts)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Ticket Queries
// ==============================

export const getTicketById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof tickets.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.organizationId, orgId),
          eq(tickets.id, id),
          isNull(tickets.deletedAt)
        )
      )
      .limit(1);

    if (!ticket) {
      throw createError("TICKET_NOT_FOUND", "Ticket not found", 404);
    }

    return ticket;
  }, parseError);

export const listTickets = async (
  orgId: string,
  filters: MarketingFiltersInput
): Promise<
  AppResult<{ items: (typeof tickets.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(tickets.organizationId, orgId),
      isNull(tickets.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(tickets.subject, `%${filters.search}%`));
    }

    if (filters.status) {
      conditions.push(eq(tickets.status, filters.status as TicketStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(tickets)
        .where(and(...conditions))
        .orderBy(desc(tickets.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(tickets)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

export const listTicketMessages = async (
  orgId: string,
  ticketId: string
): Promise<AppResult<(typeof ticketMessages.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(ticketMessages)
        .where(
          and(
            eq(ticketMessages.organizationId, orgId),
            eq(ticketMessages.ticketId, ticketId)
          )
        )
        .orderBy(desc(ticketMessages.createdAt)),
    parseError
  );
