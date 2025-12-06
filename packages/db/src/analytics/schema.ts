import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const eventType = pgEnum("event_type", [
  "page_view",
  "product_view",
  "add_to_cart",
  "remove_from_cart",
  "begin_checkout",
  "add_payment_info",
  "purchase",
  "search",
  "view_design",
  "download_design",
  "share",
  "like",
  "review",
  "custom_event",
]);

export const deviceType = pgEnum("device_type", [
  "desktop",
  "mobile",
  "tablet",
  "unknown",
]);

export const trafficSource = pgEnum("traffic_source", [
  "direct",
  "organic_search",
  "paid_search",
  "social",
  "email",
  "referral",
  "affiliate",
  "other",
]);

// ============================================================================
// PAGE VIEWS
// ============================================================================

export const pageViews = pgTable(
  "page_views",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid(), // NULL for anonymous

    // Session
    sessionId: t.text().notNull(),
    visitorId: t.text().notNull(), // Unique visitor fingerprint

    // Page details
    url: t.text().notNull(),
    path: t.text().notNull(),
    title: t.text(),
    referrer: t.text(),

    // Device & browser
    deviceType: deviceType().default("unknown").notNull(),
    browser: t.text(),
    browserVersion: t.text(),
    os: t.text(),
    osVersion: t.text(),
    screenResolution: t.text(),

    // Location
    country: t.text(),
    region: t.text(),
    city: t.text(),
    ipAddress: t.text(),

    // Traffic source
    trafficSource: trafficSource(),
    utmSource: t.text(),
    utmMedium: t.text(),
    utmCampaign: t.text(),
    utmTerm: t.text(),
    utmContent: t.text(),

    // Performance
    pageLoadTime: t.integer(), // milliseconds
    timeOnPage: t.integer(), // seconds

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("page_views_user_idx").on(table.userId),
    index("page_views_session_idx").on(table.sessionId),
    index("page_views_path_idx").on(table.path),
    index("page_views_created_idx").on(table.createdAt),
  ]
);

// ============================================================================
// EVENTS
// ============================================================================

export const events = pgTable(
  "events",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid(), // NULL for anonymous

    // Session
    sessionId: t.text().notNull(),

    // Event details
    eventType: eventType().notNull(),
    eventName: t.text().notNull(),

    // Event data
    properties: jsonb().$type<Record<string, unknown>>(),

    // Context
    url: t.text(),
    path: t.text(),
    referrer: t.text(),

    // Revenue (if applicable)
    revenue: t.numeric({ precision: 10, scale: 2 }),
    currency: t.text(),

    // Device
    deviceType: deviceType().default("unknown").notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("events_user_idx").on(table.userId),
    index("events_session_idx").on(table.sessionId),
    index("events_type_idx").on(table.eventType),
    index("events_created_idx").on(table.createdAt),
  ]
);

// ============================================================================
// CONVERSIONS
// ============================================================================

export const conversions = pgTable(
  "conversions",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid(), // NULL for anonymous

    // Conversion details
    conversionType: t.text().notNull(), // "purchase", "signup", "design_upload"
    orderId: t.uuid(), // Reference to order

    // Revenue
    revenue: t.numeric({ precision: 10, scale: 2 }).notNull(),
    currency: t.text().default("IDR").notNull(),

    // Attribution
    firstTouchSource: t.text(),
    lastTouchSource: t.text(),
    utmSource: t.text(),
    utmMedium: t.text(),
    utmCampaign: t.text(),

    // Conversion path
    touchpoints:
      jsonb().$type<
        Array<{
          source: string;
          timestamp: string;
          page: string;
        }>
      >(),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("conversions_user_idx").on(table.userId),
    index("conversions_order_idx").on(table.orderId),
    index("conversions_type_idx").on(table.conversionType),
    index("conversions_created_idx").on(table.createdAt),
  ]
);

// ============================================================================
// COHORTS
// ============================================================================

export const cohorts = pgTable(
  "cohorts",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    // Cohort info
    name: t.text().notNull(),
    description: t.text(),
    cohortDate: t.timestamp().notNull(), // Week/month when users joined

    // Metrics
    totalUsers: t.integer().notNull(),
    activeUsers: t.integer().default(0),
    retainedUsers: t.integer().default(0),
    churnedUsers: t.integer().default(0),

    // Revenue
    totalRevenue: t.numeric({ precision: 10, scale: 2 }).default("0"),
    averageRevenuePerUser: t.numeric({ precision: 10, scale: 2 }).default("0"),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("cohorts_date_idx").on(table.cohortDate)]
);

export const cohortUsers = pgTable(
  "cohort_users",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    cohortId: t
      .uuid()
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    userId: t.uuid().notNull(),

    // User metrics
    firstOrderDate: t.timestamp(),
    lastOrderDate: t.timestamp(),
    totalOrders: t.integer().default(0),
    totalRevenue: t.numeric({ precision: 10, scale: 2 }).default("0"),

    // Activity
    isActive: t.integer().default(1).notNull(), // 1 = active, 0 = churned
    lastActiveDate: t.timestamp(),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("cohort_users_unique_idx").on(table.cohortId, table.userId),
    index("cohort_users_cohort_idx").on(table.cohortId),
    index("cohort_users_user_idx").on(table.userId),
  ]
);

// ============================================================================
// REVENUE REPORTS (Aggregated daily/weekly/monthly)
// ============================================================================

export const revenueReports = pgTable(
  "revenue_reports",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    // Period
    period: t.text().notNull(), // "daily", "weekly", "monthly"
    periodStart: t.timestamp().notNull(),
    periodEnd: t.timestamp().notNull(),

    // Revenue metrics
    totalRevenue: t.numeric({ precision: 10, scale: 2 }).notNull(),
    totalOrders: t.integer().notNull(),
    averageOrderValue: t.numeric({ precision: 10, scale: 2 }).notNull(),

    // Breakdown
    productRevenue: t.numeric({ precision: 10, scale: 2 }).default("0"),
    shippingRevenue: t.numeric({ precision: 10, scale: 2 }).default("0"),
    taxRevenue: t.numeric({ precision: 10, scale: 2 }).default("0"),
    discountAmount: t.numeric({ precision: 10, scale: 2 }).default("0"),
    refundAmount: t.numeric({ precision: 10, scale: 2 }).default("0"),

    // Costs
    productCost: t.numeric({ precision: 10, scale: 2 }).default("0"),
    printCost: t.numeric({ precision: 10, scale: 2 }).default("0"),
    shippingCost: t.numeric({ precision: 10, scale: 2 }).default("0"),
    platformFees: t.numeric({ precision: 10, scale: 2 }).default("0"),
    creatorCommissions: t.numeric({ precision: 10, scale: 2 }).default("0"),

    // Profit
    grossProfit: t.numeric({ precision: 10, scale: 2 }).notNull(),
    netProfit: t.numeric({ precision: 10, scale: 2 }).notNull(),
    profitMargin: t.numeric({ precision: 5, scale: 2 }).notNull(), // percentage

    // Customer metrics
    newCustomers: t.integer().default(0),
    returningCustomers: t.integer().default(0),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("revenue_reports_period_idx").on(
      table.period,
      table.periodStart
    ),
    index("revenue_reports_period_start_idx").on(table.periodStart),
  ]
);

// ============================================================================
// PRODUCT ANALYTICS
// ============================================================================

export const productMetrics = pgTable(
  "product_metrics",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    productId: t.uuid().notNull(),

    // Period
    date: t.timestamp().notNull(),

    // Views & engagement
    views: t.integer().default(0).notNull(),
    uniqueViews: t.integer().default(0).notNull(),
    addToCartCount: t.integer().default(0).notNull(),

    // Sales
    orderCount: t.integer().default(0).notNull(),
    quantitySold: t.integer().default(0).notNull(),
    revenue: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),

    // Conversion
    conversionRate: t.numeric({ precision: 5, scale: 2 }).default("0"),

    // Engagement
    likeCount: t.integer().default(0).notNull(),
    shareCount: t.integer().default(0).notNull(),
    reviewCount: t.integer().default(0).notNull(),
    averageRating: t.numeric({ precision: 3, scale: 2 }).default("0"),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("product_metrics_product_date_idx").on(
      table.productId,
      table.date
    ),
    index("product_metrics_product_idx").on(table.productId),
    index("product_metrics_date_idx").on(table.date),
  ]
);

// ============================================================================
// USER SEGMENTS
// ============================================================================

export const userSegments = pgTable(
  "user_segments",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    // Segment info
    name: t.text().notNull(),
    description: t.text(),

    // Segment criteria
    criteria: jsonb().$type<{
      totalOrders?: { min?: number; max?: number };
      totalRevenue?: { min?: number; max?: number };
      lastOrderDays?: { min?: number; max?: number };
      averageOrderValue?: { min?: number; max?: number };
      tags?: string[];
    }>(),

    // Stats
    userCount: t.integer().default(0).notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("user_segments_name_idx").on(table.name)]
);

export const segmentUsers = pgTable(
  "segment_users",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    segmentId: t
      .uuid()
      .notNull()
      .references(() => userSegments.id, { onDelete: "cascade" }),
    userId: t.uuid().notNull(),

    // Metrics (snapshot when added to segment)
    totalOrders: t.integer(),
    totalRevenue: t.numeric({ precision: 10, scale: 2 }),
    lastOrderDate: t.timestamp(),

    addedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("segment_users_unique_idx").on(table.segmentId, table.userId),
    index("segment_users_segment_idx").on(table.segmentId),
    index("segment_users_user_idx").on(table.userId),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const cohortsRelations = relations(cohorts, ({ many }) => ({
  cohortUsers: many(cohortUsers),
}));

export const cohortUsersRelations = relations(cohortUsers, ({ one }) => ({
  cohort: one(cohorts, {
    fields: [cohortUsers.cohortId],
    references: [cohorts.id],
  }),
}));

export const userSegmentsRelations = relations(userSegments, ({ many }) => ({
  segmentUsers: many(segmentUsers),
}));

export const segmentUsersRelations = relations(segmentUsers, ({ one }) => ({
  segment: one(userSegments, {
    fields: [segmentUsers.segmentId],
    references: [userSegments.id],
  }),
}));
