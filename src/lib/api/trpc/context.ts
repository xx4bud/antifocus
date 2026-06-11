import { createId } from "@paralleldrive/cuid2";
import { getAuthSession } from "@/features/auth/lib/services";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema/core";
import { redis } from "@/lib/redis";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const auth = await getAuthSession();
  const sessionData = auth.ok ? auth.value : null;

  const session = sessionData?.session ?? null;
  const user = sessionData?.user ?? null;

  const orgId = session?.activeOrganizationId ?? null;
  const branchId =
    session?.metadata && typeof session.metadata === "object"
      ? (((session.metadata as Record<string, unknown>)
          .active_branch_id as string) ?? null)
      : null;

  const audit = async (
    action: string,
    targetName: string,
    targetId: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!orgId) {
      return;
    }
    await db.insert(auditLogs).values({
      id: createId(),
      organizationId: orgId,
      sessionId: session?.id ?? null,
      actorName: user?.name ?? "System",
      actorId: user?.id ?? "system",
      action,
      targetName,
      targetId,
      metadata,
    });
  };

  return {
    db,
    redis,
    session,
    user,
    orgId,
    branchId,
    audit,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
