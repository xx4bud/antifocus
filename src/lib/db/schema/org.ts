import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import type { AuthInvitation, AuthMember, AuthOrg } from "@/lib/auth";
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
import { costlists, pricelists, products } from "./catalog";
import {
  addresses,
  auditLogs,
  files,
  integrations,
  notifications,
  sequences,
  settings,
  webhooks,
} from "./core";
import {
  type BranchStatus,
  DEFAULT_BRANCH_STATUS,
  DEFAULT_ENTITY_STATUS,
  DEFAULT_INVITATION_STATUS,
  DEFAULT_ORG_ROLE,
  type EntityStatus,
  type InvitationStatus,
  type OrgRole,
} from "./enums";
import {
  expenseCategories,
  expenses,
  invoices,
  paymentMethods,
  payments,
  supplierBills,
  taxRates,
} from "./finance";
import {
  banners,
  postCategories,
  posts,
  promotions,
  promotionUsages,
  reviews,
  tickets,
  vouchers,
} from "./marketing";
import {
  fulfillments,
  orderChannels,
  orderReturns,
  orderSessions,
  orders,
} from "./order";
import {
  billOfMaterials,
  productionOrders,
  productionTasks,
} from "./production";
import {
  couriers,
  inventories,
  inventoryMovements,
  inventoryTransfers,
  purchaseOrders,
} from "./supply";
import { attributes, categories, collections, tags, units } from "./taxonomy";

// ==============================
// Better Auth Organizations
// ==============================

export const organizations = pgTable(
  "organizations",
  {
    id: idColumn(),
    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull().unique(),
    logo: text("logo"),
    ...timestamps,

    // custom fields
    metadata: jsonbColumn("metadata"),
    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("organizations", table.slug),
    idx("organizations", table.name),
  ]
);

export const organizationRelations = relations(organizations, ({ many }) => ({
  // org
  organizationRoles: many(organizationRoles),
  members: many(members),
  invitations: many(invitations),
  branches: many(branches),
  customers: many(customers),
  suppliers: many(suppliers),

  // core
  auditLogs: many(auditLogs),
  files: many(files),
  addresses: many(addresses),
  sequences: many(sequences),
  settings: many(settings),
  integrations: many(integrations),
  webhooks: many(webhooks),
  notifications: many(notifications),

  // taxonomy
  tags: many(tags),
  attributes: many(attributes),
  categories: many(categories),
  collections: many(collections),
  units: many(units),

  // catalog
  products: many(products),
  pricelists: many(pricelists),
  costlists: many(costlists),

  // finance
  taxRates: many(taxRates),
  paymentMethods: many(paymentMethods),
  invoices: many(invoices),
  supplierBills: many(supplierBills),
  expenseCategories: many(expenseCategories),
  expenses: many(expenses),
  payments: many(payments),

  // supply
  couriers: many(couriers),
  purchaseOrders: many(purchaseOrders),
  inventories: many(inventories),
  inventoryMovements: many(inventoryMovements),
  inventoryTransfers: many(inventoryTransfers),

  // order
  orderChannels: many(orderChannels),
  orders: many(orders),
  orderSessions: many(orderSessions),
  fulfillments: many(fulfillments),
  orderReturns: many(orderReturns),

  // production
  billOfMaterials: many(billOfMaterials),
  productionOrders: many(productionOrders),
  productionTasks: many(productionTasks),

  // marketing
  promotions: many(promotions),
  vouchers: many(vouchers),
  promotionUsages: many(promotionUsages),
  banners: many(banners),
  reviews: many(reviews),
  postCategories: many(postCategories),
  posts: many(posts),
  tickets: many(tickets),
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
    system: falseColumn("system"),
    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),
    ...timestamps,
  },
  (table) => [
    idx("organization_roles", table.organizationId),
    uidx("organization_roles", table.organizationId, table.role),
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
    ...timestamps,

    // custom fields
    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    metadata: jsonbColumn("metadata"),
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("members", table.organizationId),
    idx("members", table.userId),
    uidx("members", table.organizationId, table.userId),
  ]
);

export const memberRelations = relations(members, ({ one, many }) => ({
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

  // org
  branchMembers: many(branchMembers),

  // core
  addresses: many(addresses),

  // order
  orderSessions: many(orderSessions),

  // production
  productionTasks: many(productionTasks),

  // marketing
  posts: many(posts),
  assignedTickets: many(tickets),
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

    email: varcharColumn("email").notNull(),
    role: text("role").$type<OrgRole>().default(DEFAULT_ORG_ROLE),
    status: text("status")
      .$type<InvitationStatus>()
      .default(DEFAULT_INVITATION_STATUS)
      .notNull(),
    expiresAt: timestampColumn("expires_at").notNull(),
    ...timestamps,

    // custom fields
    metadata: jsonbColumn("metadata"),
  },
  (table) => [
    idx("invitations", table.organizationId),
    idx("invitations", table.inviterId),
    idx("invitations", table.email),
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

// ==============================
// Branches
// ==============================

export const branches = pgTable(
  "branches",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code"),
    phoneNumber: varcharColumn("phone_number"),
    email: varcharColumn("email"),

    logo: text("logo"),
    cover: text("cover"),

    rating: decimalColumn("rating", 3, 2),
    reviewCount: intColumn("review_count"),

    status: text("status")
      .$type<BranchStatus>()
      .default(DEFAULT_BRANCH_STATUS)
      .notNull(),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("branches", table.organizationId),
    uidx("branches", table.organizationId, table.name),
  ]
);

export const branchRelations = relations(branches, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [branches.organizationId],
    references: [organizations.id],
  }),

  // org
  members: many(branchMembers),

  // core
  addresses: many(addresses),
  sequences: many(sequences),

  // finance
  paymentMethods: many(paymentMethods),

  // order
  orders: many(orders),
  orderSessions: many(orderSessions),

  // production
  productionOrders: many(productionOrders),

  // supply
  purchaseOrders: many(purchaseOrders),
  inventories: many(inventories),
  inventoryMovements: many(inventoryMovements),

  // transfers (inventoryTransfers)
  transfersSent: many(inventoryTransfers, { relationName: "transfer_source" }),
  transfersReceived: many(inventoryTransfers, {
    relationName: "transfer_destination",
  }),

  // order
  fulfillments: many(fulfillments),
  orderReturns: many(orderReturns),

  // finance
  expenses: many(expenses),

  // marketing
  tickets: many(tickets),
  reviews: many(reviews),
}));

export type Branch = typeof branches.$inferSelect;
export type BranchInsert = typeof branches.$inferInsert;

// ==============================
// Branch Members
// ==============================

export const branchMembers = pgTable(
  "branch_members",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("branch_members", table.branchId),
    idx("branch_members", table.memberId),
    uidx(
      "branch_members",
      table.organizationId,
      table.branchId,
      table.memberId
    ),
  ]
);

export const branchMemberRelations = relations(branchMembers, ({ one }) => ({
  branch: one(branches, {
    fields: [branchMembers.branchId],
    references: [branches.id],
  }),
  member: one(members, {
    fields: [branchMembers.memberId],
    references: [members.id],
  }),
}));

export type BranchMember = typeof branchMembers.$inferSelect;
export type BranchMemberInsert = typeof branchMembers.$inferInsert;

// ==============================
// Customers
// ==============================

export const customers = pgTable(
  "customers",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code"),
    phoneNumber: varcharColumn("phone_number").notNull(),
    email: varcharColumn("email"),

    image: text("image"),

    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("customers", table.organizationId),
    idx("customers", table.userId),
    uidx("customers", table.organizationId, table.phoneNumber),
    uidx("customers", table.organizationId, table.email),
  ]
);

export const customerRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),

  // core
  addresses: many(addresses),

  // marketing
  promotionUsages: many(promotionUsages),
  reviews: many(reviews),
  tickets: many(tickets),
}));

export type Customer = typeof customers.$inferSelect;
export type CustomerInsert = typeof customers.$inferInsert;

// ==============================
// Suppliers
// ==============================

export const suppliers = pgTable(
  "suppliers",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code"),
    phoneNumber: varcharColumn("phone_number").notNull(),
    email: varcharColumn("email"),

    status: text("status")
      .$type<EntityStatus>()
      .default(DEFAULT_ENTITY_STATUS)
      .notNull(),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("suppliers", table.organizationId),
    uidx("suppliers", table.organizationId, table.phoneNumber),
    uidx("suppliers", table.organizationId, table.email),
  ]
);

export const supplierRelations = relations(suppliers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [suppliers.organizationId],
    references: [organizations.id],
  }),

  // core
  addresses: many(addresses),

  // catalog
  costlists: many(costlists),

  // production
  productionOrders: many(productionOrders),

  // supply
  purchaseOrders: many(purchaseOrders),

  // finance
  supplierBills: many(supplierBills),
}));

export type Supplier = typeof suppliers.$inferSelect;
export type SupplierInsert = typeof suppliers.$inferInsert;
