import type { Prisma } from "@prisma/client";

// User Data
export type Role = "USER" | "ADMIN";

// Photo Data
export function getPhotoDataSelect() {
  return {
    id: true,
    url: true,
    publicId: true,
    isCover: true,
    userId: true,
    categoryId: true,
    subCategoryId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.PhotoSelect;
}

export type PhotoData = Prisma.PhotoGetPayload<{
  select: ReturnType<typeof getPhotoDataSelect>;
}>;

export function getSubCategoryDataSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    photos: true,
    isFeatured: true,
    categoryId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.SubCategorySelect;
}
export function getSubCategoryDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
  } satisfies Prisma.SubCategoryInclude;
}
export type SubCategoryData = Prisma.SubCategoryGetPayload<{
  include: ReturnType<typeof getSubCategoryDataInclude>;
}>;

export function getCategoryDataSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    photos: true,
    isFeatured: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.CategorySelect;
}
export function getCategoryDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    subCategories: {
      select: getSubCategoryDataSelect(),
    },
  } satisfies Prisma.CategoryInclude;
}
export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataInclude>;
}>;
