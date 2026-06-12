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
  varcharColumn,
} from "../helpers";
import { designAreas, pricelists, variants } from "./catalog";
import { files, integrations } from "./core";
import {
  DEFAULT_FULFILLMENT_STATUS,
  DEFAULT_ORDER_FULFILLMENT_STATUS,
  DEFAULT_ORDER_PAYMENT_STATUS,
  DEFAULT_ORDER_RETURN_STATUS,
  DEFAULT_ORDER_SESSION_STATUS,
  DEFAULT_ORDER_STATUS,
  type FulfillmentStatus,
  type OrderFulfillmentStatus,
  type OrderPaymentStatus,
  type OrderReturnStatus,
  type OrderSessionStatus,
  type OrderStatus,
} from "./enums";
import { invoices, paymentMethods } from "./finance";
import {
  promotions,
  promotionUsages,
  reviews,
  tickets,
  vouchers,
} from "./marketing";
import { branches, customers, members, organizations } from "./org";
import { productionOrderItems, productionOrders } from "./production";
import { inventoryMovements, shippingMethods } from "./supply";

// ==============================
// Order Sessions (POS)
// ==============================

export const orderSessions = pgTable(
  "order_sessions",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),

    name: varcharColumn("name").notNull(),
    status: text("status")
      .$type<OrderSessionStatus>()
      .default(DEFAULT_ORDER_SESSION_STATUS)
      .notNull(),

    openingBalance: decimalColumn("opening_balance").default(0),
    closingBalance: decimalColumn("closing_balance").default(0),
    actualBalance: decimalColumn("actual_balance").default(0),

    openedAt: timestampColumn("opened_at"),
    closedAt: timestampColumn("closed_at"),

    metadata: jsonbColumn("metadata"), // e.g. terminal/device info

    ...timestamps,
  },
  (table) => [
    idx("order_sessions", table.organizationId),
    idx("order_sessions", table.branchId),
    idx("order_sessions", table.memberId),
    idx("order_sessions", table.status),
  ]
);

export const orderSessionRelations = relations(
  orderSessions,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [orderSessions.organizationId],
      references: [organizations.id],
    }),

    // org
    branch: one(branches, {
      fields: [orderSessions.branchId],
      references: [branches.id],
    }),
    member: one(members, {
      fields: [orderSessions.memberId],
      references: [members.id],
    }),

    // order
    orders: many(orders),
  })
);

export type OrderSession = typeof orderSessions.$inferSelect;
export type OrderSessionInsert = typeof orderSessions.$inferInsert;

// ==============================
// Order Channels
// ==============================

export const orderChannels = pgTable(
  "order_channels",
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
    metadata: jsonbColumn("metadata"), // config/credentials

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("order_channels", table.organizationId),
    idx("order_channels", table.integrationId),
    idx("order_channels", table.code), // downgraded from uidx for soft delete
  ]
);

export const orderChannelRelations = relations(
  orderChannels,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [orderChannels.organizationId],
      references: [organizations.id],
    }),

    // core
    integration: one(integrations, {
      fields: [orderChannels.integrationId],
      references: [integrations.id],
    }),

    // catalog
    pricelists: many(pricelists),

    // marketing
    promotions: many(promotions),

    // order
    orders: many(orders),
  })
);

export type OrderChannel = typeof orderChannels.$inferSelect;
export type OrderChannelInsert = typeof orderChannels.$inferInsert;

// ==============================
// Orders
// ==============================

export const orders = pgTable(
  "orders",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: text("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),
    customerId: text("customer_id"),

    orderChannelId: text("order_channel_id").references(
      () => orderChannels.id,
      {
        onDelete: "set null",
      }
    ),
    paymentMethodId: text("payment_method_id").references(
      () => paymentMethods.id,
      { onDelete: "set null" }
    ),
    shippingMethodId: text("shipping_method_id").references(
      () => shippingMethods.id,
      { onDelete: "set null" }
    ),
    promotionId: text("promotion_id").references(() => promotions.id, {
      onDelete: "set null",
    }),
    voucherId: text("voucher_id").references(() => vouchers.id, {
      onDelete: "set null",
    }),
    sessionId: text("session_id").references(() => orderSessions.id, {
      onDelete: "set null",
    }),

    orderNumber: varcharColumn("order_number").notNull().unique(),

    subtotal: decimalColumn("subtotal").default(0).notNull(),
    discountTotal: decimalColumn("discount_total").default(0).notNull(),
    taxTotal: decimalColumn("tax_total").default(0).notNull(),
    shippingCost: decimalColumn("shipping_cost").default(0).notNull(),
    shippingTotal: decimalColumn("shipping_total").default(0).notNull(),
    grandTotal: decimalColumn("grand_total").default(0).notNull(),

    status: text("status")
      .$type<OrderStatus>()
      .default(DEFAULT_ORDER_STATUS)
      .notNull(),
    paymentStatus: text("payment_status")
      .$type<OrderPaymentStatus>()
      .default(DEFAULT_ORDER_PAYMENT_STATUS)
      .notNull(),
    fulfillmentStatus: text("fulfillment_status")
      .$type<OrderFulfillmentStatus>()
      .default(DEFAULT_ORDER_FULFILLMENT_STATUS)
      .notNull(),

    // Snapshot data
    shippingAddress: jsonbColumn("shipping_address"),
    billingAddress: jsonbColumn("billing_address"),
    shippingRate: jsonbColumn("shipping_rate"),

    metadata: jsonbColumn("metadata"), // additional order notes or custom fields

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("orders", table.organizationId),
    idx("orders", table.branchId),
    idx("orders", table.customerId),
    idx("orders", table.sessionId),
    idx("orders", table.status),
    idx("orders", table.orderNumber), // downgraded from uidx for soft delete
  ]
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),

  // org
  branch: one(branches, {
    fields: [orders.branchId],
    references: [branches.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),

  // order
  orderChannel: one(orderChannels, {
    fields: [orders.orderChannelId],
    references: [orderChannels.id],
  }),
  session: one(orderSessions, {
    fields: [orders.sessionId],
    references: [orderSessions.id],
  }),

  // finance
  paymentMethod: one(paymentMethods, {
    fields: [orders.paymentMethodId],
    references: [paymentMethods.id],
  }),

  // supply
  shippingMethod: one(shippingMethods, {
    fields: [orders.shippingMethodId],
    references: [shippingMethods.id],
  }),

  // marketing
  promotion: one(promotions, {
    fields: [orders.promotionId],
    references: [promotions.id],
  }),
  voucher: one(vouchers, {
    fields: [orders.voucherId],
    references: [vouchers.id],
  }),

  // order
  items: many(orderItems),
  fulfillment: many(fulfillments),
  orderReturns: many(orderReturns),

  // production
  productionOrders: many(productionOrders),

  // finance
  invoices: many(invoices),

  // marketing
  promotionUsages: many(promotionUsages),
  tickets: many(tickets),
}));

export type Order = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;

// ==============================
// Order Items
// ==============================

export const orderItems = pgTable(
  "order_items",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: text("variant_id").notNull(),
    promotionId: text("promotion_id"),

    quantity: decimalColumn("quantity").notNull().default(1),

    unitPrice: decimalColumn("unit_price").default(0),
    unitCost: decimalColumn("unit_cost").default(0),

    discountAmount: decimalColumn("discount_amount").default(0),
    taxAmount: decimalColumn("tax_amount").default(0),

    totalPrice: decimalColumn("total_price").default(0),

    metadata: jsonbColumn("metadata"), // snapshot of variant name/sku or line item notes

    ...timestamps,
  },
  (table) => [
    idx("order_items", table.orderId),
    idx("order_items", table.variantId),
  ]
);

export const orderItemRelations = relations(orderItems, ({ one, many }) => ({
  // order
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  // catalog
  variant: one(variants, {
    fields: [orderItems.variantId],
    references: [variants.id],
  }),

  // marketing
  promotion: one(promotions, {
    fields: [orderItems.promotionId],
    references: [promotions.id],
  }),

  // order
  designs: many(orderItemDesigns),

  // production
  productionOrderItems: many(productionOrderItems),
  fulfillmentItems: many(fulfillmentItems),
  orderReturnItems: many(orderReturnItems),

  // supply
  inventoryMovements: many(inventoryMovements),

  // marketing
  reviews: many(reviews),
  tickets: many(tickets),
}));

export type OrderItem = typeof orderItems.$inferSelect;
export type OrderItemInsert = typeof orderItems.$inferInsert;

// ==============================
// Order Item Designs (Customizations)
// ==============================

export const orderItemDesigns = pgTable(
  "order_item_designs",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderItemId: text("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    designAreaId: text("design_area_id").notNull(),
    fileId: text("file_id"),

    placementX: decimalColumn("placement_x"),
    placementY: decimalColumn("placement_y"),
    scale: decimalColumn("scale", 5, 2).notNull().default(1),
    rotation: decimalColumn("rotation", 5, 2).notNull().default(0),

    metadata: jsonbColumn("metadata"), // editor canvas state, layer configs

    ...timestamps,
  },
  (table) => [
    idx("order_item_designs", table.orderItemId),
    idx("order_item_designs", table.designAreaId),
    idx("order_item_designs", table.fileId),
  ]
);

export const orderItemDesignRelations = relations(
  orderItemDesigns,
  ({ one }) => ({
    // order
    orderItem: one(orderItems, {
      fields: [orderItemDesigns.orderItemId],
      references: [orderItems.id],
    }),

    // catalog
    designArea: one(designAreas, {
      fields: [orderItemDesigns.designAreaId],
      references: [designAreas.id],
    }),

    // core
    file: one(files, {
      fields: [orderItemDesigns.fileId],
      references: [files.id],
    }),
  })
);

export type OrderItemDesign = typeof orderItemDesigns.$inferSelect;
export type OrderItemDesignInsert = typeof orderItemDesigns.$inferInsert;

// ==============================
// Fulfillments
// ==============================

export const fulfillments = pgTable(
  "fulfillments",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    branchId: text("branch_id").notNull(),

    fulfillmentNumber: varcharColumn("fulfillment_number").notNull(),

    status: text("status")
      .$type<FulfillmentStatus>()
      .default(DEFAULT_FULFILLMENT_STATUS)
      .notNull(),

    shippingMethodId: text("shipping_method_id").references(
      () => shippingMethods.id,
      { onDelete: "set null" }
    ),
    trackingNumber: varcharColumn("tracking_number"),
    trackingUrl: text("tracking_url"),

    shippedAt: timestampColumn("shipped_at"),
    deliveredAt: timestampColumn("delivered_at"),

    metadata: jsonbColumn("metadata"), // courier API response snapshot

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("fulfillments", table.organizationId),
    idx("fulfillments", table.orderId),
    idx("fulfillments", table.branchId),
    idx("fulfillments", table.status),
    idx("fulfillments", table.fulfillmentNumber), // downgraded from uidx for soft delete
  ]
);

export const fulfillmentRelations = relations(
  fulfillments,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [fulfillments.organizationId],
      references: [organizations.id],
    }),

    // order
    order: one(orders, {
      fields: [fulfillments.orderId],
      references: [orders.id],
    }),

    // org
    branch: one(branches, {
      fields: [fulfillments.branchId],
      references: [branches.id],
    }),

    // supply
    shippingMethod: one(shippingMethods, {
      fields: [fulfillments.shippingMethodId],
      references: [shippingMethods.id],
    }),

    // items
    items: many(fulfillmentItems),
  })
);

export type Fulfillment = typeof fulfillments.$inferSelect;
export type FulfillmentInsert = typeof fulfillments.$inferInsert;

// ==============================
// Fulfillment Items
// ==============================

export const fulfillmentItems = pgTable(
  "fulfillment_items",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    fulfillmentId: text("fulfillment_id")
      .notNull()
      .references(() => fulfillments.id, { onDelete: "cascade" }),
    orderItemId: text("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "restrict" }),

    quantity: decimalColumn("quantity").notNull().default(1),

    createdAt: timestampColumn("created_at").notNull().defaultNow(),
  },
  (table) => [
    idx("fulfillment_items", table.fulfillmentId),
    idx("fulfillment_items", table.orderItemId),
  ]
);

export const fulfillmentItemRelations = relations(
  fulfillmentItems,
  ({ one, many }) => ({
    // order
    fulfillment: one(fulfillments, {
      fields: [fulfillmentItems.fulfillmentId],
      references: [fulfillments.id],
    }),
    orderItem: one(orderItems, {
      fields: [fulfillmentItems.orderItemId],
      references: [orderItems.id],
    }),

    // supply
    inventoryMovements: many(inventoryMovements),
  })
);

export type FulfillmentItem = typeof fulfillmentItems.$inferSelect;
export type FulfillmentItemInsert = typeof fulfillmentItems.$inferInsert;

// ==============================
// Order Returns
// ==============================

export const orderReturns = pgTable(
  "order_returns",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    branchId: text("branch_id").notNull(),

    returnNumber: varcharColumn("return_number").notNull(),

    status: text("status")
      .$type<OrderReturnStatus>()
      .default(DEFAULT_ORDER_RETURN_STATUS)
      .notNull(),
    reason: text("reason"),

    receivedAt: timestampColumn("received_at"),

    metadata: jsonbColumn("metadata"), // customer complaint details or return tracking info

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"),
  },
  (table) => [
    idx("order_returns", table.organizationId),
    idx("order_returns", table.orderId),
    idx("order_returns", table.branchId),
    idx("order_returns", table.status),
    idx("order_returns", table.returnNumber), // downgraded from uidx for soft delete
  ]
);

export const orderReturnRelations = relations(
  orderReturns,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [orderReturns.organizationId],
      references: [organizations.id],
    }),

    // order
    order: one(orders, {
      fields: [orderReturns.orderId],
      references: [orders.id],
    }),

    // org
    branch: one(branches, {
      fields: [orderReturns.branchId],
      references: [branches.id],
    }),

    // items
    items: many(orderReturnItems),
  })
);

export type OrderReturn = typeof orderReturns.$inferSelect;
export type OrderReturnInsert = typeof orderReturns.$inferInsert;

// ==============================
// Order Return Items
// ==============================

export const orderReturnItems = pgTable(
  "order_return_items",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderReturnId: text("order_return_id")
      .notNull()
      .references(() => orderReturns.id, { onDelete: "cascade" }),
    orderItemId: text("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "restrict" }),

    quantity: decimalColumn("quantity").notNull().default(1),
    receivedQuantity: decimalColumn("received_quantity").notNull().default(0),

    condition: text("condition"),
    metadata: jsonbColumn("metadata"),

    ...timestamps,
  },
  (table) => [
    idx("order_return_items", table.orderReturnId),
    idx("order_return_items", table.orderItemId),
  ]
);

export const orderReturnItemRelations = relations(
  orderReturnItems,
  ({ one, many }) => ({
    // order
    orderReturn: one(orderReturns, {
      fields: [orderReturnItems.orderReturnId],
      references: [orderReturns.id],
    }),
    orderItem: one(orderItems, {
      fields: [orderReturnItems.orderItemId],
      references: [orderItems.id],
    }),

    // supply
    inventoryMovements: many(inventoryMovements),
  })
);

export type OrderReturnItem = typeof orderReturnItems.$inferSelect;
export type OrderReturnItemInsert = typeof orderReturnItems.$inferInsert;
