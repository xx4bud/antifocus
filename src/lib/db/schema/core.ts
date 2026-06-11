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
import { users } from "./auth";
import { type AddressType, DEFAULT_ADDRESS_TYPE } from "./enums";
import { branches, customers, members, organizations, suppliers } from "./org";

// ==============================
// Audit Logs (Append-only)
// ==============================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: idColumn(),
    organizationId: text("organization_id"),
    sessionId: text("session_id"),

    actorName: varcharColumn("actor_name").notNull(),
    actorId: text("actor_id").notNull(), // polymorphic

    action: varcharColumn("action").notNull(),
    metadata: jsonbColumn("metadata"), // details

    targetName: varcharColumn("target_name").notNull(), // resource
    targetId: text("target_id").notNull(), // record_id

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [idx("audit_logs", table.organizationId)]
);

export const auditLogRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type AuditLogInsert = typeof auditLogs.$inferInsert;

// ==============================
// Files
// ==============================

export const files = pgTable(
  "files",
  {
    id: idColumn(),
    organizationId: text("organization_id"),
    providerId: text("provider_id").notNull(), // uploadthings, r2, etc
    accountId: text("account_id"),

    name: varcharColumn("name").notNull(),
    url: text("url").notNull(),
    size: intColumn("size").notNull(),
    mime: text("mime").notNull(),
    hash: text("hash"),

    public: trueColumn("public"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("files", table.organizationId),
    uidx("files", table.organizationId, table.url),
    uidx("files", table.providerId, table.accountId, table.url),
  ]
);

export const fileRelations = relations(files, ({ one }) => ({
  organization: one(organizations, {
    fields: [files.organizationId],
    references: [organizations.id],
  }),
}));

export type File = typeof files.$inferSelect;
export type FileInsert = typeof files.$inferInsert;

// ==============================
// Addresses (Polymorphic)
// ==============================

export const addresses = pgTable(
  "addresses",
  {
    id: idColumn(),
    userId: text("user_id"),
    organizationId: text("organization_id"),
    memberId: text("member_id"),
    branchId: text("branch_id"),
    customerId: text("customer_id"),
    supplierId: text("supplier_id"),

    name: varcharColumn("name").notNull(),
    phoneNumber: varcharColumn("phone_number").notNull(),
    email: varcharColumn("email"),

    street1: text("street_1").notNull(),
    street2: text("street_2"),
    subDistrict: jsonbColumn("sub_district"),
    district: jsonbColumn("district"),
    city: jsonbColumn("city"),
    province: jsonbColumn("province"),
    country: jsonbColumn("country"),
    zipCode: text("zip_code"),

    latitude: decimalColumn("latitude", 9, 6),
    longitude: decimalColumn("longitude", 9, 6),

    default: falseColumn("default"),
    type: text("type")
      .$type<AddressType>()
      .default(DEFAULT_ADDRESS_TYPE)
      .notNull(),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("addresses", table.organizationId),
    idx("addresses", table.userId),
    idx("addresses", table.customerId),
    idx("addresses", table.supplierId),
    idx("addresses", table.memberId),
    idx("addresses", table.branchId),
  ]
);

export const addressRelations = relations(addresses, ({ one }) => ({
  // core
  organization: one(organizations, {
    fields: [addresses.organizationId],
    references: [organizations.id],
  }),

  // auth
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),

  // org
  member: one(members, {
    fields: [addresses.memberId],
    references: [members.id],
  }),
  branch: one(branches, {
    fields: [addresses.branchId],
    references: [branches.id],
  }),
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
  supplier: one(suppliers, {
    fields: [addresses.supplierId],
    references: [suppliers.id],
  }),
}));

export type Address = typeof addresses.$inferSelect;
export type AddressInsert = typeof addresses.$inferInsert;

// ==============================
// Sequences (Auto-number)
// ==============================

export const sequences = pgTable(
  "sequences",
  {
    id: idColumn(),
    organizationId: text("organization_id"),
    branchId: text("branch_id"),

    name: varcharColumn("name").notNull(),
    prefix: text("prefix"),
    suffix: text("suffix"),
    format: text("format"),

    padding: intColumn("padding").notNull().default(4),
    increment: intColumn("increment").notNull().default(1),
    current: intColumn("current").notNull().default(0),
    next: intColumn("next").notNull().default(1),
    resetAt: timestampColumn("reset_at").notNull(),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("sequences", table.organizationId),
    idx("sequences", table.branchId),
    uidx("sequences", table.organizationId, table.branchId, table.name),
  ]
);

export const sequenceRelations = relations(sequences, ({ one }) => ({
  // core
  organization: one(organizations, {
    fields: [sequences.organizationId],
    references: [organizations.id],
  }),

  // org
  branch: one(branches, {
    fields: [sequences.branchId],
    references: [branches.id],
  }),
}));

export type Sequence = typeof sequences.$inferSelect;
export type SequenceInsert = typeof sequences.$inferInsert;

// ==============================
// Settings (Key-Value)
// ==============================

export const settings = pgTable(
  "settings",
  {
    id: idColumn(),
    organizationId: text("organization_id"),
    category: varcharColumn("category").notNull(), // polymorphic

    key: varcharColumn("key").notNull(),
    value: text("value").notNull(),

    public: trueColumn("public"),
    system: falseColumn("system"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("settings", table.organizationId),
    uidx("settings", table.organizationId, table.category, table.key),
  ]
);

export const settingRelations = relations(settings, ({ one }) => ({
  organization: one(organizations, {
    fields: [settings.organizationId],
    references: [organizations.id],
  }),
}));

export type Setting = typeof settings.$inferSelect;
export type SettingInsert = typeof settings.$inferInsert;

// ==============================
// Integrations
// ==============================

export const integrations = pgTable(
  "integrations",
  {
    id: idColumn(),
    organizationId: text("organization_id"),
    providerId: text("provider_id").notNull(),
    accountId: text("account_id"),

    category: varcharColumn("category").notNull(), // polymorphic
    name: varcharColumn("name").notNull(),
    configs: jsonbColumn("configs"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("integrations", table.organizationId),
    uidx(
      "integrations",
      table.organizationId,
      table.providerId,
      table.accountId
    ),
  ]
);

export const integrationRelations = relations(integrations, ({ one }) => ({
  organization: one(organizations, {
    fields: [integrations.organizationId],
    references: [organizations.id],
  }),
}));

export type Integration = typeof integrations.$inferSelect;
export type IntegrationInsert = typeof integrations.$inferInsert;

// ==============================
// Webhooks
// ==============================

export const webhooks = pgTable(
  "webhooks",
  {
    id: idColumn(),
    organizationId: text("organization_id"),

    url: text("url").notNull(),
    secret: text("secret"),
    headers: jsonbColumn("headers"),
    events: jsonbColumn("events"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("webhooks", table.organizationId),
    uidx("webhooks", table.organizationId, table.url),
  ]
);

export const webhookRelations = relations(webhooks, ({ one }) => ({
  organization: one(organizations, {
    fields: [webhooks.organizationId],
    references: [organizations.id],
  }),
}));

export type Webhook = typeof webhooks.$inferSelect;
export type WebhookInsert = typeof webhooks.$inferInsert;

// ==============================
// Notifications
// ==============================

export const notifications = pgTable(
  "notifications",
  {
    id: idColumn(),
    organizationId: text("organization_id"),
    userId: text("user_id").notNull(),

    category: varcharColumn("category").notNull(), // polymorphic
    title: varcharColumn("title").notNull(),
    body: jsonbColumn("body").notNull(),
    url: text("url"),
    read: falseColumn("read"),
    readAt: timestampColumn("read_at"),

    metadata: jsonbColumn("metadata"),
    ...timestamps,
  },
  (table) => [
    idx("notifications", table.organizationId),
    idx("notifications", table.userId),
  ]
);

export const notificationRelations = relations(notifications, ({ one }) => ({
  // core
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),

  // auth
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;
