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
import { users } from "./auth";
import { organizations } from "./organization";

/**
 * Design enums
 */
export const designStatusEnum = pgEnum("design_status", [
  "draft",
  "published",
  "archived",
  "deleted",
]);

export const designLayerTypeEnum = pgEnum("design_layer_type", [
  "text",
  "image",
  "shape",
  "background",
]);

/**
 * Designs table
 */
export const designs = pgTable(
  "designs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    name: text("name").notNull(),
    description: text("description"),

    // Canvas configuration
    canvasWidth: integer("canvas_width").notNull(),
    canvasHeight: integer("canvas_height").notNull(),
    canvasBackground: text("canvas_background"), // color or image URL

    // Konva JSON state (serialized canvas)
    canvasState: jsonb("canvas_state")
      .$type<{
        version: string;
        layers: Record<string, unknown>[];
        background?: string;
      }>()
      .notNull(),

    // Preview images
    previewImage: text("preview_image"), // PNG export for preview
    thumbnailImage: text("thumbnail_image"), // small thumbnail

    // Template info
    templateId: text("template_id"), // reference to product template
    isTemplate: boolean("is_template").default(false).notNull(), // can be used as template

    // Status
    status: designStatusEnum("status").default("draft").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),

    // Tags and categories
    tags: jsonb("tags").$type<string[]>(),

    // Export settings
    exportFormat: text("export_format").default("png").notNull(), // "png", "jpg", "pdf"
    exportQuality: integer("export_quality").default(300).notNull(), // DPI

    // Statistics
    viewCount: integer("view_count").default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    useCount: integer("use_count").default(0).notNull(), // how many times used in orders

    // Metadata
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
    index("designs_org_id_idx").on(table.organizationId),
    index("designs_user_id_idx").on(table.userId),
    index("designs_status_idx").on(table.status),
    index("designs_template_id_idx").on(table.templateId),
    index("designs_public_idx").on(table.isPublic),
    index("designs_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Design layers table (backup/audit of individual layers)
 */
export const designLayers = pgTable(
  "design_layers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    designId: text("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),

    layerId: text("layer_id").notNull(), // Konva layer ID
    name: text("name"),
    type: designLayerTypeEnum("type").notNull(),

    // Layer properties (serialized Konva object)
    properties: jsonb("properties")
      .$type<{
        x: number;
        y: number;
        width?: number;
        height?: number;
        rotation?: number;
        opacity?: number;
        visible?: boolean;
        // text-specific
        text?: string;
        fontSize?: number;
        fontFamily?: string;
        textFill?: string;
        // image-specific
        src?: string;
        // shape-specific
        shapeFill?: string;
        stroke?: string;
        strokeWidth?: number;
      }>()
      .notNull(),

    // Position in layer stack
    zIndex: integer("z_index").default(0).notNull(),

    // Version control
    version: integer("version").default(1).notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("design_layers_design_id_idx").on(table.designId),
    index("design_layers_layer_id_idx").on(table.layerId),
    index("design_layers_type_idx").on(table.type),
  ]
);

/**
 * Design versions table (for undo/redo functionality)
 */
export const designVersions = pgTable(
  "design_versions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    designId: text("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),

    version: integer("version").notNull(),
    name: text("name"), // optional name for the version

    // Complete canvas state snapshot
    canvasState: jsonb("canvas_state")
      .$type<{
        version: string;
        layers: Record<string, unknown>[];
        background?: string;
      }>()
      .notNull(),

    // Preview
    previewImage: text("preview_image"),

    // Change description
    changeDescription: text("change_description"),

    // Auto-save vs manual save
    isAutoSave: boolean("is_auto_save").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("design_versions_design_id_idx").on(table.designId),
    index("design_versions_version_idx").on(table.version),
  ]
);

/**
 * Design comments table (for collaboration)
 */
export const designComments = pgTable(
  "design_comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    designId: text("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    // Comment content
    content: text("content").notNull(),

    // Position on canvas (optional)
    x: integer("x"),
    y: integer("y"),

    // Thread support
    parentId: text("parent_id"), // for replies - relation defined separately

    // Status
    isResolved: boolean("is_resolved").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("design_comments_design_id_idx").on(table.designId),
    index("design_comments_user_id_idx").on(table.userId),
    index("design_comments_parent_id_idx").on(table.parentId),
  ]
);

/**
 * Relations
 */
export const designsRelations = relations(designs, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [designs.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [designs.userId],
    references: [users.id],
  }),
  layers: many(designLayers),
  versions: many(designVersions),
  comments: many(designComments),
}));

export const designLayersRelations = relations(designLayers, ({ one }) => ({
  design: one(designs, {
    fields: [designLayers.designId],
    references: [designs.id],
  }),
}));

export const designVersionsRelations = relations(designVersions, ({ one }) => ({
  design: one(designs, {
    fields: [designVersions.designId],
    references: [designs.id],
  }),
}));

export const designCommentsRelations = relations(
  designComments,
  ({ one, many }) => ({
    design: one(designs, {
      fields: [designComments.designId],
      references: [designs.id],
    }),
    user: one(users, {
      fields: [designComments.userId],
      references: [users.id],
    }),
    parent: one(designComments, {
      fields: [designComments.parentId],
      references: [designComments.id],
    }),
    replies: many(designComments),
  })
);

/**
 * Types
 */
export type Design = typeof designs.$inferSelect;
export type NewDesign = typeof designs.$inferInsert;

export type DesignLayer = typeof designLayers.$inferSelect;
export type NewDesignLayer = typeof designLayers.$inferInsert;

export type DesignVersion = typeof designVersions.$inferSelect;
export type NewDesignVersion = typeof designVersions.$inferInsert;

export type DesignComment = typeof designComments.$inferSelect;
export type NewDesignComment = typeof designComments.$inferInsert;
