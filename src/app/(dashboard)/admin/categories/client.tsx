"use client";

import { CategoryData } from "@/types";
import * as React from "react";

interface CategoriesClientProps {
  categories: CategoryData[];
}

export function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  return <div>CategoriesClientPage {categories.length}</div>;
}
