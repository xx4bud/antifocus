import { relations } from "drizzle-orm";
import { boolean, index, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import type { AuthInvitation, AuthMember, AuthOrg } from "@/lib/auth";
import { idColumn, timestampColumn, timestamptz } from "../helpers";
import { users } from "./auth";
import {
  DEFAULT_ENTITY_STATUS,
  DEFAULT_INVITATION_STATUS,
  DEFAULT_ORG_ROLE,
  type EntityStatus,
  type InvitationStatus,
  type OrgRole,
} from "./enums";

// ==============================
// Better Auth Organizations
// ==============================

export const organizations = pgTable(
  "organizations",
  {
    id: idColumn(),
    name: text("name").notNull(),
    slug: text("slug").unique(),
    logo: text("logo"),
    ...timestampColumn(),

    // custom fields
    metadata: jsonb("metadata"), // profiles, preferences, settings
    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    deletedAt: timestamptz("deleted_at"),
  },
  (table) => [index("organizations_slug_idx").on(table.slug)]
);

export const organizationRelations = relations(organizations, ({ many }) => ({
  // org
  organizationRoles: many(organizationRoles),
  members: many(members),
  invitations: many(invitations),
}));

export type Organization = typeof organizations.$inferSelect;
export type OrganizationInsert = typeof organizations.$inferInsert;

// ==============================
// Better Auth Organization Roles
// ==============================

export const organizationRoles = pgTable(
  "organization_roles",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    permission: text("permission"), // by better auth

    // custom fields
    system: boolean("system").notNull().default(false),
    enabled: boolean("enabled").default(true),
    metadata: jsonb("metadata"),
    ...timestampColumn(),
  },
  (table) => [
    index("organization_roles_organization_id_idx").on(table.organizationId),
  ]
);

export const organizationRoleRelations = relations(
  organizationRoles,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationRoles.organizationId],
      references: [organizations.id],
    }),
  })
);

export type OrganizationRole = AuthOrg;
export type OrganizationRoleInsert = typeof organizationRoles.$inferInsert;

// ==============================
// Better Auth Members
// ==============================

export const members = pgTable(
  "members",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: text("role").$type<OrgRole>().default(DEFAULT_ORG_ROLE).notNull(),
    ...timestampColumn(),

    // custom fields
    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    metadata: jsonb("metadata"), // notes
    deletedAt: timestamptz("deleted_at"),
  },
  (table) => [
    index("members_organization_id_idx").on(table.organizationId),
    index("members_user_id_idx").on(table.userId),
  ]
);

export const memberRelations = relations(members, ({ one }) => ({
  // org
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),

  // auth
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export type Member = AuthMember;
export type MemberInsert = typeof members.$inferInsert;

// ==============================
// Better Auth Invitations
// ==============================

export const invitations = pgTable(
  "invitations",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    email: text("email").notNull(),
    role: text("role").$type<OrgRole>().default(DEFAULT_ORG_ROLE),
    status: text("status")
      .$type<InvitationStatus>()
      .default(DEFAULT_INVITATION_STATUS)
      .notNull(),
    expiresAt: timestamptz("expires_at").notNull(),
    ...timestampColumn(),

    // custom fields
    metadata: jsonb("metadata"), // branch_id
  },
  (table) => [
    index("invitations_organization_id_idx").on(table.organizationId),
    index("invitations_email_idx").on(table.email),
  ]
);

export const invitationRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

export type Invitation = AuthInvitation;
export type InvitationInsert = typeof invitations.$inferInsert;
