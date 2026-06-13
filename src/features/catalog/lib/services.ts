"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import type {
  Costlist,
  CostlistItem,
  DesignArea,
  Pricelist,
  PricelistItem,
  Product,
  ProductDesign,
  Variant,
} from "@/lib/db/schema/catalog";
import { auditLogs } from "@/lib/db/schema/core";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  deleteCostlistItem,
  deleteDesignArea,
  deletePricelistItem,
  generateVariantMatrix,
  insertCostlist,
  insertCostlistItem,
  insertDesignArea,
  insertPricelist,
  insertPricelistItem,
  insertProduct,
  insertProductDesign,
  insertVariant,
  softDeleteCostlist,
  softDeletePricelist,
  softDeleteProduct,
  softDeleteProductDesign,
  softDeleteVariant,
  updateCostlist,
  updateCostlistItem,
  updateDesignArea,
  updatePricelist,
  updatePricelistItem,
  updateProduct,
  updateProductDesign,
  updateVariant,
} from "./mutations";
import { getProductById, getVariantById } from "./queries";
import type {
  CreateCostlistInput,
  CreateCostlistItemInput,
  CreateDesignAreaInput,
  CreatePricelistInput,
  CreatePricelistItemInput,
  CreateProductDesignInput,
  CreateProductInput,
  CreateVariantInput,
  GenerateVariantMatrixInput,
  UpdateCostlistInput,
  UpdateCostlistItemInput,
  UpdateDesignAreaInput,
  UpdatePricelistInput,
  UpdatePricelistItemInput,
  UpdateProductDesignInput,
  UpdateProductInput,
  UpdateVariantInput,
} from "./validators";

// ==============================
// Product Services
// ==============================

export const createProductService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateProductInput
): Promise<AppResult<Product>> =>
  tryCatchAsync(async () => {
    const productRes = await insertProduct(orgId, data);
    if (!productRes.ok) {
      throw productRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.product_created",
      targetName: "products",
      targetId: productRes.value.id,
      metadata: { name: productRes.value.name },
    });

    return productRes.value;
  }, parseError);

export const updateProductService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  productId: string,
  data: UpdateProductInput
): Promise<AppResult<Product>> =>
  tryCatchAsync(async () => {
    const checkProduct = await getProductById(orgId, productId);
    if (!checkProduct.ok) {
      throw checkProduct.error;
    }

    const productRes = await updateProduct(orgId, productId, data);
    if (!productRes.ok) {
      throw productRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.product_updated",
      targetName: "products",
      targetId: productId,
    });

    return productRes.value;
  }, parseError);

export const deleteProductService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  productId: string
): Promise<AppResult<Product>> =>
  tryCatchAsync(async () => {
    const checkProduct = await getProductById(orgId, productId);
    if (!checkProduct.ok) {
      throw checkProduct.error;
    }

    const productRes = await softDeleteProduct(orgId, productId);
    if (!productRes.ok) {
      throw productRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.product_deleted",
      targetName: "products",
      targetId: productId,
    });

    return productRes.value;
  }, parseError);

// ==============================
// Variant Services
// ==============================

export const createVariantService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  data: CreateVariantInput
): Promise<AppResult<Variant>> =>
  tryCatchAsync(async () => {
    const productCheck = await getProductById(orgId, data.productId);
    if (!productCheck.ok) {
      throw productCheck.error;
    }

    const variantRes = await insertVariant(orgId, {
      ...data,
      id: createId(),
    });
    if (!variantRes.ok) {
      throw variantRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.variant_created",
      targetName: "variants",
      targetId: variantRes.value.id,
      metadata: { sku: variantRes.value.sku },
    });

    return variantRes.value;
  }, parseError);

export const updateVariantService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  variantId: string,
  data: UpdateVariantInput
): Promise<AppResult<Variant>> =>
  tryCatchAsync(async () => {
    const variantCheck = await getVariantById(orgId, variantId);
    if (!variantCheck.ok) {
      throw variantCheck.error;
    }

    const variantRes = await updateVariant(orgId, variantId, data);
    if (!variantRes.ok) {
      throw variantRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.variant_updated",
      targetName: "variants",
      targetId: variantId,
    });

    return variantRes.value;
  }, parseError);

export const deleteVariantService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  variantId: string
): Promise<AppResult<Variant>> =>
  tryCatchAsync(async () => {
    const variantCheck = await getVariantById(orgId, variantId);
    if (!variantCheck.ok) {
      throw variantCheck.error;
    }

    const variantRes = await softDeleteVariant(orgId, variantId);
    if (!variantRes.ok) {
      throw variantRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.variant_deleted",
      targetName: "variants",
      targetId: variantId,
    });

    return variantRes.value;
  }, parseError);

export const generateVariantMatrixService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: GenerateVariantMatrixInput
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const matrixRes = await generateVariantMatrix(orgId, input);
    if (!matrixRes.ok) {
      throw matrixRes.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.variant_matrix_generated",
      targetName: "products",
      targetId: input.productId,
      metadata: { attributes: input.attributeIds },
    });

    return matrixRes.value;
  }, parseError);

// ==============================
// Design Area Services
// ==============================

export const createDesignAreaService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateDesignAreaInput
): Promise<AppResult<DesignArea>> =>
  tryCatchAsync(async () => {
    const res = await insertDesignArea(orgId, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.design_area_created",
      targetName: "designAreas",
      targetId: res.value.id,
      metadata: { name: res.value.name, productId: input.productId },
    });

    return res.value;
  }, parseError);

export const updateDesignAreaService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdateDesignAreaInput
): Promise<AppResult<DesignArea>> =>
  tryCatchAsync(async () => {
    const res = await updateDesignArea(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.design_area_updated",
      targetName: "designAreas",
      targetId: id,
      metadata: { fields: Object.keys(input) },
    });

    return res.value;
  }, parseError);

export const deleteDesignAreaService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await deleteDesignArea(orgId, id);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.design_area_deleted",
      targetName: "designAreas",
      targetId: id,
    });

    return res.value;
  }, parseError);

// ==============================
// Product Design Services
// ==============================

export const createProductDesignService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateProductDesignInput
): Promise<AppResult<ProductDesign>> =>
  tryCatchAsync(async () => {
    const res = await insertProductDesign(orgId, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.product_design_created",
      targetName: "productDesigns",
      targetId: res.value.id,
      metadata: { name: res.value.name, areaId: input.areaId },
    });

    return res.value;
  }, parseError);

export const updateProductDesignService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdateProductDesignInput
): Promise<AppResult<ProductDesign>> =>
  tryCatchAsync(async () => {
    const res = await updateProductDesign(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.product_design_updated",
      targetName: "productDesigns",
      targetId: id,
      metadata: { fields: Object.keys(input) },
    });

    return res.value;
  }, parseError);

export const deleteProductDesignService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await softDeleteProductDesign(orgId, id);
    if (!res.ok) {
      throw res.error;
    }

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.product_design_deleted",
      targetName: "productDesigns",
      targetId: id,
    });

    return res.value;
  }, parseError);

// ==============================
// Pricelist Services
// ==============================

export const createPricelistService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreatePricelistInput
): Promise<AppResult<Pricelist>> =>
  tryCatchAsync(async () => {
    const res = await insertPricelist(orgId, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.pricelist_created",
      targetName: "pricelists",
      targetId: res.value.id,
      metadata: { channelId: input.orderChannelId },
    });
    return res.value;
  }, parseError);

export const updatePricelistService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdatePricelistInput
): Promise<AppResult<Pricelist>> =>
  tryCatchAsync(async () => {
    const res = await updatePricelist(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.pricelist_updated",
      targetName: "pricelists",
      targetId: id,
      metadata: { fields: Object.keys(input) },
    });
    return res.value;
  }, parseError);

export const deletePricelistService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await softDeletePricelist(orgId, id);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.pricelist_deleted",
      targetName: "pricelists",
      targetId: id,
    });
    return res.value;
  }, parseError);

export const createPricelistItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreatePricelistItemInput
): Promise<AppResult<PricelistItem>> =>
  tryCatchAsync(async () => {
    const res = await insertPricelistItem(orgId, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.pricelist_item_created",
      targetName: "pricelistItems",
      targetId: res.value.id,
      metadata: { variantId: input.variantId, price: input.price },
    });
    return res.value;
  }, parseError);

export const updatePricelistItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdatePricelistItemInput
): Promise<AppResult<PricelistItem>> =>
  tryCatchAsync(async () => {
    const res = await updatePricelistItem(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.pricelist_item_updated",
      targetName: "pricelistItems",
      targetId: id,
    });
    return res.value;
  }, parseError);

export const deletePricelistItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await deletePricelistItem(orgId, id);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.pricelist_item_deleted",
      targetName: "pricelistItems",
      targetId: id,
    });
    return res.value;
  }, parseError);

// ==============================
// Costlist Services
// ==============================

export const createCostlistService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateCostlistInput
): Promise<AppResult<Costlist>> =>
  tryCatchAsync(async () => {
    const res = await insertCostlist(orgId, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.costlist_created",
      targetName: "costlists",
      targetId: res.value.id,
      metadata: { supplierId: input.supplierId },
    });
    return res.value;
  }, parseError);

export const updateCostlistService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdateCostlistInput
): Promise<AppResult<Costlist>> =>
  tryCatchAsync(async () => {
    const res = await updateCostlist(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.costlist_updated",
      targetName: "costlists",
      targetId: id,
      metadata: { fields: Object.keys(input) },
    });
    return res.value;
  }, parseError);

export const deleteCostlistService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await softDeleteCostlist(orgId, id);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.costlist_deleted",
      targetName: "costlists",
      targetId: id,
    });
    return res.value;
  }, parseError);

export const createCostlistItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  input: CreateCostlistItemInput
): Promise<AppResult<CostlistItem>> =>
  tryCatchAsync(async () => {
    const res = await insertCostlistItem(orgId, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.costlist_item_created",
      targetName: "costlistItems",
      targetId: res.value.id,
      metadata: { variantId: input.variantId, costPrice: input.costPrice },
    });
    return res.value;
  }, parseError);

export const updateCostlistItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string,
  input: UpdateCostlistItemInput
): Promise<AppResult<CostlistItem>> =>
  tryCatchAsync(async () => {
    const res = await updateCostlistItem(orgId, id, input);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.costlist_item_updated",
      targetName: "costlistItems",
      targetId: id,
    });
    return res.value;
  }, parseError);

export const deleteCostlistItemService = async (
  orgId: string,
  actorId: string,
  actorName: string,
  id: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    const res = await deleteCostlistItem(orgId, id);
    if (!res.ok) {
      throw res.error;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      actorName,
      actorId,
      action: "catalog.costlist_item_deleted",
      targetName: "costlistItems",
      targetId: id,
    });
    return res.value;
  }, parseError);
