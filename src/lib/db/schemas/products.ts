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
import { productCategories } from "~/lib/db/schemas/categories";
import type { ProductStatus } from "~/lib/db/schemas/constants";
import { productMedias, productVariantMedias } from "~/lib/db/schemas/medias";
import { orderItems } from "~/lib/db/schemas/orders";
import { organizations } from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// PRODUCTS
// ==============================

export const products = pgTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),

    // pricing
    basePrice: numeric("base_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    currency: text("currency").default("IDR").notNull(),

    // physical
    weight: integer("weight"), // grams
    dimensions: jsonb("dimensions"), // {length, width, height} in mm

    // management
    status: text("status").$type<ProductStatus>().default("draft").notNull(),
    enabled: boolean("enabled").default(false).notNull(),

    attributes: jsonb("attributes"),
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
    uniqueIndex("products_slug_uidx").on(table.slug),
    index("products_org_id_idx").on(table.organizationId),
    index("products_status_idx").on(table.status),
    index("products_enabled_idx").on(table.enabled),
  ]
);

export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  productMedias: many(productMedias),
  productVariants: many(productVariants),
  productCategories: many(productCategories),
  orderItems: many(orderItems),
}));

// ==============================
// PRODUCT VARIANTS
// ==============================

export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    sku: text("sku").unique(),

    // pricing
    price: numeric("price", { precision: 19, scale: 4 }).default("0").notNull(),

    // stock (denormalized for quick queries)
    stock: integer("stock").default(0).notNull(),

    // physical
    weight: integer("weight"), // grams
    dimensions: jsonb("dimensions"), // {length, width, height} in mm

    enabled: boolean("enabled").default(true).notNull(),
    position: integer("position").default(0).notNull(),

    attributes: jsonb("attributes"),
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
    uniqueIndex("product_variants_sku_uidx").on(table.sku),
    index("product_variants_product_id_idx").on(table.productId),
    index("product_variants_enabled_idx").on(table.enabled),
  ]
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    productVariantMedias: many(productVariantMedias),
    orderItems: many(orderItems),
  })
);
