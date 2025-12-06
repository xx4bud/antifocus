import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const userRole = pgEnum("user_role", [
  "user",
  "creator",
  "staff",
  "admin",
  "super_admin",
]);

// ============================================================================
// USERS
// ============================================================================

export const users = pgTable(
  "users",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    username: t.text().unique(),
    name: t.text().notNull(),
    email: t.text().unique().notNull(),
    phoneNumber: t.text().unique(),
    image: t.text(),
    displayUsername: t.text(),
    emailVerified: t.boolean().default(false).notNull(),
    phoneNumberVerified: t.boolean().default(false),
    twoFactorEnabled: t.boolean().default(false),
    role: userRole().default("user").notNull(),

    // Banning
    banned: t.boolean().default(false),
    banReason: t.text(),
    banExpires: t.timestamp(),

    // Audit trails
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_email_idx").on(table.email),
  ]
);

// ============================================================================
// ACCOUNTS
// ============================================================================

export const accounts = pgTable(
  "accounts",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    accessToken: t.text(),
    refreshToken: t.text(),
    idToken: t.text(),
    accessTokenExpiresAt: t.timestamp(),
    refreshTokenExpiresAt: t.timestamp(),
    scope: t.text(),
    password: t.text(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("accounts_user_idx").on(table.userId)]
);

// ============================================================================
// SESSIONS
// ============================================================================

export const sessions = pgTable(
  "sessions",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: t.text().notNull().unique(),
    impersonatedBy: t.text(),
    expiresAt: t.timestamp().notNull(),
    ipAddress: t.text(),
    userAgent: t.text(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("sessions_user_idx").on(table.userId)]
);

// ============================================================================
// VERIFICATIONS
// ============================================================================

export const verifications = pgTable("verifications", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
}));

// ============================================================================
// TWO FACTORS
// ============================================================================

export const twoFactors = pgTable(
  "two_factors",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    secret: t.text().notNull(),
    backupCodes: t.text().notNull(),
  }),
  (table) => [index("two_factor_user_idx").on(table.userId)]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  twoFactors: many(twoFactors),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const twoFactorsRelations = relations(twoFactors, ({ one }) => ({
  user: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}));
