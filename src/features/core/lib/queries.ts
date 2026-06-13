import { and, asc, count, desc, eq, ilike, isNull } from "drizzle-orm";
import type { z } from "zod/v4";
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
import type { CoreFiltersInput, listNotificationsSchema } from "./validators";

// ==============================
// Files
// ==============================

export const getFileById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof files.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [file] = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.id, id),
          eq(files.organizationId, orgId),
          isNull(files.deletedAt)
        )
      )
      .limit(1);
    if (!file) {
      throw createError("NOT_FOUND", "File not found", 404);
    }
    return file;
  }, parseError);

export const listFiles = async (
  orgId: string,
  filters: CoreFiltersInput
): Promise<
  AppResult<{ items: (typeof files.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(files.organizationId, orgId),
      isNull(files.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(files.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(files)
        .where(and(...conditions))
        .orderBy(desc(files.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(files)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Addresses
// ==============================

export const getAddressById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof addresses.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [address] = await db
      .select()
      .from(addresses)
      .where(
        and(
          eq(addresses.id, id),
          eq(addresses.organizationId, orgId),
          isNull(addresses.deletedAt)
        )
      )
      .limit(1);
    if (!address) {
      throw createError("NOT_FOUND", "Address not found", 404);
    }
    return address;
  }, parseError);

export const listAddresses = async (
  orgId: string,
  filters: CoreFiltersInput
): Promise<
  AppResult<{ items: (typeof addresses.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(addresses.organizationId, orgId),
      isNull(addresses.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(addresses.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(addresses)
        .where(and(...conditions))
        .orderBy(desc(addresses.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(addresses)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Sequences
// ==============================

export const getSequenceById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof sequences.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [seq] = await db
      .select()
      .from(sequences)
      .where(
        and(
          eq(sequences.id, id),
          eq(sequences.organizationId, orgId),
          isNull(sequences.deletedAt)
        )
      )
      .limit(1);
    if (!seq) {
      throw createError("NOT_FOUND", "Sequence not found", 404);
    }
    return seq;
  }, parseError);

export const listSequences = async (
  orgId: string,
  filters: CoreFiltersInput
): Promise<
  AppResult<{ items: (typeof sequences.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(sequences.organizationId, orgId),
      isNull(sequences.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(sequences.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(sequences)
        .where(and(...conditions))
        .orderBy(desc(sequences.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(sequences)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Settings
// ==============================

export const getSettingById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof settings.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [setting] = await db
      .select()
      .from(settings)
      .where(
        and(
          eq(settings.id, id),
          eq(settings.organizationId, orgId),
          isNull(settings.deletedAt)
        )
      )
      .limit(1);
    if (!setting) {
      throw createError("NOT_FOUND", "Setting not found", 404);
    }
    return setting;
  }, parseError);

export const listSettings = async (
  orgId: string,
  filters: CoreFiltersInput
): Promise<
  AppResult<{ items: (typeof settings.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(settings.organizationId, orgId),
      isNull(settings.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(settings.key, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(settings)
        .where(and(...conditions))
        .orderBy(desc(settings.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(settings)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Integrations
// ==============================

export const getIntegrationById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof integrations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [integration] = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.id, id),
          eq(integrations.organizationId, orgId),
          isNull(integrations.deletedAt)
        )
      )
      .limit(1);
    if (!integration) {
      throw createError("NOT_FOUND", "Integration not found", 404);
    }
    return integration;
  }, parseError);

export const listIntegrations = async (
  orgId: string,
  filters: CoreFiltersInput
): Promise<
  AppResult<{ items: (typeof integrations.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(integrations.organizationId, orgId),
      isNull(integrations.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(integrations.name, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(integrations)
        .where(and(...conditions))
        .orderBy(desc(integrations.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(integrations)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Webhooks
// ==============================

export const getWebhookById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof webhooks.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [webhook] = await db
      .select()
      .from(webhooks)
      .where(
        and(
          eq(webhooks.id, id),
          eq(webhooks.organizationId, orgId),
          isNull(webhooks.deletedAt)
        )
      )
      .limit(1);
    if (!webhook) {
      throw createError("NOT_FOUND", "Webhook not found", 404);
    }
    return webhook;
  }, parseError);

export const listWebhooks = async (
  orgId: string,
  filters: CoreFiltersInput
): Promise<
  AppResult<{ items: (typeof webhooks.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(webhooks.organizationId, orgId),
      isNull(webhooks.deletedAt),
    ];
    if (filters.search) {
      conditions.push(ilike(webhooks.url, `%${filters.search}%`));
    }
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(webhooks)
        .where(and(...conditions))
        .orderBy(desc(webhooks.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(webhooks)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Notifications
// ==============================

export const listNotifications = async (
  userId: string,
  organizationId: string,
  filters: z.infer<typeof listNotificationsSchema>
): Promise<
  AppResult<{ items: (typeof notifications.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(notifications.organizationId, organizationId),
      eq(notifications.userId, userId),
      isNull(notifications.deletedAt),
    ];

    if (filters.unreadOnly) {
      conditions.push(eq(notifications.read, false));
    }
    if (filters.category) {
      conditions.push(eq(notifications.category, filters.category));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(asc(notifications.read), desc(notifications.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(notifications)
        .where(and(...conditions)),
    ]);
    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);
