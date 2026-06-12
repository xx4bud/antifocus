import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { invoices, paymentMethods, payments, taxRates } from "@/lib/db/schema";
import {
  INVOICE_STATUS,
  INVOICE_TYPE,
  PAYMENT_METHOD_TYPE,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedFinance = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Finance...");

  await db.insert(taxRates).values({
    id: ctx.finance.taxRateId,
    organizationId: ctx.org.orgId,
    name: "PPN 12%",
    code: "PPN12",
    rate: 12.0,
  });

  await db.insert(paymentMethods).values({
    id: ctx.finance.paymentMethodId,
    organizationId: ctx.org.orgId,
    name: "Bank Transfer (Manual)",
    code: "BANK_TRANSFER",
    providerId: "manual",
    type: PAYMENT_METHOD_TYPE.BANK_TRANSFER,
  });

  await db.insert(invoices).values({
    id: ctx.finance.invoiceId,
    organizationId: ctx.org.orgId,
    branchId: ctx.org.branchId,
    type: INVOICE_TYPE.AR,
    invoiceNumber: "INV-00001",
    status: INVOICE_STATUS.PAID,
    subtotal: 450_000,
    taxTotal: 54_000,
    grandTotal: 504_000,
    amountDue: 0,
  });

  await db.insert(payments).values({
    id: createId(),
    organizationId: ctx.org.orgId,
    paymentMethodId: ctx.finance.paymentMethodId,
    invoiceId: ctx.finance.invoiceId,
    type: PAYMENT_TYPE.INBOUND,
    status: PAYMENT_STATUS.COMPLETED,
    amount: 504_000,
  });
};
