import { getAllProducts } from "@/actions/product";
import React from "react";
import { ProductTable } from "./product-table";

export default async function Product() {
  const products = await getAllProducts();

  return <ProductTable products={products} />;
}
