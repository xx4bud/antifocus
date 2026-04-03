import { relations } from "drizzle-orm";
import {
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
 * Order enums
 */
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid",
  "paid",
  "refunded",
  "partially_refunded",
]);

export const orderItemStatusEnum = pgEnum("order_item_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

/**
 * Orders table
 */
export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    orderNumber: text("order_number").unique(), // human-readable order number

    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id),

    // financials — integer only (sen)
    subtotalAmount: integer("subtotal_amount").notNull(),
    shippingAmount: integer("shipping_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    taxAmount: integer("tax_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull(),

    // status
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("unpaid")
      .notNull(),

    // payment info
    paymentMethod: text("payment_method"), // "midtrans", "bank_transfer", etc.
    paymentId: text("payment_id"), // external payment provider ID
    paidAt: timestamp("paid_at", { withTimezone: true }),

    // shipping info
    shippingMethod: text("shipping_method"), // "biteship", "manual", etc.
    shippingTrackingNumber: text("shipping_tracking_number"),
    shippingCarrier: text("shipping_carrier"),
    shippingService: text("shipping_service"),

    // addresses
    shippingAddress: jsonb("shipping_address").$type<{
      name: string;
      phone: string;
      email?: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    }>(),
    billingAddress: jsonb("billing_address"), // same structure as shipping

    // notes
    customerNotes: text("customer_notes"),
    internalNotes: text("internal_notes"),

    // metadata
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
    index("orders_user_id_idx").on(table.userId),
    index("orders_org_id_idx").on(table.organizationId),
    index("orders_status_idx").on(table.status),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_order_number_idx").on(table.orderNumber),
  ]
);

/**
 * Order items table
 */
export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    // product info (snapshot at time of order)
    productId: text("product_id"),
    productName: text("product_name").notNull(),
    productSku: text("product_sku"),
    variantId: text("variant_id"),
    variantName: text("variant_name"),

    // pricing
    unitPrice: integer("unit_price").notNull(), // in sen
    quantity: integer("quantity").notNull(),
    totalPrice: integer("total_price").notNull(), // unitPrice * quantity

    // status per item (for partial fulfillment)
    status: orderItemStatusEnum("status").default("pending").notNull(),

    // design info (for custom products)
    designId: text("design_id"), // reference to design if custom

    // fulfillment
    fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),

    // metadata
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    index("order_items_status_idx").on(table.status),
  ]
);

/**
 * Order status history table (audit trail)
 */
export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    oldStatus: orderStatusEnum("old_status"),
    newStatus: orderStatusEnum("new_status").notNull(),
    changedBy: text("changed_by").references(() => users.id), // who made the change

    // context
    reason: text("reason"), // e.g., "payment_received", "customer_request"
    notes: text("notes"),

    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("order_status_history_order_id_idx").on(table.orderId),
    index("order_status_history_changed_by_idx").on(table.changedBy),
    index("order_status_history_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Relations
 */
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
    changedByUser: one(users, {
      fields: [orderStatusHistory.changedBy],
      references: [users.id],
    }),
  })
);

/**
 * Types
 */
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type NewOrderStatusHistory = typeof orderStatusHistory.$inferInsert;
