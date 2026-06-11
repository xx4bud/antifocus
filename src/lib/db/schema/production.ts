import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import {
  decimalColumn,
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
import { variants } from "./catalog";
import {
  DEFAULT_PRODUCTION_ORDER_STATUS,
  DEFAULT_PRODUCTION_PRIORITY,
  DEFAULT_PRODUCTION_TASK_STATUS,
  type ProductionOrderStatus,
  type ProductionPriority,
  type ProductionTaskStatus,
} from "./enums";
import { orderItems, orders } from "./order";
import { branches, members, organizations, suppliers } from "./org";
import { inventoryMovements } from "./supply";
import { units } from "./taxonomy";

// ==============================
// Bill of Materials (BOM)
// ==============================

export const billOfMaterials = pgTable(
  "bill_of_materials",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code"),
    instructions: text("instructions"),
    metadata: jsonbColumn("metadata"),

    enabled: trueColumn("enabled"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("bill_of_materials", table.organizationId),
    idx("bill_of_materials", table.variantId),
    uidx("bill_of_materials", table.organizationId, table.code),
  ]
);

export const billOfMaterialRelations = relations(
  billOfMaterials,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [billOfMaterials.organizationId],
      references: [organizations.id],
    }),

    // catalog
    variant: one(variants, {
      fields: [billOfMaterials.variantId],
      references: [variants.id],
    }),

    // items
    items: many(bomItems),
  })
);

export type BillOfMaterial = typeof billOfMaterials.$inferSelect;
export type BillOfMaterialInsert = typeof billOfMaterials.$inferInsert;

// ==============================
// BOM Items
// ==============================

export const bomItems = pgTable(
  "bom_items",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    bomId: text("bom_id")
      .notNull()
      .references(() => billOfMaterials.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "restrict" }),

    quantity: decimalColumn("quantity").notNull().default(1),
    unitId: text("unit_id").references(() => units.id, {
      onDelete: "set null",
    }),

    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("bom_items", table.organizationId),
    idx("bom_items", table.bomId),
    idx("bom_items", table.variantId),
    idx("bom_items", table.unitId),
    uidx("bom_items", table.bomId, table.variantId),
  ]
);

export const bomItemRelations = relations(bomItems, ({ one }) => ({
  // production
  bom: one(billOfMaterials, {
    fields: [bomItems.bomId],
    references: [billOfMaterials.id],
  }),

  // catalog
  variant: one(variants, {
    fields: [bomItems.variantId],
    references: [variants.id],
  }),

  // taxonomy
  unit: one(units, {
    fields: [bomItems.unitId],
    references: [units.id],
  }),
}));

export type BomItem = typeof bomItems.$inferSelect;
export type BomItemInsert = typeof bomItems.$inferInsert;

// ==============================
// Production Orders
// ==============================

export const productionOrders = pgTable(
  "production_orders",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: text("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),

    orderId: text("order_id").references(() => orders.id, {
      onDelete: "cascade",
    }),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),

    productionNumber: varcharColumn("production_number"),

    bomSnapshot: jsonbColumn("bom_snapshot"),

    status: text("status")
      .$type<ProductionOrderStatus>()
      .default(DEFAULT_PRODUCTION_ORDER_STATUS)
      .notNull(),
    priority: text("priority")
      .$type<ProductionPriority>()
      .default(DEFAULT_PRODUCTION_PRIORITY)
      .notNull(),

    startDate: timestampColumn("start_date"),
    targetDate: timestampColumn("target_date"),
    completedDate: timestampColumn("completed_date"),

    metadata: jsonbColumn("metadata"),

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("production_orders", table.organizationId),
    idx("production_orders", table.orderId),
    idx("production_orders", table.branchId),
    idx("production_orders", table.supplierId),
    uidx("production_orders", table.organizationId, table.productionNumber),
  ]
);

export const productionOrderRelations = relations(
  productionOrders,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [productionOrders.organizationId],
      references: [organizations.id],
    }),

    // org
    branch: one(branches, {
      fields: [productionOrders.branchId],
      references: [branches.id],
    }),
    supplier: one(suppliers, {
      fields: [productionOrders.supplierId],
      references: [suppliers.id],
    }),

    // order
    order: one(orders, {
      fields: [productionOrders.orderId],
      references: [orders.id],
    }),

    // items
    items: many(productionOrderItems),
    tasks: many(productionTasks),
  })
);

export type ProductionOrder = typeof productionOrders.$inferSelect;
export type ProductionOrderInsert = typeof productionOrders.$inferInsert;

// ==============================
// Production Order Items
// ==============================

export const productionOrderItems = pgTable(
  "production_order_items",
  {
    id: idColumn(),
    organizationId: text("organization_id").notNull(),
    productionOrderId: text("production_order_id")
      .notNull()
      .references(() => productionOrders.id, { onDelete: "cascade" }),
    variantId: text("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "cascade" }),
    orderItemId: text("order_item_id").references(() => orderItems.id, {
      onDelete: "set null",
    }),

    quantity: decimalColumn("quantity").notNull().default(0),
    completedQuantity: decimalColumn("completed_quantity").notNull().default(0),
    rejectedQuantity: decimalColumn("rejected_quantity").notNull().default(0),

    unitCost: decimalColumn("unit_cost"),

    metadata: jsonbColumn("metadata"),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
    updatedAt: timestampColumn("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    completedAt: timestampColumn("completed_at"),
  },
  (table) => [
    idx("production_order_items", table.organizationId),
    idx("production_order_items", table.productionOrderId),
    idx("production_order_items", table.variantId),
    idx("production_order_items", table.orderItemId),
  ]
);

export const productionOrderItemRelations = relations(
  productionOrderItems,
  ({ one, many }) => ({
    // production
    productionOrder: one(productionOrders, {
      fields: [productionOrderItems.productionOrderId],
      references: [productionOrders.id],
    }),

    // catalog
    variant: one(variants, {
      fields: [productionOrderItems.variantId],
      references: [variants.id],
    }),

    // order
    orderItem: one(orderItems, {
      fields: [productionOrderItems.orderItemId],
      references: [orderItems.id],
    }),

    // tasks
    tasks: many(productionTasks),

    // supply
    inventoryMovements: many(inventoryMovements),
  })
);

export type ProductionOrderItem = typeof productionOrderItems.$inferSelect;
export type ProductionOrderItemInsert =
  typeof productionOrderItems.$inferInsert;

// ==============================
// Production Tasks
// ==============================

export const productionTasks = pgTable(
  "production_tasks",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    productionOrderId: text("production_order_id")
      .notNull()
      .references(() => productionOrders.id, { onDelete: "cascade" }),
    productionOrderItemId: text("production_order_item_id").references(
      () => productionOrderItems.id,
      { onDelete: "cascade" }
    ),

    assigneeId: text("assignee_id").references(() => members.id, {
      onDelete: "set null",
    }),
    name: varcharColumn("name").notNull(),
    sequence: intColumn("sequence"),

    status: text("status")
      .$type<ProductionTaskStatus>()
      .default(DEFAULT_PRODUCTION_TASK_STATUS)
      .notNull(),

    startedAt: timestampColumn("started_at"),
    completedAt: timestampColumn("completed_at"),

    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("production_tasks", table.organizationId),
    idx("production_tasks", table.productionOrderId),
    idx("production_tasks", table.productionOrderItemId),
    idx("production_tasks", table.assigneeId),
  ]
);

export const productionTaskRelations = relations(
  productionTasks,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [productionTasks.organizationId],
      references: [organizations.id],
    }),

    // production
    productionOrder: one(productionOrders, {
      fields: [productionTasks.productionOrderId],
      references: [productionOrders.id],
    }),
    productionOrderItem: one(productionOrderItems, {
      fields: [productionTasks.productionOrderItemId],
      references: [productionOrderItems.id],
    }),

    // org
    assignee: one(members, {
      fields: [productionTasks.assigneeId],
      references: [members.id],
    }),

    // supply
    inventoryMovements: many(inventoryMovements),
  })
);

export type ProductionTask = typeof productionTasks.$inferSelect;
export type ProductionTaskInsert = typeof productionTasks.$inferInsert;
