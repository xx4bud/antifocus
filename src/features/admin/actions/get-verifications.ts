"use server";

import { count, desc, gt, lt } from "drizzle-orm";
import { db, schema } from "~/lib/db";

interface GetVerificationsParams {
  limit?: number;
  offset?: number;
  status?: "active" | "expired" | "all";
}

export async function getVerifications({
  limit = 20,
  offset = 0,
  status = "all",
}: GetVerificationsParams = {}) {
  const now = new Date();

  const whereClause =
    status === "active"
      ? gt(schema.verifications.expiresAt, now)
      : status === "expired"
        ? lt(schema.verifications.expiresAt, now)
        : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.verifications)
      .where(whereClause)
      .orderBy(desc(schema.verifications.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(schema.verifications).where(whereClause),
  ]);

  return {
    data,
    total: totalResult[0]?.count ?? 0,
  };
}
