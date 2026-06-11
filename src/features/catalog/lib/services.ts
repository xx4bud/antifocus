"use server";

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import type { Product, Variant } from "@/lib/db/schema/catalog";
import { auditLogs } from "@/lib/db/schema/core";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  insertProduct,
  insertVariant,
  softDeleteProduct,
  softDeleteVariant,
  updateProduct,
  updateVariant,
} from "./mutations";
import { getProductById, getVariantById } from "./queries";
import type {
  CreateProductInput,
  CreateVariantInput,
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
    const productRes = await insertProduct(orgId, {
      ...data,
      id: createId(),
    });
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
