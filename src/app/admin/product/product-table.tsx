"use client";

import { ProductData } from "@/lib/types";

interface ProductTableProps {
  products: ProductData[];
}

export function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div>
      {products.map((product) => (
        <ul key={product.id}>
          <li>{product.name}</li>
        </ul>
      ))}
    </div>
  );
}
