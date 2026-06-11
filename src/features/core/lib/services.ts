"use server";

import { createId } from "@paralleldrive/cuid2";
import { requireAuthSession } from "@/features/auth/lib/services";
import { db } from "@/lib/db";
import {
  type addresses,
  auditLogs,
  type files,
  type integrations,
  type sequences,
  type settings,
  type webhooks,
} from "@/lib/db/schema/core";
import { parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  createAddress,
  createFile,
  createIntegration,
  createSequence,
  createSetting,
  createWebhook,
  softDeleteAddress,
  softDeleteFile,
  softDeleteIntegration,
  softDeleteSequence,
  softDeleteSetting,
  softDeleteWebhook,
  updateAddress,
  updateIntegration,
  updateSequence,
  updateSetting,
  updateWebhook,
} from "./mutations";
import type {
  CreateAddressInput,
  CreateFileInput,
  CreateIntegrationInput,
  CreateSequenceInput,
  CreateSettingInput,
  CreateWebhookInput,
  UpdateAddressInput,
  UpdateIntegrationInput,
  UpdateSequenceInput,
  UpdateSettingInput,
  UpdateWebhookInput,
} from "./validators";

// ==============================
// Files Services
// ==============================

export const createFileService = async (
  organizationId: string,
  data: CreateFileInput
): Promise<AppResult<typeof files.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const fileRes = await createFile(organizationId, data);
    if (!fileRes.ok) {
      throw fileRes.error;
    }
    const file = fileRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "file.registered",
      targetName: "files",
      targetId: file.id,
    });

    return file;
  }, parseError);

export const softDeleteFileService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof files.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const fileRes = await softDeleteFile(id, organizationId);
    if (!fileRes.ok) {
      throw fileRes.error;
    }
    const file = fileRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "file.deleted",
      targetName: "files",
      targetId: file.id,
    });

    return file;
  }, parseError);

// ==============================
// Address Services
// ==============================

export const createAddressService = async (
  organizationId: string,
  data: CreateAddressInput
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const addressRes = await createAddress(organizationId, data);
    if (!addressRes.ok) {
      throw addressRes.error;
    }
    const address = addressRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "address.created",
      targetName: "addresses",
      targetId: address.id,
    });

    return address;
  }, parseError);

export const updateAddressService = async (
  id: string,
  organizationId: string,
  data: UpdateAddressInput
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const addressRes = await updateAddress(id, organizationId, data);
    if (!addressRes.ok) {
      throw addressRes.error;
    }
    const address = addressRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "address.updated",
      targetName: "addresses",
      targetId: address.id,
    });

    return address;
  }, parseError);

export const softDeleteAddressService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const addressRes = await softDeleteAddress(id, organizationId);
    if (!addressRes.ok) {
      throw addressRes.error;
    }
    const address = addressRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "address.deleted",
      targetName: "addresses",
      targetId: address.id,
    });

    return address;
  }, parseError);

// ==============================
// Sequence Services
// ==============================

export const createSequenceService = async (
  organizationId: string,
  data: CreateSequenceInput
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const seqRes = await createSequence(organizationId, data);
    if (!seqRes.ok) {
      throw seqRes.error;
    }
    const seq = seqRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "sequence.created",
      targetName: "sequences",
      targetId: seq.id,
    });

    return seq;
  }, parseError);

export const updateSequenceService = async (
  id: string,
  organizationId: string,
  data: UpdateSequenceInput
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const seqRes = await updateSequence(id, organizationId, data);
    if (!seqRes.ok) {
      throw seqRes.error;
    }
    const seq = seqRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "sequence.updated",
      targetName: "sequences",
      targetId: seq.id,
    });

    return seq;
  }, parseError);

export const softDeleteSequenceService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const seqRes = await softDeleteSequence(id, organizationId);
    if (!seqRes.ok) {
      throw seqRes.error;
    }
    const seq = seqRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "sequence.deleted",
      targetName: "sequences",
      targetId: seq.id,
    });

    return seq;
  }, parseError);

// ==============================
// Setting Services
// ==============================

export const createSettingService = async (
  organizationId: string,
  data: CreateSettingInput
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const settingRes = await createSetting(organizationId, data);
    if (!settingRes.ok) {
      throw settingRes.error;
    }
    const setting = settingRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "setting.created",
      targetName: "settings",
      targetId: setting.id,
    });

    return setting;
  }, parseError);

export const updateSettingService = async (
  id: string,
  organizationId: string,
  data: UpdateSettingInput
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const settingRes = await updateSetting(id, organizationId, data);
    if (!settingRes.ok) {
      throw settingRes.error;
    }
    const setting = settingRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "setting.updated",
      targetName: "settings",
      targetId: setting.id,
    });

    return setting;
  }, parseError);

export const softDeleteSettingService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const settingRes = await softDeleteSetting(id, organizationId);
    if (!settingRes.ok) {
      throw settingRes.error;
    }
    const setting = settingRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "setting.deleted",
      targetName: "settings",
      targetId: setting.id,
    });

    return setting;
  }, parseError);

// ==============================
// Integration Services
// ==============================

export const createIntegrationService = async (
  organizationId: string,
  data: CreateIntegrationInput
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const integrationRes = await createIntegration(organizationId, data);
    if (!integrationRes.ok) {
      throw integrationRes.error;
    }
    const integration = integrationRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "integration.created",
      targetName: "integrations",
      targetId: integration.id,
    });

    return integration;
  }, parseError);

export const updateIntegrationService = async (
  id: string,
  organizationId: string,
  data: UpdateIntegrationInput
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const integrationRes = await updateIntegration(id, organizationId, data);
    if (!integrationRes.ok) {
      throw integrationRes.error;
    }
    const integration = integrationRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "integration.updated",
      targetName: "integrations",
      targetId: integration.id,
    });

    return integration;
  }, parseError);

export const softDeleteIntegrationService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const integrationRes = await softDeleteIntegration(id, organizationId);
    if (!integrationRes.ok) {
      throw integrationRes.error;
    }
    const integration = integrationRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "integration.deleted",
      targetName: "integrations",
      targetId: integration.id,
    });

    return integration;
  }, parseError);

// ==============================
// Webhook Services
// ==============================

export const createWebhookService = async (
  organizationId: string,
  data: CreateWebhookInput
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const webhookRes = await createWebhook(organizationId, data);
    if (!webhookRes.ok) {
      throw webhookRes.error;
    }
    const webhook = webhookRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "webhook.created",
      targetName: "webhooks",
      targetId: webhook.id,
    });

    return webhook;
  }, parseError);

export const updateWebhookService = async (
  id: string,
  organizationId: string,
  data: UpdateWebhookInput
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const webhookRes = await updateWebhook(id, organizationId, data);
    if (!webhookRes.ok) {
      throw webhookRes.error;
    }
    const webhook = webhookRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "webhook.updated",
      targetName: "webhooks",
      targetId: webhook.id,
    });

    return webhook;
  }, parseError);

export const softDeleteWebhookService = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const webhookRes = await softDeleteWebhook(id, organizationId);
    if (!webhookRes.ok) {
      throw webhookRes.error;
    }
    const webhook = webhookRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "webhook.deleted",
      targetName: "webhooks",
      targetId: webhook.id,
    });

    return webhook;
  }, parseError);
