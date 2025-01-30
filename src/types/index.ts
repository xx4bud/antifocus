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
    isCover: true,
    userId: true,
    campaignId: true,
    collectionId: true,
    categoryId: true,
    subCategoryId: true,
    productId: true,
  } satisfies Prisma.PhotoSelect;
}

export type PhotoData = Prisma.PhotoGetPayload<{
  select: ReturnType<typeof getPhotoDataSelect>;
}>;

export function getCampaignDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    name: true,
    slug: true,
    isFeatured: true,
    photos: true,
  } satisfies Prisma.CampaignSelect;
}
export function getCampaignDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
  } satisfies Prisma.CampaignInclude;
}
export type CampaignData = Prisma.CampaignGetPayload<{
  include: ReturnType<typeof getCampaignDataInclude>;
}>;

// Collection Data
export function getCollectionDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    name: true,
    slug: true,
    photos: true,
    isFeatured: true,
  } satisfies Prisma.CollectionSelect;
}
export function getCollectionDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
  } satisfies Prisma.CollectionInclude;
}
export type CollectionData = Prisma.CollectionGetPayload<{
  include: ReturnType<typeof getCollectionDataInclude>;
}>;

// SubCategory Data
export function getSubCategoryDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    name: true,
    slug: true,
    photos: true,
    isFeatured: true,
    categoryId: true,
  } satisfies Prisma.SubCategorySelect;
}
export function getSubCategoryDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    products: {
      select: getProductDataSelect(),
    },
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
    photos: true,
    isFeatured: true,
  } satisfies Prisma.CategorySelect;
}
export function getCategoryDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    products: {
      select: getProductDataSelect(),
    },
    subCategories: {
      select: getSubCategoryDataSelect(),
    },
  } satisfies Prisma.CategoryInclude;
}
export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataInclude>;
}>;

// Product Data
export function getProductDataSelect() {
  return {
    createdAt: true,
    updatedAt: true,
    id: true,
    name: true,
    slug: true,
    isPublished: true,
    photos: true,
    categories: true,
    subCategories: true,
  } satisfies Prisma.ProductSelect;
}
export function getProductDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    categories: {
      select: getCategoryDataSelect(),
    },
    subCategories: {
      select: getSubCategoryDataSelect(),
    },
  } satisfies Prisma.ProductInclude;
}
export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>;
}>;
