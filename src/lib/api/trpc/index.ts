import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getMemberWithOrganization } from "@/lib/db/queries/orgs";
import { ORG_ROLE, USER_ROLE } from "@/lib/db/schema/enums";
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

    const member = await getMemberWithOrganization(userId, activeOrgId);

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
        activeOrganizationId: activeOrgId,
        member,
        org: member.organization,
      },
    });
  });

export const orgMemberProcedure = t.procedure.use(
  enforceOrgRole([ORG_ROLE.MEMBER, ORG_ROLE.ADMIN, ORG_ROLE.OWNER])
);

export const orgAdminProcedure = t.procedure.use(
  enforceOrgRole([ORG_ROLE.ADMIN, ORG_ROLE.OWNER])
);

export const orgOwnerProcedure = t.procedure.use(
  enforceOrgRole([ORG_ROLE.OWNER])
);
