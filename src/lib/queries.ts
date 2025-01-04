import { cache } from "react";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export const getSession = cache(auth);

export function getCategoryDataSelect() {
  return {
    photos: {
      select: {
        id: true,
        url: true,
        publicId: true,
        categoryId: true,
      }
      
    },
    subCategories: {
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      }
    },
   _count: {
    select: {
      photos: true,
      subCategories: true,
    }
   }
  } satisfies Prisma.CategoryInclude;
}

export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataSelect>;
}>;

export function getSubCategoryDataSelect() {
  return {
    id: true,
    name: true,
    description: true,
    categoryId: true,
  } satisfies Prisma.SubCategorySelect;
}

export type SubCategoryData = Prisma.SubCategoryGetPayload<{
  select: ReturnType<typeof getSubCategoryDataSelect>;
}>;

export function getPhotoDataSelect() {
  return {
    id: true,
    url: true,
    publicId: true,
    categoryId: true,
  } satisfies Prisma.PhotoSelect;
}

export type PhotoData = Prisma.PhotoGetPayload<{
  select: ReturnType<typeof getPhotoDataSelect>;
}>;
