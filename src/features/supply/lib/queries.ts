import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import type { PurchaseOrderStatus } from "@/lib/db/schema/enums";
import {
  couriers,
  inventories,
  purchaseOrderItems,
  purchaseOrders,
  shippingMethods,
  shippingRates,
} from "@/lib/db/schema/supply";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { SupplyFiltersInput } from "./validators";

// ==============================
// Courier Queries
// ==============================

export const getCourierById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof couriers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [courier] = await db
      .select()
      .from(couriers)
      .where(
        and(
          eq(couriers.organizationId, orgId),
          eq(couriers.id, id),
          isNull(couriers.deletedAt)
        )
      )
      .limit(1);

    if (!courier) {
      throw createError("COURIER_NOT_FOUND", "Courier not found", 404);
    }

    return courier;
  }, parseError);

export const listCouriers = async (
  orgId: string,
  filters: SupplyFiltersInput
): Promise<
  AppResult<{ items: (typeof couriers.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(couriers.organizationId, orgId),
      isNull(couriers.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(couriers.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(couriers)
        .where(and(...conditions))
        .orderBy(desc(couriers.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(couriers)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Purchase Order Queries
// ==============================

export const getPurchaseOrderById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof purchaseOrders.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [order] = await db
      .select()
      .from(purchaseOrders)
      .where(
        and(
          eq(purchaseOrders.organizationId, orgId),
          eq(purchaseOrders.id, id),
          isNull(purchaseOrders.deletedAt)
        )
      )
      .limit(1);

    if (!order) {
      throw createError(
        "PURCHASE_ORDER_NOT_FOUND",
        "Purchase order not found",
        404
      );
    }

    return order;
  }, parseError);

export const listPurchaseOrders = async (
  orgId: string,
  filters: SupplyFiltersInput
): Promise<
  AppResult<{ items: (typeof purchaseOrders.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(purchaseOrders.organizationId, orgId),
      isNull(purchaseOrders.deletedAt),
    ];

    if (filters.search) {
      conditions.push(
        ilike(purchaseOrders.purchaseNumber, `%${filters.search}%`)
      );
    }
    if (filters.status) {
      conditions.push(
        eq(purchaseOrders.status, filters.status as PurchaseOrderStatus)
      );
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(purchaseOrders)
        .where(and(...conditions))
        .orderBy(desc(purchaseOrders.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(purchaseOrders)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

export const listPurchaseOrderItems = async (
  orgId: string,
  purchaseOrderId: string
): Promise<AppResult<(typeof purchaseOrderItems.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(purchaseOrderItems)
        .where(
          and(
            eq(purchaseOrderItems.organizationId, orgId),
            eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId)
          )
        ),
    parseError
  );

// ==============================
// Inventory Queries
// ==============================

export const getInventoryByBranchAndVariant = async (
  orgId: string,
  branchId: string,
  variantId: string
): Promise<AppResult<typeof inventories.$inferSelect | null>> =>
  tryCatchAsync(async () => {
    const [inv] = await db
      .select()
      .from(inventories)
      .where(
        and(
          eq(inventories.organizationId, orgId),
          eq(inventories.branchId, branchId),
          eq(inventories.variantId, variantId)
        )
      )
      .limit(1);

    return inv || null;
  }, parseError);

export const listInventories = async (
  orgId: string,
  branchId: string,
  filters: SupplyFiltersInput
): Promise<
  AppResult<{ items: (typeof inventories.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(inventories.organizationId, orgId),
      eq(inventories.branchId, branchId),
    ];

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(inventories)
        .where(and(...conditions))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(inventories)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Shipping Method Queries
// ==============================

export const getShippingMethodById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof shippingMethods.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [method] = await db
      .select()
      .from(shippingMethods)
      .where(
        and(
          eq(shippingMethods.organizationId, orgId),
          eq(shippingMethods.id, id),
          isNull(shippingMethods.deletedAt)
        )
      )
      .limit(1);

    if (!method) {
      throw createError(
        "SHIPPING_METHOD_NOT_FOUND",
        "Shipping method not found",
        404
      );
    }

    return method;
  }, parseError);

export const listShippingMethods = async (
  orgId: string,
  courierId: string,
  filters: SupplyFiltersInput
): Promise<
  AppResult<{ items: (typeof shippingMethods.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(shippingMethods.organizationId, orgId),
      eq(shippingMethods.courierId, courierId),
      isNull(shippingMethods.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(shippingMethods.name, `%${filters.search}%`));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(shippingMethods)
        .where(and(...conditions))
        .orderBy(desc(shippingMethods.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(shippingMethods)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Shipping Rate Queries
// ==============================

export const getShippingRateById = async (
  orgId: string,
  id: string
): Promise<AppResult<typeof shippingRates.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [rate] = await db
      .select()
      .from(shippingRates)
      .where(
        and(
          eq(shippingRates.organizationId, orgId),
          eq(shippingRates.id, id),
          isNull(shippingRates.deletedAt)
        )
      )
      .limit(1);

    if (!rate) {
      throw createError(
        "SHIPPING_RATE_NOT_FOUND",
        "Shipping rate not found",
        404
      );
    }

    return rate;
  }, parseError);

export const listShippingRates = async (
  orgId: string,
  methodId: string,
  filters: SupplyFiltersInput
): Promise<
  AppResult<{ items: (typeof shippingRates.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(shippingRates.organizationId, orgId),
      eq(shippingRates.shippingMethodId, methodId),
      isNull(shippingRates.deletedAt),
    ];

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(shippingRates)
        .where(and(...conditions))
        .orderBy(desc(shippingRates.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(shippingRates)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);
