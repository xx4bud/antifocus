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
import { invitations, members } from "./organization";

/**
 * Auth enums
 */
export const userStatusEnum = pgEnum("user_status", [
  "pending",
  "active",
  "inactive",
  "banned",
  "deleted",
]);

export type UserStatus = (typeof userStatusEnum.enumValues)[number];

/**
 * Admin plugin: user_roles table
 */
export const userRoles = pgTable(
  "user_roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    role: text("role").notNull().unique(),
    permission: jsonb("permission"),

    system: boolean("system").default(false).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_roles_role_idx").on(table.role),
    index("user_roles_system_idx").on(table.system),
    index("user_roles_enabled_idx").on(table.enabled),
  ]
);

/**
 * Better auth: users table
 */
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    name: text("name").notNull(), // full name
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"), // avatar url

    // username plugin
    username: text("username").unique(),
    displayUsername: text("display_username"),

    // phone number plugin
    phoneNumber: text("phone_number"),
    phoneNumberVerified: boolean("phone_number_verified")
      .default(false)
      .notNull(),

    // 2FA plugin
    twoFactorEnabled: boolean("two_factor_enabled").default(false),

    // admin plugin
    role: text("role").default("user").notNull(), // ref: user_roles table
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { withTimezone: true }),

    // additional fields
    status: userStatusEnum("status").default("pending").notNull(),
    settings: jsonb("settings"), // preferences
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("users_name_idx").on(table.name),
    index("users_role_idx").on(table.role),
    index("users_status_idx").on(table.status, table.banned, table.deletedAt),
  ]
);

/**
 * Better auth: accounts table
 */
export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // tokens
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),

    // additional fields
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)]
);

/**
 * Better auth: sessions table
 */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),

    // context
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // admin plugin
    impersonatedBy: text("impersonated_by"),

    // organization plugin
    activeOrganizationId: text("active_organization_id"),

    // additional fields
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

/**
 * Better auth: verifications table
 */
export const verifications = pgTable(
  "verifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    // additional fields
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)]
);

/**
 * 2FA plugin: two_factors table
 */
export const twoFactors = pgTable(
  "two_factors",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("two_factors_user_id_idx").on(table.userId),
    index("two_factors_secret_idx").on(table.secret),
  ]
);

/**
 * API Key plugin: apikeys table
 */
export const apikeys = pgTable(
  "apikeys",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    configId: text("config_id").default("default").notNull(),
    referenceId: text("reference_id").notNull(),
    name: text("name"),
    start: text("start"),
    prefix: text("prefix"),
    key: text("key").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    permissions: text("permissions"),
    metadata: text("metadata"),

    // rate limiting
    refillInterval: integer("refill_interval"),
    refillAmount: integer("refill_amount"),
    lastRefillAt: timestamp("last_refill_at", { withTimezone: true }),
    rateLimitEnabled: boolean("rate_limit_enabled").default(true).notNull(),
    rateLimitTimeWindow: integer("rate_limit_time_window")
      .default(86_400_000)
      .notNull(),
    rateLimitMax: integer("rate_limit_max").default(10).notNull(),
    requestCount: integer("request_count").default(0).notNull(),
    remaining: integer("remaining").notNull(),
    lastRequest: timestamp("last_request", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),

    // timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("apikeys_config_id_idx").on(table.configId),
    index("apikeys_reference_id_idx").on(table.referenceId),
    index("apikeys_key_idx").on(table.key),
  ]
);

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  // better auth relations don't modify
  sessions: many(sessions),
  accounts: many(accounts),
  twoFactors: many(twoFactors),
  members: many(members),
  invitations: many(invitations),
  // add more relations here
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  // better auth relations don't modify
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  // add more relations here
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // better auth relations don't modify
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  // add more relations here
}));

export const twoFactorsRelations = relations(twoFactors, ({ one }) => ({
  // better auth relations don't modify
  users: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
  // add more relations here
}));

/**
 * Types
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

export type TwoFactor = typeof twoFactors.$inferSelect;
export type NewTwoFactor = typeof twoFactors.$inferInsert;

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;

export type ApiKey = typeof apikeys.$inferSelect;
export type NewApiKey = typeof apikeys.$inferInsert;
