import { count, desc, eq, gt, ilike, lt, or, type SQL } from "drizzle-orm";
import { z } from "zod";
import { schema } from "~/lib/db";
import {
  ORDER_STATUS,
  type OrderStatus,
  PRODUCT_STATUS,
  type ProductStatus,
} from "~/lib/db/schemas/constants";
import { adminProcedure, router } from "~/lib/trpc/init";

/**
 * Admin router — all procedures require `super_admin` role.
 */
export const adminRouter = router({
  // ========================================
  // STATS (extended)
  // ========================================
  getStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();

    const [
      usersCount,
      activeSessionsCount,
      accountsCount,
      verificationsCount,
      productsCount,
      categoriesCount,
      ordersCount,
      organizationsCount,
      bannersCount,
      customersCount,
    ] = await Promise.all([
      ctx.db
        .select({ count: count() })
        .from(schema.users)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.sessions)
        .where(gt(schema.sessions.expiresAt, now))
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.accounts)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.verifications)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.products)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.categories)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.orders)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.organizations)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.banners)
        .then((r) => r[0]?.count ?? 0),
      ctx.db
        .select({ count: count() })
        .from(schema.customers)
        .then((r) => r[0]?.count ?? 0),
    ]);

    return {
      totalUsers: usersCount,
      activeSessions: activeSessionsCount,
      totalAccounts: accountsCount,
      totalVerifications: verificationsCount,
      totalProducts: productsCount,
      totalCategories: categoriesCount,
      totalOrders: ordersCount,
      totalOrganizations: organizationsCount,
      totalBanners: bannersCount,
      totalCustomers: customersCount,
    };
  }),

  // ========================================
  // USERS
  // ========================================
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.search
        ? or(
            ilike(schema.users.name, `%${input.search}%`),
            ilike(schema.users.email, `%${input.search}%`),
            ilike(schema.users.username, `%${input.search}%`)
          )
        : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(schema.users)
          .where(whereClause)
          .orderBy(desc(schema.users.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db.select({ count: count() }).from(schema.users).where(whereClause),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  // ========================================
  // ACCOUNTS
  // ========================================
  getAccounts: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        provider: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.provider
        ? ilike(schema.accounts.providerId, input.provider)
        : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select({
            id: schema.accounts.id,
            accountId: schema.accounts.accountId,
            providerId: schema.accounts.providerId,
            userId: schema.accounts.userId,
            scope: schema.accounts.scope,
            createdAt: schema.accounts.createdAt,
            updatedAt: schema.accounts.updatedAt,
            userName: schema.users.name,
            userEmail: schema.users.email,
          })
          .from(schema.accounts)
          .leftJoin(schema.users, eq(schema.accounts.userId, schema.users.id))
          .where(whereClause)
          .orderBy(desc(schema.accounts.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.accounts)
          .where(whereClause),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  // ========================================
  // SESSIONS
  // ========================================
  getSessions: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(["active", "expired", "all"]).default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const whereClause =
        input.status === "active"
          ? gt(schema.sessions.expiresAt, now)
          : input.status === "expired"
            ? lt(schema.sessions.expiresAt, now)
            : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select({
            id: schema.sessions.id,
            token: schema.sessions.token,
            userId: schema.sessions.userId,
            ipAddress: schema.sessions.ipAddress,
            userAgent: schema.sessions.userAgent,
            impersonatedBy: schema.sessions.impersonatedBy,
            expiresAt: schema.sessions.expiresAt,
            createdAt: schema.sessions.createdAt,
            updatedAt: schema.sessions.updatedAt,
            userName: schema.users.name,
            userEmail: schema.users.email,
          })
          .from(schema.sessions)
          .leftJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
          .where(whereClause)
          .orderBy(desc(schema.sessions.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.sessions)
          .where(whereClause),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  // ========================================
  // VERIFICATIONS
  // ========================================
  getVerifications: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(["active", "expired", "all"]).default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const whereClause =
        input.status === "active"
          ? gt(schema.verifications.expiresAt, now)
          : input.status === "expired"
            ? lt(schema.verifications.expiresAt, now)
            : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(schema.verifications)
          .where(whereClause)
          .orderBy(desc(schema.verifications.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.verifications)
          .where(whereClause),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  // ========================================
  // PRODUCTS
  // ========================================
  getProducts: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
        status: z
          .enum(Object.values(PRODUCT_STATUS) as [string, ...string[]])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions: (SQL | undefined)[] = [];
      if (input.search) {
        conditions.push(
          or(
            ilike(schema.products.name, `%${input.search}%`),
            ilike(schema.products.slug, `%${input.search}%`)
          )
        );
      }
      if (input.status) {
        conditions.push(
          eq(schema.products.status, input.status as ProductStatus)
        );
      }

      const whereClause =
        conditions.length > 0
          ? conditions.length === 1
            ? conditions[0]
            : or(...conditions)
          : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select({
            id: schema.products.id,
            name: schema.products.name,
            slug: schema.products.slug,
            basePrice: schema.products.basePrice,
            currency: schema.products.currency,
            status: schema.products.status,
            enabled: schema.products.enabled,
            organizationId: schema.products.organizationId,
            createdAt: schema.products.createdAt,
            updatedAt: schema.products.updatedAt,
          })
          .from(schema.products)
          .where(whereClause)
          .orderBy(desc(schema.products.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.products)
          .where(whereClause),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),

  // ========================================
  // CATEGORIES
  // ========================================
  getCategories: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.search
        ? or(
            ilike(schema.categories.name, `%${input.search}%`),
            ilike(schema.categories.slug, `%${input.search}%`)
          )
        : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(schema.categories)
          .where(whereClause)
          .orderBy(desc(schema.categories.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.categories)
          .where(whereClause),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),

  // ========================================
  // ORDERS
  // ========================================
  getOrders: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z
          .enum(Object.values(ORDER_STATUS) as [string, ...string[]])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.status
        ? eq(schema.orders.status, input.status as OrderStatus)
        : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select({
            id: schema.orders.id,
            orderNumber: schema.orders.orderNumber,
            channel: schema.orders.channel,
            status: schema.orders.status,
            total: schema.orders.total,
            currency: schema.orders.currency,
            customerId: schema.orders.customerId,
            organizationId: schema.orders.organizationId,
            createdAt: schema.orders.createdAt,
            updatedAt: schema.orders.updatedAt,
          })
          .from(schema.orders)
          .where(whereClause)
          .orderBy(desc(schema.orders.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.orders)
          .where(whereClause),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),

  // ========================================
  // BANNERS
  // ========================================
  getBanners: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const [data, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(schema.banners)
          .orderBy(desc(schema.banners.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db.select({ count: count() }).from(schema.banners),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),

  // ========================================
  // ORGANIZATIONS
  // ========================================
  getOrganizations: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.search
        ? or(
            ilike(schema.organizations.name, `%${input.search}%`),
            ilike(schema.organizations.slug, `%${input.search}%`)
          )
        : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(schema.organizations)
          .where(whereClause)
          .orderBy(desc(schema.organizations.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.organizations)
          .where(whereClause),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),

  // ========================================
  // CUSTOMERS
  // ========================================
  getCustomers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause = input.search
        ? or(
            ilike(schema.customers.name, `%${input.search}%`),
            ilike(schema.customers.email, `%${input.search}%`)
          )
        : undefined;

      const [data, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(schema.customers)
          .where(whereClause)
          .orderBy(desc(schema.customers.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        ctx.db
          .select({ count: count() })
          .from(schema.customers)
          .where(whereClause),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),
});
