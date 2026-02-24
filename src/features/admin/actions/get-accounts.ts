"use server";

import { count, desc, eq, ilike } from "drizzle-orm";
import { db, schema } from "~/lib/db";

interface GetAccountsParams {
  limit?: number;
  offset?: number;
  provider?: string;
}

export async function getAccounts({
  limit = 20,
  offset = 0,
  provider,
}: GetAccountsParams = {}) {
  const whereClause = provider
    ? ilike(schema.accounts.providerId, provider)
    : undefined;

  const [data, totalResult] = await Promise.all([
    db
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
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.accounts).where(whereClause),
  ]);

  return {
    data,
    total: totalResult[0]?.count ?? 0,
  };
}
