import { z } from "zod/v4";
import { optionalCodeSchema } from "@/lib/validations/code";
import { emailSchema } from "@/lib/validations/email";
import { nameSchema } from "@/lib/validations/name";
import {
  optionalPhoneNumberSchema,
  phoneNumberSchema,
} from "@/lib/validations/phone-number";
import { slugSchema } from "@/lib/validations/slug";
import { urlSchema } from "@/lib/validations/url";

// ==============================
// Organization
// ==============================

export const createOrganizationSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  logo: urlSchema.optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// ==============================
// Branches
// ==============================

export const createBranchSchema = z.object({
  name: nameSchema,
  code: optionalCodeSchema,
  phoneNumber: optionalPhoneNumberSchema,
  email: emailSchema.optional().nullable(),
  logo: urlSchema.optional().nullable(),
  cover: urlSchema.optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;

export const updateBranchSchema = createBranchSchema.partial();

export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

export const setBranchStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "closed", "maintenance", "archived"]),
});

export type SetBranchStatusInput = z.infer<typeof setBranchStatusSchema>;

// ==============================
// Members & Invitations
// ==============================

export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(["owner", "admin", "member"]),
  inviterId: z.string(),
  expiresAt: z.coerce.date(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const updateMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.enum(["owner", "admin", "member"]),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// ==============================
// Customers
// ==============================

export const createCustomerSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema.optional().nullable(),
  code: optionalCodeSchema,
  userId: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = createCustomerSchema.partial();

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

// ==============================
// Suppliers
// ==============================

export const createSupplierSchema = z.object({
  name: nameSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema.optional().nullable(),
  code: optionalCodeSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = createSupplierSchema.partial();

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;

// ==============================
// Filters
// ==============================

export const baseFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const orgFiltersSchema = baseFiltersSchema;
export type OrgFiltersInput = z.infer<typeof orgFiltersSchema>;

export const branchFiltersSchema = baseFiltersSchema;
export type BranchFiltersInput = z.infer<typeof branchFiltersSchema>;

export const customerFiltersSchema = baseFiltersSchema.extend({
  userId: z.string().optional(),
});
export type CustomerFiltersInput = z.infer<typeof customerFiltersSchema>;

export const supplierFiltersSchema = baseFiltersSchema;
export type SupplierFiltersInput = z.infer<typeof supplierFiltersSchema>;

// ==============================
// Additional Operations
// ==============================

export const listMembersSchema = baseFiltersSchema.extend({
  role: z.string().optional(),
});
export type ListMembersInput = z.infer<typeof listMembersSchema>;

export const removeMemberSchema = z.object({ memberId: z.string() });

export const addBranchMemberSchema = z.object({
  branchId: z.string(),
  memberId: z.string(),
});
export type AddBranchMemberInput = z.infer<typeof addBranchMemberSchema>;

export const removeBranchMemberSchema = addBranchMemberSchema;
export type RemoveBranchMemberInput = z.infer<typeof removeBranchMemberSchema>;

export const listBranchMembersSchema = z.object({
  branchId: z.string(),
});
export type ListBranchMembersInput = z.infer<typeof listBranchMembersSchema>;
