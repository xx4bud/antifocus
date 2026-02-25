import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { UserStatus } from "~/lib/db/schemas/constants";
import {
  customers,
  invitations,
  members,
} from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// USER ROLES (global)
// ==============================

export const userRoles = pgTable(
  "user_roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    role: text("role").notNull().unique(),
    permission: jsonb("permission").notNull(),
    metadata: jsonb("metadata"),

    isSystem: boolean("is_system").default(false).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    position: text("position"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("user_roles_role_idx").on(table.role),
    index("user_roles_enabled_idx").on(table.enabled),
  ]
);

// ==============================
// BETTER-AUTH USERS
// ==============================

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),

    // username plugin
    username: text("username").unique(),
    displayUsername: text("display_username"),

    // phone number plugin
    phoneNumber: text("phone_number").unique(),
    phoneNumberVerified: boolean("phone_number_verified")
      .default(false)
      .notNull(),

    // admin plugin
    role: text("role").default("user").notNull(),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { mode: "date", withTimezone: true }),

    // 2fa plugin
    twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),

    // additional fields
    status: text("status").$type<UserStatus>().default("pending").notNull(),
    settings: jsonb("settings"),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    // soft delete
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    uniqueIndex("users_email_uidx").on(table.email),
    uniqueIndex("users_username_uidx").on(table.username),
    uniqueIndex("users_phone_number_uidx").on(table.phoneNumber),
    index("users_name_idx").on(table.name),
    index("users_role_idx").on(table.role),
    index("users_status_idx").on(table.status, table.banned),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  members: many(members),
  invitations: many(invitations),
  customers: many(customers),
}));

// ==============================
// BETTER-AUTH SESSIONS
// ==============================

export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"),

    // admin plugin
    impersonatedBy: text("impersonated_by"),

    // organization plugin
    activeOrganizationId: text("active_organization_id"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_uidx").on(table.token),
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_impersonated_by_idx").on(table.impersonatedBy),
    index("sessions_active_organization_id_idx").on(table.activeOrganizationId),
  ]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// ==============================
// BETTER-AUTH ACCOUNTS
// ==============================

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    providerId: text("provider_id").notNull(),
    accountId: text("account_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    metadata: jsonb("metadata"),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "date",
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "date",
      withTimezone: true,
    }),

    // credential provider
    scope: text("scope"),
    password: text("password"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("accounts_provider_id_account_id_uidx").on(
      table.providerId,
      table.accountId
    ),
    index("accounts_provider_id_idx").on(table.providerId),
    index("accounts_account_id_idx").on(table.accountId),
    index("accounts_user_id_idx").on(table.userId),
  ]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// ==============================
// BETTER-AUTH VERIFICATIONS
// ==============================

export const verifications = pgTable(
  "verifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)]
);

// ==============================
// ACTIVITY LOGS
// ==============================

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    type: text("type").default("system").notNull(),
    actor: text("actor"),

    entity: text("entity").notNull(),
    action: text("action").notNull(),

    changes: jsonb("changes"),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("activity_logs_type_idx").on(table.type),
    index("activity_logs_actor_idx").on(table.actor),
    index("activity_logs_entity_idx").on(table.entity),
    index("activity_logs_action_idx").on(table.action),
  ]
);
