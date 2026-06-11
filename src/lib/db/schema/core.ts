import { relations } from "drizzle-orm";
import { bigint, pgTable, text } from "drizzle-orm/pg-core";
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
// Audit Logs
// ==============================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sessionId: text("session_id"), // Better Auth session token hash

    actorName: varcharColumn("actor_name").notNull(),
    actorId: text("actor_id").notNull(), // polymorphic: userId | memberId | system

    action: text("action").notNull(), // e.g. "order.created", "product.updated"
    metadata: jsonbColumn("metadata"), // request context: ip, userAgent, diff

    targetName: varcharColumn("target_name").notNull(), // table name: "orders", "products"
    targetId: text("target_id").notNull(), // PK of the affected record

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("audit_logs", table.organizationId),
    idx("audit_logs", table.action),
    idx("audit_logs", table.createdAt),
    idx("audit_logs", table.targetName, table.targetId), // polymorphic resource lookup
  ]
);

export const auditLogRelations = relations(auditLogs, ({ one }) => ({
  // org
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
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(), // uploadthing, r2, s3, supabase
    accountId: text("account_id").notNull().default("default"), // discriminator; 'default' = single-account

    name: varcharColumn("name").notNull(),
    url: text("url").notNull(),
    size: bigint("size", { mode: "number" }).notNull().default(0), // bytes
    mime: text("mime").notNull(), // "image/png", "application/pdf"
    hash: text("hash"), // SHA-256 for integrity check

    public: trueColumn("public"), // publicly accessible without auth
    metadata: jsonbColumn("metadata"), // exif, dimensions {w, h}, alt text

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("files", table.organizationId),
    idx("files", table.mime),
    idx("files", table.public),
    idx("files", table.providerId, table.accountId, table.url), // no unique — allow re-upload after soft-delete; dedup at query layer
  ]
);

export const fileRelations = relations(files, ({ one }) => ({
  // org
  organization: one(organizations, {
    fields: [files.organizationId],
    references: [organizations.id],
  }),
}));

export type File = typeof files.$inferSelect;
export type FileInsert = typeof files.$inferInsert;

// ==============================
// Addresses
// ==============================

export const addresses = pgTable(
  "addresses",
  {
    id: idColumn(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    memberId: text("member_id").references(() => members.id, {
      onDelete: "cascade",
    }),
    branchId: text("branch_id").references(() => branches.id, {
      onDelete: "cascade",
    }),
    customerId: text("customer_id").references(() => customers.id, {
      onDelete: "cascade",
    }),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "cascade",
    }),

    name: varcharColumn("name").notNull(), // recipient label: "Rumah", "Kantor"
    phoneNumber: varcharColumn("phone_number").notNull(),
    email: varcharColumn("email"),

    // Indonesian administrative divisions stored as {id, name}
    street1: text("street_1").notNull(), // jalan, gang, no rumah
    street2: text("street_2"), // komplek, blok, rt/rw
    subDistrict: jsonbColumn("sub_district"), // {id, name} — kelurahan
    district: jsonbColumn("district"), // {id, name} — kecamatan
    city: jsonbColumn("city"), // {id, name} — kota/kab
    province: jsonbColumn("province"), // {id, name} — provinsi
    country: jsonbColumn("country"), // {id, name}
    zipCode: text("zip_code"),

    latitude: decimalColumn("latitude", 9, 6),
    longitude: decimalColumn("longitude", 9, 6),

    default: falseColumn("default"), // default address for the owner
    type: text("type")
      .$type<AddressType>()
      .default(DEFAULT_ADDRESS_TYPE)
      .notNull(),
    metadata: jsonbColumn("metadata"), // label override, delivery notes, landmark

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("addresses", table.organizationId),
    idx("addresses", table.userId),
    idx("addresses", table.customerId),
    idx("addresses", table.supplierId),
    idx("addresses", table.memberId),
    idx("addresses", table.branchId),
    idx("addresses", table.organizationId, table.type), // filter by type per org
    idx("addresses", table.customerId, table.default), // default address lookup
  ]
);

export const addressRelations = relations(addresses, ({ one }) => ({
  // auth
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),

  // org
  organization: one(organizations, {
    fields: [addresses.organizationId],
    references: [organizations.id],
  }),
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
// Sequences
// ==============================

export const sequences = pgTable(
  "sequences",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: text("branch_id"),

    name: varcharColumn("name").notNull(), // "invoice", "order", "purchase_order"
    prefix: text("prefix"), // "INV-"
    suffix: text("suffix"), // "-2026"

    padding: intColumn("padding").notNull().default(4), // zero-pad: 4 → "0001"
    increment: intColumn("increment").notNull().default(1),
    current: intColumn("current").notNull().default(0), // last issued value
    resetAt: timestampColumn("reset_at"), // null = never; next bump resets counter

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // format template, notes

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("sequences", table.organizationId),
    idx("sequences", table.branchId),
    idx("sequences", table.organizationId, table.enabled), // active sequences lookup
    uidx("sequences", table.organizationId, table.branchId, table.name),
  ]
);

export const sequenceRelations = relations(sequences, ({ one }) => ({
  // org
  organization: one(organizations, {
    fields: [sequences.organizationId],
    references: [organizations.id],
  }),
  branch: one(branches, {
    fields: [sequences.branchId],
    references: [branches.id],
  }),
}));

export type Sequence = typeof sequences.$inferSelect;
export type SequenceInsert = typeof sequences.$inferInsert;

// ==============================
// Settings
// ==============================

export const settings = pgTable(
  "settings",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    category: varcharColumn("category").notNull(), // "store", "pos", "production"
    key: varcharColumn("key").notNull(), // "currency", "timezone"
    value: text("value").notNull(), // JSON-encoded or plain string

    public: trueColumn("public"), // exposed via public API (storefront)
    system: falseColumn("system"), // hidden from UI, managed by code
    metadata: jsonbColumn("metadata"), // description, validation rules, options

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("settings", table.organizationId),
    idx("settings", table.category),
    uidx("settings", table.organizationId, table.category, table.key),
  ]
);

export const settingRelations = relations(settings, ({ one }) => ({
  // org
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
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(), // "rajaongkir", "xendit", "whatsapp"
    accountId: text("account_id").notNull().default("default"), // discriminator; 'default' = single-account

    category: varcharColumn("category").notNull(), // "shipping", "payment", "notification"
    name: varcharColumn("name").notNull(), // display label: "RajaOngkir Production"
    configs: jsonbColumn("configs"), // ⚠️ SENSITIVE: apiKey, secretKey — encrypt at app level, never log

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // connection status, last sync, rate limit info

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("integrations", table.organizationId),
    idx("integrations", table.category),
    idx("integrations", table.enabled),
    uidx(
      "integrations",
      table.organizationId,
      table.providerId,
      table.accountId
    ),
  ]
);

export const integrationRelations = relations(integrations, ({ one }) => ({
  // org
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
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    integrationId: text("integration_id").references(() => integrations.id, {
      onDelete: "set null",
    }),

    url: text("url").notNull(), // destination endpoint
    secret: text("secret"), // HMAC signing secret for payload verification
    headers: jsonbColumn("headers"), // custom headers: {Authorization: "Bearer ..."}
    events: jsonbColumn("events"), // subscribed: ["order.created", "payment.completed"]

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // logs, notes

    lastTriggeredAt: timestampColumn("last_triggered_at"),
    lastErrorAt: timestampColumn("last_error_at"),
    retryCount: intColumn("retry_count").default(0).notNull(),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("webhooks", table.organizationId),
    idx("webhooks", table.integrationId),
    idx("webhooks", table.enabled),
    uidx("webhooks", table.organizationId, table.url),
  ]
);

export const webhookRelations = relations(webhooks, ({ one }) => ({
  // org
  organization: one(organizations, {
    fields: [webhooks.organizationId],
    references: [organizations.id],
  }),

  // core
  integration: one(integrations, {
    fields: [webhooks.integrationId],
    references: [integrations.id],
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
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: varcharColumn("type").notNull(), // "order_update", "system_alert", "promotion"
    category: varcharColumn("category").notNull(), // "transactional", "marketing", "system"
    title: varcharColumn("title").notNull(),
    body: jsonbColumn("body").notNull(), // structured payload: {message, actionUrl, ...}
    url: text("url"), // deep link target

    read: falseColumn("read"),
    readAt: timestampColumn("read_at"),

    metadata: jsonbColumn("metadata"), // priority: "high" | "normal" | "low", sender info
    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("notifications", table.organizationId),
    idx("notifications", table.userId),
    idx("notifications", table.userId, table.read), // unread count query
    idx("notifications", table.organizationId, table.category),
  ]
);

export const notificationRelations = relations(notifications, ({ one }) => ({
  // org
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
