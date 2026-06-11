import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  invoices,
  paymentMethods,
  payments,
  taxRates,
} from "@/lib/db/schema/finance";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// Tax Rate Mutations
// ==============================

export const insertTaxRate = async (
  orgId: string,
  data: Omit<typeof taxRates.$inferInsert, "organizationId">
): Promise<AppResult<typeof taxRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .insert(taxRates)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!rate) {
      throw createError("BAD_REQUEST", "Failed to create tax rate", 400);
    }

    return rate;
  }, parseError);

export const updateTaxRate = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof taxRates.$inferInsert, "organizationId">>
): Promise<AppResult<typeof taxRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .update(taxRates)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(taxRates.organizationId, orgId),
          eq(taxRates.id, id),
          isNull(taxRates.deletedAt)
        )
      )
      .returning();

    if (!rate) {
      throw createError(
        "TAX_RATE_NOT_FOUND",
        "Tax rate not found to update",
        404
      );
    }

    return rate;
  }, parseError);

export const softDeleteTaxRate = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof taxRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .update(taxRates)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(taxRates.organizationId, orgId),
          eq(taxRates.id, id),
          isNull(taxRates.deletedAt)
        )
      )
      .returning();

    if (!rate) {
      throw createError(
        "TAX_RATE_NOT_FOUND",
        "Tax rate not found to delete",
        404
      );
    }

    return rate;
  }, parseError);

// ==============================
// Payment Method Mutations
// ==============================

export const insertPaymentMethod = async (
  orgId: string,
  data: Omit<typeof paymentMethods.$inferInsert, "organizationId">
): Promise<AppResult<typeof paymentMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .insert(paymentMethods)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!method) {
      throw createError("BAD_REQUEST", "Failed to create payment method", 400);
    }

    return method;
  }, parseError);

export const updatePaymentMethod = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof paymentMethods.$inferInsert, "organizationId">>
): Promise<AppResult<typeof paymentMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .update(paymentMethods)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(paymentMethods.organizationId, orgId),
          eq(paymentMethods.id, id),
          isNull(paymentMethods.deletedAt)
        )
      )
      .returning();

    if (!method) {
      throw createError(
        "PAYMENT_METHOD_NOT_FOUND",
        "Payment method not found to update",
        404
      );
    }

    return method;
  }, parseError);

export const softDeletePaymentMethod = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof paymentMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .update(paymentMethods)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(paymentMethods.organizationId, orgId),
          eq(paymentMethods.id, id),
          isNull(paymentMethods.deletedAt)
        )
      )
      .returning();

    if (!method) {
      throw createError(
        "PAYMENT_METHOD_NOT_FOUND",
        "Payment method not found to delete",
        404
      );
    }

    return method;
  }, parseError);

// ==============================
// Invoice Mutations
// ==============================

export const insertInvoice = async (
  orgId: string,
  data: Omit<typeof invoices.$inferInsert, "organizationId">
): Promise<AppResult<typeof invoices.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [invoice] = await db
      .insert(invoices)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!invoice) {
      throw createError("BAD_REQUEST", "Failed to create invoice", 400);
    }

    return invoice;
  }, parseError);

export const updateInvoice = async (
  orgId: string,
  id: string,
  data: Partial<Omit<typeof invoices.$inferInsert, "organizationId">>
): Promise<AppResult<typeof invoices.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [invoice] = await db
      .update(invoices)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(invoices.organizationId, orgId),
          eq(invoices.id, id),
          isNull(invoices.deletedAt)
        )
      )
      .returning();

    if (!invoice) {
      throw createError(
        "INVOICE_NOT_FOUND",
        "Invoice not found to update",
        404
      );
    }

    return invoice;
  }, parseError);

// ==============================
// Payment Mutations
// ==============================

export const insertPayment = async (
  orgId: string,
  data: Omit<typeof payments.$inferInsert, "organizationId">
): Promise<AppResult<typeof payments.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [payment] = await db
      .insert(payments)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!payment) {
      throw createError("BAD_REQUEST", "Failed to create payment", 400);
    }

    return payment;
  }, parseError);
