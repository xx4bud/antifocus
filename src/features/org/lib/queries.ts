import { and, count, desc, eq, gte, ilike, isNull } from "drizzle-orm";
import {
  getActiveOrdersCountQuery,
  getChartOrdersQuery,
  getFulfillmentRateQuery,
  getOrderGrowthRateQuery,
  getOrderRevenueQuery,
  getPendingProductionQuery,
  getProfitMarginQuery,
} from "@/features/order/lib/queries";
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

// ==============================
// Dashboard Queries
// ==============================

export interface DashboardMetrics {
  activeOrders: number;
  fulfillmentRate: number;
  growthRate: number;
  newCustomers: number;
  pendingProduction: number;
  profitMargin: number;
  totalRevenue: number;
}

export interface ChartDataItem {
  date: string;
  desktop: number;
  mobile: number;
}

export interface DashboardData {
  chartData: ChartDataItem[];
  metrics: DashboardMetrics;
}

export const getDashboardData = async (
  orgId: string
): Promise<AppResult<DashboardData>> =>
  tryCatchAsync(async () => {
    // Calculate time periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // 1. Total Revenue
    const totalRevenue = await getOrderRevenueQuery(orgId);

    // 2. New Customers (created in last 30 days)
    const [newCustomersResult] = await db
      .select({ count: count() })
      .from(customers)
      .where(
        and(
          eq(customers.organizationId, orgId),
          gte(customers.createdAt, thirtyDaysAgo),
          isNull(customers.deletedAt)
        )
      );
    const newCustomers = newCustomersResult?.count || 0;

    // 3. Active Orders
    const activeOrders = await getActiveOrdersCountQuery(orgId);

    // 4. Growth Rate
    const growthRate = await getOrderGrowthRateQuery(
      orgId,
      thirtyDaysAgo,
      sixtyDaysAgo
    );

    // 5. Profit Margin
    const profitMargin = await getProfitMarginQuery(orgId, totalRevenue);

    // 6. Pending Production
    const pendingProduction = await getPendingProductionQuery(orgId);

    // 7. Fulfillment Rate
    const fulfillmentRate = await getFulfillmentRateQuery(orgId);

    // 8. Chart Data (past 90 days)
    const chartOrders = await getChartOrdersQuery(orgId, ninetyDaysAgo);

    // Group by date and channel
    const groupedData: Record<string, { desktop: number; mobile: number }> = {};

    // Initialize empty records for last 90 days
    for (let i = 90; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0] || "";
      groupedData[dateStr] = { desktop: 0, mobile: 0 };
    }

    // Aggregate data by channel
    for (const order of chartOrders) {
      const dateStr = order.createdAt.toISOString().split("T")[0] || "";
      const amount = Number(order.grandTotal);

      // Categorize by channel name
      const isMobileChannel =
        order.orderChannelId?.toLowerCase().includes("mobile") ||
        order.orderChannelId?.toLowerCase().includes("app");

      if (!groupedData[dateStr]) {
        groupedData[dateStr] = { desktop: 0, mobile: 0 };
      }

      if (isMobileChannel) {
        groupedData[dateStr].mobile += amount;
      } else {
        groupedData[dateStr].desktop += amount;
      }
    }

    const chartData = Object.entries(groupedData)
      .map(([date, val]) => ({
        date,
        desktop: Math.round(val.desktop),
        mobile: Math.round(val.mobile),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      metrics: {
        totalRevenue,
        newCustomers,
        activeOrders,
        growthRate: Math.round(growthRate * 100) / 100,
        profitMargin: Math.round(profitMargin * 100) / 100,
        pendingProduction,
        fulfillmentRate: Math.round(fulfillmentRate * 100) / 100,
      },
      chartData,
    };
  }, parseError);
