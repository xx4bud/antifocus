import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  addresses,
  files,
  integrations,
  notifications,
  sequences,
  settings,
  webhooks,
} from "@/lib/db/schema/core";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
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
// Files Mutations
// ==============================

export const createFile = async (
  organizationId: string,
  data: CreateFileInput
): Promise<AppResult<typeof files.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [file] = await db
      .insert(files)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!file) {
      throw createError("DATABASE", "Failed to register file", 500);
    }
    return file;
  }, parseError);

export const softDeleteFile = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof files.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [file] = await db
      .update(files)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(files.id, id), eq(files.organizationId, organizationId)))
      .returning();
    if (!file) {
      throw createError("NOT_FOUND", "File not found", 404);
    }
    return file;
  }, parseError);

// ==============================
// Address Mutations
// ==============================

export const createAddress = async (
  organizationId: string,
  data: CreateAddressInput
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [address] = await db
      .insert(addresses)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!address) {
      throw createError("DATABASE", "Failed to create address", 500);
    }
    return address;
  }, parseError);

export const updateAddress = async (
  id: string,
  organizationId: string,
  data: UpdateAddressInput
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [address] = await db
      .update(addresses)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(addresses.id, id), eq(addresses.organizationId, organizationId))
      )
      .returning();
    if (!address) {
      throw createError("NOT_FOUND", "Address not found", 404);
    }
    return address;
  }, parseError);

export const softDeleteAddress = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [address] = await db
      .update(addresses)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(addresses.id, id), eq(addresses.organizationId, organizationId))
      )
      .returning();
    if (!address) {
      throw createError("NOT_FOUND", "Address not found", 404);
    }
    return address;
  }, parseError);

// ==============================
// Sequence Mutations
// ==============================

export const createSequence = async (
  organizationId: string,
  data: CreateSequenceInput
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [seq] = await db
      .insert(sequences)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!seq) {
      throw createError("DATABASE", "Failed to create sequence", 500);
    }
    return seq;
  }, parseError);

export const updateSequence = async (
  id: string,
  organizationId: string,
  data: UpdateSequenceInput
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [seq] = await db
      .update(sequences)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(sequences.id, id), eq(sequences.organizationId, organizationId))
      )
      .returning();
    if (!seq) {
      throw createError("NOT_FOUND", "Sequence not found", 404);
    }
    return seq;
  }, parseError);

export const softDeleteSequence = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [seq] = await db
      .update(sequences)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(sequences.id, id), eq(sequences.organizationId, organizationId))
      )
      .returning();
    if (!seq) {
      throw createError("NOT_FOUND", "Sequence not found", 404);
    }
    return seq;
  }, parseError);

// ==============================
// Settings Mutations
// ==============================

export const createSetting = async (
  organizationId: string,
  data: CreateSettingInput
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [setting] = await db
      .insert(settings)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!setting) {
      throw createError("DATABASE", "Failed to create setting", 500);
    }
    return setting;
  }, parseError);

export const updateSetting = async (
  id: string,
  organizationId: string,
  data: UpdateSettingInput
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [setting] = await db
      .update(settings)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(settings.id, id), eq(settings.organizationId, organizationId))
      )
      .returning();
    if (!setting) {
      throw createError("NOT_FOUND", "Setting not found", 404);
    }
    return setting;
  }, parseError);

export const softDeleteSetting = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [setting] = await db
      .update(settings)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(settings.id, id), eq(settings.organizationId, organizationId))
      )
      .returning();
    if (!setting) {
      throw createError("NOT_FOUND", "Setting not found", 404);
    }
    return setting;
  }, parseError);

// ==============================
// Integration Mutations
// ==============================

export const createIntegration = async (
  organizationId: string,
  data: CreateIntegrationInput
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [integration] = await db
      .insert(integrations)
      .values({
        id: createId(),
        organizationId,
        ...data,
      })
      .returning();
    if (!integration) {
      throw createError("DATABASE", "Failed to create integration", 500);
    }
    return integration;
  }, parseError);

export const updateIntegration = async (
  id: string,
  organizationId: string,
  data: UpdateIntegrationInput
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [integration] = await db
      .update(integrations)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(integrations.id, id),
          eq(integrations.organizationId, organizationId)
        )
      )
      .returning();
    if (!integration) {
      throw createError("NOT_FOUND", "Integration not found", 404);
    }
    return integration;
  }, parseError);

export const softDeleteIntegration = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [integration] = await db
      .update(integrations)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(integrations.id, id),
          eq(integrations.organizationId, organizationId)
        )
      )
      .returning();
    if (!integration) {
      throw createError("NOT_FOUND", "Integration not found", 404);
    }
    return integration;
  }, parseError);

// ==============================
// Webhook Mutations
// ==============================

export const createWebhook = async (
  organizationId: string,
  data: CreateWebhookInput
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [webhook] = await db
      .insert(webhooks)
      .values({
        id: createId(),
        organizationId,
        ...data,
        events: data.events as unknown as Record<string, unknown>,
      })
      .returning();
    if (!webhook) {
      throw createError("DATABASE", "Failed to create webhook", 500);
    }
    return webhook;
  }, parseError);

export const updateWebhook = async (
  id: string,
  organizationId: string,
  data: UpdateWebhookInput
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [webhook] = await db
      .update(webhooks)
      .set({
        ...data,
        events: data.events
          ? (data.events as unknown as Record<string, unknown>)
          : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(eq(webhooks.id, id), eq(webhooks.organizationId, organizationId))
      )
      .returning();
    if (!webhook) {
      throw createError("NOT_FOUND", "Webhook not found", 404);
    }
    return webhook;
  }, parseError);

export const softDeleteWebhook = async (
  id: string,
  organizationId: string
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [webhook] = await db
      .update(webhooks)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(webhooks.id, id), eq(webhooks.organizationId, organizationId))
      )
      .returning();
    if (!webhook) {
      throw createError("NOT_FOUND", "Webhook not found", 404);
    }
    return webhook;
  }, parseError);

// ==============================
// Additional Operations
// ==============================

export const nextSequence = async (
  organizationId: string,
  input: { name: string; branchId?: string | null }
): Promise<AppResult<string>> =>
  tryCatchAsync(async () => {
    return db.transaction(async (tx) => {
      const conditions = [
        eq(sequences.organizationId, organizationId),
        eq(sequences.name, input.name),
        eq(sequences.enabled, true),
        isNull(sequences.deletedAt),
      ];

      if (input.branchId) {
        conditions.push(eq(sequences.branchId, input.branchId));
      } else {
        conditions.push(isNull(sequences.branchId));
      }

      const [seq] = await tx
        .select()
        .from(sequences)
        .where(and(...conditions))
        .for("update"); // pessimistic row lock

      if (!seq) {
        throw createError(
          "NOT_FOUND",
          `Sequence '${input.name}' not found for this organization.`,
          404
        );
      }

      const next = seq.current + seq.increment;
      await tx
        .update(sequences)
        .set({ current: next, updatedAt: new Date() })
        .where(eq(sequences.id, seq.id));

      const padded = String(next).padStart(seq.padding ?? 4, "0");
      return `${seq.prefix ?? ""}${padded}${seq.suffix ?? ""}`;
    });
  }, parseError);

export const markNotificationRead = async (
  userId: string,
  id: string
): Promise<AppResult<typeof notifications.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [row] = await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    if (!row) {
      throw createError("NOT_FOUND", "Notification not found", 404);
    }
    return row;
  }, parseError);

export const markAllNotificationsRead = async (
  userId: string,
  organizationId: string
): Promise<AppResult<void>> =>
  tryCatchAsync(async () => {
    await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.organizationId, organizationId),
          eq(notifications.read, false)
        )
      );
  }, parseError);
