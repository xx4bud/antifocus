import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { organizations } from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// SUPPLIER ENUMS
// ==============================

export const SUPPLIER_STATUS = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
  blacklisted: "blacklisted",
} as const;

export type SupplierStatus =
  (typeof SUPPLIER_STATUS)[keyof typeof SUPPLIER_STATUS];

// ==============================
// SUPPLIERS
// ==============================

export const suppliers = pgTable(
  "suppliers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    code: text("code"), // internal supplier code
    email: text("email"),
    phoneNumber: text("phone_number"),
    contactPerson: text("contact_person"),

    // Indonesian tax
    taxId: text("tax_id"), // NPWP

    // payment terms
    paymentTermDays: integer("payment_term_days").default(30).notNull(),
    defaultCurrency: text("default_currency").default("IDR").notNull(),

    status: text("status").$type<SupplierStatus>().default("active").notNull(),
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
    uniqueIndex("suppliers_org_code_uidx").on(table.organizationId, table.code),
    index("suppliers_org_id_idx").on(table.organizationId),
    index("suppliers_status_idx").on(table.status),
  ]
);

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [suppliers.organizationId],
    references: [organizations.id],
  }),
  supplierProducts: many(supplierProducts),
}));

// ==============================
// SUPPLIER PRODUCTS
// ==============================

export const supplierProducts = pgTable(
  "supplier_products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    supplierId: text("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "cascade" }),
    productVariantId: text("product_variant_id").notNull(), // FK set in products.ts relations

    supplierSku: text("supplier_sku"),
    unitCost: numeric("unit_cost", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    currencyCode: text("currency_code").default("IDR").notNull(),
    moq: integer("moq").default(1).notNull(), // minimum order quantity
    leadTimeDays: integer("lead_time_days").default(7).notNull(),
    isPreferred: boolean("is_preferred").default(false).notNull(),
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
    uniqueIndex("supplier_products_supplier_variant_uidx").on(
      table.supplierId,
      table.productVariantId
    ),
    index("supplier_products_supplier_id_idx").on(table.supplierId),
    index("supplier_products_variant_id_idx").on(table.productVariantId),
  ]
);

export const supplierProductsRelations = relations(
  supplierProducts,
  ({ one }) => ({
    supplier: one(suppliers, {
      fields: [supplierProducts.supplierId],
      references: [suppliers.id],
    }),
  })
);
