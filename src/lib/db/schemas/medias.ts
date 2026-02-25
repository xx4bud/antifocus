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
import type { MediaFileType, MediaProvider } from "~/lib/db/schemas/constants";
import { orderItems } from "~/lib/db/schemas/orders";
import { organizations } from "~/lib/db/schemas/organizations";
import { products, productVariants } from "~/lib/db/schemas/products";
import { uuid } from "~/utils/ids";

// ==============================
// MEDIAS
// ==============================

export const medias = pgTable(
  "medias",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    provider: text("provider")
      .$type<MediaProvider>()
      .default("other")
      .notNull(),
    key: text("key"),
    path: text("path"),

    fileType: text("file_type")
      .$type<MediaFileType>()
      .default("other")
      .notNull(),
    mimeType: text("mime_type").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    width: integer("width"),
    height: integer("height"),
    size: integer("size").notNull(),
    dpi: integer("dpi"),
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
    index("medias_org_id_idx").on(table.organizationId),
    index("medias_provider_idx").on(table.provider),
    index("medias_file_type_idx").on(table.fileType),
    index("medias_mime_type_idx").on(table.mimeType),
  ]
);

export const mediasRelations = relations(medias, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [medias.organizationId],
    references: [organizations.id],
  }),
  productMedias: many(productMedias),
  productVariantMedias: many(productVariantMedias),
  orderItemMedias: many(orderItemMedias),
}));

// ==============================
// PRODUCT MEDIAS
// ==============================

export const productMedias = pgTable(
  "product_medias",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),

    isMain: boolean("is_main").default(false).notNull(),
    position: integer("position").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("product_medias_product_id_media_id_uidx").on(
      table.productId,
      table.mediaId
    ),
    index("product_medias_product_id_idx").on(table.productId),
    index("product_medias_media_id_idx").on(table.mediaId),
  ]
);

export const productMediasRelations = relations(productMedias, ({ one }) => ({
  product: one(products, {
    fields: [productMedias.productId],
    references: [products.id],
  }),
  media: one(medias, {
    fields: [productMedias.mediaId],
    references: [medias.id],
  }),
}));

// ==============================
// PRODUCT VARIANT MEDIAS
// ==============================

export const productVariantMedias = pgTable(
  "product_variant_medias",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    variantId: text("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),

    isMain: boolean("is_main").default(false).notNull(),
    position: integer("position").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("product_variant_medias_variant_id_media_id_uidx").on(
      table.variantId,
      table.mediaId
    ),
    index("product_variant_medias_variant_id_idx").on(table.variantId),
    index("product_variant_medias_media_id_idx").on(table.mediaId),
  ]
);

export const productVariantMediasRelations = relations(
  productVariantMedias,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productVariantMedias.variantId],
      references: [productVariants.id],
    }),
    media: one(medias, {
      fields: [productVariantMedias.mediaId],
      references: [medias.id],
    }),
  })
);

// ==============================
// ORDER ITEM MEDIAS
// ==============================

export const orderItemMedias = pgTable(
  "order_item_medias",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    orderItemId: text("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => medias.id, { onDelete: "cascade" }),

    isMain: boolean("is_main").default(false).notNull(),
    position: integer("position").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("order_item_medias_order_item_id_media_id_uidx").on(
      table.orderItemId,
      table.mediaId
    ),
    index("order_item_medias_order_item_id_idx").on(table.orderItemId),
    index("order_item_medias_media_id_idx").on(table.mediaId),
  ]
);

export const orderItemMediasRelations = relations(
  orderItemMedias,
  ({ one }) => ({
    orderItem: one(orderItems, {
      fields: [orderItemMedias.orderItemId],
      references: [orderItems.id],
    }),
    media: one(medias, {
      fields: [orderItemMedias.mediaId],
      references: [medias.id],
    }),
  })
);
