import { cache } from "react";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export const getSession = cache(auth);

export function getCategoryDataInclude() {
  return {
    photos: {
      select: {
        id: true,
        url: true,
        publicId: true,
        categoryId: true,
      },
    },
    subCategories: {
      select: {
        id: true,
        name: true,
        description: true,
        photos: {
          select: {
            id: true,
            url: true,
            publicId: true,
            subCategoryId: true,
          },
        },
      },
    },
    _count: {
      select: {
        subCategories: true,
        photos: true,
      },
    },
  } satisfies Prisma.CategoryInclude;
}

export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataInclude>;
}>;
