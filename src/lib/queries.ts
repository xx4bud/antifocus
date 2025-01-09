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
        slug: true,
        name: true,
        description: true,
        categoryId: true,
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
        photos: true,
        subCategories: true,
      },
    },
  } satisfies Prisma.CategoryInclude;
}

export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryDataInclude>;
}>;

export function getCampaignDataInclude() {
  return {
    photos: {
      select: {
        id: true,
        url: true,
        publicId: true,
        campaignId: true,
      },
    },
  } satisfies Prisma.CampaignInclude;
}

export type CampaignData = Prisma.CampaignGetPayload<{
  include: ReturnType<typeof getCampaignDataInclude>;
}>;

export function getProductDataInclude() {
  return {
    subCategories: {
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        categoryId: true,
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
    photos: {
      select: {
        id: true,
        url: true,
        publicId: true,
        productId: true,
      },
    },
    variants: {
      select: {
        id: true,
        name: true,
        price: true,
        productId: true,
        stock: true,
        photos: {
          select: {
            id: true,
            url: true,
            publicId: true,
            productVariantId: true,
          },
        },
      },
    },
  } satisfies Prisma.ProductInclude;
}

export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>;
}>;
