"use server";

import { prisma } from "@/lib/prisma";
import { getCategoryInclude } from "@/lib/types";

export const getCategoryBySlug = async (slug: string) => {
  const decodedSlug = decodeURIComponent(slug);
  const category = await prisma.category.findFirst({
    where: {
      slug: decodedSlug,
    },
    include: getCategoryInclude(),
  });
  return category
    ? JSON.parse(JSON.stringify(category))
    : null;
};

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: getCategoryInclude(),
  });
  return categories
    ? JSON.parse(JSON.stringify(categories))
    : [];
};
