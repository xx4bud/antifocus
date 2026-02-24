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
import { orders } from "~/lib/db/schemas/orders";
import { organizations } from "~/lib/db/schemas/organizations";
import { products, productVariants } from "~/lib/db/schemas/products";
import { customers } from "~/lib/db/schemas/stores";
import { users } from "~/lib/db/schemas/users";
import { uuid } from "~/utils/ids";

// ==============================
// INVOICE ENUMS
// ==============================

export const INVOICE_STATUS = {
  draft: "draft",
  sent: "sent",
  viewed: "viewed",
  paid: "paid",
  partially_paid: "partially_paid",
  overdue: "overdue",
  cancelled: "cancelled",
  void: "void",
} as const;

export type InvoiceStatus =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

// ==============================
// INVOICES
// ==============================

export const invoices = pgTable(
  "invoices",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => orders.id),
    customerId: text("customer_id").references(() => customers.id),

    invoiceNumber: text("invoice_number").notNull(),
    status: text("status").$type<InvoiceStatus>().default("draft").notNull(),

    // amounts
    subtotal: numeric("subtotal", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discountAmount: numeric("discount_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 })
      .default("11.00")
      .notNull(), // PPN 11%
    taxAmount: numeric("tax_amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    total: numeric("total", { precision: 19, scale: 4 }).default("0").notNull(),
    amountPaid: numeric("amount_paid", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    amountDue: numeric("amount_due", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),

    // multi-currency
    currencyCode: text("currency_code").default("IDR").notNull(),
    exchangeRate: numeric("exchange_rate", { precision: 19, scale: 6 })
      .default("1")
      .notNull(),

    // tax info
    taxId: text("tax_id"), // NPWP penerima
    companyTaxId: text("company_tax_id"), // NPWP pengirim

    // dates
    issuedAt: timestamp("issued_at", { mode: "date", withTimezone: true }),
    dueAt: timestamp("due_at", { mode: "date", withTimezone: true }),
    paidAt: timestamp("paid_at", { mode: "date", withTimezone: true }),

    // addresses (snapshot)
    billingAddress: jsonb("billing_address"),
    notes: text("notes"),
    terms: text("terms"),
    metadata: jsonb("metadata"),

    createdBy: text("created_by").references(() => users.id),

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
    uniqueIndex("invoices_org_number_uidx").on(
      table.organizationId,
      table.invoiceNumber
    ),
    index("invoices_org_id_idx").on(table.organizationId),
    index("invoices_order_id_idx").on(table.orderId),
    index("invoices_customer_id_idx").on(table.customerId),
    index("invoices_status_idx").on(table.status),
    index("invoices_due_at_idx").on(table.dueAt),
  ]
);

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  createdByUser: one(users, {
    fields: [invoices.createdBy],
    references: [users.id],
  }),
  items: many(invoiceItems),
  creditNotes: many(creditNotes),
}));

// ==============================
// INVOICE ITEMS
// ==============================

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id),
    productVariantId: text("product_variant_id").references(
      () => productVariants.id
    ),

    description: text("description").notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    discount: numeric("discount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 })
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
    index("invoice_items_invoice_id_idx").on(table.invoiceId),
    index("invoice_items_product_id_idx").on(table.productId),
  ]
);

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [invoiceItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// ==============================
// CREDIT NOTES
// ==============================

export const creditNotes = pgTable(
  "credit_notes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuid()),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    creditNoteNumber: text("credit_note_number").notNull(),
    amount: numeric("amount", { precision: 19, scale: 4 })
      .default("0")
      .notNull(),
    reason: text("reason"),

    issuedBy: text("issued_by").references(() => users.id),
    issuedAt: timestamp("issued_at", { mode: "date", withTimezone: true }),
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
    uniqueIndex("credit_notes_org_number_uidx").on(
      table.organizationId,
      table.creditNoteNumber
    ),
    index("credit_notes_invoice_id_idx").on(table.invoiceId),
    index("credit_notes_org_id_idx").on(table.organizationId),
  ]
);

export const creditNotesRelations = relations(creditNotes, ({ one }) => ({
  invoice: one(invoices, {
    fields: [creditNotes.invoiceId],
    references: [invoices.id],
  }),
  organization: one(organizations, {
    fields: [creditNotes.organizationId],
    references: [organizations.id],
  }),
  issuedByUser: one(users, {
    fields: [creditNotes.issuedBy],
    references: [users.id],
  }),
}));
