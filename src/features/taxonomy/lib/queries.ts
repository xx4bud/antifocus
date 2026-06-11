import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  attributeOptions,
  attributes,
  categories,
  collections,
  tags,
  units,
} from "@/lib/db/schema/taxonomy";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { TaxonomyFiltersInput } from "./validators";

// ==============================
// Tags
// ==============================

export const getTagById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [tag] = await db
      .select()
      .from(tags)
      .where(
        and(
          eq(tags.id, id),
          eq(tags.organizationId, orgId),
          isNull(tags.deletedAt)
        )
      )
      .limit(1);
    if (!tag) {
      throw createError("NOT_FOUND", "Tag not found", 404);
    }
    return tag;
  }, parseError);

export const listTags = async (
  orgId: string,
  filters: TaxonomyFiltersInput
): Promise<AppResult<{ items: (typeof tags.$inferSelect)[]; total: number }>> =>
  tryCatchAsync(async () => {
    const conditions = [eq(tags.organizationId, orgId), isNull(tags.deletedAt)];
    if (filters.search) {
      conditions.push(ilike(tags.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(tags)
        .where(and(...conditions))
        .orderBy(desc(tags.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(tags)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Attributes
// ==============================

export const getAttributeById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [attr] = await db
      .select()
      .from(attributes)
      .where(
        and(
          eq(attributes.id, id),
          eq(attributes.organizationId, orgId),
          isNull(attributes.deletedAt)
        )
      )
      .limit(1);
    if (!attr) {
      throw createError("NOT_FOUND", "Attribute not found", 404);
    }
    return attr;
  }, parseError);

export const listAttributes = async (
  orgId: string,
  filters: TaxonomyFiltersInput
): Promise<
  AppResult<{ items: (typeof attributes.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(attributes.organizationId, orgId),
      isNull(attributes.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(attributes.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(attributes)
        .where(and(...conditions))
        .orderBy(desc(attributes.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(attributes)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Attribute Options
// ==============================

export const getAttributeOptionById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [opt] = await db
      .select()
      .from(attributeOptions)
      .where(
        and(
          eq(attributeOptions.id, id),
          eq(attributeOptions.organizationId, orgId),
          isNull(attributeOptions.deletedAt)
        )
      )
      .limit(1);
    if (!opt) {
      throw createError("NOT_FOUND", "Attribute option not found", 404);
    }
    return opt;
  }, parseError);

export const listAttributeOptions = async (
  orgId: string,
  attributeId: string,
  filters: TaxonomyFiltersInput
): Promise<
  AppResult<{ items: (typeof attributeOptions.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(attributeOptions.organizationId, orgId),
      eq(attributeOptions.attributeId, attributeId),
      isNull(attributeOptions.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(attributeOptions.label, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(attributeOptions)
        .where(and(...conditions))
        .orderBy(desc(attributeOptions.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(attributeOptions)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Categories
// ==============================

export const getCategoryById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cat] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, id),
          eq(categories.organizationId, orgId),
          isNull(categories.deletedAt)
        )
      )
      .limit(1);
    if (!cat) {
      throw createError("NOT_FOUND", "Category not found", 404);
    }
    return cat;
  }, parseError);

export const listCategories = async (
  orgId: string,
  filters: TaxonomyFiltersInput
): Promise<
  AppResult<{ items: (typeof categories.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(categories.organizationId, orgId),
      isNull(categories.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(categories.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(and(...conditions))
        .orderBy(desc(categories.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(categories)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Collections
// ==============================

export const getCollectionById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [coll] = await db
      .select()
      .from(collections)
      .where(
        and(
          eq(collections.id, id),
          eq(collections.organizationId, orgId),
          isNull(collections.deletedAt)
        )
      )
      .limit(1);
    if (!coll) {
      throw createError("NOT_FOUND", "Collection not found", 404);
    }
    return coll;
  }, parseError);

export const listCollections = async (
  orgId: string,
  filters: TaxonomyFiltersInput
): Promise<
  AppResult<{ items: (typeof collections.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(collections.organizationId, orgId),
      isNull(collections.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(collections.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(collections)
        .where(and(...conditions))
        .orderBy(desc(collections.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(collections)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Units
// ==============================

export const getUnitById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [unit] = await db
      .select()
      .from(units)
      .where(
        and(
          eq(units.id, id),
          eq(units.organizationId, orgId),
          isNull(units.deletedAt)
        )
      )
      .limit(1);
    if (!unit) {
      throw createError("NOT_FOUND", "Unit of measure not found", 404);
    }
    return unit;
  }, parseError);

export const listUnits = async (
  orgId: string,
  filters: TaxonomyFiltersInput
): Promise<
  AppResult<{ items: (typeof units.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(units.organizationId, orgId),
      isNull(units.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(units.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(units)
        .where(and(...conditions))
        .orderBy(desc(units.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(units)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);
