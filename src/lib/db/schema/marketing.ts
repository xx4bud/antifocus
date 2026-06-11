import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import {
  decimalColumn,
  falseColumn,
  idColumn,
  idx,
  intColumn,
  jsonbColumn,
  timestampColumn,
  timestamps,
  trueColumn,
  uidx,
  varcharColumn,
} from "../helpers";
import { products } from "./catalog";
import { files } from "./core";
import {
  type BannerPosition,
  DEFAULT_BANNER_POSITION,
  DEFAULT_POST_STATUS,
  DEFAULT_PROMOTION_USAGE_STATUS,
  DEFAULT_REVIEW_STATUS,
  DEFAULT_TICKET_CHANNEL,
  DEFAULT_TICKET_PRIORITY,
  DEFAULT_TICKET_STATUS,
  type MessageSender,
  type PostStatus,
  type PromotionTarget,
  type PromotionType,
  type PromotionUsageStatus,
  type ReviewStatus,
  type TicketChannel,
  type TicketPriority,
  type TicketStatus,
} from "./enums";
import { orderChannels, orderItems, orders } from "./order";
import { branches, customers, members, organizations } from "./org";
import { collections } from "./taxonomy";

// ==============================
// Promotions
// ==============================

export const promotions = pgTable(
  "promotions",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderChannelId: text("order_channel_id"),

    type: text("type").$type<PromotionType>().notNull(),
    name: varcharColumn("name").notNull(),

    target: text("target").$type<PromotionTarget>().notNull(),
    value: decimalColumn("value").notNull(),

    startDate: timestampColumn("start_date"),
    endDate: timestampColumn("end_date"),

    minOrderAmount: decimalColumn("min_order_amount"),
    maxDiscount: decimalColumn("max_discount"),

    maxUses: intColumn("max_uses"),
    maxUsesPerUser: intColumn("max_uses_per_user"),
    usedCount: intColumn("used_count"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // description

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("promotions", table.organizationId),
    idx("promotions", table.orderChannelId),
  ]
);

export const promotionRelations = relations(promotions, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [promotions.organizationId],
    references: [organizations.id],
  }),

  // order
  orderChannel: one(orderChannels, {
    fields: [promotions.orderChannelId],
    references: [orderChannels.id],
  }),

  // marketing
  vouchers: many(vouchers),
  products: many(promotionProducts),
  collections: many(promotionCollections),
  usages: many(promotionUsages),

  // order
  orders: many(orders),
  orderItems: many(orderItems),
}));

export type Promotion = typeof promotions.$inferSelect;
export type PromotionInsert = typeof promotions.$inferInsert;

// ==============================
// Vouchers
// ==============================

export const vouchers = pgTable(
  "vouchers",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    promotionId: text("promotion_id")
      .notNull()
      .references(() => promotions.id, { onDelete: "cascade" }),

    code: varcharColumn("code").notNull(),

    maxUses: intColumn("max_uses"),
    usedCount: intColumn("used_count").default(0).notNull(),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    deletedAt: timestampColumn("deleted_at"),
    ...timestamps,
  },
  (table) => [
    idx("vouchers", table.organizationId),
    idx("vouchers", table.promotionId),
    uidx("vouchers", table.organizationId, table.code),
  ]
);

export const voucherRelations = relations(vouchers, ({ one, many }) => ({
  // marketing
  promotion: one(promotions, {
    fields: [vouchers.promotionId],
    references: [promotions.id],
  }),
  usages: many(promotionUsages),

  // order
  orders: many(orders),
}));

export type Voucher = typeof vouchers.$inferSelect;
export type VoucherInsert = typeof vouchers.$inferInsert;

// ==============================
// Promotion Products
// ==============================

export const promotionProducts = pgTable(
  "promotion_products",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    promotionId: text("promotion_id")
      .notNull()
      .references(() => promotions.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("promotion_products", table.productId),
    uidx("promotion_products", table.promotionId, table.productId),
  ]
);

export const promotionProductRelations = relations(
  promotionProducts,
  ({ one }) => ({
    // marketing
    promotion: one(promotions, {
      fields: [promotionProducts.promotionId],
      references: [promotions.id],
    }),

    // catalog
    product: one(products, {
      fields: [promotionProducts.productId],
      references: [products.id],
    }),
  })
);

export type PromotionProduct = typeof promotionProducts.$inferSelect;
export type PromotionProductInsert = typeof promotionProducts.$inferInsert;

// ==============================
// Promotion Collections
// ==============================

export const promotionCollections = pgTable(
  "promotion_collections",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    promotionId: text("promotion_id")
      .notNull()
      .references(() => promotions.id, { onDelete: "cascade" }),
    collectionId: text("collection_id").notNull(),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("promotion_collections", table.collectionId),
    uidx("promotion_collections", table.promotionId, table.collectionId),
  ]
);

export const promotionCollectionRelations = relations(
  promotionCollections,
  ({ one }) => ({
    // marketing
    promotion: one(promotions, {
      fields: [promotionCollections.promotionId],
      references: [promotions.id],
    }),

    // taxonomy
    collection: one(collections, {
      fields: [promotionCollections.collectionId],
      references: [collections.id],
    }),
  })
);

export type PromotionCollection = typeof promotionCollections.$inferSelect;
export type PromotionCollectionInsert =
  typeof promotionCollections.$inferInsert;

// ==============================
// Promotion Usages
// ==============================

export const promotionUsages = pgTable(
  "promotion_usages",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    customerId: text("customer_id").notNull(),
    promotionId: text("promotion_id").references(() => promotions.id, {
      onDelete: "set null",
    }),
    voucherId: text("voucher_id").references(() => vouchers.id, {
      onDelete: "set null",
    }),
    orderId: text("order_id").notNull(),

    status: text("status")
      .$type<PromotionUsageStatus>()
      .default(DEFAULT_PROMOTION_USAGE_STATUS)
      .notNull(),

    discountAmount: decimalColumn("discount_amount").default(0),
    metadata: jsonbColumn("metadata"), // notes

    ...timestamps,
  },
  (table) => [
    idx("promotion_usages", table.organizationId),
    idx("promotion_usages", table.customerId),
    idx("promotion_usages", table.promotionId),
    idx("promotion_usages", table.voucherId),
    idx("promotion_usages", table.orderId),
  ]
);

export const promotionUsageRelations = relations(
  promotionUsages,
  ({ one }) => ({
    // identity
    organization: one(organizations, {
      fields: [promotionUsages.organizationId],
      references: [organizations.id],
    }),

    // marketing
    promotion: one(promotions, {
      fields: [promotionUsages.promotionId],
      references: [promotions.id],
    }),
    voucher: one(vouchers, {
      fields: [promotionUsages.voucherId],
      references: [vouchers.id],
    }),

    // org
    customer: one(customers, {
      fields: [promotionUsages.customerId],
      references: [customers.id],
    }),

    // order
    order: one(orders, {
      fields: [promotionUsages.orderId],
      references: [orders.id],
    }),
  })
);

export type PromotionUsage = typeof promotionUsages.$inferSelect;
export type PromotionUsageInsert = typeof promotionUsages.$inferInsert;

// ==============================
// Banners
// ==============================

export const banners = pgTable(
  "banners",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    fileId: text("file_id"),

    name: varcharColumn("name").notNull(),
    title: text("title"),
    subtitle: text("subtitle"),

    ctaText: text("cta_text"),
    ctaUrl: text("cta_url"),

    position: text("position")
      .$type<BannerPosition>()
      .default(DEFAULT_BANNER_POSITION)
      .notNull(),
    priority: intColumn("priority").default(0).notNull(),

    startDate: timestampColumn("start_date"),
    endDate: timestampColumn("end_date"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // notes

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("banners", table.organizationId),
    idx("banners", table.fileId),
  ]
);

export const bannerRelations = relations(banners, ({ one }) => ({
  // identity
  organization: one(organizations, {
    fields: [banners.organizationId],
    references: [organizations.id],
  }),

  // core
  file: one(files, {
    fields: [banners.fileId],
    references: [files.id],
  }),
}));

export type Banner = typeof banners.$inferSelect;
export type BannerInsert = typeof banners.$inferInsert;

// ==============================
// Reviews
// ==============================

export const reviews = pgTable(
  "reviews",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    productId: text("product_id"),
    branchId: text("branch_id"),
    customerId: text("customer_id").notNull(),
    orderItemId: text("order_item_id"),

    rating: decimalColumn("rating", 3, 2).notNull(),

    title: varcharColumn("title"),
    content: text("content"),

    status: text("status")
      .$type<ReviewStatus>()
      .default(DEFAULT_REVIEW_STATUS)
      .notNull(),
    verified: falseColumn("verified"),

    replyText: text("reply_text"),
    repliedAt: timestampColumn("replied_at"),

    metadata: jsonbColumn("metadata"), // notes

    ...timestamps,
  },
  (table) => [
    idx("reviews", table.organizationId),
    idx("reviews", table.productId),
    idx("reviews", table.branchId),
    idx("reviews", table.customerId),
    idx("reviews", table.orderItemId),
  ]
);

export const reviewRelations = relations(reviews, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [reviews.organizationId],
    references: [organizations.id],
  }),

  // catalog
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),

  // org
  branch: one(branches, {
    fields: [reviews.branchId],
    references: [branches.id],
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),

  // order
  orderItem: one(orderItems, {
    fields: [reviews.orderItemId],
    references: [orderItems.id],
  }),

  // marketing
  images: many(reviewImages),
}));

export type Review = typeof reviews.$inferSelect;
export type ReviewInsert = typeof reviews.$inferInsert;

// ==============================
// Review Images
// ==============================

export const reviewImages = pgTable(
  "review_images",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    reviewId: text("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    fileId: text("file_id").notNull(),

    priority: intColumn("priority").default(0).notNull(),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("review_images", table.reviewId),
    idx("review_images", table.fileId),
    uidx("review_images", table.reviewId, table.fileId),
  ]
);

export const reviewImageRelations = relations(reviewImages, ({ one }) => ({
  // marketing
  review: one(reviews, {
    fields: [reviewImages.reviewId],
    references: [reviews.id],
  }),

  // core
  file: one(files, {
    fields: [reviewImages.fileId],
    references: [files.id],
  }),
}));

export type ReviewImage = typeof reviewImages.$inferSelect;
export type ReviewImageInsert = typeof reviewImages.$inferInsert;

// ==============================
// Post Categories
// ==============================

export const postCategories = pgTable(
  "post_categories",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull(),

    ...timestamps,
  },
  (table) => [
    idx("post_categories", table.organizationId),
    idx("post_categories", table.slug),
    uidx("post_categories", table.organizationId, table.slug),
  ]
);

export const postCategoryRelations = relations(
  postCategories,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [postCategories.organizationId],
      references: [organizations.id],
    }),
    posts: many(posts),
  })
);

export type PostCategory = typeof postCategories.$inferSelect;
export type PostCategoryInsert = typeof postCategories.$inferInsert;

// ==============================
// Posts (Blog/CMS)
// ==============================

export const posts = pgTable(
  "posts",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    categoryId: text("category_id").references(() => postCategories.id, {
      onDelete: "set null",
    }),
    authorId: text("author_id"),
    fileId: text("file_id"),

    title: varcharColumn("title").notNull(),
    slug: varcharColumn("slug").notNull(),

    excerpt: text("excerpt"),
    content: text("content"),

    status: text("status")
      .$type<PostStatus>()
      .default(DEFAULT_POST_STATUS)
      .notNull(),

    viewCount: intColumn("view_count"),

    publishedAt: timestampColumn("published_at"),

    metadata: jsonbColumn("metadata"), // seo

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("posts", table.organizationId),
    idx("posts", table.categoryId),
    idx("posts", table.authorId),
    idx("posts", table.fileId),
    idx("posts", table.slug),
    uidx("posts", table.organizationId, table.slug),
  ]
);

export const postRelations = relations(posts, ({ one }) => ({
  // identity
  organization: one(organizations, {
    fields: [posts.organizationId],
    references: [organizations.id],
  }),

  // marketing
  category: one(postCategories, {
    fields: [posts.categoryId],
    references: [postCategories.id],
  }),

  // org
  author: one(members, {
    fields: [posts.authorId],
    references: [members.id],
  }),

  // core
  file: one(files, {
    fields: [posts.fileId],
    references: [files.id],
  }),
}));

export type Post = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;

// ==============================
// Tickets (Help Desk)
// ==============================

export const tickets = pgTable(
  "tickets",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    ticketNumber: varcharColumn("ticket_number").notNull(),

    customerId: text("customer_id"),
    assigneeId: text("assignee_id"),

    orderId: text("order_id"),
    branchId: text("branch_id"),
    orderItemId: text("order_item_id"),

    subject: varcharColumn("subject").notNull(),
    content: text("content"),

    channel: text("channel")
      .$type<TicketChannel>()
      .default(DEFAULT_TICKET_CHANNEL)
      .notNull(),
    priority: text("priority")
      .$type<TicketPriority>()
      .default(DEFAULT_TICKET_PRIORITY)
      .notNull(),
    status: text("status")
      .$type<TicketStatus>()
      .default(DEFAULT_TICKET_STATUS)
      .notNull(),

    metadata: jsonbColumn("metadata"),

    resolvedAt: timestampColumn("resolved_at"),
    ...timestamps,
  },
  (table) => [
    idx("tickets", table.organizationId),
    idx("tickets", table.customerId),
    idx("tickets", table.assigneeId),
    idx("tickets", table.orderId),
    idx("tickets", table.branchId),
    uidx("tickets", table.organizationId, table.ticketNumber),
  ]
);

export const ticketRelations = relations(tickets, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [tickets.organizationId],
    references: [organizations.id],
  }),

  // org
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
  assignee: one(members, {
    fields: [tickets.assigneeId],
    references: [members.id],
  }),
  branch: one(branches, {
    fields: [tickets.branchId],
    references: [branches.id],
  }),

  // order
  order: one(orders, {
    fields: [tickets.orderId],
    references: [orders.id],
  }),
  orderItem: one(orderItems, {
    fields: [tickets.orderItemId],
    references: [orderItems.id],
  }),

  // marketing
  messages: many(ticketMessages),
}));

export type Ticket = typeof tickets.$inferSelect;
export type TicketInsert = typeof tickets.$inferInsert;

// ==============================
// Ticket Messages
// ==============================

export const ticketMessages = pgTable(
  "ticket_messages",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    ticketId: text("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    fileId: text("file_id"),

    senderType: text("sender_type").$type<MessageSender>().notNull(),
    senderId: text("sender_id"),

    content: text("content").notNull(),

    internal: falseColumn("internal"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("ticket_messages", table.ticketId),
    idx("ticket_messages", table.fileId),
  ]
);

export const ticketMessageRelations = relations(ticketMessages, ({ one }) => ({
  // marketing
  ticket: one(tickets, {
    fields: [ticketMessages.ticketId],
    references: [tickets.id],
  }),

  // core
  file: one(files, {
    fields: [ticketMessages.fileId],
    references: [files.id],
  }),
}));

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type TicketMessageInsert = typeof ticketMessages.$inferInsert;
