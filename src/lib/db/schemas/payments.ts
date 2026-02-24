import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { orders } from "~/lib/db/schemas/orders";
import { organizations } from "~/lib/db/schemas/organizations";
import { users } from "~/lib/db/schemas/users";
import { uuid } from "~/utils/ids";

// ==============================
// PAYMENT ENUMS
// ==============================

export const PAYMENT_METHOD = {
  cash: "cash",
  bank_transfer: "bank_transfer",
  qris: "qris",
  ewallet: "ewallet", // GoPay, OVO, DANA, ShopeePay
  va: "va", // virtual account
  cod: "cod",
  credit_card: "credit_card",
  debit_card: "debit_card",
  other: "other",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_GATEWAY = {
  midtrans: "midtrans",
  xendit: "xendit",
  doku: "doku",
  ipaymu: "ipaymu",
  manual: "manual",
  cash: "cash",
} as const;

export type PaymentGateway =
  (typeof PAYMENT_GATEWAY)[keyof typeof PAYMENT_GATEWAY];

export const PAYMENT_STATUS = {
  pending: "pending",
  processing: "processing",
  paid: "paid",
  failed: "failed",
  expired: "expired",
  refunded: "refunded",
  partially_refunded: "partially_refunded",
  cancelled: "cancelled",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const REFUND_STATUS = {
  pending: "pending",
  processing: "processing",
  completed: "completed",
  failed: "failed",
  rejected: "rejected",
} as const;

export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];

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
    gateway: text("gateway")
      .$type<PaymentGateway>()
      .default("manual")
      .notNull(),
    gatewayRef: text("gateway_ref"), // external reference from gateway
    gatewayResponse: jsonb("gateway_response"), // raw response from gateway

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
    paymentId: text("payment_id")
      .notNull()
      .references(() => payments.id),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),

    amount: numeric("amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    reason: text("reason"),
    status: text("status").$type<RefundStatus>().default("pending").notNull(),
    gatewayRef: text("gateway_ref"),

    processedBy: text("processed_by").references(() => users.id),
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
    index("refunds_payment_id_idx").on(table.paymentId),
    index("refunds_order_id_idx").on(table.orderId),
    index("refunds_status_idx").on(table.status),
  ]
);

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  processedByUser: one(users, {
    fields: [refunds.processedBy],
    references: [users.id],
  }),
}));
