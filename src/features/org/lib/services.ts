"use server";

import { createId } from "@paralleldrive/cuid2";
import { requireAuthSession } from "@/features/auth/lib/services";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import {
  type branches,
  type customers,
  type invitations,
  members,
  type organizations,
  type suppliers,
} from "@/lib/db/schema/org";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import {
  createBranch,
  createCustomer,
  createOrganization,
  createSupplier,
  inviteMember,
  softDeleteBranch,
  softDeleteCustomer,
  softDeleteOrganization,
  softDeleteSupplier,
  updateBranch,
  updateCustomer,
  updateMemberRole,
  updateOrganization,
  updateSupplier,
} from "./mutations";
import type {
  CreateBranchInput,
  CreateCustomerInput,
  CreateOrganizationInput,
  CreateSupplierInput,
  InviteMemberInput,
  UpdateBranchInput,
  UpdateCustomerInput,
  UpdateMemberRoleInput,
  UpdateOrganizationInput,
  UpdateSupplierInput,
} from "./validators";

// ==============================
// Organization Services
// ==============================

export const createOrganizationService = async (
  data: CreateOrganizationInput
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    // 1. Create Organization
    const orgRes = await createOrganization(data);
    if (!orgRes.ok) {
      throw orgRes.error;
    }
    const org = orgRes.value;

    // 2. Add creator user as Owner member
    const [member] = await db
      .insert(members)
      .values({
        id: createId(),
        organizationId: org.id,
        userId: actor.id,
        role: "owner",
        status: "active",
      })
      .returning();

    if (!member) {
      throw createError("DATABASE", "Failed to add creator as member", 500);
    }

    // 3. Write Audit Log
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: org.id,
      actorName: actor.name,
      actorId: actor.id,
      action: "organization.created",
      targetName: "organizations",
      targetId: org.id,
    });

    return org;
  }, parseError);

export const updateOrganizationService = async (
  organizationId: string,
  data: UpdateOrganizationInput
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const orgRes = await updateOrganization(organizationId, data);
    if (!orgRes.ok) {
      throw orgRes.error;
    }
    const org = orgRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "organization.updated",
      targetName: "organizations",
      targetId: org.id,
    });

    return org;
  }, parseError);

export const softDeleteOrganizationService = async (
  organizationId: string
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const orgRes = await softDeleteOrganization(organizationId);
    if (!orgRes.ok) {
      throw orgRes.error;
    }
    const org = orgRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "organization.deleted",
      targetName: "organizations",
      targetId: org.id,
    });

    return org;
  }, parseError);

// ==============================
// Branch Services
// ==============================

export const createBranchService = async (
  organizationId: string,
  data: CreateBranchInput
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const branchRes = await createBranch(organizationId, data);
    if (!branchRes.ok) {
      throw branchRes.error;
    }
    const branch = branchRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "branch.created",
      targetName: "branches",
      targetId: branch.id,
    });

    return branch;
  }, parseError);

export const updateBranchService = async (
  branchId: string,
  organizationId: string,
  data: UpdateBranchInput
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const branchRes = await updateBranch(branchId, organizationId, data);
    if (!branchRes.ok) {
      throw branchRes.error;
    }
    const branch = branchRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "branch.updated",
      targetName: "branches",
      targetId: branch.id,
    });

    return branch;
  }, parseError);

export const softDeleteBranchService = async (
  branchId: string,
  organizationId: string
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const branchRes = await softDeleteBranch(branchId, organizationId);
    if (!branchRes.ok) {
      throw branchRes.error;
    }
    const branch = branchRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "branch.deleted",
      targetName: "branches",
      targetId: branch.id,
    });

    return branch;
  }, parseError);

// ==============================
// Member & Invitation Services
// ==============================

export const inviteMemberService = async (
  organizationId: string,
  data: InviteMemberInput
): Promise<AppResult<typeof invitations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const invRes = await inviteMember(organizationId, data);
    if (!invRes.ok) {
      throw invRes.error;
    }
    const inv = invRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "member.invited",
      targetName: "invitations",
      targetId: inv.id,
    });

    return inv;
  }, parseError);

export const updateMemberRoleService = async (
  memberId: string,
  organizationId: string,
  data: UpdateMemberRoleInput
): Promise<AppResult<typeof members.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const memberRes = await updateMemberRole(memberId, organizationId, data);
    if (!memberRes.ok) {
      throw memberRes.error;
    }
    const member = memberRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "member.role_updated",
      targetName: "members",
      targetId: member.id,
    });

    return member;
  }, parseError);

// ==============================
// Customer Services
// ==============================

export const createCustomerService = async (
  organizationId: string,
  data: CreateCustomerInput
): Promise<AppResult<typeof customers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const custRes = await createCustomer(organizationId, data);
    if (!custRes.ok) {
      throw custRes.error;
    }
    const cust = custRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "customer.created",
      targetName: "customers",
      targetId: cust.id,
    });

    return cust;
  }, parseError);

export const updateCustomerService = async (
  customerId: string,
  organizationId: string,
  data: UpdateCustomerInput
): Promise<AppResult<typeof customers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const custRes = await updateCustomer(customerId, organizationId, data);
    if (!custRes.ok) {
      throw custRes.error;
    }
    const cust = custRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "customer.updated",
      targetName: "customers",
      targetId: cust.id,
    });

    return cust;
  }, parseError);

export const softDeleteCustomerService = async (
  customerId: string,
  organizationId: string
): Promise<AppResult<typeof customers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const custRes = await softDeleteCustomer(customerId, organizationId);
    if (!custRes.ok) {
      throw custRes.error;
    }
    const cust = custRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "customer.deleted",
      targetName: "customers",
      targetId: cust.id,
    });

    return cust;
  }, parseError);

// ==============================
// Supplier Services
// ==============================

export const createSupplierService = async (
  organizationId: string,
  data: CreateSupplierInput
): Promise<AppResult<typeof suppliers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const supRes = await createSupplier(organizationId, data);
    if (!supRes.ok) {
      throw supRes.error;
    }
    const sup = supRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "supplier.created",
      targetName: "suppliers",
      targetId: sup.id,
    });

    return sup;
  }, parseError);

export const updateSupplierService = async (
  supplierId: string,
  organizationId: string,
  data: UpdateSupplierInput
): Promise<AppResult<typeof suppliers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const supRes = await updateSupplier(supplierId, organizationId, data);
    if (!supRes.ok) {
      throw supRes.error;
    }
    const sup = supRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "supplier.updated",
      targetName: "suppliers",
      targetId: sup.id,
    });

    return sup;
  }, parseError);

export const softDeleteSupplierService = async (
  supplierId: string,
  organizationId: string
): Promise<AppResult<typeof suppliers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const sessionRes = await requireAuthSession();
    if (!sessionRes.ok) {
      throw sessionRes.error;
    }
    const actor = sessionRes.value.user;

    const supRes = await softDeleteSupplier(supplierId, organizationId);
    if (!supRes.ok) {
      throw supRes.error;
    }
    const sup = supRes.value;

    await db.insert(auditLogs).values({
      id: createId(),
      organizationId,
      actorName: actor.name,
      actorId: actor.id,
      action: "supplier.deleted",
      targetName: "suppliers",
      targetId: sup.id,
    });

    return sup;
  }, parseError);
