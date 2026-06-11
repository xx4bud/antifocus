"use server";

import { createId } from "@paralleldrive/cuid2";
import { requireAuthSession } from "@/features/auth/lib/services";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import type {
  attributeOptions,
  attributes,
  categories,
  categoryAttributes,
  collections,
  tags,
  units,
} from "@/lib/db/schema/taxonomy";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  createAttribute,
  createAttributeOption,
  createCategory,
  createCollection,
  createTag,
  createUnit,
  linkCategoryAttribute,
  softDeleteAttribute,
  softDeleteAttributeOption,
  softDeleteCategory,
  softDeleteCollection,
  softDeleteTag,
  softDeleteUnit,
  unlinkCategoryAttribute,
  updateAttribute,
  updateAttributeOption,
  updateCategory,
  updateCollection,
  updateTag,
  updateUnit,
} from "./mutations";
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
// Tags Services
// ==============================

export const createTagService = async (
  organizationId: string,
  data: CreateTagInput
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const tagRes = await createTag(organizationId, data);
    if (!tagRes.ok) {
      throw tagRes.error;
    }
    const tag = tagRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "tag.created",
      targetName: "tags",
      targetId: tag.id,
    });

    return tag;
  }, parseError);

export const updateTagService = async (
  id: string,
  organizationId: string,
  data: UpdateTagInput
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const tagRes = await updateTag(id, organizationId, data);
    if (!tagRes.ok) {
      throw tagRes.error;
    }
    const tag = tagRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "tag.updated",
      targetName: "tags",
      targetId: tag.id,
    });

    return tag;
  }, parseError);

export const softDeleteTagService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof tags.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const tagRes = await softDeleteTag(id, organizationId);
    if (!tagRes.ok) {
      throw tagRes.error;
    }
    const tag = tagRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "tag.deleted",
      targetName: "tags",
      targetId: tag.id,
    });

    return tag;
  }, parseError);

// ==============================
// Attributes Services
// ==============================

export const createAttributeService = async (
  organizationId: string,
  data: CreateAttributeInput
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const attrRes = await createAttribute(organizationId, data);
    if (!attrRes.ok) {
      throw attrRes.error;
    }
    const attr = attrRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "attribute.created",
      targetName: "attributes",
      targetId: attr.id,
    });

    return attr;
  }, parseError);

export const updateAttributeService = async (
  id: string,
  organizationId: string,
  data: UpdateAttributeInput
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const attrRes = await updateAttribute(id, organizationId, data);
    if (!attrRes.ok) {
      throw attrRes.error;
    }
    const attr = attrRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "attribute.updated",
      targetName: "attributes",
      targetId: attr.id,
    });

    return attr;
  }, parseError);

export const softDeleteAttributeService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof attributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const attrRes = await softDeleteAttribute(id, organizationId);
    if (!attrRes.ok) {
      throw attrRes.error;
    }
    const attr = attrRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "attribute.deleted",
      targetName: "attributes",
      targetId: attr.id,
    });

    return attr;
  }, parseError);

// ==============================
// Attribute Options Services
// ==============================

export const createAttributeOptionService = async (
  organizationId: string,
  data: CreateAttributeOptionInput
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const optRes = await createAttributeOption(organizationId, data);
    if (!optRes.ok) {
      throw optRes.error;
    }
    const opt = optRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "attribute_option.created",
      targetName: "attribute_options",
      targetId: opt.id,
    });

    return opt;
  }, parseError);

export const updateAttributeOptionService = async (
  id: string,
  organizationId: string,
  data: UpdateAttributeOptionInput
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const optRes = await updateAttributeOption(id, organizationId, data);
    if (!optRes.ok) {
      throw optRes.error;
    }
    const opt = optRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "attribute_option.updated",
      targetName: "attribute_options",
      targetId: opt.id,
    });

    return opt;
  }, parseError);

export const softDeleteAttributeOptionService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof attributeOptions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const optRes = await softDeleteAttributeOption(id, organizationId);
    if (!optRes.ok) {
      throw optRes.error;
    }
    const opt = optRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "attribute_option.deleted",
      targetName: "attribute_options",
      targetId: opt.id,
    });

    return opt;
  }, parseError);

// ==============================
// Categories Services
// ==============================

export const createCategoryService = async (
  organizationId: string,
  data: CreateCategoryInput
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const catRes = await createCategory(organizationId, data);
    if (!catRes.ok) {
      throw catRes.error;
    }
    const cat = catRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "category.created",
      targetName: "categories",
      targetId: cat.id,
    });

    return cat;
  }, parseError);

export const updateCategoryService = async (
  id: string,
  organizationId: string,
  data: UpdateCategoryInput
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const catRes = await updateCategory(id, organizationId, data);
    if (!catRes.ok) {
      throw catRes.error;
    }
    const cat = catRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "category.updated",
      targetName: "categories",
      targetId: cat.id,
    });

    return cat;
  }, parseError);

export const softDeleteCategoryService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof categories.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const catRes = await softDeleteCategory(id, organizationId);
    if (!catRes.ok) {
      throw catRes.error;
    }
    const cat = catRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "category.deleted",
      targetName: "categories",
      targetId: cat.id,
    });

    return cat;
  }, parseError);

export const linkCategoryAttributeService = async (
  organizationId: string,
  data: LinkCategoryAttributeInput
): Promise<AppResult<typeof categoryAttributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const catAttrRes = await linkCategoryAttribute(organizationId, data);
    if (!catAttrRes.ok) {
      throw catAttrRes.error;
    }
    const catAttr = catAttrRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "category_attribute.linked",
      targetName: "category_attributes",
      targetId: catAttr.id,
    });

    return catAttr;
  }, parseError);

export const unlinkCategoryAttributeService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof categoryAttributes.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const catAttrRes = await unlinkCategoryAttribute(id, organizationId);
    if (!catAttrRes.ok) {
      throw catAttrRes.error;
    }
    const catAttr = catAttrRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "category_attribute.unlinked",
      targetName: "category_attributes",
      targetId: catAttr.id,
    });

    return catAttr;
  }, parseError);

// ==============================
// Collections Services
// ==============================

export const createCollectionService = async (
  organizationId: string,
  data: CreateCollectionInput
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const collRes = await createCollection(organizationId, data);
    if (!collRes.ok) {
      throw collRes.error;
    }
    const coll = collRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "collection.created",
      targetName: "collections",
      targetId: coll.id,
    });

    return coll;
  }, parseError);

export const updateCollectionService = async (
  id: string,
  organizationId: string,
  data: UpdateCollectionInput
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const collRes = await updateCollection(id, organizationId, data);
    if (!collRes.ok) {
      throw collRes.error;
    }
    const coll = collRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "collection.updated",
      targetName: "collections",
      targetId: coll.id,
    });

    return coll;
  }, parseError);

export const softDeleteCollectionService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof collections.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const collRes = await softDeleteCollection(id, organizationId);
    if (!collRes.ok) {
      throw collRes.error;
    }
    const coll = collRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "collection.deleted",
      targetName: "collections",
      targetId: coll.id,
    });

    return coll;
  }, parseError);

// ==============================
// Units Services
// ==============================

export const createUnitService = async (
  organizationId: string,
  data: CreateUnitInput
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const unitRes = await createUnit(organizationId, data);
    if (!unitRes.ok) {
      throw unitRes.error;
    }
    const unit = unitRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "unit.created",
      targetName: "units",
      targetId: unit.id,
    });

    return unit;
  }, parseError);

export const updateUnitService = async (
  id: string,
  organizationId: string,
  data: UpdateUnitInput
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const unitRes = await updateUnit(id, organizationId, data);
    if (!unitRes.ok) {
      throw unitRes.error;
    }
    const unit = unitRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "unit.updated",
      targetName: "units",
      targetId: unit.id,
    });

    return unit;
  }, parseError);

export const softDeleteUnitService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof units.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const unitRes = await softDeleteUnit(id, organizationId);
    if (!unitRes.ok) {
      throw unitRes.error;
    }
    const unit = unitRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "unit.deleted",
      targetName: "units",
      targetId: unit.id,
    });

    return unit;
  }, parseError);
