"use server";

import prisma from "@/lib/prisma";
import { getCategoryDataInclude } from "@/types";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isFeatured: true,
      },
      
      include: getCategoryDataInclude(),
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
