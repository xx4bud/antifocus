import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import z, { ZodError } from "zod";
import { isDevelopment } from "@/lib/utils";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
            : null,
      },
    };
  },
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (isDevelopment) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const duration = Date.now() - start;
  if (isDevelopment) {
    console.log(`[TRPC] ${path} — ${duration}ms`);
  }

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const authProcedure = t.procedure.use(({ ctx, next }) => {
  if (!(ctx.session && ctx.user)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Anda harus masuk terlebih dahulu",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

/**
 * RBAC Procedure: Guard by specific roles
 */
export const rbacProcedure = (roles: string[]) =>
  authProcedure.use(({ ctx, next }) => {
    if (!roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Akses ditolak: Membutuhkan role yang sesuai",
      });
    }

    return next({ ctx });
  });

/**
 * Convenience procedures for common roles
 */
export const superAdminProcedure = rbacProcedure(["super_admin"]);
export const adminProcedure = rbacProcedure(["admin", "super_admin"]);
