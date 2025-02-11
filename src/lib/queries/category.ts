import { cache } from "react";
import prisma from "../prisma";
import { getCategoryDataInclude } from "../types";

export const getAllCategories = cache(async () => {
  return prisma.category.findMany({
    where: { featured: true },
    include: getCategoryDataInclude(),
    take: 6,
    orderBy: { views: "desc" },
  });
});

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    where: { featured: true },
    include: {
      subCategories: true,
    },
  });
});

export const getCategory = cache(
  async (categorySlug: string) => {
    return prisma.category.findFirst({
      where: { slug: categorySlug, featured: true },
      include: {
        subCategories: true,
        products: {
          include: {
            media: true,
          },
          orderBy: { views: "desc" },
        },
      },
    });
  }
);

export const getSubCategories = cache(async () => {
    return prisma.subCategory.findMany({
      where: { featured: true },
      include: {
        category: true,
      },
    });
  });

export  const getSubCategory = cache(
    async (subcategorySlug: string) => {
      return prisma.subCategory.findFirst({
        where: {
          featured: true,
          slug: subcategorySlug,
        },
        include: {
          category: true,
          products: {
            include: {
              media: true,
            },
            orderBy: { views: "desc" },
          },
        },
      });
    }
  );


