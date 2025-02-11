import { cache } from "react";
import prisma from "../prisma";
import { ProductData } from "../types";

export const getProductsByCategory = cache(
  async (categorySlug: string) => {
    const products = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
        categories: {
          some: { slug: categorySlug },
        },
      },
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
        reviews: true,
      },
      orderBy: { views: "desc" },
    });
    return JSON.parse(JSON.stringify(products));
  }
);

export const getProductBySubCategory = cache(
  async (subcategorySlug: string) => {
    const products = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
        subCategories: {
          some: {
            slug: subcategorySlug,
          },
        },
      },
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
        reviews: true,
      },
      orderBy: { views: "desc" },
    });
    return JSON.parse(JSON.stringify(products));
  }
);

export const getProduct = cache(
  async (productSlug: string) => {
    const product = await prisma.product.findFirst({
      where: {
        status: "AVAILABLE",
        slug: productSlug,
      },
      include: {
        media: true,
        categories: true,
        subCategories: true,
        specs: true,
        variants: true,
        options: true,
        reviews: true,
      },
      orderBy: { views: "asc" },
    });
    return JSON.parse(JSON.stringify(product));
  }
);

export const getAllProducts = cache(
  async ({
    take,
  }: {
    take?: number;
  }): Promise<{ products: ProductData[] }> => {
    const products = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
        reviews: true,
      },
      orderBy: { views: "asc" },
      ...(take !== undefined ? { take } : {}),
    });
    return {
      products: JSON.parse(JSON.stringify(products)),
    };
  }
);
