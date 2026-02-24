import { relations } from "drizzle-orm";
import {
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
import { products, productVariants } from "~/lib/db/schemas/products";
import { customers, stores } from "~/lib/db/schemas/stores";
import { users } from "~/lib/db/schemas/users";
import { uuid } from "~/utils/ids";

// ==============================
// ORDER ENUMS
// ==============================

export const ORDER_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  processing: "processing",
  printing: "printing",
  quality_check: "quality_check",
  packing: "packing",
  shipped: "shipped",
  delivered: "delivered",
  completed: "completed",
  cancelled: "cancelled",
  refunded: "refunded",
  on_hold: "on_hold",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_CHANNEL = {
  pos: "pos",
  online: "online",
  marketplace: "marketplace",
  whatsapp: "whatsapp",
  manual: "manual",
} as const;

export type OrderChannel = (typeof ORDER_CHANNEL)[keyof typeof ORDER_CHANNEL];

export const PRINT_STATUS = {
  pending: "pending",
  queued: "queued",
  printing: "printing",
  done: "done",
  failed: "failed",
  skipped: "skipped",
} as const;

export type PrintStatus = (typeof PRINT_STATUS)[keyof typeof PRINT_STATUS];

export const SHIPMENT_STATUS = {
  pending: "pending",
  picked_up: "picked_up",
  in_transit: "in_transit",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  returned: "returned",
  failed: "failed",
} as const;

export type ShipmentStatus =
  (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

export const COURIER = {
  jne: "jne",
  jnt: "jnt",
  sicepat: "sicepat",
  anteraja: "anteraja",
  pos_indonesia: "pos_indonesia",
  tiki: "tiki",
  gosend: "gosend",
  grab: "grab",
  lalamove: "lalamove",
  custom: "custom",
  self_pickup: "self_pickup",
} as const;

export type Courier = (typeof COURIER)[keyof typeof COURIER];

// ==============================
// ORDERS
// ==============================

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    customerId: text("customer_id").references(() => customers.id),
    storeId: text("store_id").references(() => stores.id),

    orderNumber: text("order_number").notNull(),
    channel: text("channel").$type<OrderChannel>().default("online").notNull(),
    status: text("status").$type<OrderStatus>().default("pending").notNull(),

    // pricing
    subtotal: numeric("subtotal", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discountAmount: numeric("discount_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discountCode: text("discount_code"),
    taxAmount: numeric("tax_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    shippingCost: numeric("shipping_cost", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    total: numeric("total", { precision: 19, scale: 4 }).default("0").notNull(),

    // multi-currency
    currencyCode: text("currency_code").default("IDR").notNull(),
    exchangeRate: numeric("exchange_rate", { precision: 19, scale: 6 })
      .default("1")
      .notNull(),

    // addresses (snapshot — jsonb so they're immutable after order)
    shippingAddress: jsonb("shipping_address"),
    billingAddress: jsonb("billing_address"),

    // notes
    customerNotes: text("customer_notes"),
    internalNotes: text("internal_notes"),
    metadata: jsonb("metadata"),

    // timestamps
    confirmedAt: timestamp("confirmed_at", {
      mode: "date",
      withTimezone: true,
    }),
    completedAt: timestamp("completed_at", {
      mode: "date",
      withTimezone: true,
    }),
    cancelledAt: timestamp("cancelled_at", {
      mode: "date",
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (table) => [
    uniqueIndex("orders_org_order_number_uidx").on(
      table.organizationId,
      table.orderNumber
    ),
    index("orders_org_id_idx").on(table.organizationId),
    index("orders_customer_id_idx").on(table.customerId),
    index("orders_store_id_idx").on(table.storeId),
    index("orders_status_idx").on(table.status),
    index("orders_channel_idx").on(table.channel),
    index("orders_created_at_idx").on(table.createdAt),
  ]
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  items: many(orderItems),
  history: many(orderHistory),
  shipments: many(shipments),
}));

// ==============================
// ORDER ITEMS
// ==============================

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id),
    productVariantId: text("product_variant_id").references(
      () => productVariants.id
    ),

    // snapshot
    productName: text("product_name").notNull(),
    variantName: text("variant_name"),
    sku: text("sku"),

    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discount: numeric("discount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    total: numeric("total", { precision: 19, scale: 4 }).default("0").notNull(),

    // print on demand
    designFileUrl: text("design_file_url"),
    printStatus: text("print_status")
      .$type<PrintStatus>()
      .default("pending")
      .notNull(),
    printNotes: text("print_notes"),
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
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    index("order_items_print_status_idx").on(table.printStatus),
  ]
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// ==============================
// ORDER HISTORY
// ==============================

export const orderHistory = pgTable(
  "order_history",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    fromStatus: text("from_status").$type<OrderStatus>(),
    toStatus: text("to_status").$type<OrderStatus>().notNull(),
    note: text("note"),
    changedBy: text("changed_by").references(() => users.id),
    metadata: jsonb("metadata"),

    // timestamps
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("order_history_order_id_idx").on(table.orderId),
    index("order_history_created_at_idx").on(table.createdAt),
  ]
);

export const orderHistoryRelations = relations(orderHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderHistory.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [orderHistory.changedBy],
    references: [users.id],
  }),
}));

// ==============================
// SHIPMENTS
// ==============================

export const shipments = pgTable(
  "shipments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    courier: text("courier").$type<Courier>().notNull(),
    courierService: text("courier_service"), // e.g. "REG", "YES", "OKE"
    trackingNumber: text("tracking_number"),
    status: text("status").$type<ShipmentStatus>().default("pending").notNull(),

    weight: integer("weight"), // grams
    cost: numeric("cost", { precision: 19, scale: 4 }).default("0").notNull(),
    insuranceCost: numeric("insurance_cost", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),

    shippedAt: timestamp("shipped_at", { mode: "date", withTimezone: true }),
    deliveredAt: timestamp("delivered_at", {
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
    index("shipments_order_id_idx").on(table.orderId),
    index("shipments_tracking_number_idx").on(table.trackingNumber),
    index("shipments_status_idx").on(table.status),
    index("shipments_courier_idx").on(table.courier),
  ]
);

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
}));
