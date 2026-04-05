"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const getCurrentUser = cache(async () => {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  return session.user;
});
