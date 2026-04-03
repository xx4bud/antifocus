import type { InvitationStatus } from "better-auth/plugins";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/utils/ids";
import { users } from "./auth";

/**
 * Enums
 */
export const organizationStatusEnum = pgEnum("organization_status", [
  "pending",
  "active",
  "inactive",
  "banned",
  "deleted",
]);

export type OrganizationStatus =
  (typeof organizationStatusEnum.enumValues)[number];

export const memberStatusEnum = pgEnum("member_status", [
  "pending",
  "active",
  "inactive",
  "banned",
  "deleted",
]);

export type MemberStatus = (typeof memberStatusEnum.enumValues)[number];

/**
 * Organizations table
 */
export const organizations = pgTable(
  "organizations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    metadata: jsonb("metadata"),

    // additional fields
    status: organizationStatusEnum("status").default("pending").notNull(),
    settings: jsonb("settings"),

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
  (table) => [uniqueIndex("organizations_slug_uidx").on(table.slug)]
);

/**
 * Members table (Organization members)
 */
export const members = pgTable(
  "members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(), // ref: org_roles.role

    // additional fields
    status: memberStatusEnum("status").default("pending").notNull(),
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
    index("members_organization_id_idx").on(table.organizationId),
    index("members_user_id_idx").on(table.userId),
    index("members_status_idx").on(table.status),
  ]
);

/**
 * Invitations table (Organization invitations)
 */
export const invitations = pgTable(
  "invitations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status")
      .$type<InvitationStatus>()
      .default("pending")
      .notNull(),
    email: text("email").notNull(),
    role: text("role").default("member").notNull(), // ref: org_roles.role

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
  (table) => [
    index("invitations_org_id_idx").on(table.organizationId),
    index("invitations_email_idx").on(table.email),
  ]
);

/**
 * Organization roles table
 */
export const organizationRoles = pgTable(
  "org_roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    permission: jsonb("permission"),

    // additional fields
    system: boolean("system").default(false).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
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
  (table) => [
    uniqueIndex("org_roles_org_id_role_uidx").on(
      table.organizationId,
      table.role
    ),
    index("org_roles_org_id_idx").on(table.organizationId),
    index("org_roles_system_idx").on(table.system),
    index("org_roles_enabled_idx").on(table.enabled),
  ]
);

/**
 * Relations
 */
export const organizationsRelations = relations(organizations, ({ many }) => ({
  // better auth relations don't modify
  members: many(members),
  invitations: many(invitations),
  organizationRoles: many(organizationRoles),
  // add more relations here
}));

export const membersRelations = relations(members, ({ one }) => ({
  // better auth relations don't modify
  organizations: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  users: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  // add more relations here
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  // better auth relations don't modify
  organizations: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  users: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
  // add more relations here
}));

export const organizationRolesRelations = relations(
  organizationRoles,
  ({ one }) => ({
    // better auth relations don't modify
    organizations: one(organizations, {
      fields: [organizationRoles.organizationId],
      references: [organizations.id],
    }),
    // add more relations here
  })
);

/**
 * Types
 */
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type OrganizationRole = typeof organizationRoles.$inferSelect;
export type NewOrganizationRole = typeof organizationRoles.$inferInsert;
