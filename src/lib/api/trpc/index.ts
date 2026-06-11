import { initTRPC, TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { ORG_ROLE, USER_ROLE } from "@/lib/db/schema/enums";
import { members } from "@/lib/db/schema/org";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// ==============================
// User Middleware
// ==============================

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!(ctx.session && ctx.user)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceSuperadmin = t.middleware(({ ctx, next }) => {
  if (!(ctx.session && ctx.user)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.user.role !== USER_ROLE.SUPERADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Requires superadmin privileges",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
    },
  });
});

export const superadminProcedure = t.procedure.use(enforceSuperadmin);

// ==============================
// Organization Middleware
// ==============================

const enforceOrgAccess = t.middleware(async ({ ctx, next }) => {
  if (!(ctx.session && ctx.user)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const userId = ctx.user.id;
  const activeOrgId = ctx.session.activeOrganizationId;

  if (!activeOrgId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Active organization required",
    });
  }

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.userId, userId),
      eq(members.organizationId, activeOrgId)
    ),
    with: {
      organization: true,
    },
  });

  if (!member || member.status !== "active") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not an active member of this organization",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
      orgId: activeOrgId,
      activeOrganizationId: activeOrgId,
      member,
      org: member.organization,
    },
  });
});

export const orgProcedure = t.procedure.use(enforceOrgAccess);

const enforceBranchAccess = t.middleware(async ({ ctx, next }) => {
  const branchId = ctx.branchId;
  if (!branchId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Active branch required in session metadata",
    });
  }

  // Note: ctx.orgId is guaranteed by orgProcedure
  const orgId = ctx.orgId;

  // verify branch belongs to org
  const branch = await db.query.branches.findFirst({
    where: (branches, { eq, and }) =>
      and(
        eq(branches.id, branchId),
        eq(branches.organizationId, orgId as string) // orgId is non-null due to orgProcedure
      ),
  });

  if (!branch) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Branch does not belong to the active organization",
    });
  }

  return next({
    ctx: {
      branchId: branch.id,
      branch,
    },
  });
});

export const branchProcedure = orgProcedure.use(enforceBranchAccess);

const enforceOrgRole = (allowedRoles: string[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!(ctx.session && ctx.user)) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const userId = ctx.user.id;
    const activeOrgId = ctx.session.activeOrganizationId;

    if (!activeOrgId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Active organization required",
      });
    }

    const member = await db.query.members.findFirst({
      where: and(
        eq(members.userId, userId),
        eq(members.organizationId, activeOrgId)
      ),
      with: {
        organization: true,
      },
    });

    if (!(member && allowedRoles.includes(member.role))) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have the required role in this organization",
      });
    }

    return next({
      ctx: {
        session: ctx.session,
        user: ctx.user,
        orgId: activeOrgId,
        activeOrganizationId: activeOrgId,
        member,
        org: member.organization,
      },
    });
  });

export const orgMemberProcedure = orgProcedure.use(
  enforceOrgRole([ORG_ROLE.MEMBER, ORG_ROLE.ADMIN, ORG_ROLE.OWNER])
);

export const orgAdminProcedure = orgProcedure.use(
  enforceOrgRole([ORG_ROLE.ADMIN, ORG_ROLE.OWNER])
);

export const orgOwnerProcedure = orgProcedure.use(
  enforceOrgRole([ORG_ROLE.OWNER])
);
