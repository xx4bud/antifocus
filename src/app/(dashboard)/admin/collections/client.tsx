"use client";

import { CollectionData } from "@/types";
import * as React from "react";

interface CollectionsClientProps {
  collections: CollectionData[];
}

export default function CollectionsClient({
  collections,
}: CollectionsClientProps) {
  return (
    <div className="container flex flex-1 flex-col">
      {collections.map((collection) => (
        <div key={collection.id}>
          <div>{collection.name}</div>
          {collection.products.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
