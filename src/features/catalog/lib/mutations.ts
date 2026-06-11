import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, variants } from "@/lib/db/schema/catalog";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// Product Mutations
// ==============================

export const insertProduct = async (
  orgId: string,
  data: Omit<typeof products.$inferInsert, "organizationId">
): Promise<AppResult<typeof products.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [product] = await db
      .insert(products)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!product) {
      throw createError("BAD_REQUEST", "Failed to create product", 400);
    }

    return product;
  }, parseError);

export const updateProduct = async (
  orgId: string,
  productId: string,
  data: Partial<Omit<typeof products.$inferInsert, "organizationId">>
): Promise<AppResult<typeof products.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(products.organizationId, orgId),
          eq(products.id, productId),
          isNull(products.deletedAt)
        )
      )
      .returning();

    if (!product) {
      throw createError(
        "PRODUCT_NOT_FOUND",
        "Product not found to update",
        404
      );
    }

    return product;
  }, parseError);

export const softDeleteProduct = async (
  orgId: string,
  productId: string
): Promise<AppResult<typeof products.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [product] = await db
      .update(products)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(products.organizationId, orgId),
          eq(products.id, productId),
          isNull(products.deletedAt)
        )
      )
      .returning();

    if (!product) {
      throw createError(
        "PRODUCT_NOT_FOUND",
        "Product not found to delete",
        404
      );
    }

    return product;
  }, parseError);

// ==============================
// Variant Mutations
// ==============================

export const insertVariant = async (
  orgId: string,
  data: Omit<typeof variants.$inferInsert, "organizationId">
): Promise<AppResult<typeof variants.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [variant] = await db
      .insert(variants)
      .values({ ...data, organizationId: orgId })
      .returning();

    if (!variant) {
      throw createError("BAD_REQUEST", "Failed to create variant", 400);
    }

    return variant;
  }, parseError);

export const updateVariant = async (
  orgId: string,
  variantId: string,
  data: Partial<Omit<typeof variants.$inferInsert, "organizationId">>
): Promise<AppResult<typeof variants.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [variant] = await db
      .update(variants)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(variants.organizationId, orgId),
          eq(variants.id, variantId),
          isNull(variants.deletedAt)
        )
      )
      .returning();

    if (!variant) {
      throw createError(
        "VARIANT_NOT_FOUND",
        "Variant not found to update",
        404
      );
    }

    return variant;
  }, parseError);

export const softDeleteVariant = async (
  orgId: string,
  variantId: string
): Promise<AppResult<typeof variants.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [variant] = await db
      .update(variants)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(variants.organizationId, orgId),
          eq(variants.id, variantId),
          isNull(variants.deletedAt)
        )
      )
      .returning();

    if (!variant) {
      throw createError(
        "VARIANT_NOT_FOUND",
        "Variant not found to delete",
        404
      );
    }

    return variant;
  }, parseError);
