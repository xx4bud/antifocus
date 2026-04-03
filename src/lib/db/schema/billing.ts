import { relations } from "drizzle-orm";
import {
  boolean,
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
 * Billing enums
 */
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
]);

export const billingPaymentStatusEnum = pgEnum("billing_payment_status", [
  "pending",
  "completed",
  "failed",
  "cancelled",
  "refunded",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "inactive",
  "cancelled",
  "expired",
  "past_due",
]);

export const subscriptionIntervalEnum = pgEnum("subscription_interval", [
  "month",
  "year",
]);

/**
 * Invoices table
 */
export const invoices = pgTable(
  "invoices",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    invoiceNumber: text("invoice_number").unique(), // human-readable invoice number

    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id), // bill to user

    // Invoice details
    title: text("title").notNull(),
    description: text("description"),

    // Amounts (in sen)
    subtotalAmount: integer("subtotal_amount").notNull(),
    taxAmount: integer("tax_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull(),

    // Status and dates
    status: invoiceStatusEnum("status").default("draft").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),

    // Billing address
    billingAddress: jsonb("billing_address").$type<{
      name: string;
      email: string;
      phone?: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
      taxId?: string; // NPWP for Indonesia
    }>(),

    // Payment method
    paymentMethod: text("payment_method"), // "bank_transfer", "midtrans", etc.
    paymentId: text("payment_id"), // external payment reference

    // Notes
    notes: text("notes"),
    terms: text("terms"), // payment terms

    // Metadata
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
    index("invoices_org_id_idx").on(table.organizationId),
    index("invoices_user_id_idx").on(table.userId),
    index("invoices_status_idx").on(table.status),
    index("invoices_due_at_idx").on(table.dueAt),
    index("invoices_invoice_number_idx").on(table.invoiceNumber),
  ]
);

/**
 * Invoice items table
 */
export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),

    // Item details
    name: text("name").notNull(),
    description: text("description"),

    // Pricing
    unitPrice: integer("unit_price").notNull(), // in sen
    quantity: integer("quantity").notNull(),
    totalPrice: integer("total_price").notNull(), // calculated: unitPrice * quantity

    // Tax
    taxRate: integer("tax_rate"), // in basis points (e.g., 1000 = 10%)
    taxAmount: integer("tax_amount").notNull().default(0), // in sen

    // Reference to what this item is for
    referenceType: text("reference_type"), // "order", "subscription", "custom"
    referenceId: text("reference_id"), // ID of the referenced item

    // Metadata
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
    index("invoice_items_invoice_id_idx").on(table.invoiceId),
    index("invoice_items_reference_idx").on(
      table.referenceType,
      table.referenceId
    ),
  ]
);

/**
 * Payments table
 */
export const payments = pgTable(
  "payments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    // References
    invoiceId: text("invoice_id").references(() => invoices.id, {
      onDelete: "set null",
    }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id),

    // Payment details
    amount: integer("amount").notNull(), // in sen
    currency: text("currency").default("IDR").notNull(),

    // Payment method and provider
    paymentMethod: text("payment_method").notNull(), // "bank_transfer", "midtrans", "manual"
    paymentProvider: text("payment_provider"), // "bca", "mandiri", "midtrans"
    paymentId: text("payment_id"), // external payment reference

    // Status
    status: billingPaymentStatusEnum("status").default("pending").notNull(),

    // Transaction details
    transactionId: text("transaction_id"), // bank transaction ID
    referenceNumber: text("reference_number"), // payment reference

    // Processing info
    processedAt: timestamp("processed_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    failureReason: text("failure_reason"),

    // Notes
    notes: text("notes"),

    // Metadata
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
    index("payments_invoice_id_idx").on(table.invoiceId),
    index("payments_org_id_idx").on(table.organizationId),
    index("payments_user_id_idx").on(table.userId),
    index("payments_status_idx").on(table.status),
    index("payments_payment_id_idx").on(table.paymentId),
    index("payments_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Subscriptions table
 */
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),

    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),

    // Subscription details
    name: text("name").notNull(),
    description: text("description"),

    // Billing
    amount: integer("amount").notNull(), // monthly/yearly amount in sen
    currency: text("currency").default("IDR").notNull(),
    interval: subscriptionIntervalEnum("interval").default("month").notNull(),

    // Status and dates
    status: subscriptionStatusEnum("status").default("active").notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),
    trialEnd: timestamp("trial_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

    // Payment
    paymentMethod: text("payment_method"), // stored payment method reference

    // Metadata
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
    index("subscriptions_org_id_idx").on(table.organizationId),
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_current_period_end_idx").on(table.currentPeriodEnd),
  ]
);

/**
 * Subscription items table (for plan features/limits)
 */
export const subscriptionItems = pgTable(
  "subscription_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    subscriptionId: text("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),

    // Item details
    name: text("name").notNull(), // e.g., "Orders per month", "Storage GB"
    value: integer("value").notNull(), // quantity or limit

    // Metadata
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
    index("subscription_items_subscription_id_idx").on(table.subscriptionId),
  ]
);

/**
 * Relations
 */
export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  items: many(invoiceItems),
  payments: many(payments),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [subscriptions.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [subscriptions.userId],
      references: [users.id],
    }),
    items: many(subscriptionItems),
  })
);

export const subscriptionItemsRelations = relations(
  subscriptionItems,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionItems.subscriptionId],
      references: [subscriptions.id],
    }),
  })
);

/**
 * Types
 */
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type SubscriptionItem = typeof subscriptionItems.$inferSelect;
export type NewSubscriptionItem = typeof subscriptionItems.$inferInsert;
