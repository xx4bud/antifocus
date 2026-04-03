import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/utils/ids";
import { users } from "./auth";
import { organizations } from "./organization";

/**
 * Notification enums
 */
export const notificationTypeEnum = pgEnum("notification_type", [
  // Order notifications
  "order.created",
  "order.confirmed",
  "order.processing",
  "order.shipped",
  "order.delivered",
  "order.cancelled",
  "order.refunded",

  // Payment notifications
  "payment.received",
  "payment.failed",
  "payment.refunded",
  "invoice.sent",
  "invoice.overdue",

  // Product notifications
  "product.out_of_stock",
  "product.low_stock",

  // System notifications
  "system.maintenance",
  "system.announcement",

  // User notifications
  "user.welcome",
  "user.email_verified",
  "user.password_changed",
  "user.account_suspended",
  "user.account_reactivated",

  // Organization notifications
  "organization.invitation",
  "organization.member_added",
  "organization.member_removed",
  "organization.role_changed",

  // Design notifications
  "design.shared",
  "design.commented",

  // Marketing notifications
  "marketing.promotion",
  "marketing.newsletter",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "email",
  "push",
  "sms",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "delivered",
  "failed",
  "read",
]);

/**
 * Notifications table
 */
export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    // Recipient
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").references(() => organizations.id),

    // Notification content
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    data: jsonb("data"), // additional structured data

    // Delivery channels
    channels:
      jsonb("channels").$type<
        (typeof notificationChannelEnum.enumValues)[number][]
      >(), // which channels to use

    // Status tracking
    status:
      jsonb("status").$type<
        Record<
          (typeof notificationChannelEnum.enumValues)[number],
          (typeof notificationStatusEnum.enumValues)[number]
        >
      >(), // status per channel

    // Reference to related entity
    referenceType: text("reference_type"), // "order", "invoice", "product", etc.
    referenceId: text("reference_id"), // ID of the related entity

    // User interaction
    isRead: boolean("is_read").default(false).notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),

    // Scheduling
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }), // for delayed notifications
    sentAt: timestamp("sent_at", { withTimezone: true }), // when first sent

    // Priority and settings
    priority: text("priority").default("normal").notNull(), // "low", "normal", "high", "urgent"
    isSilent: boolean("is_silent").default(false).notNull(), // don't show push notification

    // Metadata
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_org_id_idx").on(table.organizationId),
    index("notifications_type_idx").on(table.type),
    index("notifications_reference_idx").on(
      table.referenceType,
      table.referenceId
    ),
    index("notifications_is_read_idx").on(table.isRead),
    index("notifications_scheduled_at_idx").on(table.scheduledAt),
    index("notifications_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Push subscriptions table (for web push notifications)
 */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    // Web Push API subscription object
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(), // client's public key
    auth: text("auth").notNull(), // auth secret

    // Browser/device info
    userAgent: text("user_agent"),
    browserName: text("browser_name"),
    platform: text("platform"),

    // Subscription settings
    isActive: boolean("is_active").default(true).notNull(),
    topics: jsonb("topics").$type<string[]>(), // notification topics user subscribed to

    // Error tracking
    lastSuccessAt: timestamp("last_success_at", { withTimezone: true }),
    lastFailureAt: timestamp("last_failure_at", { withTimezone: true }),
    failureCount: integer("failure_count").default(0),

    // Metadata
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("push_subscriptions_user_id_idx").on(table.userId),
    index("push_subscriptions_endpoint_idx").on(table.endpoint),
    index("push_subscriptions_is_active_idx").on(table.isActive),
  ]
);

/**
 * Notification templates table (for reusable notifications)
 */
export const notificationTemplates = pgTable(
  "notification_templates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    organizationId: text("organization_id").references(() => organizations.id), // null for global templates

    // Template details
    name: text("name").notNull(),
    type: notificationTypeEnum("type").notNull(),
    description: text("description"),

    // Content templates
    titleTemplate: text("title_template").notNull(), // e.g., "Order {{orderNumber}} Confirmed"
    messageTemplate: text("message_template").notNull(),

    // Default settings
    defaultChannels:
      jsonb("default_channels").$type<
        (typeof notificationChannelEnum.enumValues)[number][]
      >(),
    defaultPriority: text("default_priority").default("normal"),

    // Template variables (for validation)
    variables:
      jsonb("variables").$type<
        Record<
          string,
          { type: string; required: boolean; description?: string }
        >
      >(),

    // Status
    isActive: boolean("is_active").default(true).notNull(),

    // Metadata
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("notification_templates_org_id_idx").on(table.organizationId),
    index("notification_templates_type_idx").on(table.type),
    index("notification_templates_is_active_idx").on(table.isActive),
  ]
);

/**
 * Relations
 */
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),
}));

export const pushSubscriptionsRelations = relations(
  pushSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [pushSubscriptions.userId],
      references: [users.id],
    }),
  })
);

export const notificationTemplatesRelations = relations(
  notificationTemplates,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [notificationTemplates.organizationId],
      references: [organizations.id],
    }),
  })
);

/**
 * Types
 */
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;

export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type NewNotificationTemplate = typeof notificationTemplates.$inferInsert;
