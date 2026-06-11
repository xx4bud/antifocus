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
import { products } from "./catalog";
import { integrations } from "./core";
import {
  DEFAULT_INVOICE_STATUS,
  DEFAULT_PAYMENT_STATUS,
  type FeeType,
  type InvoiceStatus,
  type InvoiceType,
  type PaymentMethodType,
  type PaymentStatus,
  type PaymentType,
} from "./enums";
import { orders } from "./order";
import { branches, organizations, suppliers } from "./org";
import { purchaseOrders } from "./supply";

// ==============================
// Enums
// ==============================

// ==============================
// Tax Rates
// ==============================

export const taxRates = pgTable(
  "tax_rates",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    code: varcharColumn("code").notNull(),
    rate: decimalColumn("rate", 5, 2).notNull(),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // exceptions, notes

    deletedAt: timestampColumn("deleted_at"), // soft delete
    ...timestamps,
  },
  (table) => [
    idx("tax_rates", table.organizationId),
    idx("tax_rates", table.organizationId, table.code), // no unique — allow reuse after soft-delete; dedup at app layer
  ]
);

export const taxRateRelations = relations(taxRates, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [taxRates.organizationId],
    references: [organizations.id],
  }),
  products: many(products),
}));

export type TaxRate = typeof taxRates.$inferSelect;
export type TaxRateInsert = typeof taxRates.$inferInsert;

// ==============================
// Payment Methods
// ==============================

export const paymentMethods = pgTable(
  "payment_methods",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    integrationId: text("integration_id").references(() => integrations.id, {
      onDelete: "set null",
    }),
    branchId: text("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),
    providerId: text("provider_id").notNull(), // midtrans, manual
    accountId: text("account_id"),

    type: text("type").$type<PaymentMethodType>().notNull(),
    name: varcharColumn("name").notNull(),
    code: varcharColumn("code").notNull(),

    feeType: text("fee_type").$type<FeeType>(),
    feeValue: decimalColumn("fee_value").notNull().default(0),

    // bank account info
    accountName: varcharColumn("account_name"),
    accountNumber: varcharColumn("account_number"),

    currencyCode: varcharColumn("currency_code", 3).notNull().default("IDR"),
    currentBalance: decimalColumn("current_balance").notNull().default(0),
    balanceAt: timestampColumn("balance_at"),

    reconcileBalance: decimalColumn("reconcile_balance").notNull().default(0),
    reconcileAt: timestampColumn("reconcile_at"),

    enabled: trueColumn("enabled"),
    metadata: jsonbColumn("metadata"), // payment instructions, routing rules

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"), // soft delete
  },
  (table) => [
    idx("payment_methods", table.organizationId),
    idx("payment_methods", table.integrationId),
    idx("payment_methods", table.branchId),
    idx("payment_methods", table.organizationId, table.code), // no unique — allow reuse after soft-delete
  ]
);

export const paymentMethodRelations = relations(
  paymentMethods,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [paymentMethods.organizationId],
      references: [organizations.id],
    }),
    integration: one(integrations, {
      fields: [paymentMethods.integrationId],
      references: [integrations.id],
    }),
    branch: one(branches, {
      fields: [paymentMethods.branchId],
      references: [branches.id],
    }),
    payments: many(payments),
    orders: many(orders),
  })
);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type PaymentMethodInsert = typeof paymentMethods.$inferInsert;

// ==============================
// Invoices
// ==============================

export const invoices = pgTable(
  "invoices",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: text("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),

    // Polymorphic Document Relations
    orderId: text("order_id").references(() => orders.id, {
      onDelete: "set null",
    }), // null if type is ap / expense
    purchaseOrderId: text("purchase_order_id").references(
      () => purchaseOrders.id,
      {
        onDelete: "set null",
      }
    ), // null if type is ar / expense
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }), // null if type is ar / expense

    type: text("type").$type<InvoiceType>().notNull(), // ar (income), ap (bill), expense (opex)
    invoiceNumber: varcharColumn("invoice_number").notNull(), // sequential number (INV-XXX, BILL-XXX, EXP-XXX)
    dueDate: timestampColumn("due_date"),

    status: text("status")
      .$type<InvoiceStatus>()
      .default(DEFAULT_INVOICE_STATUS)
      .notNull(),

    subtotal: decimalColumn("subtotal").notNull().default(0),
    taxTotal: decimalColumn("tax_total").notNull().default(0),
    discountTotal: decimalColumn("discount_total").notNull().default(0),
    grandTotal: decimalColumn("grand_total").notNull().default(0),
    amountDue: decimalColumn("amount_due").notNull().default(0),

    metadata: jsonbColumn("metadata"), // notes, terms, PO reference, receipt attachments

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"), // soft delete
  },
  (table) => [
    idx("invoices", table.organizationId),
    idx("invoices", table.branchId),
    idx("invoices", table.orderId),
    idx("invoices", table.purchaseOrderId),
    idx("invoices", table.supplierId),
    idx("invoices", table.type),
    idx("invoices", table.status),
    idx("invoices", table.organizationId, table.invoiceNumber), // no unique — allow reuse after soft-delete
  ]
);

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
  branch: one(branches, {
    fields: [invoices.branchId],
    references: [branches.id],
  }),
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
  purchaseOrder: one(purchaseOrders, {
    fields: [invoices.purchaseOrderId],
    references: [purchaseOrders.id],
  }),
  supplier: one(suppliers, {
    fields: [invoices.supplierId],
    references: [suppliers.id],
  }),
  payments: many(payments),
}));

export type Invoice = typeof invoices.$inferSelect;
export type InvoiceInsert = typeof invoices.$inferInsert;

// ==============================
// Payments
// ==============================

export const payments = pgTable(
  "payments",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    paymentMethodId: text("payment_method_id")
      .notNull()
      .references(() => paymentMethods.id, { onDelete: "restrict" }),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }), // every payment references a unified invoice/bill/expense

    type: text("type").$type<PaymentType>().notNull(), // inbound (incoming cash) / outbound (outgoing cash)
    status: text("status")
      .$type<PaymentStatus>()
      .default(DEFAULT_PAYMENT_STATUS)
      .notNull(),

    amount: decimalColumn("amount").notNull(),
    paidAt: timestampColumn("paid_at"),

    referenceId: text("reference_id"), // external reference number (gateway trx ID, bank transfer reference)
    metadata: jsonbColumn("metadata"), // gateway response, receipt url

    ...timestamps,
    deletedAt: timestampColumn("deleted_at"), // soft delete
  },
  (table) => [
    idx("payments", table.organizationId),
    idx("payments", table.paymentMethodId),
    idx("payments", table.invoiceId),
    idx("payments", table.type),
    idx("payments", table.status),
  ]
);

export const paymentRelations = relations(payments, ({ one }) => ({
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [payments.paymentMethodId],
    references: [paymentMethods.id],
  }),
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

export type Payment = typeof payments.$inferSelect;
export type PaymentInsert = typeof payments.$inferInsert;
