// Org Mutations
// Handles create, update, and soft-delete operations for organization related entities

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  branches,
  customers,
  invitations,
  members,
  organizations,
  suppliers,
} from "@/lib/db/schema/org";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
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
// Organization Mutations
// ==============================

export const createOrganization = async (
  data: CreateOrganizationInput
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [org] = await db
      .insert(organizations)
      .values({ ...data })
      .returning();
    if (!org) {
      throw createError("DATABASE", "Failed to create organization", 500);
    }
    return org;
  }, parseError);

export const updateOrganization = async (
  organizationId: string,
  data: UpdateOrganizationInput
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [org] = await db
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();
    if (!org) {
      throw createError("NOT_FOUND", "Organization not found", 404);
    }
    return org;
  }, parseError);

export const softDeleteOrganization = async (
  organizationId: string
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [org] = await db
      .update(organizations)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();
    if (!org) {
      throw createError("NOT_FOUND", "Organization not found", 404);
    }
    return org;
  }, parseError);

// ==============================
// Branch Mutations
// ==============================

export const createBranch = async (
  organizationId: string,
  data: CreateBranchInput
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [branch] = await db
      .insert(branches)
      .values({ ...data, organizationId })
      .returning();
    if (!branch) {
      throw createError("DATABASE", "Failed to create branch", 500);
    }
    return branch;
  }, parseError);

export const updateBranch = async (
  branchId: string,
  organizationId: string,
  data: UpdateBranchInput
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [branch] = await db
      .update(branches)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(branches.id, branchId),
          eq(branches.organizationId, organizationId)
        )
      )
      .returning();
    if (!branch) {
      throw createError("NOT_FOUND", "Branch not found", 404);
    }
    return branch;
  }, parseError);

export const setBranchStatus = async (
  branchId: string,
  organizationId: string,
  input: { status: "open" | "closed" | "maintenance" | "archived" }
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [branch] = await db
      .update(branches)
      .set({ status: input.status, updatedAt: new Date() })
      .where(
        and(
          eq(branches.id, branchId),
          eq(branches.organizationId, organizationId)
        )
      )
      .returning();
    if (!branch) {
      throw createError("NOT_FOUND", "Branch not found", 404);
    }
    return branch;
  }, parseError);

export const softDeleteBranch = async (
  branchId: string,
  organizationId: string
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    // Guard check: active orders, open POS sessions, pending inventory movements
    // For Phase 1, we just do a basic check on branch existence.
    // In Phase 3 & 4, this should query orders, orderSessions, and inventory transfers.
    const [branchToUpdate] = await db
      .select()
      .from(branches)
      .where(
        and(
          eq(branches.id, branchId),
          eq(branches.organizationId, organizationId)
        )
      )
      .limit(1);
    if (!branchToUpdate) {
      throw createError("NOT_FOUND", "Branch not found", 404);
    }

    const [branch] = await db
      .update(branches)
      .set({ deletedAt: new Date(), updatedAt: new Date(), status: "archived" })
      .where(
        and(
          eq(branches.id, branchId),
          eq(branches.organizationId, organizationId)
        )
      )
      .returning();
    if (!branch) {
      throw createError("NOT_FOUND", "Branch not found", 404);
    }
    return branch;
  }, parseError);

// ==============================
// Member & Invitation Mutations
// ==============================

export const inviteMember = async (
  organizationId: string,
  data: InviteMemberInput
): Promise<AppResult<typeof invitations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [inv] = await db
      .insert(invitations)
      .values({ ...data, organizationId })
      .returning();
    if (!inv) {
      throw createError("DATABASE", "Failed to send invitation", 500);
    }
    return inv;
  }, parseError);

export const updateMemberRole = async (
  memberId: string,
  organizationId: string,
  data: UpdateMemberRoleInput
): Promise<AppResult<typeof members.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [member] = await db
      .update(members)
      .set({ role: data.role, updatedAt: new Date() })
      .where(
        and(
          eq(members.id, memberId),
          eq(members.organizationId, organizationId)
        )
      )
      .returning();
    if (!member) {
      throw createError("NOT_FOUND", "Member not found", 404);
    }
    return member;
  }, parseError);

// ==============================
// Customer Mutations
// ==============================

export const createCustomer = async (
  organizationId: string,
  data: CreateCustomerInput
): Promise<AppResult<typeof customers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cust] = await db
      .insert(customers)
      .values({ ...data, organizationId })
      .returning();
    if (!cust) {
      throw createError("DATABASE", "Failed to create customer", 500);
    }
    return cust;
  }, parseError);

export const updateCustomer = async (
  customerId: string,
  organizationId: string,
  data: UpdateCustomerInput
): Promise<AppResult<typeof customers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cust] = await db
      .update(customers)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(customers.id, customerId),
          eq(customers.organizationId, organizationId)
        )
      )
      .returning();
    if (!cust) {
      throw createError("NOT_FOUND", "Customer not found", 404);
    }
    return cust;
  }, parseError);

export const softDeleteCustomer = async (
  customerId: string,
  organizationId: string
): Promise<AppResult<typeof customers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [cust] = await db
      .update(customers)
      .set({ deletedAt: new Date(), updatedAt: new Date(), status: "deleted" })
      .where(
        and(
          eq(customers.id, customerId),
          eq(customers.organizationId, organizationId)
        )
      )
      .returning();
    if (!cust) {
      throw createError("NOT_FOUND", "Customer not found", 404);
    }
    return cust;
  }, parseError);

// ==============================
// Supplier Mutations
// ==============================

export const createSupplier = async (
  organizationId: string,
  data: CreateSupplierInput
): Promise<AppResult<typeof suppliers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [sup] = await db
      .insert(suppliers)
      .values({ ...data, organizationId })
      .returning();
    if (!sup) {
      throw createError("DATABASE", "Failed to create supplier", 500);
    }
    return sup;
  }, parseError);

export const updateSupplier = async (
  supplierId: string,
  organizationId: string,
  data: UpdateSupplierInput
): Promise<AppResult<typeof suppliers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [sup] = await db
      .update(suppliers)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(suppliers.id, supplierId),
          eq(suppliers.organizationId, organizationId)
        )
      )
      .returning();
    if (!sup) {
      throw createError("NOT_FOUND", "Supplier not found", 404);
    }
    return sup;
  }, parseError);

export const softDeleteSupplier = async (
  supplierId: string,
  organizationId: string
): Promise<AppResult<typeof suppliers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [sup] = await db
      .update(suppliers)
      .set({ deletedAt: new Date(), updatedAt: new Date(), status: "deleted" })
      .where(
        and(
          eq(suppliers.id, supplierId),
          eq(suppliers.organizationId, organizationId)
        )
      )
      .returning();
    if (!sup) {
      throw createError("NOT_FOUND", "Supplier not found", 404);
    }
    return sup;
  }, parseError);

import { branchMembers } from "@/lib/db/schema/org";

export const removeMember = async (
  memberId: string,
  organizationId: string
): Promise<AppResult<typeof members.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [member] = await db
      .update(members)
      .set({ deletedAt: new Date(), updatedAt: new Date(), status: "inactive" })
      .where(
        and(
          eq(members.id, memberId),
          eq(members.organizationId, organizationId)
        )
      )
      .returning();
    if (!member) {
      throw createError("NOT_FOUND", "Member not found", 404);
    }
    return member;
  }, parseError);

export const addBranchMember = async (
  organizationId: string,
  branchId: string,
  memberId: string
): Promise<AppResult<typeof branchMembers.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [row] = await db
      .insert(branchMembers)
      .values({ organizationId, branchId, memberId })
      .onConflictDoNothing()
      .returning();
    if (!row) {
      throw createError("DATABASE", "Failed to add branch member", 500);
    }
    return row;
  }, parseError);

export const removeBranchMember = async (
  organizationId: string,
  branchId: string,
  memberId: string
): Promise<AppResult<void>> =>
  tryCatchAsync(async () => {
    await db
      .delete(branchMembers)
      .where(
        and(
          eq(branchMembers.branchId, branchId),
          eq(branchMembers.memberId, memberId),
          eq(branchMembers.organizationId, organizationId)
        )
      );
  }, parseError);

// ==============================
// End of Mutations
// ==============================
