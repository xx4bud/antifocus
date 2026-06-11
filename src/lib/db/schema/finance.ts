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
import { products } from "./catalog";
import { integrations } from "./core";
import {
  type BillStatus,
  DEFAULT_BILL_STATUS,
  DEFAULT_INVOICE_STATUS,
  DEFAULT_PAYMENT_STATUS,
  type FeeType,
  type InvoiceStatus,
  type PaymentMethodType,
  type PaymentStatus,
  type PaymentType,
} from "./enums";
import { orders } from "./order";
import { branches, organizations, suppliers } from "./org";
import { purchaseOrders } from "./supply";

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
    metadata: jsonbColumn("metadata"), // notes

    deletedAt: timestampColumn("deleted_at"),
    ...timestamps,
  },
  (table) => [
    idx("tax_rates", table.organizationId),
    uidx("tax_rates", table.organizationId, table.code),
  ]
);

export const taxRateRelations = relations(taxRates, ({ one, many }) => ({
  // core / org
  organization: one(organizations, {
    fields: [taxRates.organizationId],
    references: [organizations.id],
  }),

  // catalog
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
    metadata: jsonbColumn("metadata"), // routing

    ...timestamps,
  },
  (table) => [
    idx("payment_methods", table.organizationId),
    idx("payment_methods", table.integrationId),
    idx("payment_methods", table.branchId),
    uidx("payment_methods", table.organizationId, table.code),
  ]
);

export const paymentMethodRelations = relations(
  paymentMethods,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [paymentMethods.organizationId],
      references: [organizations.id],
    }),

    // core
    integration: one(integrations, {
      fields: [paymentMethods.integrationId],
      references: [integrations.id],
    }),

    // org
    branch: one(branches, {
      fields: [paymentMethods.branchId],
      references: [branches.id],
    }),

    // finance
    payments: many(payments),

    // order
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
    orderId: text("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),

    invoiceNumber: varcharColumn("invoice_number").notNull(),
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

    metadata: jsonbColumn("metadata"), // notes

    ...timestamps,
  },
  (table) => [
    idx("invoices", table.organizationId),
    idx("invoices", table.orderId),
    uidx("invoices", table.organizationId, table.invoiceNumber),
  ]
);

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),

  // order
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),

  // finance
  payments: many(payments),
}));

export type Invoice = typeof invoices.$inferSelect;
export type InvoiceInsert = typeof invoices.$inferInsert;

// ==============================
// Supplier Bills
// ==============================

export const supplierBills = pgTable(
  "supplier_bills",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    purchaseOrderId: text("purchase_order_id").references(
      () => purchaseOrders.id,
      { onDelete: "set null" }
    ),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),

    billNumber: varcharColumn("bill_number").notNull(),
    dueDate: timestampColumn("due_date"),

    status: text("status")
      .$type<BillStatus>()
      .default(DEFAULT_BILL_STATUS)
      .notNull(),

    grandTotal: decimalColumn("grand_total").notNull().default(0),
    amountDue: decimalColumn("amount_due").notNull().default(0),

    metadata: jsonbColumn("metadata"), // notes

    ...timestamps,
  },
  (table) => [
    idx("supplier_bills", table.organizationId),
    idx("supplier_bills", table.purchaseOrderId),
    idx("supplier_bills", table.supplierId),
    uidx("supplier_bills", table.organizationId, table.billNumber),
  ]
);

export const supplierBillRelations = relations(
  supplierBills,
  ({ one, many }) => ({
    // identity
    organization: one(organizations, {
      fields: [supplierBills.organizationId],
      references: [organizations.id],
    }),

    // supply
    purchaseOrder: one(purchaseOrders, {
      fields: [supplierBills.purchaseOrderId],
      references: [purchaseOrders.id],
    }),

    // org
    supplier: one(suppliers, {
      fields: [supplierBills.supplierId],
      references: [suppliers.id],
    }),

    // finance
    payments: many(payments),
  })
);

export type SupplierBill = typeof supplierBills.$inferSelect;
export type SupplierBillInsert = typeof supplierBills.$inferInsert;

// ==============================
// Expense Categories
// ==============================

export const expenseCategories = pgTable(
  "expense_categories",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    name: varcharColumn("name").notNull(),
    metadata: jsonbColumn("metadata"), // description

    ...timestamps,
  },
  (table) => [
    idx("expense_categories", table.organizationId),
    uidx("expense_categories", table.organizationId, table.name),
  ]
);

export const expenseCategoryRelations = relations(
  expenseCategories,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [expenseCategories.organizationId],
      references: [organizations.id],
    }),
    expenses: many(expenses),
  })
);

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type ExpenseCategoryInsert = typeof expenseCategories.$inferInsert;

// ==============================
// Expenses (OPEX)
// ==============================

export const expenses = pgTable(
  "expenses",
  {
    id: idColumn(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => expenseCategories.id, { onDelete: "restrict" }),
    branchId: text("branch_id").references(() => branches.id, {
      onDelete: "set null",
    }),

    title: varcharColumn("title").notNull(),
    amount: decimalColumn("amount").notNull(),
    date: timestampColumn("date").notNull(),

    referenceId: text("reference_id"),
    metadata: jsonbColumn("metadata"), // description

    ...timestamps,
  },
  (table) => [
    idx("expenses", table.organizationId),
    idx("expenses", table.categoryId),
    idx("expenses", table.branchId),
  ]
);

export const expenseRelations = relations(expenses, ({ one, many }) => ({
  // identity
  organization: one(organizations, {
    fields: [expenses.organizationId],
    references: [organizations.id],
  }),

  // finance
  category: one(expenseCategories, {
    fields: [expenses.categoryId],
    references: [expenseCategories.id],
  }),

  // org
  branch: one(branches, {
    fields: [expenses.branchId],
    references: [branches.id],
  }),

  // finance
  payments: many(payments),
}));

export type Expense = typeof expenses.$inferSelect;
export type ExpenseInsert = typeof expenses.$inferInsert;

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
    invoiceId: text("invoice_id").references(() => invoices.id, {
      onDelete: "set null",
    }),
    supplierBillId: text("supplier_bill_id").references(
      () => supplierBills.id,
      {
        onDelete: "set null",
      }
    ),
    expenseId: text("expense_id").references(() => expenses.id, {
      onDelete: "set null",
    }),

    type: text("type").$type<PaymentType>().notNull(),
    status: text("status")
      .$type<PaymentStatus>()
      .default(DEFAULT_PAYMENT_STATUS)
      .notNull(),

    amount: decimalColumn("amount").notNull(),
    paidAt: timestampColumn("paid_at"),

    referenceId: text("reference_id"),
    metadata: jsonbColumn("metadata"), // description

    ...timestamps,
  },
  (table) => [
    idx("payments", table.organizationId),
    idx("payments", table.paymentMethodId),
    idx("payments", table.invoiceId),
    idx("payments", table.supplierBillId),
    idx("payments", table.expenseId),
    idx("payments", table.type),
  ]
);

export const paymentRelations = relations(payments, ({ one }) => ({
  // identity
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
  }),

  // finance
  paymentMethod: one(paymentMethods, {
    fields: [payments.paymentMethodId],
    references: [paymentMethods.id],
  }),
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
  supplierBill: one(supplierBills, {
    fields: [payments.supplierBillId],
    references: [supplierBills.id],
  }),
  expense: one(expenses, {
    fields: [payments.expenseId],
    references: [expenses.id],
  }),
}));

export type Payment = typeof payments.$inferSelect;
export type PaymentInsert = typeof payments.$inferInsert;
