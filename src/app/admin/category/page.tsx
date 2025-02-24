import React from "react";
import { CategoryTable } from "./category-table";
import { getAllCategories } from "@/actions/category";

export default async function Category() {
  const categories = await getAllCategories();

  return <CategoryTable categories={categories} />;
}
