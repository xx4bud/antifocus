"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "@/lib/unstable-cache";

export const getCategory = unstable_cache(
  async (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);
    const category = await prisma.category.findUnique({
      where: {
        slug: decodedSlug,
      },
      include: {
        media: { where: { order: 0 } },
        subCategories: {
          where: { featured: true },
        },
        products: {
          where: { status: "AVAILABLE" },
        },
      },
    });

    return category
      ? JSON.parse(JSON.stringify(category))
      : null;
  },
  ["category"],
  { revalidate: 86400 }
);

export const getCategories = unstable_cache(
  async () => {
    const categories = await prisma.category.findMany({
      where: {
        featured: true,
      },
      include: {
        media: { where: { order: 0 } },
        subCategories: true,
      },
    });

    return categories
      ? JSON.parse(JSON.stringify(categories))
      : null;
  },
  ["categories"],
  { revalidate: 86400 }
);

export const getSubCategory = unstable_cache(
  async (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);
    const subCategory = await prisma.subCategory.findUnique(
      {
        where: {
          slug: decodedSlug,
        },
        include: {
          media: { where: { order: 0 } },
          products: {
            where: { status: "AVAILABLE" },
          },
        },
      }
    );

    return subCategory
      ? JSON.parse(JSON.stringify(subCategory))
      : null;
  },
  ["subCategory"],
  { revalidate: 86400 }
);
