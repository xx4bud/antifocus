"use server";

import { count, gt } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getAdminStats() {
  const now = new Date();

  const [usersCount, activeSessionsCount, accountsCount, verificationsCount] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(schema.users)
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: count() })
        .from(schema.sessions)
        .where(gt(schema.sessions.expiresAt, now))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: count() })
        .from(schema.accounts)
        .then((r) => r[0]?.count ?? 0),
      db
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
}
