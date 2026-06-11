import { relations } from "drizzle-orm";
import { type PgColumn, pgTable, text } from "drizzle-orm/pg-core";
import {
  decimalColumn,
  falseColumn,
  idColumn,
  idx,
  intColumn,
  jsonbColumn,
  numColumn,
  timestampColumn,
  timestamps,
  trueColumn,
  uidx,
  varcharColumn,
} from "../helpers";
import { files } from "./core";
import {
  DEFAULT_PRODUCT_STATUS,
  DEFAULT_PRODUCT_TYPE,
  type ProductStatus,
  type ProductType,
} from "./enums";
import { promotionProducts, reviews } from "./marketing";
import { orderItemDesigns, orderItems } from "./order";
import { organizations } from "./org";
import { billOfMaterials, bomItems, productionOrderItems } from "./production";
import {
  inventories,
  inventoryMovements,
  inventoryTransferItems,
  purchaseOrderItems,
} from "./supply";
import {
  attributeOptions,
  attributes,
  categories,
  collections,
  tags,
  units,
} from "./taxonomy";

// ==============================
// Products
// ==============================

export const products = pgTable(
  "products",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    unitId: text("unit_id").references(() => units.id, {
      onDelete: "restrict",
    }),
    taxRateId: text("tax_rate_id"),

    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull(),

    rating: decimalColumn("rating", 3, 2).notNull().default(0),
    reviewCount: intColumn("review_count").notNull().default(0),
    viewCount: intColumn("view_count").notNull().default(0),
    saleCount: intColumn("sale_count").notNull().default(0),

    status: text("status")
      .$type<ProductStatus>()
      .default(DEFAULT_PRODUCT_STATUS)
      .notNull(),
    type: text("type")
      .$type<ProductType>()
      .default(DEFAULT_PRODUCT_TYPE)
      .notNull(),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("products", table.organizationId),
    idx("products", table.slug),
    idx("products", table.unitId),
    idx("products", table.status),
    uidx("products", table.organizationId, table.slug),
  ]
);

export const productRelations = relations(products, ({ one, many }) => ({
  // catalog
  unit: one(units, {
    fields: [products.unitId],
    references: [units.id],
  }),

  // core
  images: many(productImages),
  tags: many(productTags),
  categories: many(productCategories),
  attributes: many(productAttributes),
  collections: many(productCollections),
  variants: many(variants),
  designAreas: many(designAreas),

  // marketing
  promotionProducts: many(promotionProducts),
  reviews: many(reviews),
}));

export type Product = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;

// ==============================
// Product Images
// ==============================

export const productImages = pgTable(
  "product_images",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    fileId: text("file_id").notNull(),

    main: falseColumn("main"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("product_images", table.productId),
    idx("product_images", table.fileId),
    uidx("product_images", table.productId, table.fileId),
  ]
);

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  file: one(files, {
    fields: [productImages.fileId],
    references: [files.id],
  }),
}));

export type ProductImage = typeof productImages.$inferSelect;
export type ProductImageInsert = typeof productImages.$inferInsert;

// ==============================
// Product Tags
// ==============================

export const productTags = pgTable(
  "product_tags",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),

    main: falseColumn("main"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("product_tags", table.productId),
    idx("product_tags", table.tagId),
    uidx("product_tags", table.productId, table.tagId),
  ]
);

export const productTagRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export type ProductTag = typeof productTags.$inferSelect;
export type ProductTagInsert = typeof productTags.$inferInsert;

// ==============================
// Product Categories
// ==============================

export const productCategories = pgTable(
  "product_categories",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),

    main: falseColumn("main"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("product_categories", table.productId),
    idx("product_categories", table.categoryId),
    uidx("product_categories", table.productId, table.categoryId),
  ]
);

export const productCategoryRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export type ProductCategory = typeof productCategories.$inferSelect;
export type ProductCategoryInsert = typeof productCategories.$inferInsert;

// ==============================
// Product Attributes
// ==============================

export const productAttributes = pgTable(
  "product_attributes",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    attributeId: text("attribute_id")
      .notNull()
      .references(() => attributes.id, { onDelete: "cascade" }),
    attributeOptionId: text("attribute_option_id"),

    value: jsonbColumn("value").notNull(),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("product_attributes", table.productId),
    idx("product_attributes", table.attributeId),
    idx("product_attributes", table.attributeOptionId),
    uidx("product_attributes", table.productId, table.attributeId),
  ]
);

export const productAttributeRelations = relations(
  productAttributes,
  ({ one }) => ({
    product: one(products, {
      fields: [productAttributes.productId],
      references: [products.id],
    }),
    attribute: one(attributes, {
      fields: [productAttributes.attributeId],
      references: [attributes.id],
    }),
    attributeOption: one(attributeOptions, {
      fields: [productAttributes.attributeOptionId],
      references: [attributeOptions.id],
    }),
  })
);

export type ProductAttribute = typeof productAttributes.$inferSelect;
export type ProductAttributeInsert = typeof productAttributes.$inferInsert;

// ==============================
// Product Collections
// ==============================

export const productCollections = pgTable(
  "product_collections",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),

    main: falseColumn("main"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("product_collections", table.productId),
    idx("product_collections", table.collectionId),
    uidx("product_collections", table.productId, table.collectionId),
  ]
);

export const productCollectionRelations = relations(
  productCollections,
  ({ one }) => ({
    product: one(products, {
      fields: [productCollections.productId],
      references: [products.id],
    }),
    collection: one(collections, {
      fields: [productCollections.collectionId],
      references: [collections.id],
    }),
  })
);

export type ProductCollection = typeof productCollections.$inferSelect;
export type ProductCollectionInsert = typeof productCollections.$inferInsert;

// ==============================
// Variants
// ==============================

export const variants = pgTable(
  "variants",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    baseVariantId: text("base_variant_id").references(
      (): PgColumn => variants.id,
      {
        onDelete: "restrict",
      }
    ),

    sku: varcharColumn("sku"),
    barcode: varcharColumn("barcode"),

    price: decimalColumn("price"),
    costPrice: decimalColumn("cost_price"),
    compareAtPrice: decimalColumn("compare_at_price"),

    minOrder: decimalColumn("min_order").notNull().default(1),
    maxOrder: decimalColumn("max_order").notNull().default(0), // unlimited
    minLeadTime: intColumn("min_lead_time").notNull().default(0), // days
    maxLeadTime: intColumn("max_lead_time").notNull().default(0), // days

    saleCount: intColumn("sale_count").notNull().default(0),

    weight: decimalColumn("weight"),
    width: decimalColumn("width"),
    height: decimalColumn("height"),
    length: decimalColumn("length"),

    enabled: trueColumn("enabled"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("variants", table.organizationId),
    idx("variants", table.productId),
    idx("variants", table.baseVariantId),
    uidx("variants", table.organizationId, table.sku),
  ]
);

export const variantRelations = relations(variants, ({ one, many }) => ({
  // catalog
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  baseVariant: one(variants, {
    relationName: "base_variant",
    fields: [variants.baseVariantId],
    references: [variants.id],
  }),
  childVariants: many(variants, { relationName: "base_variant" }),
  images: many(variantImages),
  options: many(variantOptions),
  designAreas: many(designAreas),
  pricelistItems: many(pricelistItems),
  costlistItems: many(costlistItems),

  // order
  orderItems: many(orderItems),

  // production
  billOfMaterials: many(billOfMaterials),
  bomItems: many(bomItems),
  productionOrderItems: many(productionOrderItems),

  // supply
  purchaseOrderItems: many(purchaseOrderItems),
  inventories: many(inventories),
  inventoryMovements: many(inventoryMovements),
  inventoryTransferItems: many(inventoryTransferItems),
}));

export type Variant = typeof variants.$inferSelect;
export type VariantInsert = typeof variants.$inferInsert;

// ==============================
// Variant Images
// ==============================

export const variantImages = pgTable(
  "variant_images",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),
    fileId: text("file_id").notNull(),

    main: falseColumn("main"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("variant_images", table.variantId),
    idx("variant_images", table.fileId),
    uidx("variant_images", table.variantId, table.fileId),
  ]
);

export const variantImageRelations = relations(variantImages, ({ one }) => ({
  variant: one(variants, {
    fields: [variantImages.variantId],
    references: [variants.id],
  }),
  file: one(files, {
    fields: [variantImages.fileId],
    references: [files.id],
  }),
}));

export type VariantImage = typeof variantImages.$inferSelect;
export type VariantImageInsert = typeof variantImages.$inferInsert;

// ==============================
// Variant Options
// ==============================

export const variantOptions = pgTable(
  "variant_options",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),
    attributeOptionId: text("attribute_option_id").notNull(),

    value: jsonbColumn("value").notNull(),
    metadata: jsonbColumn("metadata"),

    price: decimalColumn("price"),
    cost: decimalColumn("cost"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("variant_options", table.variantId),
    idx("variant_options", table.attributeOptionId),
    uidx("variant_options", table.variantId, table.attributeOptionId),
  ]
);

export const variantOptionRelations = relations(variantOptions, ({ one }) => ({
  variant: one(variants, {
    fields: [variantOptions.variantId],
    references: [variants.id],
  }),
  attributeOption: one(attributeOptions, {
    fields: [variantOptions.attributeOptionId],
    references: [attributeOptions.id],
  }),
}));

export type VariantOption = typeof variantOptions.$inferSelect;
export type VariantOptionInsert = typeof variantOptions.$inferInsert;

// ==============================
// Design Areas (Print Zones)
// ==============================

export const designAreas = pgTable(
  "design_area",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => variants.id, {
      onDelete: "cascade",
    }),

    name: varcharColumn("name").notNull(),
    width: numColumn("width"),
    height: numColumn("height"),
    x: numColumn("x"),
    y: numColumn("y"),
    z: intColumn("z"),
    metadata: jsonbColumn("metadata"),

    price: decimalColumn("price"),
    cost: decimalColumn("cost"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("design_area", table.organizationId),
    idx("design_area", table.productId),
    idx("design_area", table.variantId),
  ]
);

export const designAreaRelations = relations(designAreas, ({ one, many }) => ({
  // catalog
  product: one(products, {
    fields: [designAreas.productId],
    references: [products.id],
  }),
  variant: one(variants, {
    fields: [designAreas.variantId],
    references: [variants.id],
  }),
  productDesigns: many(productDesigns),

  // order
  orderItemDesigns: many(orderItemDesigns),
}));

export type DesignArea = typeof designAreas.$inferSelect;
export type DesignAreaInsert = typeof designAreas.$inferInsert;

// ==============================
// Product Designs (Templates)
// ==============================

export const productDesigns = pgTable(
  "product_designs",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    areaId: text("area_id")
      .notNull()
      .references(() => designAreas.id, { onDelete: "cascade" }),
    fileId: text("file_id"),

    name: varcharColumn("name").notNull(),
    placement: varcharColumn("placement"),
    width: numColumn("width"),
    height: numColumn("height"),
    offsetX: numColumn("offset_x"),
    offsetY: numColumn("offset_y"),
    offsetZ: intColumn("offset_z"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("product_designs", table.organizationId),
    idx("product_designs", table.areaId),
    idx("product_designs", table.fileId),
  ]
);

export const productDesignRelations = relations(productDesigns, ({ one }) => ({
  designArea: one(designAreas, {
    fields: [productDesigns.areaId],
    references: [designAreas.id],
  }),
  file: one(files, {
    fields: [productDesigns.fileId],
    references: [files.id],
  }),
}));

export type ProductDesign = typeof productDesigns.$inferSelect;
export type ProductDesignInsert = typeof productDesigns.$inferInsert;

// ==============================
// Pricelists (Sales)
// ==============================

export const pricelists = pgTable(
  "pricelists",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderChannelId: text("order_channel_id"),

    currencyCode: varcharColumn("currency_code", 3).notNull().default("IDR"),
    taxInclusive: falseColumn("tax_inclusive"),
    startDate: timestampColumn("start_date"),
    endDate: timestampColumn("end_date"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [idx("pricelists", table.organizationId)]
);

export const pricelistRelations = relations(pricelists, ({ one, many }) => ({
  // catalog
  organization: one(organizations, {
    fields: [pricelists.organizationId],
    references: [organizations.id],
  }),
  items: many(pricelistItems),
}));

export type Pricelist = typeof pricelists.$inferSelect;
export type PricelistInsert = typeof pricelists.$inferInsert;

// ==============================
// Pricelist Items
// ==============================

export const pricelistItems = pgTable(
  "pricelist_items",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    pricelistId: text("pricelist_id")
      .notNull()
      .references(() => pricelists.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),

    price: decimalColumn("price").notNull(),
    compareAtPrice: decimalColumn("compare_at_price").notNull(),

    minQuantity: numColumn("min_quantity").notNull().default(1),
    maxQuantity: numColumn("max_quantity").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("pricelist_items", table.variantId),
    uidx(
      "pricelist_items",
      table.pricelistId,
      table.variantId,
      table.minQuantity
    ),
  ]
);

export const pricelistItemRelations = relations(pricelistItems, ({ one }) => ({
  pricelist: one(pricelists, {
    fields: [pricelistItems.pricelistId],
    references: [pricelists.id],
  }),
  variant: one(variants, {
    fields: [pricelistItems.variantId],
    references: [variants.id],
  }),
}));

export type PricelistItem = typeof pricelistItems.$inferSelect;
export type PricelistItemInsert = typeof pricelistItems.$inferInsert;

// ==============================
// Costlists (Purchasing)
// ==============================

export const costlists = pgTable(
  "costlists",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    supplierId: text("supplier_id"),

    currencyCode: varcharColumn("currency_code", 3).notNull().default("IDR"),
    taxInclusive: falseColumn("tax_inclusive"),
    startDate: timestampColumn("start_date"),
    endDate: timestampColumn("end_date"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("costlists", table.organizationId),
    idx("costlists", table.supplierId),
  ]
);

export const costlistRelations = relations(costlists, ({ one, many }) => ({
  // catalog
  organization: one(organizations, {
    fields: [costlists.organizationId],
    references: [organizations.id],
  }),
  items: many(costlistItems),
}));

export type Costlist = typeof costlists.$inferSelect;
export type CostlistInsert = typeof costlists.$inferInsert;

// ==============================
// Costlist Items
// ==============================

export const costlistItems = pgTable(
  "costlist_items",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    costlistId: text("costlist_id")
      .notNull()
      .references(() => costlists.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),

    costPrice: decimalColumn("cost_price").notNull(),

    minQuantity: numColumn("min_quantity").notNull().default(1),
    maxQuantity: numColumn("max_quantity").notNull().default(0),

    leadTime: intColumn("lead_time").notNull().default(0),

    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("costlist_items", table.variantId),
    uidx(
      "costlist_items",
      table.costlistId,
      table.variantId,
      table.minQuantity
    ),
  ]
);

export const costlistItemRelations = relations(costlistItems, ({ one }) => ({
  costlist: one(costlists, {
    fields: [costlistItems.costlistId],
    references: [costlists.id],
  }),
  variant: one(variants, {
    fields: [costlistItems.variantId],
    references: [variants.id],
  }),
}));

export type CostlistItem = typeof costlistItems.$inferSelect;
export type CostlistItemInsert = typeof costlistItems.$inferInsert;
