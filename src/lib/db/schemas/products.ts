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
import { categoryProducts } from "~/lib/db/schemas/categories";
import { productMedias } from "~/lib/db/schemas/medias";
import { organizations } from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// PRODUCT ENUMS
// ==============================

export const PRODUCT_STATUS = {
  draft: "draft",
  active: "active",
  archived: "archived",
  discontinued: "discontinued",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRINT_TYPE = {
  dtg: "dtg", // Direct to Garment
  dtf: "dtf", // Direct to Film
  sublimation: "sublimation",
  screen: "screen", // Sablon
  vinyl: "vinyl", // Heat press vinyl
  offset: "offset",
  uv: "uv", // UV printing
  embroidery: "embroidery", // Bordir
  laser: "laser", // Laser engraving
  none: "none", // Non-print product (blank, accessories)
} as const;

export type PrintType = (typeof PRINT_TYPE)[keyof typeof PRINT_TYPE];

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

    // future marketplace: link to global catalog product
    globalProductId: text("global_product_id"),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    sku: text("sku"),

    // pricing (base — variants can override)
    basePrice: numeric("base_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    costPrice: numeric("cost_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 19, scale: 4 }),
    currencyCode: text("currency_code").default("IDR").notNull(),

    // physical
    weight: integer("weight"), // grams
    length: integer("length"), // mm
    width: integer("width"), // mm
    height: integer("height"), // mm

    // printing
    printType: text("print_type").$type<PrintType>().default("none").notNull(),

    // management
    status: text("status").$type<ProductStatus>().default("draft").notNull(),
    enabled: boolean("enabled").default(false).notNull(),
    isTaxable: boolean("is_taxable").default(true).notNull(),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 }), // e.g. 11.00 for PPN

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
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    uniqueIndex("products_slug_uidx").on(table.slug),
    uniqueIndex("products_org_sku_uidx").on(table.organizationId, table.sku),
    index("products_org_id_idx").on(table.organizationId),
    index("products_status_idx").on(table.status, table.enabled),
    index("products_print_type_idx").on(table.printType),
    index("products_global_product_id_idx").on(table.globalProductId),
  ]
);

export const productsRelations = relations(products, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  variants: many(productVariants),
  categories: many(categoryProducts),
  medias: many(productMedias),
  designAreas: many(productDesignAreas),
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

    name: text("name").notNull(), // e.g. "Putih / XL", "Hitam / M"
    sku: text("sku"),

    // pricing (overrides product base)
    price: numeric("price", { precision: 19, scale: 4 }).default("0").notNull(),
    costPrice: numeric("cost_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 19, scale: 4 }),

    // physical
    weight: integer("weight"), // grams
    length: integer("length"), // mm
    width: integer("width"), // mm
    height: integer("height"), // mm

    // attributes (jsonb: {color: "Hitam", size: "XL", material: "Cotton"})
    attributes: jsonb("attributes"),

    // stock (denormalized for quick queries — source of truth in inventory)
    stock: integer("stock").default(0).notNull(),
    lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),

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
    uniqueIndex("product_variants_product_sku_uidx").on(
      table.productId,
      table.sku
    ),
    index("product_variants_product_id_idx").on(table.productId),
    index("product_variants_enabled_idx").on(table.enabled),
  ]
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

// ==============================
// PRODUCT DESIGN AREAS
// ==============================

/**
 * Defines printable zones on a product.
 * For example, a t-shirt might have "Front", "Back", "Left Sleeve".
 */
export const productDesignAreas = pgTable(
  "product_design_areas",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    name: text("name").notNull(), // "Depan", "Belakang", "Lengan Kiri"
    code: text("code"), // "front", "back", "left_sleeve"

    // area dimensions (mm)
    width: integer("width"),
    height: integer("height"),
    positionX: integer("position_x").default(0).notNull(),
    positionY: integer("position_y").default(0).notNull(),

    // printing constraints
    maxColors: integer("max_colors"),
    printMethod: text("print_method").$type<PrintType>(),
    dpiRequired: integer("dpi_required"),

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
  (table) => [index("product_design_areas_product_id_idx").on(table.productId)]
);

export const productDesignAreasRelations = relations(
  productDesignAreas,
  ({ one }) => ({
    product: one(products, {
      fields: [productDesignAreas.productId],
      references: [products.id],
    }),
  })
);
