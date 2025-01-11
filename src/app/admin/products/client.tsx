"use client";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ProductData } from "@/lib/queries";

interface ProductsClientProps {
  products: ProductData[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title="Products"
        amount={products.length}
        description="Manage our products"
        button={
          <Button asChild>
            <Link href={"/admin/products/add"}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Link>
          </Button>
        }
      />
      <Separator className="my-3" />

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - Rp {parseFloat(product.price.toString())}
          </li>
        ))}
      </ul>
    </div>
  );
}
