import { count, desc, eq, gt, ilike, lt, or } from "drizzle-orm";
import { z } from "zod";
import { schema } from "~/lib/db";
import { adminProcedure, router } from "~/lib/trpc/init";

/**
 * Admin router — all procedures require `super_admin` role.
 *
 * Usage from client components:
 * ```tsx
 * const trpc = useTRPC();
 * const { data } = useQuery(trpc.admin.getStats.queryOptions());
 * ```
 *
 * Usage from server components:
 * ```ts
 * const stats = await api.admin.getStats();
 * ```
 */
export const adminRouter = router({
  // ========================================
  // STATS
  // ========================================
  getStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();

    const [usersCount, activeSessionsCount, accountsCount, verificationsCount] =
      await Promise.all([
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
      ]);

    return {
      totalUsers: usersCount,
      activeSessions: activeSessionsCount,
      totalAccounts: accountsCount,
      totalVerifications: verificationsCount,
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
});
