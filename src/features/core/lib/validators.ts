import { z } from "zod/v4";
import { emailSchema } from "@/lib/validations/email";
import { nameSchema } from "@/lib/validations/name";
import { phoneNumberSchema } from "@/lib/validations/phone-number";
import { urlSchema } from "@/lib/validations/url";

// ==============================
// Files
// ==============================

export const createFileSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  accountId: z.string().default("default"),
  name: z.string().min(1, "File name is required"),
  url: urlSchema,
  size: z.number().int().nonnegative(),
  mime: z.string().min(1, "MIME type is required"),
  hash: z.string().optional().nullable(),
  public: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateFileInput = z.infer<typeof createFileSchema>;

// ==============================
// Addresses
// ==============================

const adminDivisionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .nullable()
  .optional();

export const createAddressSchema = z.object({
  userId: z.string().optional().nullable(),
  memberId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
  supplierId: z.string().optional().nullable(),
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema.optional().nullable(),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional().nullable(),
  subDistrict: adminDivisionSchema,
  district: adminDivisionSchema,
  city: adminDivisionSchema,
  province: adminDivisionSchema,
  country: adminDivisionSchema,
  zipCode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  default: z.boolean().default(false),
  type: z.enum(["mixed", "billing", "shipping"]).default("mixed"),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = createAddressSchema.partial();
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

// ==============================
// Sequences
// ==============================

export const createSequenceSchema = z.object({
  branchId: z.string().optional().nullable(),
  name: z.string().min(1, "Sequence name is required"),
  prefix: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  padding: z.number().int().min(1).default(4),
  increment: z.number().int().min(1).default(1),
  current: z.number().int().nonnegative().default(0),
  resetAt: z.coerce.date().optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateSequenceInput = z.infer<typeof createSequenceSchema>;

export const updateSequenceSchema = createSequenceSchema.partial();
export type UpdateSequenceInput = z.infer<typeof updateSequenceSchema>;

// ==============================
// Settings
// ==============================

export const createSettingSchema = z.object({
  category: z.string().min(1, "Category is required"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  public: z.boolean().default(true),
  system: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateSettingInput = z.infer<typeof createSettingSchema>;

export const updateSettingSchema = createSettingSchema.partial();
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;

// ==============================
// Integrations
// ==============================

export const createIntegrationSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  accountId: z.string().default("default"),
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  configs: z.record(z.string(), z.unknown()).optional().nullable(),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateIntegrationInput = z.infer<typeof createIntegrationSchema>;

export const updateIntegrationSchema = createIntegrationSchema.partial();
export type UpdateIntegrationInput = z.infer<typeof updateIntegrationSchema>;

// ==============================
// Webhooks
// ==============================

export const createWebhookSchema = z.object({
  integrationId: z.string().optional().nullable(),
  url: urlSchema,
  secret: z.string().optional().nullable(),
  headers: z.record(z.string(), z.unknown()).optional().nullable(),
  events: z.array(z.string()).min(1, "At least one event topic is required"),
  enabled: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>;

export const updateWebhookSchema = createWebhookSchema.partial();
export type UpdateWebhookInput = z.infer<typeof updateWebhookSchema>;

// ==============================
// Filters & Queries
// ==============================

export const coreFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type CoreFiltersInput = z.infer<typeof coreFiltersSchema>;

// ==============================
// Additional Operations
// ==============================

export const nextSequenceSchema = z.object({
  name: z.string().min(1),
  branchId: z.string().optional().nullable(),
});

export const listNotificationsSchema = coreFiltersSchema.extend({
  unreadOnly: z.boolean().default(false),
  category: z.string().optional(),
});

export const markReadSchema = z.object({ id: z.string() });
