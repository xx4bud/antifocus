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
import type { OrderChannel, OrderStatus } from "~/lib/db/schemas/constants";
import { orderItemMedias } from "~/lib/db/schemas/medias";
import { customers, organizations } from "~/lib/db/schemas/organizations";
import { products, productVariants } from "~/lib/db/schemas/products";
import { uuid } from "~/utils/ids";

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
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),

    orderNumber: text("order_number").notNull(),
    channel: text("channel").$type<OrderChannel>().notNull(),
    status: text("status").$type<OrderStatus>().default("pending").notNull(),

    // pricing
    subTotal: numeric("sub_total", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discountAmount: numeric("discount_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    taxAmount: numeric("tax_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    shippingAmount: numeric("shipping_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    total: numeric("total", { precision: 19, scale: 4 }).default("0").notNull(),

    // multi-currency
    currency: text("currency").default("IDR").notNull(),
    exchangeRate: numeric("exchange_rate", { precision: 19, scale: 4 })
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
  orderItems: many(orderItems),
  payments: many(payments),
  refunds: many(refunds),
}));

import { payments, refunds } from "~/lib/db/schemas/payments";

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
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productVariantId: text("product_variant_id").references(
      () => productVariants.id,
      { onDelete: "set null" }
    ),

    // snapshot
    productName: text("product_name"),
    variantName: text("variant_name"),
    sku: text("sku"),

    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discountAmount: numeric("discount_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    taxAmount: numeric("tax_amount", { precision: 19, scale: 4 })
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
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    index("order_items_product_variant_id_idx").on(table.productVariantId),
  ]
);

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
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
  orderItemMedias: many(orderItemMedias),
}));
