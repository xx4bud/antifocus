import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";
import { isDevelopment } from "~/utils/env";
import { SuperJSON } from "~/utils/serializers";
import type { Context } from "./context";

/**
 * tRPC initialization with SuperJSON transformer and custom error formatter.
 *
 * @see https://trpc.io/docs/server/routers-and-procedures
 */
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

/**
 * Router and procedure helpers.
 */
export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

/**
 * Middleware — timing logger (development only).
 * Adds an artificial delay in dev to help test loading states.
 */
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

/**
 * Public procedure — no authentication required.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Authenticated procedure — requires a valid session.
 * Throws UNAUTHORIZED if no session found.
 */
export const authedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
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

/**
 * Admin procedure — requires `super_admin` role.
 * Extends authedProcedure with an additional role check.
 */
export const adminProcedure = authedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "super_admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Requires super_admin role",
    });
  }

  return next({ ctx });
});
