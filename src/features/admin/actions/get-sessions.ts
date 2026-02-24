"use server";

import { count, desc, eq, gt, lt } from "drizzle-orm";
import { db, schema } from "~/lib/db";

interface GetSessionsParams {
  limit?: number;
  offset?: number;
  status?: "active" | "expired" | "all";
}

export async function getSessions({
  limit = 20,
  offset = 0,
  status = "all",
}: GetSessionsParams = {}) {
  const now = new Date();

  const whereClause =
    status === "active"
      ? gt(schema.sessions.expiresAt, now)
      : status === "expired"
        ? lt(schema.sessions.expiresAt, now)
        : undefined;

  const [data, totalResult] = await Promise.all([
    db
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
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.sessions).where(whereClause),
  ]);

  return {
    data,
    total: totalResult[0]?.count ?? 0,
  };
}
