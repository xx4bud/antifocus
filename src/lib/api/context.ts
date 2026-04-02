import { cache } from "react";
import { getServerSession } from "@/features/auth/actions/session";
import { db } from "@/lib/db";

export const createContext = cache(async () => {
  const session = await getServerSession();

  return {
    db,
    session,
    user: session?.user ?? null,
  };
});

export type Context = Awaited<ReturnType<typeof createContext>>;
