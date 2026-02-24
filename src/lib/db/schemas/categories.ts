import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { uuid } from "~/utils/ids";
import { organizations } from "./organizations";
import { products } from "./products";

// ==============================
// CATEGORIES
// ==============================

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    image: text("image"),
    parentId: text("parent_id"),

    enabled: boolean("enabled").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("categories_slug_idx").on(table.slug),
    index("categories_parentId_idx").on(table.parentId),
  ]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  organizations: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_tree",
  }),
  children: many(categories, { relationName: "category_tree" }),
  products: many(categoryProducts),
}));

// ==============================
// CATEGORY PRODUCTS
// ==============================

export const categoryProducts = pgTable(
  "category_products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    isPrimary: boolean("is_primary").default(false).notNull(),
    enabled: boolean("enabled").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("category_products_category_id_product_id_uidx").on(
      table.categoryId,
      table.productId
    ),
    index("category_products_category_id_idx").on(table.categoryId),
    index("category_products_product_id_idx").on(table.productId),
  ]
);

export const categoryProductsRelations = relations(
  categoryProducts,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoryProducts.categoryId],
      references: [categories.id],
    }),
    product: one(products, {
      fields: [categoryProducts.productId],
      references: [products.id],
    }),
  })
);
