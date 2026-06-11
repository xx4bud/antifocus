import { z } from "zod/v4";
import { codeSchema } from "@/lib/validations/code";
import { nameSchema } from "@/lib/validations/name";

// ==============================
// Promotions & Vouchers
// ==============================

export const createPromotionSchema = z.object({
  orderChannelId: z.string().optional().nullable(),
  type: z.enum(["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"]),
  name: nameSchema,
  target: z.enum(["order", "product", "category", "collection", "shipping"]),
  value: z.number().positive(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  minOrderAmount: z.number().min(0).optional().nullable(),
  maxDiscount: z.number().min(0).optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  maxUsesPerUser: z.number().int().positive().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;

export const updatePromotionSchema = createPromotionSchema.partial();
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;

export const createVoucherSchema = z.object({
  promotionId: z.string().min(1, "Promotion ID is required"),
  code: codeSchema,
  maxUses: z.number().int().positive().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;

// ==============================
// Banners
// ==============================

export const createBannerSchema = z.object({
  fileId: z.string().optional().nullable(),
  name: nameSchema,
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  position: z
    .enum(["hero", "popup", "sidebar", "banner_strip"])
    .default("hero"),
  priority: z.number().int().default(0),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;

export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;

// ==============================
// Reviews
// ==============================

export const createReviewSchema = z.object({
  productId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  customerId: z.string().min(1, "Customer ID is required"),
  orderItemId: z.string().optional().nullable(),
  rating: z.number().min(1).max(5),
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  verified: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  imageFileIds: z.array(z.string()).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const replyReviewSchema = z.object({
  replyText: z.string().min(1, "Reply content is required"),
});

export type ReplyReviewInput = z.infer<typeof replyReviewSchema>;

export const updateReviewStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>;

// ==============================
// CMS (Post Categories & Posts)
// ==============================

export const createPostCategorySchema = z.object({
  name: nameSchema,
  slug: codeSchema,
});

export type CreatePostCategoryInput = z.infer<typeof createPostCategorySchema>;

export const createPostSchema = z.object({
  categoryId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),
  fileId: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  slug: codeSchema,
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// ==============================
// Tickets & Messages (Help Desk)
// ==============================

export const createTicketSchema = z.object({
  customerId: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  orderItemId: z.string().optional().nullable(),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().optional().nullable(),
  channel: z
    .enum(["web", "email", "phone", "walk_in", "social_media"])
    .default("web"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketStatusSchema = z.object({
  status: z.enum([
    "open",
    "in_progress",
    "waiting_for_customer",
    "resolved",
    "closed",
  ]),
  assigneeId: z.string().optional().nullable(),
});

export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;

export const createTicketMessageSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  fileId: z.string().optional().nullable(),
  content: z.string().min(1, "Message content is required"),
  internal: z.boolean().default(false),
});

export type CreateTicketMessageInput = z.infer<
  typeof createTicketMessageSchema
>;

// ==============================
// Filters
// ==============================

export const marketingFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type MarketingFiltersInput = z.infer<typeof marketingFiltersSchema>;
