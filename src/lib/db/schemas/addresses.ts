import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organizations } from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// ADDRESS ENUMS
// ==============================

export const ADDRESS_ENTITY_TYPE = {
  user: "user",
  organization: "organization",
  customer: "customer",
  supplier: "supplier",
  warehouse: "warehouse",
  store: "store",
} as const;

export type AddressEntityType =
  (typeof ADDRESS_ENTITY_TYPE)[keyof typeof ADDRESS_ENTITY_TYPE];

// ==============================
// ADDRESSES
// ==============================

export const addresses = pgTable(
  "addresses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),

    // polymorphic owner
    entityType: text("entity_type").$type<AddressEntityType>().notNull(),
    entityId: text("entity_id").notNull(),

    // address fields
    label: text("label"), // "Rumah", "Kantor", "Gudang"
    recipientName: text("recipient_name"),
    phoneNumber: text("phone_number"),
    line1: text("line1").notNull(),
    line2: text("line2"),

    // Indonesian regions
    province: text("province"), // e.g. "Jawa Barat"
    city: text("city"), // e.g. "Bandung"
    district: text("district"), // kecamatan
    subdistrict: text("subdistrict"), // kelurahan
    postalCode: text("postal_code"),
    country: text("country").default("ID").notNull(),

    // geo
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),

    isDefault: boolean("is_default").default(false).notNull(),
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
    index("addresses_entity_idx").on(table.entityType, table.entityId),
    index("addresses_org_id_idx").on(table.organizationId),
    index("addresses_postal_code_idx").on(table.postalCode),
  ]
);

export const addressesRelations = relations(addresses, ({ one }) => ({
  organization: one(organizations, {
    fields: [addresses.organizationId],
    references: [organizations.id],
  }),
}));
