import { z } from "zod/v4";
import { codeSchema } from "@/lib/validations/code";
import { nameSchema } from "@/lib/validations/name";

// ==============================
// Tax Rates
// ==============================

export const createTaxRateSchema = z.object({
  name: nameSchema,
  code: codeSchema,
  rate: z.number().min(0).max(100),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateTaxRateInput = z.infer<typeof createTaxRateSchema>;

export const updateTaxRateSchema = createTaxRateSchema.partial();
export type UpdateTaxRateInput = z.infer<typeof updateTaxRateSchema>;

// ==============================
// Payment Methods
// ==============================

export const createPaymentMethodSchema = z.object({
  integrationId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  providerId: z.string().min(1, "Provider ID is required"),
  accountId: z.string().optional().nullable(),
  type: z.enum([
    "cash",
    "bank_transfer",
    "debit_card",
    "credit_card",
    "ewallet",
  ]),
  name: nameSchema,
  code: codeSchema,
  feeType: z.enum(["percentage", "fixed"]).optional().nullable(),
  feeValue: z.number().min(0).default(0),
  accountName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  currencyCode: z.string().length(3).default("IDR"),
  currentBalance: z.number().default(0),
  reconcileBalance: z.number().default(0),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreatePaymentMethodInput = z.infer<
  typeof createPaymentMethodSchema
>;

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();
export type UpdatePaymentMethodInput = z.infer<
  typeof updatePaymentMethodSchema
>;

// ==============================
// Invoices
// ==============================

export const createInvoiceSchema = z.object({
  branchId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  purchaseOrderId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  type: z.enum(["ar", "ap", "expense"]),
  dueDate: z.date().optional().nullable(),
  subtotal: z.number().min(0).default(0),
  taxTotal: z.number().min(0).default(0),
  discountTotal: z.number().min(0).default(0),
  grandTotal: z.number().min(0),
  amountDue: z.number().min(0),
  status: z
    .enum(["draft", "issued", "partially_paid", "paid", "overdue", "cancelled"])
    .default("draft"),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

// ==============================
// Payments
// ==============================

export const createPaymentSchema = z.object({
  paymentMethodId: z.string().min(1, "Payment Method ID is required"),
  invoiceId: z.string().min(1, "Invoice ID is required"),
  type: z.enum(["inbound", "outbound", "transfer"]),
  status: z
    .enum(["pending", "completed", "failed", "refunded"])
    .default("pending"),
  amount: z.number().positive(),
  paidAt: z.date().optional().nullable(),
  referenceId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

// ==============================
// Filters
// ==============================

export const financeFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type FinanceFiltersInput = z.infer<typeof financeFiltersSchema>;
