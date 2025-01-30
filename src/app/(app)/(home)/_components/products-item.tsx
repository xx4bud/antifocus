"use client";

import { ProductData } from "@/types";
import Image from "next/image";
import * as React from "react";

interface ProductsItemProps {
  products: ProductData[];
}

export function ProductsItem({
  products,
}: ProductsItemProps) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group cursor-pointer overflow-hidden rounded-lg bg-card shadow transition-transform duration-100"
        >
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.photos?.[0].url}
              alt={product.name}
              fill
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="border-t p-4 pt-1">
            <h3 className="-mb-1 truncate text-base font-semibold">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Price: $100
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
