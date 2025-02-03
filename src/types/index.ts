import type { Prisma } from "@prisma/client";

// User Data
export type Role = "USER" | "ADMIN";

// Photo Data
export function getPhotoDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    url: true,
    publicId: true,
    position: true,
    userId: true,
    categoryId: true,
  } satisfies Prisma.PhotoSelect;
}
export type PhotoData = Prisma.PhotoGetPayload<{
  select: ReturnType<typeof getPhotoDataSelect>;
}>;

// SubCategory Data
export function getSubCategoryDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    name: true,
    slug: true,
    isFeatured: true,
    photos: true,
  } satisfies Prisma.SubCategorySelect;
}
export function getSubCategoryDataInclude() {
  return {
    photos: true,
  } satisfies Prisma.SubCategoryInclude;
}
export type SubCategoryData = Prisma.SubCategoryGetPayload<{
  include: ReturnType<typeof getSubCategoryDataInclude>;
}>;

// Category Data
export function getCategoryDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    name: true,
    slug: true,
    isFeatured: true,
    photos: true,
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
