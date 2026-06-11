import { z } from "zod/v4";
import {
  createTRPCRouter,
  orgAdminProcedure,
  orgProcedure,
  protectedProcedure,
} from "@/lib/api/trpc";
import { createError } from "@/lib/utils/error";
import {
  listBranches,
  listCustomers,
  listOrganizations,
  listSuppliers,
} from "./queries";
import {
  createBranchService,
  createCustomerService,
  createOrganizationService,
  createSupplierService,
  inviteMemberService,
  softDeleteBranchService,
  softDeleteCustomerService,
  softDeleteOrganizationService,
  softDeleteSupplierService,
  updateBranchService,
  updateCustomerService,
  updateMemberRoleService,
  updateOrganizationService,
  updateSupplierService,
} from "./services";
import {
  branchFiltersSchema,
  createBranchSchema,
  createCustomerSchema,
  createOrganizationSchema,
  createSupplierSchema,
  customerFiltersSchema,
  inviteMemberSchema,
  orgFiltersSchema,
  supplierFiltersSchema,
  updateMemberRoleSchema,
} from "./validators";

export const orgRouter = createTRPCRouter({
  // ==============================
  // Organization Operations
  // ==============================

  listOrganizations: orgProcedure
    .input(orgFiltersSchema)
    .query(async ({ input }) => {
      const result = await listOrganizations(input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getOrganizationById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { getOrganizationById } = await import("./queries");
      const result = await getOrganizationById(input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createOrganization: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input }) => {
      // ctx.user is guaranteed by protectedProcedure
      // The service will add the user as owner member automatically
      const result = await createOrganizationService(input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateOrganization: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
        logo: z.string().optional().nullable(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await updateOrganizationService(input.id, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteOrganization: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const result = await softDeleteOrganizationService(input.id);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Branch Operations
  // ==============================

  listBranches: orgProcedure
    .input(branchFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listBranches(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  getBranchById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const { getBranchById } = await import("./queries");
      const result = await getBranchById(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createBranch: orgProcedure
    .input(createBranchSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createBranchService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateBranch: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        code: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        logo: z.string().optional().nullable(),
        cover: z.string().optional().nullable(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateBranchService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteBranch: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteBranchService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Member & Invitation Operations
  // ==============================

  inviteMember: orgAdminProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await inviteMemberService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateMemberRole: orgAdminProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateMemberRoleService(
        input.memberId,
        ctx.orgId,
        input
      );
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Customer Operations
  // ==============================

  listCustomers: orgProcedure
    .input(customerFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listCustomers(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createCustomer: orgProcedure
    .input(createCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createCustomerService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateCustomer: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional().nullable(),
        code: z.string().optional(),
        userId: z.string().optional().nullable(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateCustomerService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteCustomer: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteCustomerService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  // ==============================
  // Supplier Operations
  // ==============================

  listSuppliers: orgProcedure
    .input(supplierFiltersSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await listSuppliers(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  createSupplier: orgProcedure
    .input(createSupplierSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await createSupplierService(ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  updateSupplier: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional().nullable(),
        code: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await updateSupplierService(input.id, ctx.orgId, input);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),

  deleteSupplier: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw createError("UNAUTHORIZED", "Organization context missing", 401);
      }
      const result = await softDeleteSupplierService(input.id, ctx.orgId);
      if (!result.ok) {
        throw result.error;
      }
      return result.value;
    }),
});
