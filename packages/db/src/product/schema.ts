import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const productStatus = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
  "out_of_stock",
]);

export const designStatus = pgEnum("design_status", [
  "pending_review",
  "approved",
  "rejected",
  "flagged",
]);

export const printProviderStatus = pgEnum("print_provider_status", [
  "active",
  "inactive",
  "maintenance",
]);

export const templateCategory = pgEnum("template_category", [
  "apparel",
  "accessories",
  "home_living",
  "stationery",
  "seasonal",
  "trending",
]);

// ============================================================================
// CATEGORIES & TAGS
// ============================================================================

export const categories = pgTable(
  "categories",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.text().notNull(),
    slug: t.text().notNull().unique(),
    description: t.text(),
    parentId: t.uuid(),
    imageUrl: t.text(),
    displayOrder: t.integer().default(0),
    isActive: t.boolean().default(true).notNull(),
    metaTitle: t.text(),
    metaDescription: t.text(),

    // Audit trails
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("categories_slug_idx").on(table.slug),
    index("categories_parent_idx").on(table.parentId),
  ]
);

export const tags = pgTable(
  "tags",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    name: t.text().notNull().unique(),
    slug: t.text().notNull().unique(),
    usageCount: t.integer().default(0).notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("tags_slug_idx").on(table.slug)]
);

// ============================================================================
// PRODUCTS
// ============================================================================

export const products = pgTable(
  "products",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    categoryId: t
      .uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),

    // Basic info
    name: t.text().notNull(),
    slug: t.text().notNull().unique(),
    description: t.text(),
    shortDescription: t.text(),

    // Pricing
    baseCost: t.numeric({ precision: 10, scale: 2 }).notNull(), // Cost from supplier
    retailPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
    compareAtPrice: t.numeric({ precision: 10, scale: 2 }), // Original price for discounts

    // Print specifications
    printAreas:
      jsonb().$type<
        Array<{
          name: string; // "front", "back", "left sleeve"
          maxWidth: number;
          maxHeight: number;
          x: number;
          y: number;
        }>
      >(),
    printMethods: jsonb().$type<string[]>(), // ["DTG", "Screen Print", "Embroidery"]

    // Physical attributes
    weight: t.numeric({ precision: 8, scale: 2 }), // in grams
    dimensions: jsonb().$type<{
      length: number;
      width: number;
      height: number;
      unit: string;
    }>(),

    // SEO & metadata
    metaTitle: t.text(),
    metaDescription: t.text(),
    keywords: jsonb().$type<string[]>(),

    // Status & visibility
    status: productStatus().default("draft").notNull(),
    isFeatured: t.boolean().default(false).notNull(),
    isCustomizable: t.boolean().default(true).notNull(),

    // Stats
    viewCount: t.integer().default(0).notNull(),
    orderCount: t.integer().default(0).notNull(),
    averageRating: t.numeric({ precision: 3, scale: 2 }).default("0"),

    // Audit trails
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    publishedAt: t.timestamp(),
  }),
  (table) => [
    index("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.categoryId),
    index("products_status_idx").on(table.status),
    index("products_featured_idx").on(table.isFeatured),
  ]
);

export const productVariants = pgTable(
  "product_variants",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    productId: t
      .uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    // Variant attributes
    sku: t.text().notNull().unique(),
    name: t.text().notNull(), // "Large / Blue"

    // Variant options (size, color, etc.)
    options: jsonb().$type<Record<string, string>>().notNull(), // {"size": "L", "color": "Blue"}

    // Pricing override
    baseCost: t.numeric({ precision: 10, scale: 2 }),
    retailPrice: t.numeric({ precision: 10, scale: 2 }),

    // Inventory (for POD, usually unlimited)
    stockQuantity: t.integer().default(999999).notNull(),
    lowStockThreshold: t.integer().default(0),

    // Physical
    weight: t.numeric({ precision: 8, scale: 2 }),
    barcode: t.text(),

    // Status
    isActive: t.boolean().default(true).notNull(),
    displayOrder: t.integer().default(0),

    // Audit trails
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("variants_product_idx").on(table.productId),
    index("variants_sku_idx").on(table.sku),
    uniqueIndex("variants_product_options_idx").on(
      table.productId,
      table.options
    ),
  ]
);

export const productImages = pgTable(
  "product_images",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    productId: t
      .uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: t.uuid().references(() => productVariants.id, {
      onDelete: "cascade",
    }),

    // Image details
    url: t.text().notNull(),
    alt: t.text(),
    displayOrder: t.integer().default(0).notNull(),
    isPrimary: t.boolean().default(false).notNull(),

    // Dimensions
    width: t.integer(),
    height: t.integer(),

    // Mockup info
    isMockup: t.boolean().default(false).notNull(),
    mockupPosition: jsonb().$type<{
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
    }>(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("images_product_idx").on(table.productId),
    index("images_variant_idx").on(table.variantId),
  ]
);

export const productTags = pgTable(
  "product_tags",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    productId: t
      .uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    tagId: t
      .uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("product_tags_unique_idx").on(table.productId, table.tagId),
    index("product_tags_product_idx").on(table.productId),
    index("product_tags_tag_idx").on(table.tagId),
  ]
);

// ============================================================================
// DESIGNS & TEMPLATES
// ============================================================================

export const designs = pgTable(
  "designs",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    creatorId: t.uuid().notNull(), // References users.id from auth DB

    // Design info
    title: t.text().notNull(),
    description: t.text(),

    // File references (stored in media DB)
    fileId: t.uuid().notNull(), // Main design file
    thumbnailId: t.uuid(), // Thumbnail reference
    previewUrls: jsonb().$type<string[]>(), // Multiple preview angles

    // Design specs
    width: t.integer().notNull(),
    height: t.integer().notNull(),
    dpi: t.integer().default(300).notNull(),
    colorMode: t.text().default("CMYK").notNull(),
    fileFormat: t.text().notNull(), // "PNG", "SVG", "AI"
    fileSize: t.integer().notNull(), // bytes

    // Copyright & licensing
    isOriginal: t.boolean().default(true).notNull(),
    licenseType: t.text().default("exclusive"), // "exclusive", "non-exclusive"
    copyrightNotice: t.text(),

    // Moderation
    status: designStatus().default("pending_review").notNull(),
    rejectionReason: t.text(),
    reviewedAt: t.timestamp(),
    reviewedBy: t.uuid(), // Admin user ID

    // Tags & categories
    tags: jsonb().$type<string[]>(),
    colors: jsonb().$type<string[]>(), // Dominant colors ["#FF0000", "#00FF00"]

    // Stats
    downloadCount: t.integer().default(0).notNull(),
    usageCount: t.integer().default(0).notNull(),
    likeCount: t.integer().default(0).notNull(),

    // Visibility
    isPublic: t.boolean().default(false).notNull(),
    isMarketplace: t.boolean().default(false).notNull(), // Available in marketplace
    price: t.numeric({ precision: 10, scale: 2 }), // Price if selling in marketplace

    // Audit trails
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    publishedAt: t.timestamp(),
  }),
  (table) => [
    index("designs_creator_idx").on(table.creatorId),
    index("designs_status_idx").on(table.status),
    index("designs_marketplace_idx").on(table.isMarketplace),
  ]
);

export const templates = pgTable(
  "templates",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    // Template info
    name: t.text().notNull(),
    description: t.text(),
    category: templateCategory().notNull(),

    // File references
    fileId: t.uuid().notNull(),
    thumbnailId: t.uuid(),
    previewUrl: t.text(),

    // Template specs
    layers:
      jsonb().$type<
        Array<{
          id: string;
          type: "text" | "image" | "shape";
          editable: boolean;
          locked: boolean;
          properties: Record<string, unknown>;
        }>
      >(),

    // Customization options
    customizableFields:
      jsonb().$type<
        Array<{
          name: string;
          type: string;
          default: unknown;
          options?: unknown[];
        }>
      >(),

    // Visibility & pricing
    isPremium: t.boolean().default(false).notNull(),
    isActive: t.boolean().default(true).notNull(),

    // Stats
    usageCount: t.integer().default(0).notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("templates_category_idx").on(table.category),
    index("templates_premium_idx").on(table.isPremium),
  ]
);

// ============================================================================
// COLLECTIONS
// ============================================================================

export const collections = pgTable(
  "collections",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    creatorId: t.uuid(), // NULL for system collections

    // Collection info
    name: t.text().notNull(),
    slug: t.text().notNull().unique(),
    description: t.text(),
    imageUrl: t.text(),

    // Settings
    isPublic: t.boolean().default(true).notNull(),
    isFeatured: t.boolean().default(false).notNull(),
    displayOrder: t.integer().default(0),

    // Metadata
    metaTitle: t.text(),
    metaDescription: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("collections_slug_idx").on(table.slug),
    index("collections_creator_idx").on(table.creatorId),
  ]
);

export const collectionProducts = pgTable(
  "collection_products",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    collectionId: t
      .uuid()
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: t
      .uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    displayOrder: t.integer().default(0),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("collection_products_unique_idx").on(
      table.collectionId,
      table.productId
    ),
    index("collection_products_collection_idx").on(table.collectionId),
    index("collection_products_product_idx").on(table.productId),
  ]
);

// ============================================================================
// PRINT PROVIDERS
// ============================================================================

export const printProviders = pgTable(
  "print_providers",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),

    // Provider info
    name: t.text().notNull(),
    slug: t.text().notNull().unique(),
    description: t.text(),
    logoUrl: t.text(),

    // Contact
    email: t.text(),
    phone: t.text(),
    website: t.text(),

    // Location
    country: t.text().notNull(),
    city: t.text(),
    address: t.text(),

    // Capabilities
    printMethods: jsonb().$type<string[]>(), // ["DTG", "Sublimation"]
    productTypes: jsonb().$type<string[]>(), // ["apparel", "mugs"]
    maxPrintWidth: t.integer(),
    maxPrintHeight: t.integer(),

    // SLA
    productionTime: t.integer().default(3).notNull(), // days
    shippingTime: t.integer().default(5).notNull(), // days
    qualityScore: t.numeric({ precision: 3, scale: 2 }).default("5.0"),

    // Pricing
    baseFee: t.numeric({ precision: 10, scale: 2 }).default("0"),
    perItemFee: t.numeric({ precision: 10, scale: 2 }).default("0"),

    // API integration
    apiKey: t.text(),
    apiEndpoint: t.text(),
    webhookUrl: t.text(),

    // Status
    status: printProviderStatus().default("active").notNull(),
    priority: t.integer().default(0), // Higher = preferred

    // Stats
    totalOrders: t.integer().default(0).notNull(),
    successRate: t.numeric({ precision: 5, scale: 2 }).default("100"),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("print_providers_slug_idx").on(table.slug),
    index("print_providers_status_idx").on(table.status),
  ]
);

export const productPrintProviders = pgTable(
  "product_print_providers",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    productId: t
      .uuid()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    printProviderId: t
      .uuid()
      .notNull()
      .references(() => printProviders.id, { onDelete: "cascade" }),

    // Provider-specific settings
    providerSku: t.text(),
    baseCost: t.numeric({ precision: 10, scale: 2 }),
    productionTime: t.integer(), // Override default

    isPreferred: t.boolean().default(false).notNull(),
    priority: t.integer().default(0),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    uniqueIndex("product_print_providers_unique_idx").on(
      table.productId,
      table.printProviderId
    ),
    index("product_print_providers_product_idx").on(table.productId),
    index("product_print_providers_provider_idx").on(table.printProviderId),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  productTags: many(productTags),
  collectionProducts: many(collectionProducts),
  productPrintProviders: many(productPrintProviders),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    images: many(productImages),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  productTags: many(productTags),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionProducts: many(collectionProducts),
}));

export const collectionProductsRelations = relations(
  collectionProducts,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProducts.collectionId],
      references: [collections.id],
    }),
    product: one(products, {
      fields: [collectionProducts.productId],
      references: [products.id],
    }),
  })
);

export const printProvidersRelations = relations(
  printProviders,
  ({ many }) => ({
    productPrintProviders: many(productPrintProviders),
  })
);

export const productPrintProvidersRelations = relations(
  productPrintProviders,
  ({ one }) => ({
    product: one(products, {
      fields: [productPrintProviders.productId],
      references: [products.id],
    }),
    printProvider: one(printProviders, {
      fields: [productPrintProviders.printProviderId],
      references: [printProviders.id],
    }),
  })
);
