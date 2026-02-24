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
import { uuid } from "~/utils/ids";

// ==============================
// ATTRIBUTE TYPE ENUMS
// ==============================

export const ATTRIBUTE_TYPE = {
  text: "text",
  number: "number",
  color: "color",
  select: "select",
  multiselect: "multiselect",
  boolean: "boolean",
} as const;

export type AttributeType =
  (typeof ATTRIBUTE_TYPE)[keyof typeof ATTRIBUTE_TYPE];

// ==============================
// ATTRIBUTE DEFINITIONS
// ==============================

/**
 * Global or per-tenant attribute definitions.
 * When `isGlobal = true`, the attribute is shared across all orgs (marketplace catalog).
 * When `isGlobal = false`, it belongs to a specific org.
 */
export const attributeDefinitions = pgTable(
  "attribute_definitions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),

    name: text("name").notNull(), // e.g. "Ukuran", "Warna", "Bahan"
    slug: text("slug").notNull(),
    type: text("type").$type<AttributeType>().default("text").notNull(),
    description: text("description"),

    // options for select/multiselect (jsonb array of {value, label, meta?})
    options: jsonb("options"),

    isGlobal: boolean("is_global").default(false).notNull(),
    isRequired: boolean("is_required").default(false).notNull(),
    isFilterable: boolean("is_filterable").default(true).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
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
    uniqueIndex("attr_def_org_slug_uidx").on(table.organizationId, table.slug),
    index("attr_def_org_id_idx").on(table.organizationId),
    index("attr_def_is_global_idx").on(table.isGlobal),
    index("attr_def_type_idx").on(table.type),
  ]
);

export const attributeDefinitionsRelations = relations(
  attributeDefinitions,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [attributeDefinitions.organizationId],
      references: [organizations.id],
    }),
    values: many(attributeValues),
  })
);

// ==============================
// ATTRIBUTE VALUES
// ==============================

/**
 * Attribute values assigned to entities (products, variants, etc.)
 * Polymorphic via entityType + entityId.
 */
export const attributeValues = pgTable(
  "attribute_values",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    attributeDefinitionId: text("attribute_definition_id")
      .notNull()
      .references(() => attributeDefinitions.id, { onDelete: "cascade" }),

    // polymorphic target
    entityType: text("entity_type").notNull(), // "product", "variant"
    entityId: text("entity_id").notNull(),

    // value storage (use the one matching the attribute type)
    textValue: text("text_value"),
    numberValue: integer("number_value"),
    booleanValue: boolean("boolean_value"),
    jsonValue: jsonb("json_value"), // for select/multiselect/complex

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
    uniqueIndex("attr_val_def_entity_uidx").on(
      table.attributeDefinitionId,
      table.entityType,
      table.entityId
    ),
    index("attr_val_entity_idx").on(table.entityType, table.entityId),
    index("attr_val_def_id_idx").on(table.attributeDefinitionId),
  ]
);

export const attributeValuesRelations = relations(
  attributeValues,
  ({ one }) => ({
    definition: one(attributeDefinitions, {
      fields: [attributeValues.attributeDefinitionId],
      references: [attributeDefinitions.id],
    }),
  })
);
