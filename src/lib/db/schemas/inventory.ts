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
import { organizations } from "~/lib/db/schemas/organizations";
import { productVariants } from "~/lib/db/schemas/products";
import { suppliers } from "~/lib/db/schemas/suppliers";
import { uuid } from "~/utils/ids";

// ==============================
// WAREHOUSE ENUMS
// ==============================

export const STOCK_MOVEMENT_TYPE = {
  in: "in",
  out: "out",
  adjustment: "adjustment",
  transfer: "transfer",
  return: "return",
  reserved: "reserved",
  released: "released",
} as const;

export type StockMovementType =
  (typeof STOCK_MOVEMENT_TYPE)[keyof typeof STOCK_MOVEMENT_TYPE];

export const PURCHASE_ORDER_STATUS = {
  draft: "draft",
  sent: "sent",
  confirmed: "confirmed",
  partial: "partial",
  received: "received",
  cancelled: "cancelled",
} as const;

export type PurchaseOrderStatus =
  (typeof PURCHASE_ORDER_STATUS)[keyof typeof PURCHASE_ORDER_STATUS];

// ==============================
// WAREHOUSES
// ==============================

export const warehouses = pgTable(
  "warehouses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    code: text("code"),
    address: text("address"),
    phoneNumber: text("phone_number"),

    isDefault: boolean("is_default").default(false).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
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
    uniqueIndex("warehouses_org_code_uidx").on(
      table.organizationId,
      table.code
    ),
    index("warehouses_org_id_idx").on(table.organizationId),
  ]
);

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [warehouses.organizationId],
    references: [organizations.id],
  }),
  inventoryItems: many(inventoryItems),
}));

// ==============================
// INVENTORY ITEMS
// ==============================

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    warehouseId: text("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "cascade" }),
    productVariantId: text("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),

    quantity: integer("quantity").default(0).notNull(),
    reservedQuantity: integer("reserved_quantity").default(0).notNull(),
    minStock: integer("min_stock").default(0).notNull(),
    maxStock: integer("max_stock"),
    reorderPoint: integer("reorder_point").default(0).notNull(),
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
    uniqueIndex("inventory_items_warehouse_variant_uidx").on(
      table.warehouseId,
      table.productVariantId
    ),
    index("inventory_items_warehouse_id_idx").on(table.warehouseId),
    index("inventory_items_variant_id_idx").on(table.productVariantId),
  ]
);

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  warehouse: one(warehouses, {
    fields: [inventoryItems.warehouseId],
    references: [warehouses.id],
  }),
  productVariant: one(productVariants, {
    fields: [inventoryItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// ==============================
// STOCK MOVEMENTS
// ==============================

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    productVariantId: text("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),

    type: text("type").$type<StockMovementType>().notNull(),
    quantity: integer("quantity").notNull(), // positive for in, negative for out
    previousQuantity: integer("previous_quantity").notNull(),
    newQuantity: integer("new_quantity").notNull(),

    // source/destination
    sourceWarehouseId: text("source_warehouse_id").references(
      () => warehouses.id
    ),
    destinationWarehouseId: text("destination_warehouse_id").references(
      () => warehouses.id
    ),

    // reference
    referenceType: text("reference_type"), // "order", "purchase_order", "adjustment", "transfer"
    referenceId: text("reference_id"),
    reason: text("reason"),
    performedBy: text("performed_by"), // userId
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("stock_movements_org_id_idx").on(table.organizationId),
    index("stock_movements_variant_id_idx").on(table.productVariantId),
    index("stock_movements_type_idx").on(table.type),
    index("stock_movements_reference_idx").on(
      table.referenceType,
      table.referenceId
    ),
    index("stock_movements_created_at_idx").on(table.createdAt),
  ]
);

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  organization: one(organizations, {
    fields: [stockMovements.organizationId],
    references: [organizations.id],
  }),
  productVariant: one(productVariants, {
    fields: [stockMovements.productVariantId],
    references: [productVariants.id],
  }),
  sourceWarehouse: one(warehouses, {
    fields: [stockMovements.sourceWarehouseId],
    references: [warehouses.id],
    relationName: "source",
  }),
  destinationWarehouse: one(warehouses, {
    fields: [stockMovements.destinationWarehouseId],
    references: [warehouses.id],
    relationName: "destination",
  }),
}));

// ==============================
// PURCHASE ORDERS
// ==============================

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    supplierId: text("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    warehouseId: text("warehouse_id")
      .notNull()
      .references(() => warehouses.id),

    poNumber: text("po_number").notNull(),
    status: text("status")
      .$type<PurchaseOrderStatus>()
      .default("draft")
      .notNull(),

    subtotal: numeric("subtotal", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    tax: numeric("tax", { precision: 19, scale: 4 }).default("0").notNull(),
    shippingCost: numeric("shipping_cost", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    totalAmount: numeric("total_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    currencyCode: text("currency_code").default("IDR").notNull(),

    notes: text("notes"),
    expectedAt: timestamp("expected_at", {
      mode: "date",
      withTimezone: true,
    }),
    receivedAt: timestamp("received_at", {
      mode: "date",
      withTimezone: true,
    }),
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
    uniqueIndex("purchase_orders_org_po_number_uidx").on(
      table.organizationId,
      table.poNumber
    ),
    index("purchase_orders_org_id_idx").on(table.organizationId),
    index("purchase_orders_supplier_id_idx").on(table.supplierId),
    index("purchase_orders_status_idx").on(table.status),
  ]
);

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [purchaseOrders.organizationId],
      references: [organizations.id],
    }),
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
    warehouse: one(warehouses, {
      fields: [purchaseOrders.warehouseId],
      references: [warehouses.id],
    }),
    items: many(purchaseOrderItems),
  })
);

// ==============================
// PURCHASE ORDER ITEMS
// ==============================

export const purchaseOrderItems = pgTable(
  "purchase_order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    purchaseOrderId: text("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "cascade" }),
    productVariantId: text("product_variant_id")
      .notNull()
      .references(() => productVariants.id),

    quantity: integer("quantity").notNull(),
    receivedQuantity: integer("received_quantity").default(0).notNull(),
    unitCost: numeric("unit_cost", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    total: numeric("total", { precision: 19, scale: 4 }).default("0").notNull(),
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
    index("purchase_order_items_po_id_idx").on(table.purchaseOrderId),
    index("purchase_order_items_variant_id_idx").on(table.productVariantId),
  ]
);

export const purchaseOrderItemsRelations = relations(
  purchaseOrderItems,
  ({ one }) => ({
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderItems.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    productVariant: one(productVariants, {
      fields: [purchaseOrderItems.productVariantId],
      references: [productVariants.id],
    }),
  })
);
