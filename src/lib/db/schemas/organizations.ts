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
import { users } from "~/lib/db/schemas/auths";
import { categories } from "~/lib/db/schemas/categories";
import type {
  InvitationStatus,
  OrganizationStatus,
} from "~/lib/db/schemas/constants";
import { medias } from "~/lib/db/schemas/medias";
import { orders } from "~/lib/db/schemas/orders";
import { payments, refunds } from "~/lib/db/schemas/payments";
import { products } from "~/lib/db/schemas/products";
import { uuid } from "~/utils/ids";

// ==============================
// BETTER-AUTH ORGANIZATIONS
// ==============================

export const organizations = pgTable(
  "organizations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),

    status: text("status")
      .$type<OrganizationStatus>()
      .default("pending")
      .notNull(),
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
    uniqueIndex("organizations_slug_uidx").on(table.slug),
    index("organizations_name_idx").on(table.name),
    index("organizations_status_idx").on(table.status),
  ]
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  organizationRoles: many(organizationRoles),
  members: many(members),
  invitations: many(invitations),
  customers: many(customers),
  medias: many(medias),
  products: many(products),
  categories: many(categories),
  orders: many(orders),
  payments: many(payments),
  refunds: many(refunds),
}));

// ==============================
// BETTER-AUTH ORGANIZATION ROLES
// ==============================

export const organizationRoles = pgTable(
  "org_roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
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
    uniqueIndex("org_roles_org_id_role_uidx").on(
      table.organizationId,
      table.role
    ),
    index("org_roles_org_id_idx").on(table.organizationId),
    index("org_roles_role_idx").on(table.role),
    index("org_roles_enabled_idx").on(table.enabled),
  ]
);

export const organizationRolesRelations = relations(
  organizationRoles,
  ({ one }) => ({
    organizations: one(organizations, {
      fields: [organizationRoles.organizationId],
      references: [organizations.id],
    }),
  })
);

// ==============================
// BETTER-AUTH MEMBERS
// ==============================

export const members = pgTable(
  "members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: text("role").default("member").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
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
  (table) => [
    uniqueIndex("members_org_id_user_id_uidx").on(
      table.organizationId,
      table.userId
    ),
    index("members_org_id_idx").on(table.organizationId),
    index("members_user_id_idx").on(table.userId),
    index("members_enabled_idx").on(table.enabled),
  ]
);

export const membersRelations = relations(members, ({ one, many }) => ({
  organizations: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  users: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  refunds: many(refunds),
}));

// ==============================
// BETTER-AUTH INVITATIONS
// ==============================

export const invitations = pgTable(
  "invitations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    email: text("email").notNull(),
    role: text("role").default("member").notNull(),
    status: text("status")
      .$type<InvitationStatus>()
      .default("pending")
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
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
  (table) => [
    index("invitations_org_id_idx").on(table.organizationId),
    index("invitations_inviter_id_idx").on(table.inviterId),
    index("invitations_email_idx").on(table.email),
  ]
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organizations: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  users: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

// ==============================
// CUSTOMERS
// ==============================

export const customers = pgTable(
  "customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    name: text("name"),
    email: text("email"),
    phoneNumber: text("phone_number"),

    enabled: boolean("enabled").default(true).notNull(),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    uniqueIndex("customers_org_id_user_id_uidx").on(
      table.organizationId,
      table.userId
    ),
    index("customers_org_id_idx").on(table.organizationId),
    index("customers_user_id_idx").on(table.userId),
  ]
);

export const customersRelations = relations(customers, ({ one, many }) => ({
  organizations: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  users: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  orders: many(orders),
}));
