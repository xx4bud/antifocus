import { relations } from "drizzle-orm";
import {
  index,
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
 * Audit log enums
 */
export const auditActionEnum = pgEnum("audit_action", [
  // Auth actions
  "user.login",
  "user.logout",
  "user.register",
  "user.password_change",
  "user.email_change",
  "user.profile_update",

  // Organization actions
  "organization.create",
  "organization.update",
  "organization.delete",
  "organization.member_add",
  "organization.member_remove",
  "organization.member_role_change",

  // Product actions
  "product.create",
  "product.update",
  "product.delete",
  "product.publish",
  "product.unpublish",

  // Order actions
  "order.create",
  "order.update",
  "order.cancel",
  "order.status_change",
  "order.payment_received",
  "order.shipped",
  "order.delivered",
  "order.refunded",

  // Design actions
  "design.create",
  "design.update",
  "design.delete",
  "design.publish",
  "design.export",

  // Billing actions
  "invoice.create",
  "invoice.update",
  "invoice.send",
  "invoice.pay",
  "payment.create",
  "payment.process",
  "payment.fail",
  "subscription.create",
  "subscription.update",
  "subscription.cancel",

  // Admin actions
  "admin.user_ban",
  "admin.user_unban",
  "admin.organization_suspend",
  "admin.settings_change",

  // Feature flag actions
  "feature_flag.enable",
  "feature_flag.disable",
  "feature_flag.update",
]);

/**
 * Audit logs table
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    // Actor information
    userId: text("user_id").references(() => users.id), // who performed the action
    organizationId: text("organization_id").references(() => organizations.id), // organization context

    // Action details
    action: auditActionEnum("action").notNull(), // what happened
    resourceType: text("resource_type").notNull(), // "user", "order", "product", etc.
    resourceId: text("resource_id"), // ID of the affected resource

    // Data changes
    oldValue: jsonb("old_value"), // previous state (before change)
    newValue: jsonb("new_value"), // new state (after change)

    // Context
    ipAddress: text("ip_address"), // client IP
    userAgent: text("user_agent"), // browser/client info
    sessionId: text("session_id"), // session that performed the action

    // Additional metadata
    metadata: jsonb("metadata"), // extra context (e.g., reason, notes)

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_org_id_idx").on(table.organizationId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_resource_idx").on(table.resourceType, table.resourceId),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Audit log exports table (for compliance/archival)
 */
export const auditLogExports = pgTable(
  "audit_log_exports",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    // Export details
    name: text("name").notNull(), // descriptive name
    description: text("description"),

    // Date range
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),

    // Filters
    organizationId: text("organization_id").references(() => organizations.id), // specific org or null for all
    userId: text("user_id").references(() => users.id), // specific user or null for all
    actions:
      jsonb("actions").$type<(typeof auditActionEnum.enumValues)[number][]>(), // specific actions or null for all

    // Export status
    status: text("status").default("pending").notNull(), // "pending", "processing", "completed", "failed"
    recordCount: text("record_count"), // number of records exported

    // File information
    fileUrl: text("file_url"), // URL to exported file
    fileSize: text("file_size"), // size in bytes

    // Error handling
    errorMessage: text("error_message"),

    // Requested by
    requestedBy: text("requested_by")
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("audit_log_exports_org_id_idx").on(table.organizationId),
    index("audit_log_exports_user_id_idx").on(table.userId),
    index("audit_log_exports_requested_by_idx").on(table.requestedBy),
    index("audit_log_exports_status_idx").on(table.status),
    index("audit_log_exports_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Relations
 */
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
}));

export const auditLogExportsRelations = relations(
  auditLogExports,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [auditLogExports.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [auditLogExports.userId],
      references: [users.id],
    }),
    requestedByUser: one(users, {
      fields: [auditLogExports.requestedBy],
      references: [users.id],
    }),
  })
);

/**
 * Types
 */
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type AuditLogExport = typeof auditLogExports.$inferSelect;
export type NewAuditLogExport = typeof auditLogExports.$inferInsert;
