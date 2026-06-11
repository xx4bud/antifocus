import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema/auth";
import { createError, parseError } from "@/lib/utils/error";
import { type AppResult, tryCatchAsync } from "@/lib/utils/result";

// ==============================
// User Mutations
// ==============================

export const updateUser = async (
  userId: string,
  data: Partial<typeof users.$inferInsert>
): Promise<AppResult<typeof users.$inferSelect>> =>
  tryCatchAsync(async () => {
    // Drizzle write, no side-effects here
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw createError("USER_NOT_FOUND", "User not found to update", 404);
    }

    return updatedUser;
  }, parseError);

export const softDeleteUser = async (
  userId: string
): Promise<AppResult<typeof users.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [deletedUser] = await db
      .update(users)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) {
      throw createError("USER_NOT_FOUND", "User not found to delete", 404);
    }

    return deletedUser;
  }, parseError);

// ==============================
// Session Mutations
// ==============================

export const revokeAllUserSessions = async (
  userId: string
): Promise<AppResult<boolean>> =>
  tryCatchAsync(async () => {
    await db.delete(sessions).where(eq(sessions.userId, userId));
    return true;
  }, parseError);

export const switchSessionOrganization = async (
  sessionToken: string,
  organizationId: string
): Promise<AppResult<typeof sessions.$inferSelect>> =>
  tryCatchAsync(async () => {
    const [updatedSession] = await db
      .update(sessions)
      .set({ activeOrganizationId: organizationId, updatedAt: new Date() })
      .where(eq(sessions.token, sessionToken))
      .returning();

    if (!updatedSession) {
      throw createError("SESSION_NOT_FOUND", "Active session not found", 404);
    }

    return updatedSession;
  }, parseError);
