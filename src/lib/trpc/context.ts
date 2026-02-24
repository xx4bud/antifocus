import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

/**
 * Creates the tRPC context for each request.
 * Uses React `cache()` to deduplicate session lookups within the same request.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createContext = cache(async () => {
  const heads = new Headers(await headers());

  const session = await auth.api.getSession({
    headers: heads,
  });

  return {
    db,
    session,
    user: session?.user ?? null,
  };
});

export type Context = Awaited<ReturnType<typeof createContext>>;
