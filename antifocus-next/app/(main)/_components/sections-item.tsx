import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export const SectionsOne = ({ products }: { products: any }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Flash Sale</h1>
        <div className="-mr-1 ms-auto flex items-center gap-1">
          <span className="-mr-1 text-sm text-muted-foreground">View All</span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1" key={products[0].id}>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[0].image}
            alt={products[0].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[1].image}
            alt={products[1].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
      </div>
    </div>
  );
};

export const SectionsTwo = ({ products }: { products: any }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Best Seller</h1>
        <div className="-mr-1 ms-auto flex items-center gap-1">
          <span className="-mr-1 text-sm text-muted-foreground">View All</span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1" key={products[0].id}>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[2].image}
            alt={products[2].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
        <Card className="overflow-hidden shadow-none">
          <Image
            src={products[3].image}
            alt={products[3].name}
            className="aspect-[4/5] h-auto w-full object-cover"
            width={200}
            height={250}
          />
        </Card>
      </div>
    </div>
  );
};
