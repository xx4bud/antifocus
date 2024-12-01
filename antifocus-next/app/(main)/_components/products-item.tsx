import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function ProductsItem({
  item,
}: {
  item: any;
}) {
  return (
    <Card className="overflow-hidden rounded-lg shadow-none">
      <Image
        src={item.image || ''}
        alt={item.name}
        width={500}
        height={500}
        className="aspect-square h-auto w-full object-cover"
      />
      <div className="flex flex-col gap-1 p-2">
        <span className="line-clamp-2 text-sm font-medium">{item.name}</span>
        <span className="text-xs text-muted-foreground">Rp. {item.price}</span>
      </div>
    </Card>
  );
}
