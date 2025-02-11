import { cache } from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getProductsBySubCategory = cache(
  async (subCategorySlug: string) => {
    const decodedSlug = decodeURIComponent(subCategorySlug);
    const products = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
        subCategories: {
          some: { slug: decodedSlug },
        },
      },
      include: {
        categories: true,
        subCategories: true,
        media: { where: { order: 0 } },
      },
    });
    return products
      ? JSON.parse(JSON.stringify(products))
      : null;
  }
);

export const getProductsByCategory = cache(
  async (categorySlug: string) => {
    const decodedSlug = decodeURIComponent(categorySlug);
    const products = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
        categories: {
          some: { slug: decodedSlug },
        },
      },
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
      },
      orderBy: { views: "desc" },
    });
    return products
      ? JSON.parse(JSON.stringify(products))
      : null;
  }
);

export const getCategories = cache(async () => {
  const categories = await prisma.category.findMany({
    where: { featured: true },
    include: {
      subCategories: {
        where: { featured: true },
      },
    },
  });

  return categories
    ? JSON.parse(JSON.stringify(categories))
    : null;
});

export const getFeaturedCategories = cache(async () => {
  const featuredCategories = await prisma.category.findMany(
    {
      where: { featured: true },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        media: { where: { order: 0 } },
        subCategories: {
          where: { featured: true },
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            media: { where: { order: 0 } },
            _count: { select: { products: true } },
          },
          orderBy: { products: { _count: "desc" } },
          take: 3,
        },
        _count: { select: { products: true } },
      },
      orderBy: { views: "desc" },
      take: 6,
    }
  );

  return featuredCategories
    ? JSON.parse(JSON.stringify(featuredCategories))
    : null;
});
export type FeaturedCategoriesData =
  Prisma.PromiseReturnType<typeof getFeaturedCategories>;

export const getCategoryBySlug = cache(
  async (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);

    const category = await prisma.category.findUnique({
      where: { slug: decodedSlug },
      include: {
        media: { where: { order: 0 } },
        subCategories: true,
        products: {
          include: {
            media: true,
          },
          orderBy: { views: "desc" },
        },
      },
    });

    return category
      ? JSON.parse(JSON.stringify(category))
      : null;
  }
);

export const getSubCategoryBySlug = cache(
  async (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);

    const subCategory = await prisma.subCategory.findUnique(
      {
        where: { slug: decodedSlug },
        include: {
          media: { where: { order: 0 } },
          category: true,
          products: {
            include: {
              media: true,
            },
            orderBy: { views: "desc" },
          },
        },
      }
    );

    return subCategory
      ? JSON.parse(JSON.stringify(subCategory))
      : null;
  }
);

export const getProductBySlug = cache(
  async (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);

    const product = await prisma.product.findUnique({
      where: { slug: decodedSlug },
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
        specs: true,
        variants: true,
        options: true,
        reviews: true,
      },
    });

    return product
      ? JSON.parse(JSON.stringify(product))
      : null;
  }
);
