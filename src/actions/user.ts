"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserInclude } from "@/lib/types";
import { cache } from "react";

export const getSession = cache(auth);

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user;
});

export const getUserBySlug = async (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const user = await prisma.user.findFirst({
    where: { slug: decodedSlug },
    include: getUserInclude(),
  });

  return user ? JSON.parse(JSON.stringify(user)) : null;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: getUserInclude(),
  });
  return users
    ? JSON.parse(JSON.stringify(users))
    : [];
};
