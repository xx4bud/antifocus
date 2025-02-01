"use server";

import prisma from "@/lib/prisma";
import { getCategoryDataInclude } from "@/types";

export async function getAllFeaturedCategories() {
  const categories = await prisma.category.findMany({
    where: {
      isFeatured: true,
    },
    include: getCategoryDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return categories;
}
