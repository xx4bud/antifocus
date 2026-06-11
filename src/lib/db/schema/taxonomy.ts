import { relations } from "drizzle-orm";
import { type PgColumn, pgTable, text } from "drizzle-orm/pg-core";
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
import {
  productAttributes,
  productCategories,
  productCollections,
  products,
  productTags,
  variantOptions,
} from "./catalog";
import { files } from "./core";
import { type AttributeType, DEFAULT_ATTRIBUTE_TYPE } from "./enums";
import { promotionCollections } from "./marketing";
import { organizations } from "./org";
import { bomItems } from "./production";

// ==============================
// Tags
// ==============================

export const tags = pgTable(
  "tags",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull(),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("tags", table.organizationId),
    uidx("tags", table.organizationId, table.slug),
  ]
);

export const tagRelations = relations(tags, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [tags.organizationId],
    references: [organizations.id],
  }),

  // catalog
  products: many(productTags),
}));

export type Tag = typeof tags.$inferSelect;
export type TagInsert = typeof tags.$inferInsert;

// ==============================
// Attributes
// ==============================

export const attributes = pgTable(
  "attributes",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull(),

    type: text("type")
      .$type<AttributeType>()
      .default(DEFAULT_ATTRIBUTE_TYPE)
      .notNull(),
    filterable: trueColumn("filterable"),

    position: intColumn("position").notNull().default(0),
    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("attributes", table.organizationId),
    uidx("attributes", table.organizationId, table.slug),
  ]
);

export const attributeRelations = relations(attributes, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [attributes.organizationId],
    references: [organizations.id],
  }),

  // taxonomy
  options: many(attributeOptions),

  // categories
  categories: many(categoryAttributes),
  products: many(productAttributes),
}));

export type Attribute = typeof attributes.$inferSelect;
export type AttributeInsert = typeof attributes.$inferInsert;

// ==============================
// Attribute Options
// ==============================

export const attributeOptions = pgTable(
  "attribute_options",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    attributeId: text("attribute_id")
      .notNull()
      .references(() => attributes.id, { onDelete: "cascade" }),

    label: varcharColumn("label").notNull(),
    value: jsonbColumn("value"),

    price: decimalColumn("price"),
    cost: decimalColumn("cost"),

    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("attribute_options", table.organizationId),
    idx("attribute_options", table.attributeId),
  ]
);

export const attributeOptionRelations = relations(
  attributeOptions,
  ({ one, many }) => ({
    // taxonomy
    attribute: one(attributes, {
      fields: [attributeOptions.attributeId],
      references: [attributes.id],
    }),

    // catalog
    products: many(productAttributes),
    variantOptions: many(variantOptions),
  })
);

export type AttributeOption = typeof attributeOptions.$inferSelect;
export type AttributeOptionInsert = typeof attributeOptions.$inferInsert;

// ==============================
// Categories
// ==============================

export const categories = pgTable(
  "categories",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    parentId: text("parent_id").references((): PgColumn => categories.id, {
      onDelete: "set null",
    }),

    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull(),

    position: intColumn("position").notNull().default(0),
    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("categories", table.organizationId),
    idx("categories", table.parentId as PgColumn),
    uidx("categories", table.organizationId, table.slug),
  ]
);

export const categoryRelations = relations(categories, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),

  // self-ref
  parent: one(categories, {
    relationName: "category_tree",
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories, { relationName: "category_tree" }),

  // images
  images: many(categoryImages),

  // attributes
  attributes: many(categoryAttributes),

  // catalog
  products: many(productCategories),
}));

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

// ==============================
// Category Images
// ==============================

export const categoryImages = pgTable(
  "category_images",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    fileId: text("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("category_images", table.categoryId),
    idx("category_images", table.fileId),
    uidx("category_images", table.categoryId, table.fileId),
  ]
);

export const categoryImageRelations = relations(categoryImages, ({ one }) => ({
  // taxonomy
  category: one(categories, {
    fields: [categoryImages.categoryId],
    references: [categories.id],
  }),

  // core
  file: one(files, {
    fields: [categoryImages.fileId],
    references: [files.id],
  }),
}));

export type CategoryImage = typeof categoryImages.$inferSelect;
export type CategoryImageInsert = typeof categoryImages.$inferInsert;

// ==============================
// Category Attributes
// ==============================

export const categoryAttributes = pgTable(
  "category_attributes",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    attributeId: text("attribute_id")
      .notNull()
      .references(() => attributes.id, { onDelete: "cascade" }),

    required: falseColumn("required"),
    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("category_attributes", table.categoryId),
    idx("category_attributes", table.attributeId),
    uidx("category_attributes", table.categoryId, table.attributeId),
  ]
);

export const categoryAttributeRelations = relations(
  categoryAttributes,
  ({ one }) => ({
    // taxonomy
    category: one(categories, {
      fields: [categoryAttributes.categoryId],
      references: [categories.id],
    }),
    attribute: one(attributes, {
      fields: [categoryAttributes.attributeId],
      references: [attributes.id],
    }),
  })
);

export type CategoryAttribute = typeof categoryAttributes.$inferSelect;
export type CategoryAttributeInsert = typeof categoryAttributes.$inferInsert;

// ==============================
// Collections
// ==============================

export const collections = pgTable(
  "collections",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    slug: varcharColumn("slug").notNull(),
    rules: jsonbColumn("rules"),

    position: intColumn("position").notNull().default(0),
    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("collections", table.organizationId),
    uidx("collections", table.organizationId, table.slug),
  ]
);

export const collectionRelations = relations(collections, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [collections.organizationId],
    references: [organizations.id],
  }),

  // images
  images: many(collectionImages),

  // catalog
  products: many(productCollections),

  // marketing
  promotions: many(promotionCollections),
}));

export type Collection = typeof collections.$inferSelect;
export type CollectionInsert = typeof collections.$inferInsert;

// ==============================
// Collection Images
// ==============================

export const collectionImages = pgTable(
  "collection_images",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    fileId: text("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    position: intColumn("position").notNull().default(0),
    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("collection_images", table.collectionId),
    idx("collection_images", table.fileId),
    uidx("collection_images", table.collectionId, table.fileId),
  ]
);

export const collectionImageRelations = relations(
  collectionImages,
  ({ one }) => ({
    // taxonomy
    collection: one(collections, {
      fields: [collectionImages.collectionId],
      references: [collections.id],
    }),

    // core
    file: one(files, {
      fields: [collectionImages.fileId],
      references: [files.id],
    }),
  })
);

export type CollectionImage = typeof collectionImages.$inferSelect;
export type CollectionImageInsert = typeof collectionImages.$inferInsert;

// ==============================
// Units of Measure
// ==============================

export const units = pgTable(
  "units",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    baseUnitId: text("base_unit_id").references((): PgColumn => units.id, {
      onDelete: "set null",
    }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code").notNull(),
    rate: decimalColumn("rate", 15, 4).notNull(),

    position: intColumn("position").notNull().default(0),
    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("units", table.organizationId),
    idx("units", table.baseUnitId),
    uidx("units", table.organizationId, table.code),
  ]
);

export const unitRelations = relations(units, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [units.organizationId],
    references: [organizations.id],
  }),

  // self-ref
  baseUnit: one(units, {
    relationName: "base_units",
    fields: [units.baseUnitId],
    references: [units.id],
  }),
  childUnits: many(units, { relationName: "base_units" }),

  // catalog
  products: many(products),
  bomItems: many(bomItems),
}));

export type Unit = typeof units.$inferSelect;
export type UnitInsert = typeof units.$inferInsert;
