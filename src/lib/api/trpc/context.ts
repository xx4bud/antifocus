import { getAuthSession } from "@/lib/auth/services";
import { db } from "@/lib/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const auth = await getAuthSession();
  const sessionData = auth.ok ? auth.value : null;

  return {
    db,
    session: sessionData?.session ?? null,
    user: sessionData?.user ?? null,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
