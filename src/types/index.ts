import type { Prisma } from "@prisma/client";

// Photo Data
export function getPhotoDataSelect() {
  return {
    id: true,
    url: true,
    publicId: true,
    isCover: true,
    productId: true,
    userId: true,
    campaignId: true,
    collectionId: true,
    subCategoryId: true,
    categoryId: true,
    variantId: true,
  } satisfies Prisma.PhotoSelect;
}

// User Data
export type Role = "USER" | "ADMIN";
export function getUserDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
  } satisfies Prisma.UserInclude;
}
export type UserData = Prisma.UserGetPayload<{
  include: ReturnType<typeof getUserDataInclude>;
}>;

// Campaign Data
export function getCampaignDataSelect() {
  return {
    id: true,
    slug: true,
    name: true,
    isFeatured: true,
    photos: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.CampaignSelect;
}
export function getCampaignDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    products: {
      select: getProductDataSelect(),
    },
  } satisfies Prisma.CampaignInclude;
}
export type CampaignData = Prisma.CampaignGetPayload<{
  include: ReturnType<typeof getCampaignDataInclude>;
}>;

// Collection Data
export function getCollectionDataSelect() {
  return {
    id: true,
    slug: true,
    name: true,
    isFeatured: true,
    photos: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.CollectionSelect;
}
export function getCollectionDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    products: {
      select: getProductDataSelect(),
    },
  } satisfies Prisma.CollectionInclude;
}
export type CollectionData = Prisma.CollectionGetPayload<{
  include: ReturnType<typeof getCollectionDataInclude>;
}>;

// Category Data
export function getCategoryDataSelect() {
  return {
    id: true,
    slug: true,
    name: true,
    isFeatured: true,
    photos: true,
    subCategories: true,
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

// SubCategory Data
export function getSubCategoryDataSelect() {
  return {
    id: true,
    slug: true,
    name: true,
    isFeatured: true,
    photos: true,
    categoryId: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
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

// Product Data
export function getProductDataSelect() {
  return {
    id: true,
    slug: true,
    name: true,
    isPublished: true,
    description: true,
    photos: true,
    sellingInfos: true,
    shippingInfos: true,
    salesInfos: true,
    userId: true,
    specsInfoId: true,
    campaignId: true,
    collectionId: true,
    subCategoryId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.ProductSelect;
}
export function getProductDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    sellingInfos: {
      select: getSellingInfoDataSelect(),
    },
    shippingInfos: {
      select: getShippingInfoDataSelect(),
    },
    salesInfos: {
      select: getSalesInfoDataSelect(),
    },
    specsInfos: {
      select: getSpecsInfoDataSelect(),
    },
    campaigns: {
      select: getCampaignDataSelect(),
    },
    collections: {
      select: getCollectionDataSelect(),
    },
    subCategories: {
      select: getSubCategoryDataSelect(),
    },
  } satisfies Prisma.ProductInclude;
}
export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>;
}>;

// SpecsInfo Data
export function getSpecsInfoDataSelect() {
  return {
    id: true,
    key: true,
    value: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.SpecsInfoSelect;
}
export function getSpecsInfoDataInclude() {
  return {
    products: {
      select: getProductDataSelect(),
    },
  } satisfies Prisma.SpecsInfoInclude;
}
export type SpecsInfoData = Prisma.SpecsInfoGetPayload<{
  include: ReturnType<typeof getSpecsInfoDataInclude>;
}>;

// SellingInfo Data
export function getSellingInfoDataSelect() {
  return {
    id: true,
    listPrice: true,
    price: true,
    totalStock: true,
    stock: true,
    variants: true,
    wholesales: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.SellingInfoSelect;
}
export function getSellingInfoDataInclude() {
  return {
    variants: {
      select: getVariantDataSelect(),
    },
    wholesales: {
      select: getWholesaleDataSelect(),
    },
  } satisfies Prisma.SellingInfoInclude;
}
export type SellingInfoData = Prisma.SellingInfoGetPayload<{
  include: ReturnType<typeof getSellingInfoDataInclude>;
}>;

// Variant Data
export function getVariantDataSelect() {
  return {
    id: true,
    key: true,
    value: true,
    listPrice: true,
    price: true,
    stock: true,
    photos: true,
    sellingInfoId: true,
    shippingInfos: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.VariantSelect;
}
export function getVariantDataInclude() {
  return {
    photos: {
      select: getPhotoDataSelect(),
    },
    shippingInfos: {
      select: getShippingInfoDataSelect(),
    },
  } satisfies Prisma.VariantInclude;
}
export type VariantData = Prisma.VariantGetPayload<{
  include: ReturnType<typeof getVariantDataInclude>;
}>;

// Wholesale Data
export function getWholesaleDataSelect() {
  return {
    id: true,
    unitPrice: true,
    minOrder: true,
    maxOrder: true,
    sellingInfoId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.WholesaleSelect;
}

// SalesInfo Data
export function getSalesInfoDataSelect() {
  return {
    id: true,
    numSales: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.SalesInfoSelect;
}

// ShippingInfo Data
export function getShippingInfoDataSelect() {
  return {
    id: true,
    weight: true,
    variantWeight: true,
    variantId: true,
    productId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.ShippingInfoSelect;
}
