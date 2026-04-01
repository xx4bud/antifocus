import { db } from "@/lib/db/client";

/**
 * Get account by provider and account ID
 */
export async function getAccountByProvider(
  providerId: string,
  accountId: string
) {
  return db.query.accounts.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.providerId, providerId), eq(table.accountId, accountId)),
  });
}

/**
 * Get all accounts for a specific user
 */
export async function getAccountsByUserId(userId: string) {
  return db.query.accounts.findMany({
    where: (table, { eq }) => eq(table.userId, userId),
  });
}
