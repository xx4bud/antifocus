import { relations } from "drizzle-orm";
import { index, jsonb, pgEnum, pgTable } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const orderStatus = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "in_production",
  "quality_check",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
  "failed",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "authorized",
  "paid",
  "partially_refunded",
  "refunded",
  "failed",
  "cancelled",
]);

export const paymentMethod = pgEnum("payment_method", [
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
  "gopay",
  "ovo",
  "dana",
  "shopee_pay",
]);

export const fulfillmentStatus = pgEnum("fulfillment_status", [
  "pending",
  "queued",
  "in_production",
  "awaiting_pickup",
  "in_transit",
  "delivered",
  "failed",
  "cancelled",
]);

export const shippingMethod = pgEnum("shipping_method", [
  "standard",
  "express",
  "overnight",
  "international",
]);

export const refundReason = pgEnum("refund_reason", [
  "defective",
  "wrong_item",
  "damaged",
  "not_as_described",
  "customer_request",
  "duplicate_order",
  "other",
]);

export const refundStatus = pgEnum("refund_status", [
  "requested",
  "approved",
  "processing",
  "completed",
  "rejected",
]);

// ============================================================================
// ORDERS
// ============================================================================

export const orders = pgTable(
  "orders",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull(), // References users.id from auth DB

    // Order identification
    orderNumber: t.text().notNull().unique(), // Human-readable: "ORD-2025-000123"

    // Financial
    subtotal: t.numeric({ precision: 10, scale: 2 }).notNull(),
    discount: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    tax: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    shippingCost: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    total: t.numeric({ precision: 10, scale: 2 }).notNull(),
    currency: t.text().default("IDR").notNull(),

    // Discounts & promotions
    promoCode: t.text(),
    promoDiscount: t.numeric({ precision: 10, scale: 2 }).default("0"),
    creatorCommission: t.numeric({ precision: 10, scale: 2 }).default("0"),

    // Status tracking
    status: orderStatus().default("pending").notNull(),
    paymentStatus: paymentStatus().default("pending").notNull(),

    // Customer info (snapshot at time of order)
    customerEmail: t.text().notNull(),
    customerName: t.text().notNull(),
    customerPhone: t.text(),

    // Shipping address
    shippingAddress: jsonb()
      .$type<{
        firstName: string;
        lastName: string;
        company?: string;
        address1: string;
        address2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
      }>()
      .notNull(),

    // Billing address
    billingAddress: jsonb().$type<{
      firstName: string;
      lastName: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
    }>(),

    // Shipping info
    shippingMethod: shippingMethod().notNull(),
    estimatedDeliveryDate: t.timestamp(),
    actualDeliveryDate: t.timestamp(),

    // Special instructions
    customerNotes: t.text(),
    internalNotes: t.text(),

    // IP & fraud detection
    ipAddress: t.text(),
    userAgent: t.text(),
    fraudScore: t.integer().default(0),
    isFraudulent: t.boolean().default(false).notNull(),

    // Audit trails
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    confirmedAt: t.timestamp(),
    shippedAt: t.timestamp(),
    deliveredAt: t.timestamp(),
    cancelledAt: t.timestamp(),
    cancellationReason: t.text(),
  }),
  (table) => [
    index("orders_user_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_number_idx").on(table.orderNumber),
    index("orders_created_idx").on(table.createdAt),
  ]
);

export const orderItems = pgTable(
  "order_items",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t
      .uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    // Product references (from product DB)
    productId: t.uuid().notNull(),
    variantId: t.uuid(),
    designId: t.uuid(), // Custom design used

    // Item details (snapshot at time of order)
    productName: t.text().notNull(),
    variantName: t.text(),
    sku: t.text(),

    // Customization
    customization: jsonb().$type<{
      designUrl: string;
      printArea: string;
      position: { x: number; y: number; width: number; height: number };
      colors?: string[];
      text?: Array<{ content: string; font: string; color: string }>;
    }>(),

    // Pricing
    basePrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
    printCost: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    quantity: t.integer().notNull(),
    unitPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
    totalPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),

    // Production
    printProviderId: t.uuid(), // Assigned print provider
    productionStatus: fulfillmentStatus().default("pending").notNull(),
    productionStartedAt: t.timestamp(),
    productionCompletedAt: t.timestamp(),

    // Quality control
    qualityCheckPassed: t.boolean(),
    qualityCheckNotes: t.text(),
    qualityCheckBy: t.uuid(), // Staff user ID
    qualityCheckAt: t.timestamp(),

    // Creator commission
    creatorId: t.uuid(), // Design creator
    creatorCommission: t.numeric({ precision: 10, scale: 2 }).default("0"),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_product_idx").on(table.productId),
    index("order_items_creator_idx").on(table.creatorId),
  ]
);

// ============================================================================
// PAYMENTS
// ============================================================================

export const payments = pgTable(
  "payments",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t
      .uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    // Payment details
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    currency: t.text().default("IDR").notNull(),
    method: paymentMethod().notNull(),
    status: paymentStatus().default("pending").notNull(),

    // Payment gateway
    paymentGateway: t.text().notNull(), // "stripe", "paypal", "midtrans"
    transactionId: t.text(), // External transaction ID
    gatewayResponse: jsonb().$type<Record<string, unknown>>(),

    // Card info (last 4 digits only)
    cardLast4: t.text(),
    cardBrand: t.text(),

    // Fraud detection
    fraudScore: t.integer().default(0),
    riskLevel: t.text(), // "low", "medium", "high"

    // Idempotency
    idempotencyKey: t.text().unique(),

    // Timestamps
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    processedAt: t.timestamp(),
    authorizedAt: t.timestamp(),
    capturedAt: t.timestamp(),
    failedAt: t.timestamp(),
    failureReason: t.text(),
  }),
  (table) => [
    index("payments_order_idx").on(table.orderId),
    index("payments_status_idx").on(table.status),
    index("payments_transaction_idx").on(table.transactionId),
  ]
);

// ============================================================================
// FULFILLMENT
// ============================================================================

export const fulfillments = pgTable(
  "fulfillments",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t
      .uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    printProviderId: t.uuid().notNull(), // From product DB

    // Fulfillment details
    status: fulfillmentStatus().default("pending").notNull(),

    // Print provider info
    providerOrderId: t.text(), // External order ID at print provider
    providerStatus: t.text(),
    providerResponse: jsonb().$type<Record<string, unknown>>(),

    // Production
    productionStartedAt: t.timestamp(),
    productionCompletedAt: t.timestamp(),
    estimatedCompletionDate: t.timestamp(),

    // Quality assurance
    qualityCheckRequired: t.boolean().default(true).notNull(),
    qualityCheckPassed: t.boolean(),
    qualityNotes: t.text(),

    // Webhooks & notifications
    webhooksSent: jsonb().$type<Array<{ event: string; sentAt: string }>>(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("fulfillments_order_idx").on(table.orderId),
    index("fulfillments_provider_idx").on(table.printProviderId),
    index("fulfillments_status_idx").on(table.status),
  ]
);

export const fulfillmentItems = pgTable(
  "fulfillment_items",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    fulfillmentId: t
      .uuid()
      .notNull()
      .references(() => fulfillments.id, { onDelete: "cascade" }),
    orderItemId: t
      .uuid()
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),

    quantity: t.integer().notNull(),

    // Production files
    printFileUrl: t.text(), // Final print-ready file
    mockupUrl: t.text(), // Mockup preview

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("fulfillment_items_fulfillment_idx").on(table.fulfillmentId),
    index("fulfillment_items_order_item_idx").on(table.orderItemId),
  ]
);

// ============================================================================
// SHIPMENTS
// ============================================================================

export const shipments = pgTable(
  "shipments",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t
      .uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fulfillmentId: t.uuid().references(() => fulfillments.id),

    // Carrier info
    carrier: t.text().notNull(), // "JNE", "J&T", "FedEx"
    trackingNumber: t.text(),
    trackingUrl: t.text(),

    // Shipping details
    shippingMethod: shippingMethod().notNull(),
    serviceName: t.text(), // "REG", "YES", "Express"

    // Package info
    packageCount: t.integer().default(1).notNull(),
    weight: t.numeric({ precision: 8, scale: 2 }), // grams
    dimensions: jsonb().$type<{
      length: number;
      width: number;
      height: number;
      unit: string;
    }>(),

    // Costs
    shippingCost: t.numeric({ precision: 10, scale: 2 }).notNull(),
    insuranceCost: t.numeric({ precision: 10, scale: 2 }).default("0"),

    // Label & documentation
    labelUrl: t.text(),
    invoiceUrl: t.text(),

    // Tracking events
    trackingEvents:
      jsonb().$type<
        Array<{
          status: string;
          location: string;
          timestamp: string;
          description: string;
        }>
      >(),

    // Addresses (snapshot)
    fromAddress: jsonb().$type<{
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }>(),

    toAddress: jsonb().$type<{
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }>(),

    // Delivery
    estimatedDeliveryDate: t.timestamp(),
    actualDeliveryDate: t.timestamp(),
    deliveryProofUrl: t.text(), // Photo proof
    signedBy: t.text(),

    // Status
    status: t.text().default("pending").notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    shippedAt: t.timestamp(),
    deliveredAt: t.timestamp(),
  }),
  (table) => [
    index("shipments_order_idx").on(table.orderId),
    index("shipments_tracking_idx").on(table.trackingNumber),
  ]
);

// ============================================================================
// REFUNDS & RETURNS
// ============================================================================

export const refunds = pgTable(
  "refunds",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t
      .uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    paymentId: t.uuid().references(() => payments.id),

    // Refund details
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    currency: t.text().default("IDR").notNull(),
    reason: refundReason().notNull(),
    reasonDetails: t.text(),
    status: refundStatus().default("requested").notNull(),

    // Request
    requestedBy: t.uuid().notNull(), // User ID
    requestedAt: t.timestamp().notNull().defaultNow(),

    // Review
    reviewedBy: t.uuid(), // Admin user ID
    reviewedAt: t.timestamp(),
    reviewNotes: t.text(),

    // Processing
    refundMethod: t.text(), // "original_payment", "store_credit"
    transactionId: t.text(), // External refund transaction ID
    gatewayResponse: jsonb().$type<Record<string, unknown>>(),

    // Return shipping (if applicable)
    returnShippingRequired: t.boolean().default(false).notNull(),
    returnTrackingNumber: t.text(),
    returnLabelUrl: t.text(),

    // Evidence
    evidence:
      jsonb().$type<
        Array<{
          type: string; // "photo", "video", "description"
          url?: string;
          content?: string;
        }>
      >(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    processedAt: t.timestamp(),
    completedAt: t.timestamp(),
    rejectedAt: t.timestamp(),
  }),
  (table) => [
    index("refunds_order_idx").on(table.orderId),
    index("refunds_status_idx").on(table.status),
  ]
);

export const refundItems = pgTable(
  "refund_items",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    refundId: t
      .uuid()
      .notNull()
      .references(() => refunds.id, { onDelete: "cascade" }),
    orderItemId: t
      .uuid()
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),

    quantity: t.integer().notNull(),
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    reason: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("refund_items_refund_idx").on(table.refundId),
    index("refund_items_order_item_idx").on(table.orderItemId),
  ]
);

// ============================================================================
// INVOICES
// ============================================================================

export const invoices = pgTable(
  "invoices",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    orderId: t
      .uuid()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    // Invoice details
    invoiceNumber: t.text().notNull().unique(), // "INV-2025-000123"

    // Amounts
    subtotal: t.numeric({ precision: 10, scale: 2 }).notNull(),
    tax: t.numeric({ precision: 10, scale: 2 }).notNull(),
    discount: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    shippingCost: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    total: t.numeric({ precision: 10, scale: 2 }).notNull(),
    amountPaid: t.numeric({ precision: 10, scale: 2 }).default("0").notNull(),
    amountDue: t.numeric({ precision: 10, scale: 2 }).notNull(),
    currency: t.text().default("IDR").notNull(),

    // Status
    status: t.text().default("draft").notNull(), // "draft", "sent", "paid", "overdue", "void"

    // Dates
    issuedAt: t.timestamp(),
    dueAt: t.timestamp(),
    paidAt: t.timestamp(),

    // Files
    pdfUrl: t.text(),

    // Notes
    notes: t.text(),
    terms: t.text(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("invoices_order_idx").on(table.orderId),
    index("invoices_number_idx").on(table.invoiceNumber),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
  payments: many(payments),
  fulfillments: many(fulfillments),
  shipments: many(shipments),
  refunds: many(refunds),
  invoices: many(invoices),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  fulfillmentItems: many(fulfillmentItems),
  refundItems: many(refundItems),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  refunds: many(refunds),
}));

export const fulfillmentsRelations = relations(
  fulfillments,
  ({ one, many }) => ({
    order: one(orders, {
      fields: [fulfillments.orderId],
      references: [orders.id],
    }),
    fulfillmentItems: many(fulfillmentItems),
    shipments: many(shipments),
  })
);

export const fulfillmentItemsRelations = relations(
  fulfillmentItems,
  ({ one }) => ({
    fulfillment: one(fulfillments, {
      fields: [fulfillmentItems.fulfillmentId],
      references: [fulfillments.id],
    }),
    orderItem: one(orderItems, {
      fields: [fulfillmentItems.orderItemId],
      references: [orderItems.id],
    }),
  })
);

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
  fulfillment: one(fulfillments, {
    fields: [shipments.fulfillmentId],
    references: [fulfillments.id],
  }),
}));

export const refundsRelations = relations(refunds, ({ one, many }) => ({
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  refundItems: many(refundItems),
}));

export const refundItemsRelations = relations(refundItems, ({ one }) => ({
  refund: one(refunds, {
    fields: [refundItems.refundId],
    references: [refunds.id],
  }),
  orderItem: one(orderItems, {
    fields: [refundItems.orderItemId],
    references: [orderItems.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
}));
