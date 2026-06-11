import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  attributeOptions,
  attributes,
  categories,
  categoryAttributes,
  collections,
  tags,
  units,
} from "@/lib/db/schema/taxonomy";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type {
  CreateAttributeInput,
  CreateAttributeOptionInput,
  CreateCategoryInput,
  CreateCollectionInput,
  CreateTagInput,
  CreateUnitInput,
  LinkCategoryAttributeInput,
  UpdateAttributeInput,
  UpdateAttributeOptionInput,
  UpdateCategoryInput,
  UpdateCollectionInput,
  UpdateTagInput,
  UpdateUnitInput,
} from "./validators";

// ==============================
// Tags
// ==============================

export const createTag = async (
  organizationId: string,
  data: CreateTagInput
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [tag] = await db
      .insert(tags)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!tag) {
      throw createError("DATABASE", "Failed to create tag", 500);
    }
    return tag;
  }, parseError);

export const updateTag = async (
  id: string,
  organizationId: string,
  data: UpdateTagInput
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [tag] = await db
      .update(tags)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tags.id, id), eq(tags.organizationId, organizationId)))
      .returning();
    if (!tag) {
      throw createError("NOT_FOUND", "Tag not found", 404);
    }
    return tag;
  }, parseError);

export const softDeleteTag = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [tag] = await db
      .update(tags)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(tags.id, id), eq(tags.organizationId, organizationId)))
      .returning();
    if (!tag) {
      throw createError("NOT_FOUND", "Tag not found", 404);
    }
    return tag;
  }, parseError);

// ==============================
// Attributes
// ==============================

export const createAttribute = async (
  organizationId: string,
  data: CreateAttributeInput
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [attr] = await db
      .insert(attributes)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!attr) {
      throw createError("DATABASE", "Failed to create attribute", 500);
    }
    return attr;
  }, parseError);

export const updateAttribute = async (
  id: string,
  organizationId: string,
  data: UpdateAttributeInput
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [attr] = await db
      .update(attributes)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(attributes.id, id),
          eq(attributes.organizationId, organizationId)
        )
      )
      .returning();
    if (!attr) {
      throw createError("NOT_FOUND", "Attribute not found", 404);
    }
    return attr;
  }, parseError);

export const softDeleteAttribute = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [attr] = await db
      .update(attributes)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(attributes.id, id),
          eq(attributes.organizationId, organizationId)
        )
      )
      .returning();
    if (!attr) {
      throw createError("NOT_FOUND", "Attribute not found", 404);
    }
    return attr;
  }, parseError);

// ==============================
// Attribute Options
// ==============================

export const createAttributeOption = async (
  organizationId: string,
  data: CreateAttributeOptionInput
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [opt] = await db
      .insert(attributeOptions)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!opt) {
      throw createError("DATABASE", "Failed to create attribute option", 500);
    }
    return opt;
  }, parseError);

export const updateAttributeOption = async (
  id: string,
  organizationId: string,
  data: UpdateAttributeOptionInput
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [opt] = await db
      .update(attributeOptions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(attributeOptions.id, id),
          eq(attributeOptions.organizationId, organizationId)
        )
      )
      .returning();
    if (!opt) {
      throw createError("NOT_FOUND", "Attribute option not found", 404);
    }
    return opt;
  }, parseError);

export const softDeleteAttributeOption = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [opt] = await db
      .update(attributeOptions)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(attributeOptions.id, id),
          eq(attributeOptions.organizationId, organizationId)
        )
      )
      .returning();
    if (!opt) {
      throw createError("NOT_FOUND", "Attribute option not found", 404);
    }
    return opt;
  }, parseError);

// ==============================
// Categories
// ==============================

export const createCategory = async (
  organizationId: string,
  data: CreateCategoryInput
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cat] = await db
      .insert(categories)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!cat) {
      throw createError("DATABASE", "Failed to create category", 500);
    }
    return cat;
  }, parseError);

export const updateCategory = async (
  id: string,
  organizationId: string,
  data: UpdateCategoryInput
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cat] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(categories.id, id),
          eq(categories.organizationId, organizationId)
        )
      )
      .returning();
    if (!cat) {
      throw createError("NOT_FOUND", "Category not found", 404);
    }
    return cat;
  }, parseError);

export const softDeleteCategory = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cat] = await db
      .update(categories)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(categories.id, id),
          eq(categories.organizationId, organizationId)
        )
      )
      .returning();
    if (!cat) {
      throw createError("NOT_FOUND", "Category not found", 404);
    }
    return cat;
  }, parseError);

export const linkCategoryAttribute = async (
  organizationId: string,
  data: LinkCategoryAttributeInput
): Promise<AppResult<typeof categoryAttributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [catAttr] = await db
      .insert(categoryAttributes)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!catAttr) {
      throw createError(
        "DATABASE",
        "Failed to link attribute to category",
        500
      );
    }
    return catAttr;
  }, parseError);

export const unlinkCategoryAttribute = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof categoryAttributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [catAttr] = await db
      .delete(categoryAttributes)
      .where(
        and(
          eq(categoryAttributes.id, id),
          eq(categoryAttributes.organizationId, organizationId)
        )
      )
      .returning();
    if (!catAttr) {
      throw createError("NOT_FOUND", "Link association not found", 404);
    }
    return catAttr;
  }, parseError);

// ==============================
// Collections
// ==============================

export const createCollection = async (
  organizationId: string,
  data: CreateCollectionInput
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [coll] = await db
      .insert(collections)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!coll) {
      throw createError("DATABASE", "Failed to create collection", 500);
    }
    return coll;
  }, parseError);

export const updateCollection = async (
  id: string,
  organizationId: string,
  data: UpdateCollectionInput
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [coll] = await db
      .update(collections)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(collections.id, id),
          eq(collections.organizationId, organizationId)
        )
      )
      .returning();
    if (!coll) {
      throw createError("NOT_FOUND", "Collection not found", 404);
    }
    return coll;
  }, parseError);

export const softDeleteCollection = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [coll] = await db
      .update(collections)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(collections.id, id),
          eq(collections.organizationId, organizationId)
        )
      )
      .returning();
    if (!coll) {
      throw createError("NOT_FOUND", "Collection not found", 404);
    }
    return coll;
  }, parseError);

// ==============================
// Units
// ==============================

export const createUnit = async (
  organizationId: string,
  data: CreateUnitInput
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [unit] = await db
      .insert(units)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!unit) {
      throw createError("DATABASE", "Failed to create unit of measure", 500);
    }
    return unit;
  }, parseError);

export const updateUnit = async (
  id: string,
  organizationId: string,
  data: UpdateUnitInput
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [unit] = await db
      .update(units)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(units.id, id), eq(units.organizationId, organizationId)))
      .returning();
    if (!unit) {
      throw createError("NOT_FOUND", "Unit of measure not found", 404);
    }
    return unit;
  }, parseError);

export const softDeleteUnit = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [unit] = await db
      .update(units)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(units.id, id), eq(units.organizationId, organizationId)))
      .returning();
    if (!unit) {
      throw createError("NOT_FOUND", "Unit of measure not found", 404);
    }
    return unit;
  }, parseError);
