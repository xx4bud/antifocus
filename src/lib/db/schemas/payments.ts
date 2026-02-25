import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from "~/lib/db/schemas/constants";
import { orders } from "~/lib/db/schemas/orders";
import { members, organizations } from "~/lib/db/schemas/organizations";
import { uuid } from "~/utils/ids";

// ==============================
// PAYMENTS
// ==============================

export const payments = pgTable(
  "payments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),

    method: text("method").$type<PaymentMethod>().notNull(),
    gateway: text("gateway").$type<PaymentGateway>().notNull(),
    gatewayRef: text("gateway_ref"),
    gatewayResponse: jsonb("gateway_response"),

    amount: numeric("amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    currencyCode: text("currency_code").default("IDR").notNull(),
    exchangeRate: numeric("exchange_rate", { precision: 19, scale: 6 })
      .default("1")
      .notNull(),

    status: text("status").$type<PaymentStatus>().default("pending").notNull(),

    paidAt: timestamp("paid_at", { mode: "date", withTimezone: true }),
    expiredAt: timestamp("expired_at", { mode: "date", withTimezone: true }),
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
    index("payments_org_id_idx").on(table.organizationId),
    index("payments_order_id_idx").on(table.orderId),
    index("payments_status_idx").on(table.status),
    index("payments_gateway_ref_idx").on(table.gatewayRef),
    index("payments_method_idx").on(table.method),
  ]
);

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
  }),
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  refunds: many(refunds),
}));

// ==============================
// REFUNDS
// ==============================

export const refunds = pgTable(
  "refunds",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    paymentId: text("payment_id")
      .notNull()
      .references(() => payments.id),

    amount: numeric("amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    currencyCode: text("currency_code").default("IDR").notNull(),
    exchangeRate: numeric("exchange_rate", { precision: 19, scale: 6 })
      .default("1")
      .notNull(),

    reason: text("reason"),
    status: text("status").$type<RefundStatus>().default("pending").notNull(),

    gatewayRef: text("gateway_ref"),
    gatewayResponse: jsonb("gateway_response"),

    processedBy: text("processed_by").references(() => members.id),
    processedAt: timestamp("processed_at", {
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
    index("refunds_org_id_idx").on(table.organizationId),
    index("refunds_order_id_idx").on(table.orderId),
    index("refunds_payment_id_idx").on(table.paymentId),
    index("refunds_status_idx").on(table.status),
    index("refunds_gateway_ref_idx").on(table.gatewayRef),
  ]
);

export const refundsRelations = relations(refunds, ({ one }) => ({
  organization: one(organizations, {
    fields: [refunds.organizationId],
    references: [organizations.id],
  }),
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  processedByMember: one(members, {
    fields: [refunds.processedBy],
    references: [members.id],
  }),
}));
