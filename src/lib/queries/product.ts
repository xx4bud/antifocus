// lib/queries/product.ts
import { cache } from "react";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

interface ProductFilters {
  productId?: string;
  category?: string;
  subCategory?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = cache(
  async (
    filters: ProductFilters = {},
    sortBy: string = "",
    page: number = 1,
    pageSize: number = 10
  ) => {
    const currentPage = page;
    const limit = pageSize;
    const skip = (currentPage - 1) * limit;

    const whereClause: any = {
      status: "AVAILABLE",
      AND: [],
    };

    if (filters.productId) {
      whereClause.AND.push({
        id: { not: filters.productId },
      });
    }

    if (filters.category) {
      whereClause.AND.push({
        categories: { some: { slug: filters.category } },
      });
    }

    if (filters.subCategory) {
      whereClause.AND.push({
        subCategories: {
          some: { slug: filters.subCategory },
        },
      });
    }

    if (filters.search) {
      whereClause.AND.push({
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    ) {
      whereClause.AND.push({
        price: {
          gte:
            filters.minPrice !== undefined
              ? filters.minPrice
              : 0,
          lte:
            filters.maxPrice !== undefined
              ? filters.maxPrice
              : Infinity,
        },
      });
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput =
      {};
    switch (sortBy) {
      case "most-popular":
        orderBy = { views: "desc" };
        break;
      case "best-selling":
        orderBy = { sales: "desc" };
        break;
      case "new-arrivals":
        orderBy = { createdAt: "desc" };
        break;
      case "top-rated":
        orderBy = { ratings: "desc" };
        break;
      case "price-low-to-high":
        orderBy = { price: "asc" };
        break;
      case "price-high-to-low":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { views: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
        variants: {
          include: {
            media: true,
          },
        },
        reviews: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    const productsPlain = JSON.parse(
      JSON.stringify(products)
    );

    return {
      products: productsPlain,
      totalPages: Math.ceil(totalCount / limit),
      currentPage,
      pageSize: limit,
      totalCount,
    };
  }
);
export type ProductsData = Prisma.PromiseReturnType<
  typeof getProducts
>;
