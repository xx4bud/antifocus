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

export const notificationType = pgEnum("notification_type", [
  "order_confirmation",
  "order_shipped",
  "order_delivered",
  "order_cancelled",
  "payment_received",
  "payment_failed",
  "refund_approved",
  "refund_completed",
  "design_approved",
  "design_rejected",
  "new_message",
  "new_review",
  "low_stock",
  "price_drop",
  "promotion",
  "system_alert",
  "custom",
]);

export const notificationChannel = pgEnum("notification_channel", [
  "email",
  "sms",
  "push",
  "in_app",
  "webhook",
]);

export const notificationStatus = pgEnum("notification_status", [
  "pending",
  "queued",
  "sending",
  "sent",
  "delivered",
  "failed",
  "bounced",
]);

export const notificationPriority = pgEnum("notification_priority", [
  "low",
  "normal",
  "high",
  "urgent",
]);

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = pgTable(
  "notifications",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull(),

    // Notification details
    type: notificationType().notNull(),
    channel: notificationChannel().notNull(),
    priority: notificationPriority().default("normal").notNull(),

    // Content
    title: t.text().notNull(),
    body: t.text().notNull(),
    data: jsonb().$type<Record<string, unknown>>(), // Additional data payload

    // Targeting
    actionUrl: t.text(), // Deep link or web URL
    actionLabel: t.text(),
    imageUrl: t.text(),

    // Status
    status: notificationStatus().default("pending").notNull(),

    // Scheduling
    scheduledAt: t.timestamp(),
    sentAt: t.timestamp(),
    deliveredAt: t.timestamp(),

    // Read status (for in-app notifications)
    isRead: t.boolean().default(false).notNull(),
    readAt: t.timestamp(),

    // Error handling
    errorMessage: t.text(),
    retryCount: t.integer().default(0).notNull(),
    maxRetries: t.integer().default(3).notNull(),

    // Related entities
    orderId: t.uuid(),
    designId: t.uuid(),

    // Expiry (for in-app notifications)
    expiresAt: t.timestamp(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("notifications_user_idx").on(table.userId),
    index("notifications_type_idx").on(table.type),
    index("notifications_status_idx").on(table.status),
    index("notifications_channel_idx").on(table.channel),
    index("notifications_created_idx").on(table.createdAt),
  ]
);

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

export const notificationPreferences = pgTable(
  "notification_preferences",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull().unique(),

    // Global settings
    emailEnabled: t.boolean().default(true).notNull(),
    smsEnabled: t.boolean().default(true).notNull(),
    pushEnabled: t.boolean().default(true).notNull(),
    inAppEnabled: t.boolean().default(true).notNull(),

    // Per-type preferences
    orderUpdatesEmail: t.boolean().default(true).notNull(),
    orderUpdatesSms: t.boolean().default(false).notNull(),
    orderUpdatesPush: t.boolean().default(true).notNull(),

    marketingEmail: t.boolean().default(true).notNull(),
    marketingSms: t.boolean().default(false).notNull(),
    marketingPush: t.boolean().default(false).notNull(),

    designUpdatesEmail: t.boolean().default(true).notNull(),
    designUpdatesPush: t.boolean().default(true).notNull(),

    reviewsEmail: t.boolean().default(true).notNull(),
    reviewsPush: t.boolean().default(true).notNull(),

    promotionsEmail: t.boolean().default(true).notNull(),
    promotionsPush: t.boolean().default(false).notNull(),

    // Quiet hours
    quietHoursEnabled: t.boolean().default(false).notNull(),
    quietHoursStart: t.text(), // "22:00"
    quietHoursEnd: t.text(), // "08:00"
    quietHoursTimezone: t.text(),

    // Digest preferences
    dailyDigestEnabled: t.boolean().default(false).notNull(),
    weeklyDigestEnabled: t.boolean().default(false).notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("notification_preferences_user_idx").on(table.userId)]
);

// ============================================================================
// EMAIL LOGS
// ============================================================================

export const emailLogs = pgTable(
  "email_logs",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    notificationId: t.uuid().references(() => notifications.id, {
      onDelete: "set null",
    }),
    userId: t.uuid(),

    // Email details
    to: t.text().notNull(),
    from: t.text().notNull(),
    subject: t.text().notNull(),

    // Content
    htmlBody: t.text(),
    textBody: t.text(),

    // Email service
    provider: t.text().default("resend").notNull(), // "resend", "sendgrid", "ses"
    messageId: t.text(), // External message ID

    // Status
    status: notificationStatus().default("pending").notNull(),

    // Tracking
    sentAt: t.timestamp(),
    deliveredAt: t.timestamp(),
    openedAt: t.timestamp(),
    clickedAt: t.timestamp(),
    bouncedAt: t.timestamp(),
    complainedAt: t.timestamp(),

    // Metadata
    openCount: t.integer().default(0).notNull(),
    clickCount: t.integer().default(0).notNull(),

    // Error handling
    errorMessage: t.text(),
    bounceType: t.text(), // "hard", "soft", "complaint"

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("email_logs_notification_idx").on(table.notificationId),
    index("email_logs_user_idx").on(table.userId),
    index("email_logs_status_idx").on(table.status),
    index("email_logs_to_idx").on(table.to),
  ]
);

// ============================================================================
// SMS LOGS
// ============================================================================

export const smsLogs = pgTable(
  "sms_logs",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    notificationId: t.uuid().references(() => notifications.id, {
      onDelete: "set null",
    }),
    userId: t.uuid(),

    // SMS details
    to: t.text().notNull(),
    from: t.text().notNull(),
    body: t.text().notNull(),

    // Provider
    provider: t.text().default("twilio").notNull(), // "twilio", "vonage", "messagebird"
    messageId: t.text(), // External message ID

    // Status
    status: notificationStatus().default("pending").notNull(),

    // Tracking
    sentAt: t.timestamp(),
    deliveredAt: t.timestamp(),

    // Costs
    segments: t.integer().default(1), // Number of SMS segments
    cost: t.text(), // Cost in provider's currency

    // Error handling
    errorMessage: t.text(),
    errorCode: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("sms_logs_notification_idx").on(table.notificationId),
    index("sms_logs_user_idx").on(table.userId),
    index("sms_logs_status_idx").on(table.status),
    index("sms_logs_to_idx").on(table.to),
  ]
);

// ============================================================================
// PUSH TOKENS
// ============================================================================

export const pushTokens = pgTable(
  "push_tokens",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull(),

    // Token details
    token: t.text().notNull().unique(),
    platform: t.text().notNull(), // "ios", "android", "web"

    // Device info
    deviceId: t.text(),
    deviceName: t.text(),
    deviceModel: t.text(),
    osVersion: t.text(),
    appVersion: t.text(),

    // Status
    isActive: t.boolean().default(true).notNull(),

    // Tracking
    lastUsedAt: t.timestamp(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("push_tokens_user_idx").on(table.userId),
    index("push_tokens_token_idx").on(table.token),
    index("push_tokens_active_idx").on(table.isActive),
  ]
);

export const pushLogs = pgTable(
  "push_logs",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    notificationId: t.uuid().references(() => notifications.id, {
      onDelete: "set null",
    }),
    userId: t.uuid(),
    tokenId: t.uuid().references(() => pushTokens.id, {
      onDelete: "set null",
    }),

    // Push details
    title: t.text().notNull(),
    body: t.text().notNull(),
    data: jsonb().$type<Record<string, unknown>>(),

    // Provider
    provider: t.text().default("fcm").notNull(), // "fcm", "apns", "web_push"
    messageId: t.text(),

    // Status
    status: notificationStatus().default("pending").notNull(),

    // Tracking
    sentAt: t.timestamp(),
    deliveredAt: t.timestamp(),
    clickedAt: t.timestamp(),

    // Error handling
    errorMessage: t.text(),
    errorCode: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("push_logs_notification_idx").on(table.notificationId),
    index("push_logs_user_idx").on(table.userId),
    index("push_logs_token_idx").on(table.tokenId),
    index("push_logs_status_idx").on(table.status),
  ]
);

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================

export const notificationTemplates = pgTable(
  "notification_templates",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    // Template info
    name: t.text().notNull().unique(),
    type: notificationType().notNull(),
    channel: notificationChannel().notNull(),

    // Content (with variable placeholders)
    subject: t.text(), // For email
    title: t.text(),
    body: t.text().notNull(),

    // HTML template (for email)
    htmlTemplate: t.text(),

    // Variables
    variables:
      jsonb().$type<
        Array<{
          name: string;
          description: string;
          required: boolean;
          default?: string;
        }>
      >(),

    // Status
    isActive: t.boolean().default(true).notNull(),

    // Localization
    locale: t.text().default("id-ID").notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("notification_templates_unique_idx").on(
      table.name,
      table.locale
    ),
    index("notification_templates_type_idx").on(table.type),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const notificationsRelations = relations(notifications, ({ one }) => ({
  emailLog: one(emailLogs),
  smsLog: one(smsLogs),
  pushLog: one(pushLogs),
}));

export const emailLogsRelations = relations(emailLogs, ({ one }) => ({
  notification: one(notifications, {
    fields: [emailLogs.notificationId],
    references: [notifications.id],
  }),
}));

export const smsLogsRelations = relations(smsLogs, ({ one }) => ({
  notification: one(notifications, {
    fields: [smsLogs.notificationId],
    references: [notifications.id],
  }),
}));

export const pushTokensRelations = relations(pushTokens, ({ many }) => ({
  pushLogs: many(pushLogs),
}));

export const pushLogsRelations = relations(pushLogs, ({ one }) => ({
  notification: one(notifications, {
    fields: [pushLogs.notificationId],
    references: [notifications.id],
  }),
  token: one(pushTokens, {
    fields: [pushLogs.tokenId],
    references: [pushTokens.id],
  }),
}));
