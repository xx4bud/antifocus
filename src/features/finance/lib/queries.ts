import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, paymentMethods, taxRates } from "@/lib/db/schema/finance";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { FinanceFiltersInput } from "./validators";

// ==============================
// Tax Rate Queries
// ==============================

export const getTaxRateById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof taxRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .select()
      .from(taxRates)
      .where(
        and(
          eq(taxRates.organizationId, orgId),
          eq(taxRates.id, id),
          isNull(taxRates.deletedAt)
        )
      )
      .limit(1);

    if (!rate) {
      throw createError("TAX_RATE_NOT_FOUND", "Tax rate not found", 404);
    }

    return rate;
  }, parseError);

export const listTaxRates = async (
  orgId: string,
  filters: FinanceFiltersInput
): Promise<
  AppResult<{ items: (typeof taxRates.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(taxRates.organizationId, orgId),
      isNull(taxRates.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(taxRates.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(taxRates)
        .where(and(...conditions))
        .orderBy(desc(taxRates.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(taxRates)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Payment Method Queries
// ==============================

export const getPaymentMethodById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof paymentMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .select()
      .from(paymentMethods)
      .where(
        and(
          eq(paymentMethods.organizationId, orgId),
          eq(paymentMethods.id, id),
          isNull(paymentMethods.deletedAt)
        )
      )
      .limit(1);

    if (!method) {
      throw createError(
        "PAYMENT_METHOD_NOT_FOUND",
        "Payment method not found",
        404
      );
    }

    return method;
  }, parseError);

export const listPaymentMethods = async (
  orgId: string,
  filters: FinanceFiltersInput
): Promise<
  AppResult<{ items: (typeof paymentMethods.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(paymentMethods.organizationId, orgId),
      isNull(paymentMethods.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(paymentMethods.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(paymentMethods)
        .where(and(...conditions))
        .orderBy(desc(paymentMethods.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(paymentMethods)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Invoice Queries
// ==============================

export const getInvoiceById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof invoices.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.organizationId, orgId),
          eq(invoices.id, id),
          isNull(invoices.deletedAt)
        )
      )
      .limit(1);

    if (!invoice) {
      throw createError("INVOICE_NOT_FOUND", "Invoice not found", 404);
    }

    return invoice;
  }, parseError);

export const listInvoices = async (
  orgId: string,
  filters: FinanceFiltersInput
): Promise<
  AppResult<{ items: (typeof invoices.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(invoices.organizationId, orgId),
      isNull(invoices.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(invoices.invoiceNumber, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(invoices)
        .where(and(...conditions))
        .orderBy(desc(invoices.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(invoices)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);
