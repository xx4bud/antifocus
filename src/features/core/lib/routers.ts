import { z } from "zod/v4";
import { createTRPCRouter, orgProcedure } from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  getAddressById,
  getFileById,
  getIntegrationById,
  getSequenceById,
  getSettingById,
  getWebhookById,
  listAddresses,
  listFiles,
  listIntegrations,
  listSequences,
  listSettings,
  listWebhooks,
} from "./queries";
import {
  createAddressService,
  createFileService,
  createIntegrationService,
  createSequenceService,
  createSettingService,
  createWebhookService,
  softDeleteAddressService,
  softDeleteFileService,
  softDeleteIntegrationService,
  softDeleteSequenceService,
  softDeleteSettingService,
  softDeleteWebhookService,
  updateAddressService,
  updateIntegrationService,
  updateSequenceService,
  updateSettingService,
  updateWebhookService,
} from "./services";
import {
  coreFiltersSchema,
  createAddressSchema,
  createFileSchema,
  createIntegrationSchema,
  createSequenceSchema,
  createSettingSchema,
  createWebhookSchema,
} from "./validators";

export const coreRouter = createTRPCRouter({
  // ==============================
  // Files Endpoints
  // ==============================

  listFiles: orgProcedure
    .input(coreFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listFiles(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getFileById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getFileById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createFile: orgProcedure
    .input(createFileSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createFileService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteFile: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteFileService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Address Endpoints
  // ==============================

  listAddresses: orgProcedure
    .input(coreFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listAddresses(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getAddressById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getAddressById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createAddress: orgProcedure
    .input(createAddressSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createAddressService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateAddress: orgProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string().optional().nullable(),
        memberId: z.string().optional().nullable(),
        branchId: z.string().optional().nullable(),
        customerId: z.string().optional().nullable(),
        supplierId: z.string().optional().nullable(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional().nullable(),
        street1: z.string().optional(),
        street2: z.string().optional().nullable(),
        zipCode: z.string().optional().nullable(),
        latitude: z.number().optional().nullable(),
        longitude: z.number().optional().nullable(),
        default: z.boolean().optional(),
        type: z.enum(["mixed", "billing", "shipping"]).optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateAddressService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteAddress: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteAddressService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Sequence Endpoints
  // ==============================

  listSequences: orgProcedure
    .input(coreFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listSequences(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getSequenceById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getSequenceById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createSequence: orgProcedure
    .input(createSequenceSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createSequenceService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateSequence: orgProcedure
    .input(
      z.object({
        id: z.string(),
        branchId: z.string().optional().nullable(),
        name: z.string().optional(),
        prefix: z.string().optional().nullable(),
        suffix: z.string().optional().nullable(),
        padding: z.number().int().optional(),
        increment: z.number().int().optional(),
        current: z.number().int().optional(),
        resetAt: z.coerce.date().optional().nullable(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateSequenceService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteSequence: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteSequenceService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Setting Endpoints
  // ==============================

  listSettings: orgProcedure
    .input(coreFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listSettings(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getSettingById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getSettingById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createSetting: orgProcedure
    .input(createSettingSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createSettingService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateSetting: orgProcedure
    .input(
      z.object({
        id: z.string(),
        category: z.string().optional(),
        key: z.string().optional(),
        value: z.string().optional(),
        public: z.boolean().optional(),
        system: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateSettingService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteSetting: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteSettingService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Integration Endpoints
  // ==============================

  listIntegrations: orgProcedure
    .input(coreFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listIntegrations(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getIntegrationById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getIntegrationById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createIntegration: orgProcedure
    .input(createIntegrationSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createIntegrationService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateIntegration: orgProcedure
    .input(
      z.object({
        id: z.string(),
        providerId: z.string().optional(),
        accountId: z.string().optional(),
        category: z.string().optional(),
        name: z.string().optional(),
        configs: z.record(z.string(), z.unknown()).optional().nullable(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateIntegrationService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteIntegration: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteIntegrationService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Webhook Endpoints
  // ==============================

  listWebhooks: orgProcedure
    .input(coreFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listWebhooks(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getWebhookById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await getWebhookById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createWebhook: orgProcedure
    .input(createWebhookSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createWebhookService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateWebhook: orgProcedure
    .input(
      z.object({
        id: z.string(),
        integrationId: z.string().optional().nullable(),
        url: z.string().url().optional(),
        secret: z.string().optional().nullable(),
        headers: z.record(z.string(), z.unknown()).optional().nullable(),
        events: z.array(z.string()).optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateWebhookService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteWebhook: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteWebhookService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),
});
