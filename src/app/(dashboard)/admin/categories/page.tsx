import prisma from "@/lib/prisma";
import { getCategoryDataInclude } from "@/types";
import {CategoriesClient} from "./client";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: getCategoryDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return <CategoriesClient categories={categories} />;
}
