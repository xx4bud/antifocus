import prisma from "@/lib/prisma";
import { unstable_cache } from "@/lib/unstable-cache";

export const getProduct = unstable_cache(
  async (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);
    const product = await prisma.product.findUnique({
      where: {
        slug: decodedSlug,
        status: "AVAILABLE",
      },
      include: {
        categories: true,
        subCategories: true,
        media: true,
        variants: true,
      },
    });
    return product
      ? JSON.parse(JSON.stringify(product))
      : null;
  },
  ["product"],
  { revalidate: 86400 }
);

export const getProducts = unstable_cache(
  async (
    filters: any = {},
    sortBy: string = "",
    page: number = 1,
    pageSize: number = 12
  ) => {
    const currentPage = page;
    const limit = pageSize;
    const skip = (currentPage - 1) * limit;

    const whereClause: any = {
      status: "AVAILABLE",
      AND: [],
    };

    if (filters.product) {
      whereClause.AND.push({
        slug: { not: filters.product },
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

    if (filters.q) {
      whereClause.AND.push({
        OR: [
          {
            name: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: filters.q,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    if (filters.variant) {
      filters.variant.split(",").forEach((v: any) => {
        const [label, value] = v.split(":");
        whereClause.AND.push({
          variants: {
            some: { label, value },
          },
        });
      });
    }

    if (filters.option) {
      filters.option.split(",").forEach((o: any) => {
        const [label, value] = o.split(":");
        whereClause.AND.push({
          options: {
            some: { label, value },
          },
        });
      });
    }

    if (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    ) {
      const min = filters.minPrice ?? 0;
      const max = filters.maxPrice ?? Infinity;

      whereClause.AND.push({
        OR: [
          {
            price: { gte: min, lte: max },
            variants: { none: {} },
          },
          {
            variants: {
              some: {
                price: { gte: min, lte: max },
              },
            },
          },
          {
            options: {
              some: {
                price: { gte: min, lte: max },
              },
            },
          },
        ],
      });
    }

    let orderBy = {};
    switch (sortBy) {
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "latest":
        orderBy = { createdAt: "desc" };
        break;
      case "top-sales":
        orderBy = { sales: "desc" };
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
      skip: skip,
      take: limit,
      include: {
        media: { where: { order: 0 } },
        categories: true,
        subCategories: true,
        variants: {
          include: {
            media: true,
            options: true,
          },
        },
        options: true,
        reviews: true,
      },
    });

    if (
      sortBy === "price-low-to-high" ||
      sortBy === "price-high-to-low"
    ) {
      const getMinPrice = (product: any) => {
        let minPrice = Number(product.price);

        // Cek harga variant
        if (product.variants?.length > 0) {
          const variantPrices = product.variants.map(
            (v: any) => Number(v.price)
          );
          minPrice = Math.min(minPrice, ...variantPrices);

          // Cek harga option dalam variant
          product.variants.forEach((variant: any) => {
            if (variant.options?.length > 0) {
              const optionPrices = variant.options.map(
                (o: any) => Number(o.price)
              );
              minPrice = Math.min(
                minPrice,
                ...optionPrices
              );
            }
          });
        }

        // Cek harga option langsung di produk
        if (product.options?.length > 0) {
          const optionPrices = product.options.map(
            (o: any) => Number(o.price)
          );
          minPrice = Math.min(minPrice, ...optionPrices);
        }

        return minPrice;
      };

      products.sort((a, b) => {
        const minPriceA = getMinPrice(a);
        const minPriceB = getMinPrice(b);
        return sortBy === "price-low-to-high"
          ? minPriceA - minPriceB
          : minPriceB - minPriceA;
      });
    }

    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    const totalPage = Math.ceil(totalCount / limit);

    const productsPlain = JSON.parse(
      JSON.stringify(products)
    );

    return {
      products: productsPlain,
      totalPages: totalPage,
      currentPage,
      pageSize: limit,
      totalCount,
    };
  },
  [
    "products",
    "totalPages",
    "currentPage",
    "pageSize",
    "totalCount",
  ],
  {
    revalidate: 86400,
  }
);
