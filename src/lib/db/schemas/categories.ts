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
import { organizations } from "~/lib/db/schemas/organizations";
import { products } from "~/lib/db/schemas/products";
import { uuid } from "~/utils/ids";

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
      onDelete: "set null",
    }),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    image: text("image"),

    parentId: text("parent_id"),

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
    uniqueIndex("categories_slug_uidx").on(table.slug),
    index("categories_org_id_idx").on(table.organizationId),
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_enabled_idx").on(table.enabled),
  ]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_tree",
  }),
  children: many(categories, { relationName: "category_tree" }),
  productCategories: many(productCategories),
}));

// ==============================
// PRODUCT CATEGORIES
// ==============================

export const productCategories = pgTable(
  "product_categories",
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
    enabled: boolean("enabled").default(true).notNull(),
    position: integer("position").default(0).notNull(),

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
    uniqueIndex("product_categories_category_id_product_id_uidx").on(
      table.categoryId,
      table.productId
    ),
    index("product_categories_category_id_idx").on(table.categoryId),
    index("product_categories_product_id_idx").on(table.productId),
  ]
);

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
  })
);
