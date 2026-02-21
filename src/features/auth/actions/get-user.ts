"use server";

import { cache } from "react";
import type { User } from "~/lib/db/types";
import { getServerSession } from "./get-session";

export const getCurrentUser = cache(async () => {
  const session = await getServerSession();
  return (session?.user as User) ?? null;
});
