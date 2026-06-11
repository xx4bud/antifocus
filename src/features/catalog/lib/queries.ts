import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, variants } from "@/lib/db/schema/catalog";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { CatalogFiltersInput } from "./validators";

// ==============================
// Product Queries
// ==============================

export const getProductById = async (
  orgId: string,
  productId: string
): Promise<AppResult<typeof products.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [product] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.organizationId, orgId),
          eq(products.id, productId),
          isNull(products.deletedAt)
        )
      )
      .limit(1);

    if (!product) {
      throw createError("PRODUCT_NOT_FOUND", "Product not found", 404);
    }

    return product;
  }, parseError);

export const listProducts = async (
  orgId: string,
  filters: CatalogFiltersInput
): Promise<
  AppResult<{ items: (typeof products.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(products.organizationId, orgId),
      isNull(products.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }
    if (filters.status) {
      conditions.push(eq(products.status, filters.status));
    }
    if (filters.type) {
      conditions.push(eq(products.type, filters.type));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(products)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Variant Queries
// ==============================

export const getVariantById = async (
  orgId: string,
  variantId: string
): Promise<AppResult<typeof variants.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [variant] = await db
      .select()
      .from(variants)
      .where(
        and(
          eq(variants.organizationId, orgId),
          eq(variants.id, variantId),
          isNull(variants.deletedAt)
        )
      )
      .limit(1);

    if (!variant) {
      throw createError("VARIANT_NOT_FOUND", "Variant not found", 404);
    }

    return variant;
  }, parseError);

export const listProductVariants = async (
  orgId: string,
  productId: string
): Promise<AppResult<(typeof variants.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db
        .select()
        .from(variants)
        .where(
          and(
            eq(variants.organizationId, orgId),
            eq(variants.productId, productId),
            isNull(variants.deletedAt)
          )
        )
        .orderBy(variants.position),
    parseError
  );
