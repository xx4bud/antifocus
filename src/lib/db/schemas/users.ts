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
import {
  accounts,
  apikeys,
  sessions,
  twoFactors,
} from "~/lib/db/schemas/auths";
import { invitations, members } from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// USER ENUMS
// ==============================

export const USER_STATUS = {
  pending: "pending",
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
  deleted: "deleted",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

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

    // two factor plugin
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
    index("users_role_idx").on(table.role),
    index("users_status_idx").on(table.status, table.banned),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  members: many(members),
  invitations: many(invitations),
  twoFactors: many(twoFactors),
  apikeys: many(apikeys),
}));

// ==============================
// USER ROLES (global)
// ==============================

export const userRoles = pgTable(
  "user_roles",
  {
    id: text("id").primaryKey(),
    role: text("role").notNull(),
    permission: jsonb("permission"),
    metadata: jsonb("metadata"),

    isSystem: boolean("is_system").default(false).notNull(),
    enabled: boolean("enabled").default(true).notNull(),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_roles_role_idx").on(table.role)]
);
