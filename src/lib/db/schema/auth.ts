import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import type { AuthSession, AuthUser } from "@/lib/auth";
import {
  falseColumn,
  idColumn,
  idx,
  jsonbColumn,
  timestampColumn,
  timestamps,
  trueColumn,
  uidx,
  varcharColumn,
} from "../helpers";
import { addresses, notifications } from "./core";
import {
  DEFAULT_ENTITY_STATUS,
  DEFAULT_USER_ROLE,
  type EntityStatus,
  type UserRole,
} from "./enums";
import { customers, invitations, members } from "./org";

// ==============================
// Better Auth Users
// ==============================

export const users = pgTable(
  "users",
  {
    id: idColumn(),
    name: varcharColumn("name").notNull(),
    email: varcharColumn("email").notNull().unique(),
    emailVerified: falseColumn("email_verified"),
    image: text("image"),
    ...timestamps,

    // username plugin
    username: varcharColumn("username").unique(),
    displayUsername: text("display_username"),

    // phone number plugin
    phoneNumber: varcharColumn("phone_number").unique(),
    phoneNumberVerified: falseColumn("phone_number_verified"),

    // two factor plugin
    twoFactorEnabled: falseColumn("two_factor_enabled"),

    // admin plugin
    role: text("role").$type<UserRole>().default(DEFAULT_USER_ROLE),
    banned: falseColumn("banned"),
    banReason: text("ban_reason"),
    banExpires: timestampColumn("ban_expires"),

    // custom fields
    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    metadata: jsonbColumn("metadata"), // profiles, preferences, settings
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("users", table.name),
    idx("users", table.role),
    idx("users", table.status),
  ]
);

export const userRelations = relations(users, ({ many }) => ({
  // auth
  sessions: many(sessions),
  accounts: many(accounts),
  twoFactors: many(twoFactors),

  // org
  members: many(members),
  invitations: many(invitations),
  customers: many(customers),

  // core
  addresses: many(addresses),
  notifications: many(notifications),
}));

export type User = AuthUser;
export type UserInsert = typeof users.$inferInsert;

// ==============================
// Better Auth Sessions
// ==============================

export const sessions = pgTable(
  "sessions",
  {
    id: idColumn(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    token: varcharColumn("token").notNull().unique(),
    expiresAt: timestampColumn("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    ...timestamps,

    // admin plugin
    impersonatedBy: text("impersonated_by"),

    // org plugin
    activeOrganizationId: text("active_organization_id"),

    // custom fields
    metadata: jsonbColumn("metadata"), // active_branch_id
  },
  (table) => [idx("sessions", table.userId), idx("sessions", table.token)]
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type Session = AuthSession;
export type SessionInsert = typeof sessions.$inferInsert;

// ==============================
// Better Auth Accounts
// ==============================

export const accounts = pgTable(
  "accounts",
  {
    id: idColumn(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(), // google, credentials, etc
    accountId: text("account_id").notNull(),
    ...timestamps,

    idToken: text("id_token"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestampColumn("access_token_expires_at"),
    refreshTokenExpiresAt: timestampColumn("refresh_token_expires_at"),

    scope: text("scope"),
    password: text("password"),

    // custom fields
    metadata: jsonbColumn("metadata"), // raw data
  },
  (table) => [
    uidx("accounts", table.userId, table.providerId, table.accountId),
    idx("accounts", table.userId),
  ]
);

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export type Account = typeof accounts.$inferSelect;
export type AccountInsert = typeof accounts.$inferInsert;

// ==============================
// Better Auth Verifications
// ==============================

export const verifications = pgTable(
  "verifications",
  {
    id: idColumn(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestampColumn("expires_at").notNull(),
    ...timestamps,

    // custom fields
    metadata: jsonbColumn("metadata"), // raw data
  },
  (table) => [idx("verifications", table.identifier)]
);

export type Verification = typeof verifications.$inferSelect;
export type VerificationInsert = typeof verifications.$inferInsert;

// ==============================
// Better Auth Two Factor
// ==============================

export const twoFactors = pgTable(
  "two_factors",
  {
    id: idColumn(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
  },
  (table) => [idx("two_factors", table.userId)]
);

export const twoFactorRelations = relations(twoFactors, ({ one }) => ({
  user: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}));

export type TwoFactor = typeof twoFactors.$inferSelect;
export type TwoFactorInsert = typeof twoFactors.$inferInsert;

// ==============================
// Better Auth API Keys
// ==============================

export const apikeys = pgTable(
  "apikeys",
  {
    id: idColumn(),
    configId: text("config_id").notNull().default("default"),
    referenceId: text("reference_id").notNull(),

    key: text("key").notNull(),
    name: varcharColumn("name"),
    start: text("start"),
    prefix: varcharColumn("prefix"),
    permissions: text("permissions"), // by better auth
    metadata: text("metadata"), // by better auth

    enabled: trueColumn("enabled"),
    rateLimitEnabled: trueColumn("rate_limit_enabled"),
    rateLimitTimeWindow: integer("rate_limit_time_window").default(60),
    rateLimitMax: integer("rate_limit_max").default(100),
    refillInterval: integer("refill_interval"),
    refillAmount: integer("refill_amount"),
    requestCount: integer("request_count").notNull().default(0),
    remaining: integer("remaining"),

    lastRefillAt: timestampColumn("last_refill_at"),
    lastRequest: timestampColumn("last_request"),
    expiresAt: timestampColumn("expires_at"),

    ...timestamps,
  },
  (table) => [
    idx("apikeys", table.configId),
    idx("apikeys", table.referenceId),
    idx("apikeys", table.key),
  ]
);

export type ApiKey = typeof apikeys.$inferSelect;
export type ApiKeyInsert = typeof apikeys.$inferInsert;
