import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import {
  decimalColumn,
  idColumn,
  idx,
  jsonbColumn,
  timestampColumn,
  timestamps,
  trueColumn,
  uidx,
  varcharColumn,
} from "../helpers";
import { variants } from "./catalog";
import { integrations } from "./core";
import {
  DEFAULT_INVENTORY_TRANSFER_STATUS,
  DEFAULT_PURCHASE_ORDER_STATUS,
  DEFAULT_PURCHASE_PAYMENT_STATUS,
  type InventoryMovementType,
  type InventoryTransferStatus,
  type PurchaseOrderStatus,
  type PurchasePaymentStatus,
} from "./enums";
import {
  fulfillmentItems,
  fulfillments,
  orderItems,
  orderReturnItems,
  orders,
} from "./order";
import { branches, organizations, suppliers } from "./org";
import { productionOrderItems, productionTasks } from "./production";

// ==============================
// Couriers
// ==============================

export const couriers = pgTable(
  "couriers",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    integrationId: text("integration_id").references(() => integrations.id, {
      onDelete: "set null",
    }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // tracking config, integration details

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("couriers", table.organizationId),
    idx("couriers", table.integrationId),
    idx("couriers", table.organizationId, table.code), // no unique — allow reuse after soft delete
  ]
);

export const courierRelations = relations(couriers, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [couriers.organizationId],
    references: [organizations.id],
  }),

  // core
  integration: one(integrations, {
    fields: [couriers.integrationId],
    references: [integrations.id],
  }),

  // supply
  methods: many(shippingMethods),
}));

export type Courier = typeof couriers.$inferSelect;
export type CourierInsert = typeof couriers.$inferInsert;

// ==============================
// Shipping Methods
// ==============================

export const shippingMethods = pgTable(
  "shipping_methods",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    courierId: text("courier_id")
      .notNull()
      .references(() => couriers.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code").notNull(),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // constraints, dimensions rules

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("shipping_methods", table.organizationId),
    idx("shipping_methods", table.courierId),
    idx("shipping_methods", table.courierId, table.code), // no unique — allow reuse after soft delete
  ]
);

export const shippingMethodRelations = relations(
  shippingMethods,
  ({ one, many }) => ({
    // supply
    courier: one(couriers, {
      fields: [shippingMethods.courierId],
      references: [couriers.id],
    }),
    rates: many(shippingRates),

    // order
    orders: many(orders),
    transfers: many(inventoryTransfers),
    fulfillments: many(fulfillments),
  })
);

export type ShippingMethod = typeof shippingMethods.$inferSelect;
export type ShippingMethodInsert = typeof shippingMethods.$inferInsert;

// ==============================
// Shipping Rates
// ==============================

export const shippingRates = pgTable(
  "shipping_rates",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    shippingMethodId: text("shipping_method_id")
      .notNull()
      .references(() => shippingMethods.id, { onDelete: "cascade" }),

    name: varcharColumn("name"),
    originCode: varcharColumn("origin_code"),
    destinationCode: varcharColumn("destination_code"),

    minWeight: decimalColumn("min_weight").notNull().default(0),
    maxWeight: decimalColumn("max_weight").notNull().default(0),

    cost: decimalColumn("cost"),
    price: decimalColumn("price"),

    estimatedDays: varcharColumn("estimated_days"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // specific conditions, surcharges

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("shipping_rates", table.organizationId),
    idx("shipping_rates", table.shippingMethodId),
  ]
);

export const shippingRateRelations = relations(shippingRates, ({ one }) => ({
  // supply
  shippingMethod: one(shippingMethods, {
    fields: [shippingRates.shippingMethodId],
    references: [shippingMethods.id],
  }),
}));

export type ShippingRate = typeof shippingRates.$inferSelect;
export type ShippingRateInsert = typeof shippingRates.$inferInsert;

// ==============================
// Purchase Orders
// ==============================

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    supplierId: text("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "restrict" }),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "restrict" }),

    purchaseNumber: varcharColumn("purchase_number").notNull(),

    status: text("status")
      .$type<PurchaseOrderStatus>()
      .default(DEFAULT_PURCHASE_ORDER_STATUS)
      .notNull(),
    paymentStatus: text("payment_status")
      .$type<PurchasePaymentStatus>()
      .default(DEFAULT_PURCHASE_PAYMENT_STATUS)
      .notNull(),

    // Financials
    subtotal: decimalColumn("subtotal"),
    taxTotal: decimalColumn("tax_total"),
    shippingTotal: decimalColumn("shipping_total"),
    grandTotal: decimalColumn("grand_total"),

    orderDate: timestampColumn("order_date"),
    expectedDeliveryDate: timestampColumn("expected_delivery_date"),

    notes: text("notes"),
    metadata: jsonbColumn("metadata"), // vendor notes, terms of delivery

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("purchase_orders", table.organizationId),
    idx("purchase_orders", table.supplierId),
    idx("purchase_orders", table.branchId),
    idx("purchase_orders", table.status),
    idx("purchase_orders", table.organizationId, table.purchaseNumber), // no unique — allow reuse after soft delete
  ]
);

export const purchaseOrderRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [purchaseOrders.organizationId],
      references: [organizations.id],
    }),

    // org
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
    branch: one(branches, {
      fields: [purchaseOrders.branchId],
      references: [branches.id],
    }),

    // supply
    items: many(purchaseOrderItems),
  })
);

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type PurchaseOrderInsert = typeof purchaseOrders.$inferInsert;

// ==============================
// Purchase Order Items
// ==============================

export const purchaseOrderItems = pgTable(
  "purchase_order_items",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    purchaseOrderId: text("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "restrict" }),

    quantity: decimalColumn("quantity").notNull().default(1),
    receivedQuantity: decimalColumn("received_quantity").notNull().default(0),

    unitCost: decimalColumn("unit_cost"),
    totalCost: decimalColumn("total_cost"),

    metadata: jsonbColumn("metadata"), // quality checks, receiving notes

    ...timestamps,
  },
  (table) => [
    idx("purchase_order_items", table.purchaseOrderId),
    idx("purchase_order_items", table.variantId),
  ]
);

export const purchaseOrderItemRelations = relations(
  purchaseOrderItems,
  ({ one, many }) => ({
    // supply
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderItems.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    inventoryMovements: many(inventoryMovements),

    // catalog
    variant: one(variants, {
      fields: [purchaseOrderItems.variantId],
      references: [variants.id],
    }),
  })
);

export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type PurchaseOrderItemInsert = typeof purchaseOrderItems.$inferInsert;

// ==============================
// Inventory
// ==============================

export const inventories = pgTable(
  "inventories",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),

    available: decimalColumn("available").notNull().default(0),
    reserved: decimalColumn("reserved").notNull().default(0),
    incoming: decimalColumn("incoming").notNull().default(0),

    unitCost: decimalColumn("unit_cost"),

    ...timestamps,
  },
  (table) => [
    idx("inventories", table.organizationId),
    idx("inventories", table.branchId),
    idx("inventories", table.variantId),
    uidx("inventories", table.branchId, table.variantId),
  ]
);

export const inventoryRelations = relations(inventories, ({ one }) => ({
  // identity
  organization: one(organizations, {
    fields: [inventories.organizationId],
    references: [organizations.id],
  }),

  // org
  branch: one(branches, {
    fields: [inventories.branchId],
    references: [branches.id],
  }),

  // catalog
  variant: one(variants, {
    fields: [inventories.variantId],
    references: [variants.id],
  }),
}));

export type Inventory = typeof inventories.$inferSelect;
export type InventoryInsert = typeof inventories.$inferInsert;

// ==============================
// Inventory Movements
// ==============================

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "restrict" }),

    type: text("type").$type<InventoryMovementType>().notNull(),
    quantity: decimalColumn("quantity").notNull(),
    unitCost: decimalColumn("unit_cost"),

    // Polymorphic references: Must link to EXACTLY ONE source document
    purchaseOrderItemId: text("purchase_order_item_id").references(
      () => purchaseOrderItems.id,
      { onDelete: "set null" }
    ),
    orderItemId: text("order_item_id").references(() => orderItems.id, {
      onDelete: "set null",
    }),
    productionOrderItemId: text("production_order_item_id").references(
      () => productionOrderItems.id,
      { onDelete: "set null" }
    ),
    productionTaskId: text("production_task_id").references(
      () => productionTasks.id,
      { onDelete: "set null" }
    ),
    inventoryTransferItemId: text("inventory_transfer_item_id").references(
      () => inventoryTransferItems.id,
      { onDelete: "set null" }
    ),
    fulfillmentItemId: text("fulfillment_item_id").references(
      () => fulfillmentItems.id,
      { onDelete: "set null" }
    ),
    orderReturnItemId: text("order_return_item_id").references(
      () => orderReturnItems.id,
      { onDelete: "set null" }
    ),

    reference: varcharColumn("reference"), // fallback manual reference if not linked to document
    metadata: jsonbColumn("metadata"), // adjustment reasons, batch numbers

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("inventory_movements", table.organizationId),
    idx("inventory_movements", table.branchId),
    idx("inventory_movements", table.variantId),
    idx("inventory_movements", table.type),
  ]
);

export const inventoryMovementRelations = relations(
  inventoryMovements,
  ({ one }) => ({
    // identity
    organization: one(organizations, {
      fields: [inventoryMovements.organizationId],
      references: [organizations.id],
    }),

    // org
    branch: one(branches, {
      fields: [inventoryMovements.branchId],
      references: [branches.id],
    }),

    // catalog
    variant: one(variants, {
      fields: [inventoryMovements.variantId],
      references: [variants.id],
    }),

    // supply
    purchaseOrderItem: one(purchaseOrderItems, {
      fields: [inventoryMovements.purchaseOrderItemId],
      references: [purchaseOrderItems.id],
    }),
    inventoryTransferItem: one(inventoryTransferItems, {
      fields: [inventoryMovements.inventoryTransferItemId],
      references: [inventoryTransferItems.id],
    }),

    // order
    orderItem: one(orderItems, {
      fields: [inventoryMovements.orderItemId],
      references: [orderItems.id],
    }),
    fulfillmentItem: one(fulfillmentItems, {
      fields: [inventoryMovements.fulfillmentItemId],
      references: [fulfillmentItems.id],
    }),
    orderReturnItem: one(orderReturnItems, {
      fields: [inventoryMovements.orderReturnItemId],
      references: [orderReturnItems.id],
    }),

    // production
    productionOrderItem: one(productionOrderItems, {
      fields: [inventoryMovements.productionOrderItemId],
      references: [productionOrderItems.id],
    }),
    productionTask: one(productionTasks, {
      fields: [inventoryMovements.productionTaskId],
      references: [productionTasks.id],
    }),
  })
);

export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type InventoryMovementInsert = typeof inventoryMovements.$inferInsert;

// ==============================
// Inventory Transfers
// ==============================

export const inventoryTransfers = pgTable(
  "inventory_transfers",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),

    transferNumber: varcharColumn("transfer_number").notNull(),

    sourceBranchId: text("source_branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "restrict" }),
    destinationBranchId: text("destination_branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "restrict" }),

    status: text("status")
      .$type<InventoryTransferStatus>()
      .default(DEFAULT_INVENTORY_TRANSFER_STATUS)
      .notNull(),

    shippingMethodId: text("shipping_method_id").references(
      () => shippingMethods.id,
      { onDelete: "set null" }
    ),
    trackingNumber: varcharColumn("tracking_number"),
    shippingCost: decimalColumn("shipping_cost"),

    shippedAt: timestampColumn("shipped_at"),
    receivedAt: timestampColumn("received_at"),

    notes: text("notes"),
    metadata: jsonbColumn("metadata"), // delivery instructions, vehicle details

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("inventory_transfers", table.organizationId),
    idx("inventory_transfers", table.sourceBranchId),
    idx("inventory_transfers", table.destinationBranchId),
    idx("inventory_transfers", table.status),
    idx("inventory_transfers", table.organizationId, table.transferNumber), // no unique — allow reuse after soft delete
  ]
);

export const inventoryTransferRelations = relations(
  inventoryTransfers,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [inventoryTransfers.organizationId],
      references: [organizations.id],
    }),

    // org
    sourceBranch: one(branches, {
      fields: [inventoryTransfers.sourceBranchId],
      references: [branches.id],
      relationName: "transfer_source",
    }),
    destinationBranch: one(branches, {
      fields: [inventoryTransfers.destinationBranchId],
      references: [branches.id],
      relationName: "transfer_destination",
    }),

    // supply
    shippingMethod: one(shippingMethods, {
      fields: [inventoryTransfers.shippingMethodId],
      references: [shippingMethods.id],
    }),
    items: many(inventoryTransferItems),
  })
);

export type InventoryTransfer = typeof inventoryTransfers.$inferSelect;
export type InventoryTransferInsert = typeof inventoryTransfers.$inferInsert;

// ==============================
// Inventory Transfer Items
// ==============================

export const inventoryTransferItems = pgTable(
  "inventory_transfer_items",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    inventoryTransferId: text("inventory_transfer_id")
      .notNull()
      .references(() => inventoryTransfers.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "restrict" }),

    quantity: decimalColumn("quantity").notNull().default(1),
    receivedQuantity: decimalColumn("received_quantity").notNull().default(0),

    unitCost: decimalColumn("unit_cost"),

    metadata: jsonbColumn("metadata"), // discrepancies, damage notes

    ...timestamps,
  },
  (table) => [
    idx("inventory_transfer_items", table.inventoryTransferId),
    idx("inventory_transfer_items", table.variantId),
  ]
);

export const inventoryTransferItemRelations = relations(
  inventoryTransferItems,
  ({ one, many }) => ({
    // supply
    inventoryTransfer: one(inventoryTransfers, {
      fields: [inventoryTransferItems.inventoryTransferId],
      references: [inventoryTransfers.id],
    }),
    inventoryMovements: many(inventoryMovements),

    // catalog
    variant: one(variants, {
      fields: [inventoryTransferItems.variantId],
      references: [variants.id],
    }),
  })
);

export type InventoryTransferItem = typeof inventoryTransferItems.$inferSelect;
export type InventoryTransferItemInsert =
  typeof inventoryTransferItems.$inferInsert;
