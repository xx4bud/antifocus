import { Prisma } from "@prisma/client";

export function getCategoryDataSelect() {
  return {
    photos: {
      select: {
        id: true,
        url: true,
        publicId: true,
        categoryId: true,
        subCategoryId: true,
      }
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
            categoryId: true,
            subCategoryId: true,
          }
        },
      },
    
    },
  } satisfies Prisma.CategoryInclude;
}

export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataSelect>;
}>;

export function getSubCategoryDataSelect() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
  } satisfies Prisma.SubCategoryInclude;
}

export type SubCategoryData = Prisma.SubCategoryGetPayload<{
  include: ReturnType<typeof getSubCategoryDataSelect>;
}>;

export function getPhotoDataSelect() {
  return {
    id: true,
    url: true,
    publicId: true,
    categoryId: true,
    subCategoryId: true,
  } satisfies Prisma.PhotoSelect;
}

export type PhotoData = Prisma.PhotoGetPayload<{
  select: ReturnType<typeof getPhotoDataSelect>;
}>;

export type PhotoType = {
  id: string;
  url: string;
  publicId: string;
  categoryId: string | null;
  subCategoryId: string | null;
};

interface Category {
  id: string;
  name: string;
  description: string;
  photos?: PhotoData[]; 
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
  photos?: PhotoData[]; 
}
