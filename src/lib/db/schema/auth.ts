import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import type { AuthSession, AuthUser } from "@/lib/auth";
import { idColumn, timestampColumn, timestamptz } from "../helpers";
import {
  DEFAULT_ENTITY_STATUS,
  DEFAULT_USER_ROLE,
  type EntityStatus,
  type UserRole,
} from "./enums";
import { invitations, members } from "./org";

// ==============================
// Better Auth Users
// ==============================

export const users = pgTable(
  "users",
  {
    id: idColumn(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    ...timestampColumn(),

    // username plugin
    username: varchar("username", { length: 255 }).unique(),
    displayUsername: text("display_username"),

    // phone number plugin
    phoneNumber: varchar("phone_number", { length: 255 }).unique(),
    phoneNumberVerified: boolean("phone_number_verified")
      .notNull()
      .default(false),

    // two factor plugin
    twoFactorEnabled: boolean("two_factor_enabled").default(false),

    // admin plugin
    role: text("role").$type<UserRole>().default(DEFAULT_USER_ROLE),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamptz("ban_expires"),

    // custom fields
    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    metadata: jsonb("metadata"), // profiles, preferences, settings
    deletedAt: timestamptz("deleted_at"),
  },
  (table) => [
    index("users_name_idx").on(table.name),
    index("users_role_idx").on(table.role),
    index("users_status_idx").on(table.status),
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

    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamptz("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    ...timestampColumn(),

    // admin plugin
    impersonatedBy: text("impersonated_by"),

    // org plugin
    activeOrganizationId: text("active_organization_id"),

    // custom fields
    metadata: jsonb("metadata"), // active_branch_id
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_token_idx").on(table.token),
  ]
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
    ...timestampColumn(),

    idToken: text("id_token"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamptz("access_token_expires_at"),
    refreshTokenExpiresAt: timestamptz("refresh_token_expires_at"),

    scope: text("scope"),
    password: text("password"),

    // custom fields
    metadata: jsonb("metadata"), // raw data
  },
  (table) => [index("accounts_user_id_idx").on(table.userId)]
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
    expiresAt: timestamptz("expires_at").notNull(),
    ...timestampColumn(),

    // custom fields
    metadata: jsonb("metadata"), // raw data
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)]
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
  (table) => [index("two_factors_user_id_idx").on(table.userId)]
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
    id: text("id").primaryKey(),
    configId: text("config_id").notNull().default("default"),
    referenceId: text("reference_id").notNull(), // polymorphic

    key: text("key").notNull(),
    name: text("name"),
    start: text("start"),
    prefix: text("prefix"),
    permissions: text("permissions"), // by better auth
    metadata: text("metadata"), // by better auth

    enabled: boolean("enabled").notNull().default(true),
    rateLimitEnabled: boolean("rate_limit_enabled").notNull().default(true),
    rateLimitTimeWindow: integer("rate_limit_time_window").default(60),
    rateLimitMax: integer("rate_limit_max").default(100),
    refillInterval: integer("refill_interval"),
    refillAmount: integer("refill_amount"),
    requestCount: integer("request_count").notNull().default(0),
    remaining: integer("remaining"),

    lastRefillAt: timestamptz("last_refill_at"),
    lastRequest: timestamptz("last_request"),
    expiresAt: timestamptz("expires_at"),

    ...timestampColumn(),
  },
  (table) => [
    index("apikeys_config_id_idx").on(table.configId),
    index("apikeys_reference_id_idx").on(table.referenceId),
    index("apikeys_key_idx").on(table.key),
  ]
);

export type ApiKey = typeof apikeys.$inferSelect;
export type ApiKeyInsert = typeof apikeys.$inferInsert;
