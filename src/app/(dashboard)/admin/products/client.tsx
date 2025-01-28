"use client";

import { ProductData } from "@/types";
import * as React from "react";

interface ProductsClientProps {
  products: ProductData[];
}

export default function ProductsClient({
  products,
}: ProductsClientProps) {
  return (
    <div className="container flex flex-1 flex-col">
      {products.map((product) => (
        <div key={product.id}>
          <div>{product.name}</div>
          {product.subCategories.map((subCategory) => (
            <div key={subCategory.id}>
              {subCategory.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
