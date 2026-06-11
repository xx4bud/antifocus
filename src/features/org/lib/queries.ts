import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import type { BranchStatus, EntityStatus } from "@/lib/db/schema/enums";
import {
  branches,
  customers,
  members,
  organizations,
  suppliers,
} from "@/lib/db/schema/org";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type {
  BranchFiltersInput,
  CustomerFiltersInput,
  OrgFiltersInput,
  SupplierFiltersInput,
} from "./validators";

// ==============================
// Organization Queries
// ==============================

export const getOrganizationById = async (
  id: string
): Promise<AppResult<typeof organizations.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [org] = await db
      .select()
      .from(organizations)
      .where(and(eq(organizations.id, id), isNull(organizations.deletedAt)))
      .limit(1);

    if (!org) {
      throw createError("NOT_FOUND", "Organization not found", 404);
    }
    return org;
  }, parseError);

export const listOrganizations = async (
  filters: OrgFiltersInput
): Promise<
  AppResult<{ items: (typeof organizations.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [isNull(organizations.deletedAt)];

    if (filters.search) {
      conditions.push(ilike(organizations.name, `%${filters.search}%`));
    }
    if (filters.status) {
      conditions.push(eq(organizations.status, filters.status as EntityStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(organizations)
        .where(and(...conditions))
        .orderBy(desc(organizations.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(organizations)
        .where(and(...conditions)),
    ]);

    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Branch Queries
// ==============================

export const getBranchById = async (
  id: string,
  orgId: string
): Promise<AppResult<typeof branches.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [branch] = await db
      .select()
      .from(branches)
      .where(
        and(
          eq(branches.id, id),
          eq(branches.organizationId, orgId),
          isNull(branches.deletedAt)
        )
      )
      .limit(1);

    if (!branch) {
      throw createError("NOT_FOUND", "Branch not found", 404);
    }
    return branch;
  }, parseError);

export const listBranches = async (
  orgId: string,
  filters: BranchFiltersInput
): Promise<
  AppResult<{ items: (typeof branches.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(branches.organizationId, orgId),
      isNull(branches.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(branches.name, `%${filters.search}%`));
    }
    if (filters.status) {
      conditions.push(eq(branches.status, filters.status as BranchStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(branches)
        .where(and(...conditions))
        .orderBy(desc(branches.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(branches)
        .where(and(...conditions)),
    ]);

    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Member Queries
// ==============================

export type MemberWithOrganization = typeof members.$inferSelect & {
  organization: typeof organizations.$inferSelect;
};

export const getMemberWithOrganization = async (
  userId: string,
  organizationId: string
): Promise<MemberWithOrganization | null> => {
  const [result] = await db
    .select({
      member: members,
      organization: organizations,
    })
    .from(members)
    .innerJoin(organizations, eq(members.organizationId, organizations.id))
    .where(
      and(
        eq(members.userId, userId),
        eq(members.organizationId, organizationId),
        isNull(members.deletedAt),
        isNull(organizations.deletedAt)
      )
    )
    .limit(1);

  if (!result) {
    return null;
  }

  return {
    ...result.member,
    organization: result.organization,
  };
};

// ==============================
// Customer Queries
// ==============================

export const listCustomers = async (
  orgId: string,
  filters: CustomerFiltersInput
): Promise<
  AppResult<{ items: (typeof customers.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(customers.organizationId, orgId),
      isNull(customers.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(customers.name, `%${filters.search}%`));
    }
    if (filters.status) {
      conditions.push(eq(customers.status, filters.status as EntityStatus));
    }
    if (filters.userId) {
      conditions.push(eq(customers.userId, filters.userId));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(customers)
        .where(and(...conditions))
        .orderBy(desc(customers.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(customers)
        .where(and(...conditions)),
    ]);

    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);

// ==============================
// Supplier Queries
// ==============================

export const listSuppliers = async (
  orgId: string,
  filters: SupplierFiltersInput
): Promise<
  AppResult<{ items: (typeof suppliers.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [
      eq(suppliers.organizationId, orgId),
      isNull(suppliers.deletedAt),
    ];

    if (filters.search) {
      conditions.push(ilike(suppliers.name, `%${filters.search}%`));
    }
    if (filters.status) {
      conditions.push(eq(suppliers.status, filters.status as EntityStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(suppliers)
        .where(and(...conditions))
        .orderBy(desc(suppliers.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(suppliers)
        .where(and(...conditions)),
    ]);

    const totalCount = totalResult[0]?.total ?? 0;
    return { items: rows, total: Number(totalCount) };
  }, parseError);
