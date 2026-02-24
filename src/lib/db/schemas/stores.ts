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
import { organizations } from "~/lib/db/schemas/organizations";
import { users } from "~/lib/db/schemas/users";
import { uuid } from "~/utils/ids";

// ==============================
// STORES
// ==============================

export const stores = pgTable(
  "stores",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name"),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    phoneNumber: text("phone_number"),
    address: text("address"),

    isWarehouse: boolean("is_warehouse").default(false).notNull(),
    enabled: boolean("enabled").default(false).notNull(),
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
  },
  (table) => [
    uniqueIndex("stores_org_id_slug_uidx").on(table.organizationId, table.slug),
    index("stores_org_id_idx").on(table.organizationId),
    index("stores_slug_idx").on(table.slug),
    index("stores_enabled_idx").on(table.enabled),
  ]
);

export const storesRelations = relations(stores, ({ one }) => ({
  organization: one(organizations, {
    fields: [stores.organizationId],
    references: [organizations.id],
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
    taxId: text("tax_id"), // NPWP for B2B invoicing

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
    uniqueIndex("customers_org_id_phone_number_uidx").on(
      table.organizationId,
      table.phoneNumber
    ),
    index("customers_org_id_idx").on(table.organizationId),
    index("customers_user_id_idx").on(table.userId),
  ]
);

export const customersRelations = relations(customers, ({ one }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));
