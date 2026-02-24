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
import { products, productVariants } from "~/lib/db/schemas/products";
import { uuid } from "~/utils/ids";

// ==============================
// MEDIA ENUMS
// ==============================

export const MEDIA_PROVIDERS = {
  cloudinary: "cloudinary",
  cloudflare: "cloudflare",
  local: "local",
  other: "other",
} as const;

export type MediaProvider =
  (typeof MEDIA_PROVIDERS)[keyof typeof MEDIA_PROVIDERS];

// ==============================
// MEDIAS
// ==============================

export const medias = pgTable(
  "medias",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),

    provider: text("provider")
      .$type<MediaProvider>()
      .default("other")
      .notNull(),
    key: text("key"),

    fileType: text("file_type").notNull(),
    mimeType: text("mime_type").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    size: integer("size").notNull(),
    width: integer("width"),
    height: integer("height"),
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
    index("medias_file_type_idx").on(table.fileType),
  ]
);

export const mediasRelations = relations(medias, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [medias.organizationId],
    references: [organizations.id],
  }),
  productMedias: many(productMedias),
  variantMedias: many(variantMedias),
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
// VARIANT MEDIAS
// ==============================

export const variantMedias = pgTable(
  "variant_medias",
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
    uniqueIndex("variant_medias_variant_id_media_id_uidx").on(
      table.variantId,
      table.mediaId
    ),
    index("variant_medias_variant_id_idx").on(table.variantId),
    index("variant_medias_media_id_idx").on(table.mediaId),
  ]
);

export const variantMediasRelations = relations(variantMedias, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantMedias.variantId],
    references: [productVariants.id],
  }),
  media: one(medias, {
    fields: [variantMedias.mediaId],
    references: [medias.id],
  }),
}));
