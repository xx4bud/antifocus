import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  costlistItems,
  costlists,
  designAreas,
  pricelistItems,
  pricelists,
  productDesigns,
  products,
  variantOptions,
  variants,
} from "@/lib/db/schema/catalog";
import { attributeOptions } from "@/lib/db/schema/taxonomy";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type {
  CreateProductDesignInput,
  CreateProductInput,
  GenerateVariantMatrixInput,
  UpdateDesignAreaInput,
  UpdateProductDesignInput,
} from "./validators";

// ==============================
// Product Mutations
// ==============================

export const insertProduct = async (
  orgId: string,
  data: CreateProductInput
): Promise<AppResult<typeof products.$inferSelect>> =>
  tryCatchAsync(
    async () =>
      db.transaction(async (tx) => {
        const { basePrice, baseCost, ...productData } = data;

        const [product] = await tx
          .insert(products)
          .values({
            id: createId(),
            organizationId: orgId,
            ...productData,
          })
          .returning();

        if (!product) {
          throw createError("BAD_REQUEST", "Failed to create product", 400);
        }

        await tx.insert(variants).values({
          id: createId(),
          organizationId: orgId,
          productId: product.id,
          sku: `${productData.slug}-BASE`,
          price: basePrice,
          costPrice: baseCost,
        });

        return product;
      }),
    parseError
  );

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

// ── Helpers for Variant Matrix Generator ─────────────────────────────────────
const cartesian = <T>(arrays: T[][]): T[][] =>
  arrays.reduce(
    (a, b) => a.flatMap((d) => b.map((e) => [d, e].flat() as T[])),
    [[]] as T[][]
  );

function groupOptions(
  attributeIds: string[],
  options: (typeof attributeOptions.$inferSelect)[]
) {
  const groupedOptions: Record<
    string,
    (typeof attributeOptions.$inferSelect)[]
  > = {};
  for (const id of attributeIds) {
    groupedOptions[id] = [];
  }
  for (const opt of options) {
    const arr = groupedOptions[opt.attributeId];
    if (arr) {
      arr.push(opt);
    }
  }
  return groupedOptions;
}

function computeVariantCombination(
  orgId: string,
  productId: string,
  productSlug: string,
  baseVariant: { id: string; price: number | null; costPrice: number | null },
  combination: (typeof attributeOptions.$inferSelect)[]
) {
  const skuSuffix = combination
    .map((opt) => opt.label.toUpperCase().replace(/\s+/g, ""))
    .join("-");
  const variantSku = `${productSlug}-${skuSuffix}`;

  let addedPrice = 0;
  let addedCost = 0;
  for (const opt of combination) {
    addedPrice += Number(opt.price || 0);
    addedCost += Number(opt.cost || 0);
  }

  const newPrice = Number(baseVariant.price || 0) + addedPrice;
  const newCost = Number(baseVariant.costPrice || 0) + addedCost;
  const variantId = createId();

  const variantInsert = {
    id: variantId,
    organizationId: orgId,
    productId,
    baseVariantId: baseVariant.id,
    sku: variantSku,
    price: newPrice,
    costPrice: newCost,
  };

  const optionsInsert = combination.map((opt) => ({
    id: createId(),
    organizationId: orgId,
    variantId,
    attributeOptionId: opt.id,
    value: opt.value || {},
    price: opt.price ? Number(opt.price) : null,
    cost: opt.cost ? Number(opt.cost) : null,
  }));

  return { variantInsert, optionsInsert };
}

export const generateVariantMatrix = async (
  orgId: string,
  data: GenerateVariantMatrixInput
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    return db.transaction(async (tx) => {
      // 1. Fetch Product
      const [product] = await tx
        .select()
        .from(products)
        .where(
          and(
            eq(products.id, data.productId),
            eq(products.organizationId, orgId)
          )
        )
        .limit(1);
      if (!product) {
        throw createError("NOT_FOUND", "Product not found", 404);
      }

      // 2. Fetch Base Variant
      const [baseVariant] = await tx
        .select()
        .from(variants)
        .where(
          and(
            eq(variants.productId, data.productId),
            isNull(variants.baseVariantId)
          )
        )
        .limit(1);
      if (!baseVariant) {
        throw createError("NOT_FOUND", "Base variant not found", 404);
      }

      // 3. Fetch Attribute Options
      const options = await tx
        .select()
        .from(attributeOptions)
        .where(
          and(
            inArray(attributeOptions.attributeId, data.attributeIds),
            eq(attributeOptions.organizationId, orgId)
          )
        );

      const groupedOptions = groupOptions(data.attributeIds, options);
      const arraysToPermute = data.attributeIds.map(
        (id) => groupedOptions[id] || []
      );
      const combinations = cartesian(arraysToPermute);

      // 5. Create Variants
      for (const combination of combinations) {
        const { variantInsert, optionsInsert } = computeVariantCombination(
          orgId,
          product.id,
          product.slug,
          baseVariant,
          combination
        );

        await tx.insert(variants).values(variantInsert);
        if (optionsInsert.length > 0) {
          await tx.insert(variantOptions).values(optionsInsert);
        }
      }

      return true;
    });
  }, parseError);

// ==============================
// Design Area Mutations
// ==============================

export const insertDesignArea = async (
  orgId: string,
  data: import("./validators").CreateDesignAreaInput
): Promise<AppResult<typeof designAreas.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [area] = await db
      .insert(designAreas)
      .values({
        id: createId(),
        organizationId: orgId,
        ...data,
      })
      .returning();
    return area as typeof designAreas.$inferSelect;
  }, parseError);

export const updateDesignArea = async (
  orgId: string,
  id: string,
  data: UpdateDesignAreaInput
): Promise<AppResult<typeof designAreas.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [area] = await db
      .update(designAreas)
      .set(data)
      .where(and(eq(designAreas.organizationId, orgId), eq(designAreas.id, id)))
      .returning();
    if (!area) {
      throw createError("NOT_FOUND", "Design area not found", 404);
    }
    return area as typeof designAreas.$inferSelect;
  }, parseError);

export const deleteDesignArea = async (
  orgId: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const [area] = await db
      .delete(designAreas)
      .where(and(eq(designAreas.organizationId, orgId), eq(designAreas.id, id)))
      .returning();
    if (!area) {
      throw createError("NOT_FOUND", "Design area not found", 404);
    }
    return true;
  }, parseError);

// ==============================
// Product Design Mutations
// ==============================

export const insertProductDesign = async (
  orgId: string,
  data: CreateProductDesignInput
): Promise<AppResult<typeof productDesigns.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [design] = await db
      .insert(productDesigns)
      .values({
        id: createId(),
        organizationId: orgId,
        ...data,
      })
      .returning();
    return design as typeof productDesigns.$inferSelect;
  }, parseError);

export const updateProductDesign = async (
  orgId: string,
  id: string,
  data: UpdateProductDesignInput
): Promise<AppResult<typeof productDesigns.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [design] = await db
      .update(productDesigns)
      .set(data)
      .where(
        and(eq(productDesigns.organizationId, orgId), eq(productDesigns.id, id))
      )
      .returning();
    if (!design) {
      throw createError("NOT_FOUND", "Product design not found", 404);
    }
    return design as typeof productDesigns.$inferSelect;
  }, parseError);

export const softDeleteProductDesign = async (
  orgId: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const [design] = await db
      .update(productDesigns)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(productDesigns.organizationId, orgId),
          eq(productDesigns.id, id),
          isNull(productDesigns.deletedAt)
        )
      )
      .returning();
    if (!design) {
      throw createError("NOT_FOUND", "Product design not found", 404);
    }
    return true;
  }, parseError);

// ==============================
// Pricelist Mutations
// ==============================

export const insertPricelist = async (
  orgId: string,
  data: import("./validators").CreatePricelistInput
) =>
  tryCatchAsync(async () => {
    const [pricelist] = await db
      .insert(pricelists)
      .values({ id: createId(), organizationId: orgId, ...data })
      .returning();
    if (!pricelist) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create pricelist",
        500
      );
    }
    return pricelist;
  }, parseError);

export const updatePricelist = async (
  orgId: string,
  id: string,
  data: import("./validators").UpdatePricelistInput
) =>
  tryCatchAsync(async () => {
    const [pricelist] = await db
      .update(pricelists)
      .set(data)
      .where(and(eq(pricelists.organizationId, orgId), eq(pricelists.id, id)))
      .returning();
    if (!pricelist) {
      throw createError("NOT_FOUND", "Pricelist not found", 404);
    }
    return pricelist;
  }, parseError);

export const softDeletePricelist = async (orgId: string, id: string) =>
  tryCatchAsync(async () => {
    const [pricelist] = await db
      .update(pricelists)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(pricelists.organizationId, orgId),
          eq(pricelists.id, id),
          isNull(pricelists.deletedAt)
        )
      )
      .returning();
    if (!pricelist) {
      throw createError("NOT_FOUND", "Pricelist not found", 404);
    }
    return true;
  }, parseError);

export const insertPricelistItem = async (
  orgId: string,
  data: import("./validators").CreatePricelistItemInput
) =>
  tryCatchAsync(async () => {
    const [item] = await db
      .insert(pricelistItems)
      .values({ id: createId(), organizationId: orgId, ...data })
      .returning();
    if (!item) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create pricelist item",
        500
      );
    }
    return item;
  }, parseError);

export const updatePricelistItem = async (
  orgId: string,
  id: string,
  data: import("./validators").UpdatePricelistItemInput
) =>
  tryCatchAsync(async () => {
    const [item] = await db
      .update(pricelistItems)
      .set(data)
      .where(
        and(eq(pricelistItems.organizationId, orgId), eq(pricelistItems.id, id))
      )
      .returning();
    if (!item) {
      throw createError("NOT_FOUND", "Pricelist item not found", 404);
    }
    return item;
  }, parseError);

export const deletePricelistItem = async (orgId: string, id: string) =>
  tryCatchAsync(async () => {
    const [item] = await db
      .delete(pricelistItems)
      .where(
        and(eq(pricelistItems.organizationId, orgId), eq(pricelistItems.id, id))
      )
      .returning();
    if (!item) {
      throw createError("NOT_FOUND", "Pricelist item not found", 404);
    }
    return true;
  }, parseError);

// ==============================
// Costlist Mutations
// ==============================

export const insertCostlist = async (
  orgId: string,
  data: import("./validators").CreateCostlistInput
) =>
  tryCatchAsync(async () => {
    const [costlist] = await db
      .insert(costlists)
      .values({ id: createId(), organizationId: orgId, ...data })
      .returning();
    if (!costlist) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create costlist",
        500
      );
    }
    return costlist;
  }, parseError);

export const updateCostlist = async (
  orgId: string,
  id: string,
  data: import("./validators").UpdateCostlistInput
) =>
  tryCatchAsync(async () => {
    const [costlist] = await db
      .update(costlists)
      .set(data)
      .where(and(eq(costlists.organizationId, orgId), eq(costlists.id, id)))
      .returning();
    if (!costlist) {
      throw createError("NOT_FOUND", "Costlist not found", 404);
    }
    return costlist;
  }, parseError);

export const softDeleteCostlist = async (orgId: string, id: string) =>
  tryCatchAsync(async () => {
    const [costlist] = await db
      .update(costlists)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(costlists.organizationId, orgId),
          eq(costlists.id, id),
          isNull(costlists.deletedAt)
        )
      )
      .returning();
    if (!costlist) {
      throw createError("NOT_FOUND", "Costlist not found", 404);
    }
    return true;
  }, parseError);

export const insertCostlistItem = async (
  orgId: string,
  data: import("./validators").CreateCostlistItemInput
) =>
  tryCatchAsync(async () => {
    const [item] = await db
      .insert(costlistItems)
      .values({ id: createId(), organizationId: orgId, ...data })
      .returning();
    if (!item) {
      throw createError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create costlist item",
        500
      );
    }
    return item;
  }, parseError);

export const updateCostlistItem = async (
  orgId: string,
  id: string,
  data: import("./validators").UpdateCostlistItemInput
) =>
  tryCatchAsync(async () => {
    const [item] = await db
      .update(costlistItems)
      .set(data)
      .where(
        and(eq(costlistItems.organizationId, orgId), eq(costlistItems.id, id))
      )
      .returning();
    if (!item) {
      throw createError("NOT_FOUND", "Costlist item not found", 404);
    }
    return item;
  }, parseError);

export const deleteCostlistItem = async (orgId: string, id: string) =>
  tryCatchAsync(async () => {
    const [item] = await db
      .delete(costlistItems)
      .where(
        and(eq(costlistItems.organizationId, orgId), eq(costlistItems.id, id))
      )
      .returning();
    if (!item) {
      throw createError("NOT_FOUND", "Costlist item not found", 404);
    }
    return true;
  }, parseError);
