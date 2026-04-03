import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/utils/ids";
import { organizations } from "./organization";

/**
 * Product enums
 */
export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
  "deleted",
]);

export const productTypeEnum = pgEnum("product_type", [
  "physical",
  "digital",
  "service",
]);

export const productCategoryStatusEnum = pgEnum("product_category_status", [
  "active",
  "inactive",
]);

/**
 * Product categories table
 */
export const productCategories = pgTable(
  "product_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    image: text("image"), // category image URL
    parentId: text("parent_id"), // self-reference for subcategories - relation defined separately

    status: productCategoryStatusEnum("status").default("active").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    metadata: jsonb("metadata"),

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
    index("product_categories_org_id_idx").on(table.organizationId),
    index("product_categories_parent_id_idx").on(table.parentId),
    index("product_categories_slug_idx").on(table.slug),
    index("product_categories_status_idx").on(table.status),
  ]
);

/**
 * Products table
 */
export const products = pgTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => productCategories.id),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),

    type: productTypeEnum("type").default("physical").notNull(),
    status: productStatusEnum("status").default("draft").notNull(),

    // Pricing
    basePrice: integer("base_price").notNull(), // in sen
    compareAtPrice: integer("compare_at_price"), // in sen
    costPrice: integer("cost_price"), // in sen

    // Inventory
    sku: text("sku").unique(),
    barcode: text("barcode"),
    trackInventory: boolean("track_inventory").default(true).notNull(),
    inventoryQuantity: integer("inventory_quantity").default(0).notNull(),
    inventoryLowStockThreshold: integer(
      "inventory_low_stock_threshold"
    ).default(10),

    // Media
    images: jsonb("images").$type<string[]>(), // array of image URLs
    featuredImage: text("featured_image"), // main product image

    // Shipping
    weight: integer("weight"), // in grams
    dimensions: jsonb("dimensions").$type<{
      length: number;
      width: number;
      height: number;
    }>(), // in cm

    // SEO
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    seoKeywords: jsonb("seo_keywords").$type<string[]>(),

    // Additional
    tags: jsonb("tags").$type<string[]>(),
    attributes: jsonb("attributes"), // custom attributes
    metadata: jsonb("metadata"),

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
    index("products_org_id_idx").on(table.organizationId),
    index("products_category_id_idx").on(table.categoryId),
    index("products_slug_idx").on(table.slug),
    index("products_status_idx").on(table.status),
    index("products_type_idx").on(table.type),
    index("products_sku_idx").on(table.sku),
    index("products_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Product variants table
 */
export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    name: text("name").notNull(), // e.g., "Small / Red"
    sku: text("sku"),
    barcode: text("barcode"),

    // Pricing
    price: integer("price").notNull(), // in sen, can override product price
    compareAtPrice: integer("compare_at_price"), // in sen

    // Inventory
    inventoryQuantity: integer("inventory_quantity").default(0).notNull(),
    inventoryPolicy: text("inventory_policy").default("deny").notNull(), // "allow" or "deny"

    // Options
    options: jsonb("options").$type<Record<string, string>>(), // e.g., { "Size": "Small", "Color": "Red" }

    // Media
    image: text("image"), // variant-specific image

    // Additional
    position: integer("position").default(0).notNull(),
    available: boolean("available").default(true).notNull(),
    metadata: jsonb("metadata"),

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
    index("product_variants_product_id_idx").on(table.productId),
    index("product_variants_sku_idx").on(table.sku),
  ]
);

/**
 * Product templates table (for design templates)
 */
export const productTemplates = pgTable(
  "product_templates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    description: text("description"),
    category: text("category"), // e.g., "t-shirt", "mug", "poster"

    // Template configuration
    config: jsonb("config").$type<{
      dimensions: { width: number; height: number };
      printArea: { x: number; y: number; width: number; height: number };
      supportedFormats: string[];
    }>(),

    // Preview
    previewImage: text("preview_image"),
    thumbnail: text("thumbnail"),

    // Status
    isPublic: boolean("is_public").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    metadata: jsonb("metadata"),

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
    index("product_templates_org_id_idx").on(table.organizationId),
    index("product_templates_category_idx").on(table.category),
    index("product_templates_public_idx").on(table.isPublic),
    index("product_templates_active_idx").on(table.isActive),
  ]
);

/**
 * Relations
 */
export const productCategoriesRelations = relations(
  productCategories,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [productCategories.organizationId],
      references: [organizations.id],
    }),
    parent: one(productCategories, {
      fields: [productCategories.parentId],
      references: [productCategories.id],
    }),
    children: many(productCategories),
    products: many(products),
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  variants: many(productVariants),
  template: one(productTemplates, {
    fields: [products.id], // This might need adjustment based on actual relationship
    references: [productTemplates.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

export const productTemplatesRelations = relations(
  productTemplates,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [productTemplates.organizationId],
      references: [organizations.id],
    }),
    products: many(products),
  })
);

/**
 * Types
 */
export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductTemplate = typeof productTemplates.$inferSelect;
export type NewProductTemplate = typeof productTemplates.$inferInsert;
