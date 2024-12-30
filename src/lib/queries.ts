import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getSession = cache(auth);

export const getUser = async () => {
  const session = await getSession();
  if (session !== null) {
    return session.user;
  }
  return null;
};

export const getUserBySlug = cache(async (slug: string) => {
  const user = await prisma.user.findUnique({
    where: { slug },
  });

  return user;
});

export const getCampaign = unstable_cache(
  async (id: string) => {
    return await prisma.campaign.findUnique({
      where: { id },
      include: {
        photos: {
          select: {
            id: true,
            url: true,
            publicId: true,
          },
        },
      },
    });
  },
  ["campaign"],
  {
    revalidate: 60 * 60 * 2, // 2 hours
  }
);
