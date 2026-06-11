"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  Invoice,
  Payment,
  PaymentMethod,
  TaxRate,
} from "@/lib/db/schema/finance";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertInvoice,
  insertPayment,
  insertPaymentMethod,
  insertTaxRate,
  softDeletePaymentMethod,
  softDeleteTaxRate,
  updateInvoice,
  updatePaymentMethod,
  updateTaxRate,
} from "./mutations";
import {
  getInvoiceById,
  getPaymentMethodById,
  getTaxRateById,
} from "./queries";
import type {
  CreateInvoiceInput,
  CreatePaymentInput,
  CreatePaymentMethodInput,
  CreateTaxRateInput,
  UpdatePaymentMethodInput,
  UpdateTaxRateInput,
} from "./validators";

// ==============================
// Tax Rate Services
// ==============================

export const createTaxRateService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateTaxRateInput
): Promise<AppResult<TaxRate>> =>
  tryCatchAsync(async () => {
    const rateRes = await insertTaxRate(orgId, { ...data, id: createId() });
    if (!rateRes.ok) {
      throw rateRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.tax_rate_created",
      targetName: "tax_rates",
      targetId: rateRes.value.id,
    });

    return rateRes.value;
  }, parseError);

export const updateTaxRateService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdateTaxRateInput
): Promise<AppResult<TaxRate>> =>
  tryCatchAsync(async () => {
    const check = await getTaxRateById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const rateRes = await updateTaxRate(orgId, id, data);
    if (!rateRes.ok) {
      throw rateRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.tax_rate_updated",
      targetName: "tax_rates",
      targetId: id,
    });

    return rateRes.value;
  }, parseError);

export const deleteTaxRateService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<TaxRate>> =>
  tryCatchAsync(async () => {
    const check = await getTaxRateById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const rateRes = await softDeleteTaxRate(orgId, id);
    if (!rateRes.ok) {
      throw rateRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.tax_rate_deleted",
      targetName: "tax_rates",
      targetId: id,
    });

    return rateRes.value;
  }, parseError);

// ==============================
// Payment Method Services
// ==============================

export const createPaymentMethodService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreatePaymentMethodInput
): Promise<AppResult<PaymentMethod>> =>
  tryCatchAsync(async () => {
    const methodRes = await insertPaymentMethod(orgId, {
      ...data,
      id: createId(),
    });
    if (!methodRes.ok) {
      throw methodRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.payment_method_created",
      targetName: "payment_methods",
      targetId: methodRes.value.id,
    });

    return methodRes.value;
  }, parseError);

export const updatePaymentMethodService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  data: UpdatePaymentMethodInput
): Promise<AppResult<PaymentMethod>> =>
  tryCatchAsync(async () => {
    const check = await getPaymentMethodById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const methodRes = await updatePaymentMethod(orgId, id, data);
    if (!methodRes.ok) {
      throw methodRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.payment_method_updated",
      targetName: "payment_methods",
      targetId: id,
    });

    return methodRes.value;
  }, parseError);

export const deletePaymentMethodService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<PaymentMethod>> =>
  tryCatchAsync(async () => {
    const check = await getPaymentMethodById(orgId, id);
    if (!check.ok) {
      throw check.error;
    }

    const methodRes = await softDeletePaymentMethod(orgId, id);
    if (!methodRes.ok) {
      throw methodRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.payment_method_deleted",
      targetName: "payment_methods",
      targetId: id,
    });

    return methodRes.value;
  }, parseError);

// ==============================
// Invoice & Payment Services
// ==============================

export const createInvoiceService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateInvoiceInput
): Promise<AppResult<Invoice>> =>
  tryCatchAsync(async () => {
    let prefix = "EXP";
    if (data.type === "ar") {
      prefix = "INV";
    } else if (data.type === "ap") {
      prefix = "BILL";
    }
    const invoiceNumber = `${prefix}-${Date.now()}`;

    const invoiceRes = await insertInvoice(orgId, {
      ...data,
      id: createId(),
      invoiceNumber,
    });
    if (!invoiceRes.ok) {
      throw invoiceRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "finance.invoice_created",
      targetName: "invoices",
      targetId: invoiceRes.value.id,
    });

    return invoiceRes.value;
  }, parseError);

export const createPaymentService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreatePaymentInput
): Promise<AppResult<Payment>> =>
  tryCatchAsync(async () => {
    const checkInvoice = await getInvoiceById(orgId, data.invoiceId);
    if (!checkInvoice.ok) {
      throw checkInvoice.error;
    }
    const invoice = checkInvoice.value;

    const checkMethod = await getPaymentMethodById(orgId, data.paymentMethodId);
    if (!checkMethod.ok) {
      throw checkMethod.error;
    }
    const method = checkMethod.value;

    return await db.transaction(async (tx) => {
      const paymentRes = await insertPayment(orgId, {
        ...data,
        id: createId(),
      });
      if (!paymentRes.ok) {
        throw paymentRes.error;
      }
      const payment = paymentRes.value;

      const newAmountDue = Math.max(0, invoice.amountDue - payment.amount);
      const newStatus = newAmountDue === 0 ? "paid" : "partially_paid";

      const updateInvRes = await updateInvoice(orgId, invoice.id, {
        amountDue: newAmountDue,
        status: newStatus,
      });
      if (!updateInvRes.ok) {
        throw updateInvRes.error;
      }

      const balanceChange =
        payment.type === "inbound" ? payment.amount : -payment.amount;
      const newBalance = method.currentBalance + balanceChange;

      const updateMethodRes = await updatePaymentMethod(orgId, method.id, {
        currentBalance: newBalance,
        balanceAt: new Date(),
      });
      if (!updateMethodRes.ok) {
        throw updateMethodRes.error;
      }

      await tx.insert(auditLogs).values({
        id: createId(),
        organizationId: orgId,
        actorName,
        actorId,
        action: "finance.payment_created",
        targetName: "payments",
        targetId: payment.id,
      });

      return payment;
    });
  }, parseError);
