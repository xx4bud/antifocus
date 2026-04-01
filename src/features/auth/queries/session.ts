import { db } from "@/lib/db/client";

/**
 * Get session by token
 */
export async function getSessionByToken(token: string) {
  return db.query.sessions.findFirst({
    where: (table, { eq }) => eq(table.token, token),
  });
}

/**
 * Get all sessions for a user
 */
export async function getSessionsByUserId(userId: string) {
  return db.query.sessions.findMany({
    where: (table, { eq }) => eq(table.userId, userId),
  });
}
