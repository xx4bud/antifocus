import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { accounts, sessions, users } from "@/lib/db/schema/auth";
import type { EntityStatus, UserRole } from "@/lib/db/schema/enums";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";
import type { UserFiltersInput } from "./validators";

// ==============================
// User Queries
// ==============================

export const getUserById = async (
  userId: string
): Promise<AppResult<typeof users.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .limit(1);

    if (!user) {
      throw createError("USER_NOT_FOUND", "User not found", 404);
    }

    return user;
  }, parseError);

export const getUserByEmail = async (
  email: string
): Promise<AppResult<typeof users.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (!user) {
      throw createError("USER_NOT_FOUND", "User not found", 404);
    }

    return user;
  }, parseError);

export const listUsers = async (
  filters: UserFiltersInput
): Promise<
  AppResult<{ items: (typeof users.$inferSelect)[]; total: number }>
> =>
  tryCatchAsync(async () => {
    const conditions = [isNull(users.deletedAt)];
    if (filters.search) {
      conditions.push(ilike(users.name, `%${filters.search}%`));
    }
    if (filters.role) {
      conditions.push(eq(users.role, filters.role as UserRole));
    }
    if (filters.status) {
      conditions.push(eq(users.status, filters.status as EntityStatus));
    }

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(and(...conditions))
        .orderBy(desc(users.createdAt))
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      db
        .select({ total: count() })
        .from(users)
        .where(and(...conditions)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return { items: rows, total: Number(total) };
  }, parseError);

// ==============================
// Session Queries
// ==============================

export const listUserSessions = async (
  userId: string
): Promise<AppResult<(typeof sessions.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db.select().from(sessions).where(eq(sessions.userId, userId)),
    parseError
  );

// ==============================
// Account Queries
// ==============================

export const listUserAccounts = async (
  userId: string
): Promise<AppResult<(typeof accounts.$inferSelect)[]>> =>
  tryCatchAsync(
    async () =>
      await db.select().from(accounts).where(eq(accounts.userId, userId)),
    parseError
  );
